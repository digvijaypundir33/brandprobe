/**
 * Google PageSpeed Insights API Client
 *
 * API Documentation: https://developers.google.com/speed/docs/insights/v5/get-started
 *
 * Rate Limits:
 * - Without API key: 25 requests per 100 seconds
 * - With API key: 25,000 queries per day (quota can be increased)
 */

import type {
  PageSpeedInsightsResult,
  CoreWebVitals,
  LighthouseCategories,
  CoreWebVitalMetric,
  LighthouseAuditSummary,
} from '@/types/pagespeed';

// Configuration
const PAGESPEED_API_URL =
  'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const DEFAULT_TIMEOUT_MS = 60000; // 60 seconds (API can be slow)

// Environment variables
const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;
const ENABLE_PAGESPEED = process.env.ENABLE_PAGESPEED_API === 'true';

/**
 * Check if PageSpeed API is enabled
 */
export function isPageSpeedEnabled(): boolean {
  return ENABLE_PAGESPEED;
}

/**
 * Fetch PageSpeed Insights for a URL
 */
export async function getPageSpeedInsights(
  url: string,
  options: {
    strategy?: 'mobile' | 'desktop';
    categories?: Array<
      'performance' | 'seo' | 'best-practices' | 'accessibility'
    >;
    timeout?: number;
  } = {}
): Promise<PageSpeedInsightsResult | null> {
  if (!ENABLE_PAGESPEED) {
    console.log('[PageSpeed] API disabled via feature flag');
    return null;
  }

  const {
    strategy = 'mobile',
    categories = ['performance', 'seo', 'best-practices', 'accessibility'],
    timeout = DEFAULT_TIMEOUT_MS,
  } = options;

  const startTime = Date.now();

  try {
    // Build API URL with parameters
    const params = new URLSearchParams({
      url: url,
      strategy: strategy,
    });

    // Add categories
    categories.forEach((cat) => params.append('category', cat));

    // Add API key if available (removes rate limits)
    if (PAGESPEED_API_KEY) {
      params.append('key', PAGESPEED_API_KEY);
    }

    const apiUrl = `${PAGESPEED_API_URL}?${params.toString()}`;

    console.log(
      `[PageSpeed] Fetching insights for ${url} (strategy: ${strategy})`
    );

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[PageSpeed] API error: ${response.status}`, errorBody);

      // Handle specific error codes
      if (response.status === 429) {
        console.warn('[PageSpeed] Rate limit exceeded');
      } else if (response.status === 500) {
        console.warn('[PageSpeed] Target site may be blocking Lighthouse');
      }

      return null;
    }

    const data = await response.json();
    const analysisTimeMs = Date.now() - startTime;

    console.log(`[PageSpeed] Analysis complete in ${analysisTimeMs}ms`);

    // Parse and transform the response
    return parsePageSpeedResponse(data, url, strategy, analysisTimeMs);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`[PageSpeed] Request timed out after ${timeout}ms`);
    } else {
      console.error('[PageSpeed] API request failed:', error);
    }
    return null;
  }
}

/**
 * Parse PageSpeed API response into our interface
 */
function parsePageSpeedResponse(
  data: any,
  url: string,
  strategy: 'mobile' | 'desktop',
  analysisTimeMs: number
): PageSpeedInsightsResult {
  const lighthouse = data.lighthouseResult;
  const audits = lighthouse.audits;
  const categories = lighthouse.categories;

  // Extract Core Web Vitals from audits
  const coreWebVitals: CoreWebVitals = {
    lcp: extractMetric(audits['largest-contentful-paint']),
    fcp: extractMetric(audits['first-contentful-paint']),
    tbt: extractMetric(audits['total-blocking-time']),
    cls: extractMetric(audits['cumulative-layout-shift']),
    speedIndex: extractMetric(audits['speed-index']),
  };

  // Extract category scores (convert from 0-1 to 0-100)
  const lighthouseCategories: LighthouseCategories = {
    performance: {
      score: Math.round((categories.performance?.score || 0) * 100),
      audits: extractTopAudits(categories.performance, audits),
    },
    seo: {
      score: Math.round((categories.seo?.score || 0) * 100),
      audits: extractTopAudits(categories.seo, audits),
    },
    bestPractices: {
      score: Math.round((categories['best-practices']?.score || 0) * 100),
      audits: extractTopAudits(categories['best-practices'], audits),
    },
    accessibility: {
      score: Math.round((categories.accessibility?.score || 0) * 100),
      audits: extractTopAudits(categories.accessibility, audits),
    },
  };

  // Extract field data (CrUX) if available
  const loadingExperience = data.loadingExperience;
  const originLoadingExperience = data.originLoadingExperience;

  let fieldData = null;
  if (loadingExperience?.metrics || originLoadingExperience?.metrics) {
    const metrics =
      loadingExperience?.metrics || originLoadingExperience?.metrics;
    fieldData = {
      available: true,
      origin: originLoadingExperience?.id,
      lcp: metrics.LARGEST_CONTENTFUL_PAINT_MS
        ? {
            percentile: metrics.LARGEST_CONTENTFUL_PAINT_MS.percentile,
            category: metrics.LARGEST_CONTENTFUL_PAINT_MS.category,
          }
        : undefined,
      fcp: metrics.FIRST_CONTENTFUL_PAINT_MS
        ? {
            percentile: metrics.FIRST_CONTENTFUL_PAINT_MS.percentile,
            category: metrics.FIRST_CONTENTFUL_PAINT_MS.category,
          }
        : undefined,
      cls: metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE
        ? {
            percentile: metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile,
            category: metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.category,
          }
        : undefined,
      fid: metrics.FIRST_INPUT_DELAY_MS
        ? {
            percentile: metrics.FIRST_INPUT_DELAY_MS.percentile,
            category: metrics.FIRST_INPUT_DELAY_MS.category,
          }
        : undefined,
    };
  }

  return {
    url,
    strategy,
    fetchTime: lighthouse.fetchTime,
    coreWebVitals,
    categories: lighthouseCategories,
    fieldData,
    performanceScore: lighthouseCategories.performance.score,
    lighthouseVersion: lighthouse.lighthouseVersion,
    analysisTimeMs,
  };
}

/**
 * Extract metric from Lighthouse audit
 */
function extractMetric(audit: any): CoreWebVitalMetric {
  if (!audit) {
    return {
      value: 0,
      displayValue: 'N/A',
      score: 0,
      rating: 'poor',
    };
  }

  return {
    value: audit.numericValue || 0,
    displayValue: audit.displayValue || 'N/A',
    score: audit.score || 0,
    rating: getRating(audit.score),
  };
}

/**
 * Convert score to rating
 */
function getRating(
  score: number | null
): 'good' | 'needs-improvement' | 'poor' {
  if (score === null) return 'poor';
  if (score >= 0.9) return 'good';
  if (score >= 0.5) return 'needs-improvement';
  return 'poor';
}

/**
 * Extract top failing audits from a category
 */
function extractTopAudits(
  category: any,
  audits: any,
  limit: number = 5
): LighthouseAuditSummary[] {
  if (!category?.auditRefs) return [];

  return category.auditRefs
    .map((ref: any) => audits[ref.id])
    .filter((audit: any) => audit && audit.score !== null && audit.score < 1)
    .sort((a: any, b: any) => (a.score || 0) - (b.score || 0))
    .slice(0, limit)
    .map((audit: any) => ({
      id: audit.id,
      title: audit.title,
      description: audit.description,
      score: audit.score,
      displayValue: audit.displayValue,
      scoreDisplayMode: audit.scoreDisplayMode,
    }));
}
