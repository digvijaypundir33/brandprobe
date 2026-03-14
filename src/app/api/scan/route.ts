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
import type { Report, SectionScores, IssueComparison } from '@/types/report';
import { compareIssues } from '@/lib/issue-comparator';
import { logger } from '@/lib/logger';

// Feature flag for improvement tracking
const ENABLE_IMPROVEMENT_TRACKING = process.env.NEXT_PUBLIC_ENABLE_IMPROVEMENT_TRACKING === 'true';

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
    // Count actual completed reports instead of using counter (more reliable)
    const { getCompletedReportsCountThisMonth } = await import('@/lib/supabase');
    const completedReportsCount = await getCompletedReportsCountThisMonth(user.id);

    if (user.subscriptionStatus === 'free' && completedReportsCount >= user.reportsLimit) {
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

    if (user.subscriptionStatus === 'starter' && completedReportsCount >= user.reportsLimit) {
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

    if (user.subscriptionStatus === 'active' && completedReportsCount >= user.reportsLimit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Monthly report limit reached',
          message: `You have used all ${user.reportsLimit} reports for this month. Your limit will reset on your billing renewal date.`,
        },
        { status: 403 }
      );
    }

    // Get or create site
    const site = await getOrCreateSite(user.id, normalizedUrl, domain);

    // Get previous report for progress tracking
    const previousReport = await getLatestReportForSite(site.id);

    // Create report record
    const report = await createReport(user.id, site.id, normalizedUrl);

    // Start async processing (pass full previousReport for improvement tracking)
    // Note: Report count is incremented inside processReport only on success
    processReport(report.id, normalizedUrl, previousReport, startTime, analysisType, email, user.id).catch(console.error);

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
  previousReport: Report | null,
  startTime: number,
  analysisType: 'quick' | 'full' = 'full',
  userEmail?: string,
  userId?: string
): Promise<void> {
  // Extract previous scores for tracking
  const previousOverallScore = previousReport?.overallScore ?? null;

  // Set logger context for this report
  logger.setContext({ reportId, url });
  logger.info('Starting report processing', {
    analysisType,
    hasPreviousScan: !!previousReport,
    userEmail: userEmail ? '***' : undefined
  });

  let timeoutChecker: NodeJS.Timeout | null = null;
  try {
    // Check if user has paid subscription (for optimizations)
    let isPaidUser = false;
    if (userEmail) {
      const user = await getUserByEmail(userEmail);
      isPaidUser = user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'starter';
      logger.info('User subscription checked', { isPaidUser, status: user?.subscriptionStatus });
    }

    // Optimization: Free users get quick mode (1-2 pages) to stay within 60s timeout
    const effectiveAnalysisType = isPaidUser ? analysisType : 'quick';
    if (effectiveAnalysisType !== analysisType) {
      logger.info('Analysis type adjusted for free user', {
        requested: analysisType,
        effective: effectiveAnalysisType
      });
    }

    // Warn if approaching Vercel timeout (60s limit)
    const checkTimeout = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 50000) { // 50s warning
        logger.warn('Approaching Vercel timeout limit', { elapsed, limit: 60000 });
      }
    };
    const timeoutChecker = setInterval(checkTimeout, 10000); // Check every 10s

    // Step 1: Start PageSpeed API call FIRST (runs in parallel with scraping)
    // This saves ~18 seconds by running alongside scraping
    logger.info('Starting PageSpeed API call (parallel)');
    const { getPageSpeedInsights } = await import('@/lib/pagespeed');
    const pageSpeedPromise = getPageSpeedInsights(url, {
      strategy: (process.env.PAGESPEED_STRATEGY as 'mobile' | 'desktop') || 'mobile',
      categories: ['performance', 'seo', 'best-practices', 'accessibility'],
    });

    // Step 2: Scrape website using Fly.io Playwright service (runs in parallel with PageSpeed)
    const scrapeStart = logger.startTimer();
    logger.info('Starting website scrape', { mode: effectiveAnalysisType, isPaidUser });
    const scrapedData = await scrapeWebsite(url, {
      analysisType: effectiveAnalysisType,
    });
    const scrapeDuration = logger.endTimer(scrapeStart, 'Website scraping', {
      pagesAnalyzed: scrapedData.pagesAnalyzed,
      detectionResult: scrapedData.detectionResult
    });

    // Update report with scraped data
    await updateReport(reportId, {
      scrapedData,
    });

    // Step 3: Format for Claude
    const websiteContent = formatScrapedDataForPrompt(scrapedData);

    // Step 4: Capture screenshot (for all users)
    console.log(`[${reportId}] Capturing screenshot`);
    const screenshotPromise = captureScreenshot(url);

    // Step 5: Analyze technical performance
    // Pass the PageSpeed promise (may still be running) so it awaits when ready
    const techStart = Date.now();
    console.log(`[${reportId}] Analyzing technical performance`);
    const technical = await analyzeTechnicalPerformance(url, scrapedData.html, {
      pageSpeedPromise, // PageSpeed likely still running, will await when needed
    });
    console.log(`[${reportId}] ⏱️  Technical analysis completed in ${Date.now() - techStart}ms`);

    // Prepare previous report data for AI consistency (if this is a rescan)
    let previousReportData = null;
    if (previousReport) {
      // Extract top 5 high/medium priority issues from previous report for tracking
      const previousKeyIssues: Array<{ category: string; issue: string; priority: string }> = [];

      // Collect issues from each section
      const sections = [
        { name: 'messaging', data: previousReport.messagingAnalysis },
        { name: 'seo', data: previousReport.seoOpportunities },
        { name: 'content', data: previousReport.contentStrategy },
        { name: 'ads', data: previousReport.adAngles },
        { name: 'conversion', data: previousReport.conversionOptimization },
        { name: 'distribution', data: previousReport.distributionStrategy },
        { name: 'aiSearch', data: previousReport.aiSearchVisibility },
        { name: 'technical', data: previousReport.technicalPerformance },
        { name: 'brandHealth', data: previousReport.brandHealth },
        { name: 'designAuth', data: previousReport.designAuthenticity },
      ];

      for (const section of sections) {
        if (section.data && typeof section.data === 'object' && 'keyIssues' in section.data) {
          const keyIssues = (section.data as any).keyIssues || [];
          for (const issue of keyIssues) {
            if (typeof issue === 'object' && issue.issue && issue.priority) {
              previousKeyIssues.push({
                category: section.name,
                issue: issue.issue,
                priority: issue.priority,
              });
            }
          }
        }
      }

      // Sort by priority (high first) and take top 5
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      previousKeyIssues.sort((a, b) => {
        const aPriority = priorityOrder[a.priority.toLowerCase() as keyof typeof priorityOrder] || 99;
        const bPriority = priorityOrder[b.priority.toLowerCase() as keyof typeof priorityOrder] || 99;
        return aPriority - bPriority;
      });

      previousReportData = {
        overallScore: previousReport.overallScore ?? 50,
        messagingScore: previousReport.messagingScore ?? 50,
        seoScore: previousReport.seoScore ?? 50,
        contentScore: previousReport.contentScore ?? 50,
        adsScore: previousReport.adsScore ?? 50,
        conversionScore: previousReport.conversionScore ?? 50,
        distributionScore: previousReport.distributionScore ?? 50,
        aiSearchScore: previousReport.aiSearchScore ?? 50,
        technicalScore: previousReport.technicalScore ?? 50,
        brandHealthScore: previousReport.brandHealthScore ?? 50,
        designAuthScore: previousReport.designAuthenticityScore ?? 50,
        keyIssues: previousKeyIssues.slice(0, 5),
      };
    }

    // Step 4b: Analyze with AI (marketing sections in parallel)
    const aiStart = Date.now();
    console.log(`[${reportId}] Starting AI analysis`);
    const [analysis, screenshotUrl] = await Promise.all([
      analyzeWebsite(websiteContent, technical, scrapedData.brandConfig, previousReportData),
      screenshotPromise,
    ]);
    console.log(`[${reportId}] ⏱️  AI analysis completed in ${Date.now() - aiStart}ms`);

    // Add screenshot to design authenticity if available
    if (screenshotUrl && analysis.designAuthenticity) {
      analysis.designAuthenticity.detailedAnalysis.screenshotUrl = screenshotUrl;
    }

    // Calculate scores (including new sections)
    const currentSectionScores: SectionScores = {
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
    };

    const overallScore = calculateOverallScore(currentSectionScores);

    const scoreChange = previousOverallScore !== null
      ? overallScore - previousOverallScore
      : null;

    // Calculate section-level improvements (Phase 1)
    let previousSectionScores: SectionScores | null = null;
    let sectionScoreChanges: SectionScores | null = null;

    if (ENABLE_IMPROVEMENT_TRACKING && previousReport) {
      previousSectionScores = {
        messaging: previousReport.messagingScore ?? 0,
        seo: previousReport.seoScore ?? 0,
        content: previousReport.contentScore ?? 0,
        ads: previousReport.adsScore ?? 0,
        conversion: previousReport.conversionScore ?? 0,
        distribution: previousReport.distributionScore ?? 0,
        aiSearch: previousReport.aiSearchScore ?? 0,
        technical: previousReport.technicalScore ?? 0,
        brandHealth: previousReport.brandHealthScore ?? 0,
        designAuth: previousReport.designAuthenticityScore ?? 0,
      };

      sectionScoreChanges = {
        messaging: currentSectionScores.messaging - previousSectionScores.messaging,
        seo: currentSectionScores.seo - previousSectionScores.seo,
        content: currentSectionScores.content - previousSectionScores.content,
        ads: currentSectionScores.ads - previousSectionScores.ads,
        conversion: currentSectionScores.conversion - previousSectionScores.conversion,
        distribution: currentSectionScores.distribution - previousSectionScores.distribution,
        aiSearch: currentSectionScores.aiSearch - previousSectionScores.aiSearch,
        technical: currentSectionScores.technical - previousSectionScores.technical,
        brandHealth: currentSectionScores.brandHealth - previousSectionScores.brandHealth,
        designAuth: currentSectionScores.designAuth - previousSectionScores.designAuth,
      };

      console.log(`[${reportId}] Section score changes:`, sectionScoreChanges);
    }

    // Phase 2: Issue comparison via AI
    let issueComparison: IssueComparison | null = null;

    if (ENABLE_IMPROVEMENT_TRACKING && previousReport) {
      console.log(`[${reportId}] Comparing issues with previous scan...`);

      // Create a temporary current report object for comparison
      const currentReportForComparison: Report = {
        id: reportId,
        userId: '',
        siteId: '',
        url,
        status: 'ready',
        createdAt: new Date().toISOString(),
        scrapedData: null,
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
        previousOverallScore: previousOverallScore,
        scoreChange,
        previousSectionScores,
        sectionScoreChanges,
        issueComparison: null,
        scanNumber: (previousReport.scanNumber ?? 1) + 1,
        scanTimeMs: null,
        isAutoRescan: false,
        isPublic: true,
        showcaseEnabled: false,
        showcaseRank: 0,
        showcaseViews: 0,
        showcaseClicks: 0,
        showcaseUpvotes: 0,
      };

      try {
        issueComparison = await compareIssues(previousReport, currentReportForComparison);
        console.log(`[${reportId}] Issue comparison complete:`, issueComparison.summary);
      } catch (err) {
        console.error(`[${reportId}] Issue comparison failed:`, err);
        // Continue without issue comparison
      }
    }

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
      // Improvement tracking (Phase 1 & 2)
      previousSectionScores: previousSectionScores as Record<string, number> | null,
      sectionScoreChanges: sectionScoreChanges as Record<string, number> | null,
      issueComparison,
      scanTimeMs,
      analysisType,
      pagesAnalyzed: scrapedData.pagesAnalyzed,
    });

    const totalTime = Date.now() - startTime;
    logger.info('Report completed successfully', {
      overallScore,
      scanTimeMs,
      totalTime,
      scoreChange,
      pagesAnalyzed: scrapedData.pagesAnalyzed
    });

    // Note: Report count is now dynamically calculated from completed reports (status='ready')
    // No need to increment a counter - the count is self-correcting

    // Send report ready email if email provided
    if (userEmail) {
      const { sendReportReadyEmail } = await import('@/lib/email');
      await sendReportReadyEmail(userEmail, reportId, url).catch((err) => {
        logger.error('Failed to send report ready email', err);
      });
    }

    if (timeoutChecker) clearInterval(timeoutChecker);
    logger.clearContext();
  } catch (error) {
    if (timeoutChecker) clearInterval(timeoutChecker);
    logger.error('Report processing failed', error, {
      stage: 'unknown',
      totalTime: Date.now() - startTime
    });

    // Determine error message based on error type
    let errorMessage = 'An unexpected error occurred during report generation.';

    if (error instanceof Error) {
      // Check for common error types
      if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Report generation timed out. Please try again with a simpler website or contact support.';
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage = 'AI service rate limit reached. Please try again in a few minutes.';
      } else if (error.message.includes('token') || error.message.includes('context length')) {
        errorMessage = 'Website content is too large to analyze. Please contact support.';
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Could not connect to the website. Please check the URL and try again.';
      } else {
        errorMessage = `Error: ${error.message.substring(0, 200)}`;
      }
    }

    await updateReport(reportId, {
      status: 'failed',
      errorMessage,
      errorTimestamp: new Date().toISOString(),
    });
  }
}
