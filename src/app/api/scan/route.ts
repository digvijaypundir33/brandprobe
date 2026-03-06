import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { scrapeWebsite, formatScrapedDataForPrompt, captureScreenshot } from '@/lib/scraper';
import { analyzeWebsite } from '@/lib/ai';
import { analyzeTechnicalPerformance } from '@/lib/technical-analyzer';
import {
  getOrCreateUser,
  getOrCreateSite,
  createReport,
  updateReport,
  getCachedReport,
  getLatestReportForSite,
  updateUser,
  createMagicLink,
  getUserByEmail,
} from '@/lib/supabase';
import { normalizeUrl, extractDomain, isValidEmail, calculateOverallScore } from '@/lib/utils';
import { sendMagicLinkEmail } from '@/lib/email';
import { getSessionFromRequest } from '@/lib/auth';

const scanRequestSchema = z.object({
  url: z.string().min(1, 'URL is required'),
  email: z.string().email('Valid email is required'),
  analysisType: z.enum(['quick', 'full']).default('full').optional(),
  skipVerification: z.boolean().optional(), // For authenticated users
  forceRescan: z.boolean().optional(), // Allow re-scanning same URL
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { url, email, analysisType = 'full', skipVerification = false, forceRescan = false } = scanRequestSchema.parse(body);

    // Normalize URL
    const normalizedUrl = normalizeUrl(url);
    const domain = extractDomain(normalizedUrl);

    // Get or create user first (needed for checking limits)
    const user = await getOrCreateUser(email);

    // Check for cached report (same URL within 24 hours)
    const cachedReport = await getCachedReport(normalizedUrl);
    if (cachedReport && !forceRescan) {
      // Return info about existing report, let client decide to rescan
      return NextResponse.json({
        success: true,
        reportId: cachedReport.id,
        cached: true,
        existingReport: {
          id: cachedReport.id,
          url: cachedReport.url,
          createdAt: cachedReport.createdAt,
          overallScore: cachedReport.overallScore,
        },
        canRescan: user.subscriptionStatus === 'active', // Only Pro users can rescan for free
      });
    }

    // Check if user is already authenticated
    const session = await getSessionFromRequest(request);
    const isAuthenticated = session?.email === email;

    // Check report limits for free and starter users BEFORE creating report
    if (user.subscriptionStatus === 'free' || user.subscriptionStatus === null || user.subscriptionStatus === 'starter') {
      // Count existing reports for this user (exclude failed reports - they get a retry)
      const { getReportsByUserId } = await import('@/lib/supabase');
      const allReports = await getReportsByUserId(user.id);
      const existingReports = allReports.filter(report => report.status !== 'failed');

      const limit = user.subscriptionStatus === 'starter' ? 2 : 1; // Starter: 2 reports, Free: 1 report

      if (existingReports.length >= limit) {
        // Starter users only see Pro upgrade option
        if (user.subscriptionStatus === 'starter') {
          return NextResponse.json(
            {
              success: false,
              error: 'Starter plan limit reached',
              message: 'You have used both Starter reports. Upgrade to Pro for $29/month to get 10 reports per month.',
              requiresUpgrade: true,
              upgradeOptions: {
                pro: { price: 29, type: 'monthly', reports: 10, description: '10 full reports per month' },
              },
            },
            { status: 403 }
          );
        }

        // Free users see both Starter and Pro options
        return NextResponse.json(
          {
            success: false,
            error: 'Free plan limit reached',
            message: 'Free users can only create 1 report. Get 2 complete reports for $9 or upgrade to Pro for $29/month.',
            requiresUpgrade: true,
            upgradeOptions: {
              starter: { price: 9, type: 'one-time', reports: 2, description: '2 complete reports with all 10 sections' },
              pro: { price: 29, type: 'monthly', reports: 10, description: '10 full reports per month' },
            },
          },
          { status: 403 }
        );
      }

      // For Starter users, check if they're trying to scan the same website twice
      if (user.subscriptionStatus === 'starter') {
        const existingSiteReports = existingReports.filter(report => {
          const reportDomain = extractDomain(report.url);
          return reportDomain === domain;
        });

        if (existingSiteReports.length > 0) {
          return NextResponse.json(
            {
              success: false,
              error: 'Duplicate website',
              message: 'You already have a report for this website. Starter plan allows 5 reports for different websites only.',
            },
            { status: 403 }
          );
        }
      }
    }

    // If not authenticated and not skipping verification, send magic link
    if (!isAuthenticated && !skipVerification) {
      // Create pending report
      const site = await getOrCreateSite(user.id, normalizedUrl, domain);
      const report = await createReport(user.id, site.id, normalizedUrl);

      // Create and send magic link
      const magicLink = await createMagicLink(email, report.id);

      // Check if we're in development mode (using NEXT_PUBLIC_SUPABASE_ENV)
      const isDevelopment = process.env.NEXT_PUBLIC_SUPABASE_ENV === 'local';

      if (isDevelopment) {
        // Development mode: return console link instead of sending email
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
        const verifyUrl = `${appUrl}/api/auth/verify?token=${magicLink.token}&reportId=${report.id}`;

        console.log('\n========================================');
        console.log('🔐 MAGIC LINK (Development Mode)');
        console.log('========================================');
        console.log(`Email: ${email}`);
        console.log(`Report ID: ${report.id}`);
        console.log(`\n🔗 Click to verify and start scan:`);
        console.log(verifyUrl);
        console.log('========================================\n');

        return NextResponse.json({
          success: true,
          requiresVerification: true,
          reportId: report.id,
          message: 'Check console for magic link (development mode)',
          developmentMode: true,
          magicLink: verifyUrl, // Include in response for testing
        });
      } else {
        // Production mode: send email as usual
        const emailResult = await sendMagicLinkEmail(email, magicLink.token, report.id);

        if (!emailResult.success) {
          return NextResponse.json(
            {
              success: false,
              error: 'Failed to send verification email',
              message: 'Please try again or contact support',
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          requiresVerification: true,
          reportId: report.id,
          message: 'Check your email to verify and start the scan',
        });
      }
    }

    // User is authenticated or verification skipped - proceed with scan
    // Check report limits based on subscription tier
    if (user.subscriptionStatus === 'free' && user.reportsUsedThisMonth >= user.reportsLimit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Report limit reached',
          message: 'You have used your free report. Unlock the full report for $9 or subscribe to Pro for $29/month.',
          requiresUpgrade: true,
          upgradeOptions: {
            starter: { price: 9, type: 'one-time', reports: 1 },
            pro: { price: 29, type: 'monthly', reports: 10 },
          },
        },
        { status: 403 }
      );
    }

    if (user.subscriptionStatus === 'starter' && user.reportsUsedThisMonth >= user.reportsLimit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Report limit reached',
          message: 'You have used your Starter report. Upgrade to Pro for $29/month to get 10 reports per month.',
          requiresUpgrade: true,
          upgradeOptions: {
            pro: { price: 29, type: 'monthly', reports: 10 },
          },
        },
        { status: 403 }
      );
    }

    // Get or create site
    const site = await getOrCreateSite(user.id, normalizedUrl, domain);

    // Get previous report for progress tracking
    const previousReport = await getLatestReportForSite(site.id);
    const previousOverallScore = previousReport?.overallScore ?? null;

    // Create report record
    const report = await createReport(user.id, site.id, normalizedUrl);

    // Start async processing
    processReport(report.id, normalizedUrl, previousOverallScore, startTime, analysisType, email).catch(console.error);

    // Increment reports used
    await updateUser(user.id, {
      reportsUsedThisMonth: user.reportsUsedThisMonth + 1,
    });

    return NextResponse.json({
      success: true,
      reportId: report.id,
      cached: false,
    });
  } catch (error) {
    console.error('Scan error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to start scan',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Process report asynchronously
 * Exported so it can be called from verify route
 */
export async function processReport(
  reportId: string,
  url: string,
  previousOverallScore: number | null,
  startTime: number,
  analysisType: 'quick' | 'full' = 'full',
  userEmail?: string
): Promise<void> {
  try {
    // Check if user has paid subscription (for optimizations)
    let isPaidUser = false;
    if (userEmail) {
      const user = await getUserByEmail(userEmail);
      isPaidUser = user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'starter';
    }

    // Optimization: Free users get quick mode (1-2 pages) to stay within 60s timeout
    const effectiveAnalysisType = isPaidUser ? analysisType : 'quick';

    // Step 1: Scrape website using Fly.io Playwright service (all users)
    console.log(`[${reportId}] Starting scrape for ${url} (${effectiveAnalysisType} mode, paid: ${isPaidUser})`);
    const scrapedData = await scrapeWebsite(url, {
      analysisType: effectiveAnalysisType,
    });

    // Update report with scraped data
    await updateReport(reportId, {
      scrapedData,
    });

    // Step 2: Format for Claude
    const websiteContent = formatScrapedDataForPrompt(scrapedData);

    // Step 3: Capture screenshot (skip for free users to save 5-10s)
    console.log(`[${reportId}] ${isPaidUser ? 'Capturing screenshot' : 'Skipping screenshot (free user)'}`);
    const screenshotPromise = isPaidUser ? captureScreenshot(url) : Promise.resolve(null);

    // Step 4a: Analyze technical performance (rules-based, instant)
    console.log(`[${reportId}] Analyzing technical performance (rules-based)`);
    const technical = await analyzeTechnicalPerformance(url, scrapedData.html);

    // Step 4b: Analyze with AI (marketing sections in parallel)
    console.log(`[${reportId}] Starting AI analysis`);
    const [analysis, screenshotUrl] = await Promise.all([
      analyzeWebsite(websiteContent, technical, scrapedData.brandConfig),
      screenshotPromise,
    ]);

    // Add screenshot to design authenticity if available
    if (screenshotUrl && analysis.designAuthenticity) {
      analysis.designAuthenticity.detailedAnalysis.screenshotUrl = screenshotUrl;
    }

    // Calculate scores (including new sections)
    const overallScore = calculateOverallScore({
      messaging: analysis.messaging.score,
      seo: analysis.seo.score,
      content: analysis.content.score,
      ads: analysis.adAngles.score,
      conversion: analysis.conversion.score,
      distribution: analysis.distribution.score,
      aiSearch: analysis.aiSearch.score,
      technical: analysis.technical.score,
      brandHealth: analysis.brandHealth.score,
      designAuth: analysis.designAuthenticity.score,
    });

    const scoreChange = previousOverallScore !== null
      ? overallScore - previousOverallScore
      : null;

    const scanTimeMs = Date.now() - startTime;

    // Update report with all analysis
    await updateReport(reportId, {
      status: 'ready',
      messagingAnalysis: analysis.messaging,
      seoOpportunities: analysis.seo,
      contentStrategy: analysis.content,
      adAngles: analysis.adAngles,
      conversionOptimization: analysis.conversion,
      distributionStrategy: analysis.distribution,
      aiSearchVisibility: analysis.aiSearch,
      technicalPerformance: analysis.technical,
      brandHealth: analysis.brandHealth,
      designAuthenticity: analysis.designAuthenticity,
      overallScore,
      messagingScore: analysis.messaging.score,
      seoScore: analysis.seo.score,
      contentScore: analysis.content.score,
      adsScore: analysis.adAngles.score,
      conversionScore: analysis.conversion.score,
      distributionScore: analysis.distribution.score,
      aiSearchScore: analysis.aiSearch.score,
      technicalScore: analysis.technical.score,
      brandHealthScore: analysis.brandHealth.score,
      designAuthenticityScore: analysis.designAuthenticity.score,
      previousOverallScore,
      scoreChange,
      scanTimeMs,
      analysisType,
      pagesAnalyzed: scrapedData.pagesAnalyzed,
    });

    console.log(`[${reportId}] Report complete. Score: ${overallScore}. Time: ${scanTimeMs}ms`);

    // Send report ready email if email provided
    if (userEmail) {
      const { sendReportReadyEmail } = await import('@/lib/email');
      await sendReportReadyEmail(userEmail, reportId, url).catch(console.error);
    }
  } catch (error) {
    console.error(`[${reportId}] Processing failed:`, error);

    await updateReport(reportId, {
      status: 'failed',
    });
  }
}
