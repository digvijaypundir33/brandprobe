import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { scrapeWebsite, formatScrapedDataForPrompt } from '@/lib/scraper';
import { analyzeWebsite } from '@/lib/ai';
import {
  getOrCreateUser,
  getOrCreateSite,
  createReport,
  updateReport,
  getCachedReport,
  getLatestReportForSite,
  updateUser,
} from '@/lib/supabase';
import { normalizeUrl, extractDomain, isValidEmail, calculateOverallScore } from '@/lib/utils';

const scanRequestSchema = z.object({
  url: z.string().min(1, 'URL is required'),
  email: z.string().email('Valid email is required'),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { url, email } = scanRequestSchema.parse(body);

    // Normalize URL
    const normalizedUrl = normalizeUrl(url);
    const domain = extractDomain(normalizedUrl);

    // Check for cached report (same URL within 24 hours)
    const cachedReport = await getCachedReport(normalizedUrl);
    if (cachedReport) {
      return NextResponse.json({
        success: true,
        reportId: cachedReport.id,
        cached: true,
      });
    }

    // Get or create user
    const user = await getOrCreateUser(email);

    // Check report limits for free users
    if (user.subscriptionStatus === 'free' && user.reportsUsedThisMonth >= user.reportsLimit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Report limit reached',
          message: 'You have used your free report. Upgrade to get 10 reports per month.',
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
    processReport(report.id, normalizedUrl, previousOverallScore, startTime).catch(console.error);

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
 */
async function processReport(
  reportId: string,
  url: string,
  previousOverallScore: number | null,
  startTime: number
): Promise<void> {
  try {
    // Step 1: Scrape website
    console.log(`[${reportId}] Starting scrape for ${url}`);
    const scrapedData = await scrapeWebsite(url);

    // Update report with scraped data
    await updateReport(reportId, {
      scrapedData,
    });

    // Step 2: Format for Claude
    const websiteContent = formatScrapedDataForPrompt(scrapedData);

    // Step 3: Analyze with Claude (all 9 sections in parallel)
    console.log(`[${reportId}] Starting Claude analysis`);
    const analysis = await analyzeWebsite(websiteContent);

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
      previousOverallScore,
      scoreChange,
      scanTimeMs,
    });

    console.log(`[${reportId}] Report complete. Score: ${overallScore}. Time: ${scanTimeMs}ms`);
  } catch (error) {
    console.error(`[${reportId}] Processing failed:`, error);

    await updateReport(reportId, {
      status: 'failed',
    });
  }
}
