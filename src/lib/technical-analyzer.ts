/**
 * Technical Performance Analyzer
 *
 * Two-tier analysis:
 * 1. Google PageSpeed Insights API (when enabled and successful) - provides real Lighthouse metrics
 * 2. Heuristic fallback (when API disabled/unavailable) - rules-based analysis
 */

import type { TechnicalPerformance } from '@/types/report';
import type { PageSpeedInsightsResult } from '@/types/pagespeed';
import { getPageSpeedInsights, isPageSpeedEnabled } from './pagespeed';

interface Issue {
  problem: string;
  solution: string;
  priority: 'high' | 'medium' | 'low';
}

interface QuickWin {
  action: string;
  impact: string;
  effort: 'easy' | 'medium' | 'hard';
}

/**
 * Main entry point for technical performance analysis
 */
export async function analyzeTechnicalPerformance(
  url: string,
  html: string = '',
  options: {
    enablePageSpeed?: boolean;
    pageSpeedStrategy?: 'mobile' | 'desktop';
    pageSpeedPromise?: Promise<PageSpeedInsightsResult | null>; // Accept pre-started promise
  } = {}
): Promise<TechnicalPerformance> {
  const {
    enablePageSpeed = isPageSpeedEnabled(),
    pageSpeedStrategy = (process.env.PAGESPEED_STRATEGY as
      | 'mobile'
      | 'desktop') || 'mobile',
    pageSpeedPromise,
  } = options;

  // First, get heuristic analysis (fast, always available)
  const heuristicResult = analyzeHeuristic(url, html);

  // If PageSpeed is disabled, return heuristic result
  if (!enablePageSpeed) {
    return heuristicResult;
  }

  // Get PageSpeed data from promise (already started) or start new call
  let pageSpeedData: PageSpeedInsightsResult | null;
  if (pageSpeedPromise) {
    const pageSpeedStart = Date.now();
    console.log(`[Technical] Awaiting PageSpeed data from parallel request`);
    pageSpeedData = await pageSpeedPromise;
    const pageSpeedWait = Date.now() - pageSpeedStart;
    console.log(`[Technical] PageSpeed wait time: ${pageSpeedWait}ms (already running in parallel)`);
  } else {
    console.log(`[Technical] Starting new PageSpeed API call for ${url}`);
    pageSpeedData = await getPageSpeedInsights(url, {
      strategy: pageSpeedStrategy,
      categories: ['performance', 'seo', 'best-practices', 'accessibility'],
    });
  }

  // If PageSpeed API failed, return heuristic result with fallback indicator
  if (!pageSpeedData) {
    console.log(
      '[Technical] PageSpeed API unavailable, using heuristic analysis'
    );
    return {
      ...heuristicResult,
      detailedAnalysis: {
        ...heuristicResult.detailedAnalysis,
        pageSpeedInsights: null,
        dataSource: 'heuristic-fallback',
      },
    };
  }

  // Merge PageSpeed data with heuristic analysis
  return mergeWithPageSpeedData(heuristicResult, pageSpeedData);
}

/**
 * Merge heuristic results with PageSpeed data
 */
function mergeWithPageSpeedData(
  heuristic: TechnicalPerformance,
  pageSpeed: PageSpeedInsightsResult
): TechnicalPerformance {
  // Calculate a blended technical score
  // Weight: 60% Performance, 15% SEO, 15% Best Practices, 10% Accessibility
  const performanceWeight = 0.6;
  const seoWeight = 0.15;
  const bestPracticesWeight = 0.15;
  const accessibilityWeight = 0.1;

  const blendedScore = Math.round(
    pageSpeed.categories.performance.score * performanceWeight +
      pageSpeed.categories.seo.score * seoWeight +
      pageSpeed.categories.bestPractices.score * bestPracticesWeight +
      pageSpeed.categories.accessibility.score * accessibilityWeight
  );

  // Determine pageSpeedEstimate based on performance score
  let pageSpeedEstimate: 'Fast' | 'Medium' | 'Slow';
  if (pageSpeed.performanceScore >= 90) {
    pageSpeedEstimate = 'Fast';
  } else if (pageSpeed.performanceScore >= 50) {
    pageSpeedEstimate = 'Medium';
  } else {
    pageSpeedEstimate = 'Slow';
  }

  // Generate issues from PageSpeed data
  const keyIssues = generateIssuesFromPageSpeed(pageSpeed);
  const quickWins = generateQuickWinsFromPageSpeed(pageSpeed);

  // Build summary
  const summary = buildPageSpeedSummary(pageSpeed);

  // Format Core Web Vitals estimate string
  const coreWebVitalsEstimate = formatCoreWebVitals(pageSpeed);

  return {
    score: blendedScore,
    summary,
    keyIssues: keyIssues.slice(0, 5),
    quickWins: quickWins.slice(0, 5),
    detailedAnalysis: {
      // Legacy fields (for backward compatibility)
      pageSpeedEstimate,
      mobileReadiness: heuristic.detailedAnalysis.mobileReadiness,
      securityIndicators: heuristic.detailedAnalysis.securityIndicators,
      accessibilityFlags: heuristic.detailedAnalysis.accessibilityFlags,
      coreWebVitalsEstimate,
      structuredDataPresence: heuristic.detailedAnalysis.structuredDataPresence,
      imageOptimization: heuristic.detailedAnalysis.imageOptimization,
      recommendations: heuristic.detailedAnalysis.recommendations,

      // NEW: Real PageSpeed data
      pageSpeedInsights: {
        lcp: pageSpeed.coreWebVitals.lcp,
        fcp: pageSpeed.coreWebVitals.fcp,
        tbt: pageSpeed.coreWebVitals.tbt,
        cls: pageSpeed.coreWebVitals.cls,
        speedIndex: pageSpeed.coreWebVitals.speedIndex,
        performanceScore: pageSpeed.categories.performance.score,
        seoScore: pageSpeed.categories.seo.score,
        bestPracticesScore: pageSpeed.categories.bestPractices.score,
        accessibilityScore: pageSpeed.categories.accessibility.score,
        strategy: pageSpeed.strategy,
        fetchTime: pageSpeed.fetchTime,
        lighthouseVersion: pageSpeed.lighthouseVersion,
        hasFieldData: pageSpeed.fieldData?.available || false,
      },
      dataSource: 'pagespeed-api',
    },
  };
}

/**
 * Generate issues from PageSpeed data
 */
function generateIssuesFromPageSpeed(
  pageSpeed: PageSpeedInsightsResult
): Issue[] {
  const issues: Issue[] = [];

  // Add issues based on Core Web Vitals ratings
  if (pageSpeed.coreWebVitals.lcp.rating === 'poor') {
    issues.push({
      problem: `Slow Largest Contentful Paint (${pageSpeed.coreWebVitals.lcp.displayValue})`,
      solution:
        'Optimize server response time, reduce render-blocking resources, and optimize images',
      priority: 'high',
    });
  } else if (pageSpeed.coreWebVitals.lcp.rating === 'needs-improvement') {
    issues.push({
      problem: `LCP needs improvement (${pageSpeed.coreWebVitals.lcp.displayValue})`,
      solution: 'Consider image optimization and reducing server response time',
      priority: 'medium',
    });
  }

  if (pageSpeed.coreWebVitals.cls.rating === 'poor') {
    issues.push({
      problem: `High Cumulative Layout Shift (${pageSpeed.coreWebVitals.cls.displayValue})`,
      solution:
        'Add explicit dimensions to images and embeds, avoid inserting content above existing content',
      priority: 'high',
    });
  }

  if (pageSpeed.coreWebVitals.tbt.rating === 'poor') {
    issues.push({
      problem: `High Total Blocking Time (${pageSpeed.coreWebVitals.tbt.displayValue})`,
      solution:
        'Reduce JavaScript execution time, split long tasks, use web workers',
      priority: 'high',
    });
  }

  if (pageSpeed.coreWebVitals.fcp.rating === 'poor') {
    issues.push({
      problem: `Slow First Contentful Paint (${pageSpeed.coreWebVitals.fcp.displayValue})`,
      solution:
        'Eliminate render-blocking resources, reduce server response time',
      priority: 'medium',
    });
  }

  // Add issues from failing audits
  for (const category of Object.values(pageSpeed.categories)) {
    for (const audit of category.audits) {
      if (audit.score !== null && audit.score < 0.5 && issues.length < 10) {
        issues.push({
          problem: audit.title,
          solution: audit.description.split('.')[0], // First sentence
          priority: audit.score < 0.25 ? 'high' : 'medium',
        });
      }
    }
  }

  return issues;
}

/**
 * Generate quick wins from PageSpeed data
 */
function generateQuickWinsFromPageSpeed(
  pageSpeed: PageSpeedInsightsResult
): QuickWin[] {
  const quickWins: QuickWin[] = [];

  // Add quick wins based on metrics that need improvement
  if (pageSpeed.coreWebVitals.lcp.rating === 'needs-improvement') {
    quickWins.push({
      action: 'Optimize largest content element',
      impact: `Improve LCP from ${pageSpeed.coreWebVitals.lcp.displayValue}`,
      effort: 'medium',
    });
  }

  if (pageSpeed.coreWebVitals.cls.rating === 'needs-improvement') {
    quickWins.push({
      action: 'Add dimensions to images and embeds',
      impact: `Improve CLS from ${pageSpeed.coreWebVitals.cls.displayValue}`,
      effort: 'easy',
    });
  }

  // Add quick wins from audits that are close to passing
  for (const category of Object.values(pageSpeed.categories)) {
    for (const audit of category.audits) {
      if (
        audit.score !== null &&
        audit.score >= 0.5 &&
        audit.score < 0.9 &&
        quickWins.length < 8
      ) {
        quickWins.push({
          action: audit.title,
          impact: audit.displayValue || 'Improves performance score',
          effort: 'medium',
        });
      }
    }
  }

  // Ensure we have at least 3 quick wins
  if (quickWins.length < 3) {
    if (pageSpeed.performanceScore < 90) {
      quickWins.push({
        action: 'Enable text compression',
        impact: 'Reduce transfer sizes',
        effort: 'easy',
      });
    }
    if (quickWins.length < 3) {
      quickWins.push({
        action: 'Serve images in next-gen formats',
        impact: 'Smaller file sizes, faster loading',
        effort: 'medium',
      });
    }
    if (quickWins.length < 3) {
      quickWins.push({
        action: 'Defer offscreen images',
        impact: 'Faster initial page load',
        effort: 'easy',
      });
    }
  }

  return quickWins;
}

/**
 * Build summary from PageSpeed data
 */
function buildPageSpeedSummary(pageSpeed: PageSpeedInsightsResult): string {
  const perf = pageSpeed.categories.performance.score;
  const seo = pageSpeed.categories.seo.score;
  const bp = pageSpeed.categories.bestPractices.score;
  const a11y = pageSpeed.categories.accessibility.score;

  const perfRating = perf >= 90 ? 'excellent' : perf >= 50 ? 'moderate' : 'poor';

  return `Lighthouse Performance: ${perf}/100 (${perfRating}). SEO: ${seo}/100. Best Practices: ${bp}/100. Accessibility: ${a11y}/100. LCP: ${pageSpeed.coreWebVitals.lcp.displayValue}, CLS: ${pageSpeed.coreWebVitals.cls.displayValue}.`;
}

/**
 * Format Core Web Vitals as a string
 */
function formatCoreWebVitals(pageSpeed: PageSpeedInsightsResult): string {
  const cwv = pageSpeed.coreWebVitals;
  const ratings = [cwv.lcp.rating, cwv.fcp.rating, cwv.cls.rating, cwv.tbt.rating];
  const goodCount = ratings.filter((r) => r === 'good').length;

  if (goodCount === ratings.length) {
    return 'All Core Web Vitals passing';
  } else if (goodCount >= 2) {
    return 'Most Core Web Vitals passing';
  } else if (goodCount >= 1) {
    return 'Some Core Web Vitals need improvement';
  }
  return 'Core Web Vitals need significant improvement';
}

/**
 * Original heuristic analysis (kept as fallback)
 */
function analyzeHeuristic(url: string, html: string): TechnicalPerformance {
  // Initialize results
  const detailedAnalysis: Record<string, unknown> = {};
  const keyIssues: Issue[] = [];
  const quickWins: QuickWin[] = [];

  // If no HTML provided, assume it's a major site with bot protection
  // Give benefit of the doubt with reasonable baseline score
  if (!html || html.length < 100) {
    const httpsEnabled = url.startsWith('https://');
    return {
      score: httpsEnabled ? 75 : 60, // Higher baseline for HTTPS sites
      summary: httpsEnabled
        ? 'Site uses HTTPS. Full technical analysis unavailable (possible bot protection or login required).'
        : 'Full technical analysis unavailable. Consider enabling HTTPS.',
      keyIssues: httpsEnabled
        ? []
        : [
            {
              problem: 'Site not using HTTPS',
              solution: 'Enable HTTPS with SSL certificate',
              priority: 'high' as const,
            },
          ],
      quickWins: [
        {
          action: 'Ensure site is accessible to crawlers',
          impact: 'Better SEO and analysis coverage',
          effort: 'medium' as const,
        },
      ],
      detailedAnalysis: {
        pageSpeedEstimate: 'Medium' as const,
        coreWebVitalsEstimate: 'Likely optimized for major sites',
        mobileReadiness: 'Assumed mobile-optimized for established sites',
        imageOptimization: 'Unknown',
        structuredDataPresence: 'Unknown - analysis limited',
        securityIndicators: httpsEnabled ? ['HTTPS Enabled'] : [],
        accessibilityFlags: [],
        recommendations: [],
      },
    };
  }

  // 1. HTTPS Check (Constant/Rule-based)
  const httpsEnabled = url.startsWith('https://');
  const securityIndicators: string[] = [];

  if (httpsEnabled) {
    securityIndicators.push('HTTPS Enabled');
  } else {
    keyIssues.push({
      problem: 'Site not using HTTPS',
      solution: "Enable HTTPS with SSL certificate (free via Let's Encrypt)",
      priority: 'high',
    });
    quickWins.push({
      action: 'Enable HTTPS',
      impact: 'Improved security and SEO ranking',
      effort: 'medium',
    });
  }

  // 2. Mobile Readiness (Rule-based from HTML)
  const hasViewportMeta = html.includes('name="viewport"');
  const hasResponsiveWidth = html.includes('width=device-width');
  let mobileReadiness = 'Unknown';

  if (hasViewportMeta && hasResponsiveWidth) {
    mobileReadiness = 'Mobile-optimized (viewport meta tag present)';
  } else if (hasViewportMeta) {
    mobileReadiness = 'Partially mobile-ready (missing responsive width)';
    keyIssues.push({
      problem: 'Viewport meta tag not fully configured',
      solution: 'Add width=device-width to viewport meta tag',
      priority: 'medium',
    });
  } else {
    mobileReadiness = 'Not mobile-optimized (missing viewport meta)';
    keyIssues.push({
      problem: 'No viewport meta tag detected',
      solution:
        'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
      priority: 'high',
    });
    quickWins.push({
      action: 'Add viewport meta tag',
      impact: 'Mobile-friendly site, better mobile rankings',
      effort: 'easy',
    });
  }

  // 3. Structured Data Detection (Rule-based)
  const hasJsonLd = html.includes('application/ld+json');
  const hasSchemaOrg = html.includes('schema.org');
  const hasOpenGraph = html.includes('og:');
  let structuredDataPresence = 'No structured data detected';

  if (hasJsonLd || hasSchemaOrg) {
    structuredDataPresence = 'Schema.org markup detected';
  } else if (hasOpenGraph) {
    structuredDataPresence = 'Open Graph tags only (no schema.org)';
    quickWins.push({
      action: 'Add schema.org structured data',
      impact: 'Better search result appearance and AI understanding',
      effort: 'medium',
    });
  } else {
    structuredDataPresence = 'No structured data detected';
    keyIssues.push({
      problem: 'No structured data found',
      solution: 'Add schema.org JSON-LD markup for better search visibility',
      priority: 'medium',
    });
    quickWins.push({
      action: 'Add basic schema.org markup',
      impact: 'Rich snippets in search results',
      effort: 'medium',
    });
  }

  // 4. Image Optimization (Rule-based)
  const imgTags = html.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
  const modernFormats = imgTags.filter(
    (img) => img.includes('.webp') || img.includes('.avif')
  ).length;
  const totalImages = imgTags.length;
  let imageOptimization = 'Unknown';

  if (totalImages > 0) {
    if (modernFormats > totalImages * 0.5) {
      imageOptimization = 'Good (50%+ modern formats like WebP/AVIF)';
    } else if (modernFormats > 0) {
      imageOptimization = 'Fair (some modern formats used)';
      quickWins.push({
        action: 'Convert more images to WebP/AVIF',
        impact: 'Faster page load, better Core Web Vitals',
        effort: 'medium',
      });
    } else {
      imageOptimization = 'Poor (no modern image formats detected)';
      keyIssues.push({
        problem: 'Images not using modern formats',
        solution: 'Convert images to WebP or AVIF format',
        priority: 'medium',
      });
      quickWins.push({
        action: 'Use WebP format for images',
        impact: '30-50% smaller file sizes, faster loading',
        effort: 'easy',
      });
    }
  }

  // 5. Page Speed Estimate (Rule-based heuristics)
  const scriptTags = (html.match(/<script/gi) || []).length;
  const styleTags = (html.match(/<style|<link[^>]+stylesheet/gi) || []).length;
  const hasLazyLoading = html.includes('loading="lazy"');
  let pageSpeedEstimate: 'Fast' | 'Medium' | 'Slow' = 'Medium';

  if (scriptTags > 20 || styleTags > 10) {
    pageSpeedEstimate = 'Slow';
    keyIssues.push({
      problem: 'Too many scripts/stylesheets detected',
      solution: 'Combine and minify CSS/JS files, consider code splitting',
      priority: 'medium',
    });
  } else if (scriptTags > 10 || styleTags > 5) {
    pageSpeedEstimate = 'Medium';
  } else {
    pageSpeedEstimate = 'Fast';
  }

  if (!hasLazyLoading && totalImages > 5) {
    quickWins.push({
      action: 'Add lazy loading to images',
      impact: 'Faster initial page load',
      effort: 'easy',
    });
  }

  // 6. Core Web Vitals Estimate
  const coreWebVitalsEstimate =
    pageSpeedEstimate === 'Fast'
      ? 'Likely good based on page structure'
      : pageSpeedEstimate === 'Medium'
        ? 'May need optimization for Core Web Vitals'
        : 'Likely failing Core Web Vitals thresholds';

  // 7. Accessibility Flags (Rule-based)
  const accessibilityFlags: string[] = [];
  const imgsWithoutAlt = (html.match(/<img(?![^>]*alt=)/gi) || []).length;
  const hasAriaLabels = html.includes('aria-label');
  const hasSkipLinks =
    html.includes('skip-to-content') || html.includes('skip-link');

  if (imgsWithoutAlt > 0) {
    accessibilityFlags.push(`${imgsWithoutAlt} images missing alt attributes`);
    keyIssues.push({
      problem: `${imgsWithoutAlt} images missing alt text`,
      solution: 'Add descriptive alt attributes to all images',
      priority: 'medium',
    });
  }
  if (!hasAriaLabels) {
    accessibilityFlags.push('No ARIA labels detected');
  }
  if (!hasSkipLinks) {
    accessibilityFlags.push('No skip-to-content links');
    quickWins.push({
      action: 'Add skip-to-content link',
      impact: 'Better keyboard navigation accessibility',
      effort: 'easy',
    });
  }

  // 8. Security Headers Check (placeholder - actual data comes from scraper)
  if (httpsEnabled) {
    securityIndicators.push('SSL/TLS Encryption');
  }

  // 9. Calculate Score (Rule-based)
  let score = 0;

  // HTTPS (20 points)
  if (httpsEnabled) score += 20;

  // Mobile readiness (20 points)
  if (mobileReadiness.includes('Mobile-optimized')) score += 20;
  else if (mobileReadiness.includes('Partially')) score += 10;

  // Structured data (20 points)
  if (structuredDataPresence.includes('Schema.org')) score += 20;
  else if (structuredDataPresence.includes('Open Graph')) score += 10;

  // Image optimization (20 points)
  if (imageOptimization.includes('Good')) score += 20;
  else if (imageOptimization.includes('Fair')) score += 10;

  // Page speed (10 points)
  if (pageSpeedEstimate === 'Fast') score += 10;
  else if (pageSpeedEstimate === 'Medium') score += 5;

  // Accessibility (10 points)
  const accessibilityScore = Math.max(0, 10 - accessibilityFlags.length * 2);
  score += accessibilityScore;

  // Build detailed analysis
  detailedAnalysis.pageSpeedEstimate = pageSpeedEstimate;
  detailedAnalysis.coreWebVitalsEstimate = coreWebVitalsEstimate;
  detailedAnalysis.mobileReadiness = mobileReadiness;
  detailedAnalysis.imageOptimization = imageOptimization;
  detailedAnalysis.structuredDataPresence = structuredDataPresence;
  detailedAnalysis.securityIndicators = securityIndicators;
  detailedAnalysis.accessibilityFlags = accessibilityFlags;
  detailedAnalysis.recommendations = [];

  // Build summary
  const summary = `Technical score: ${score}/100. ${httpsEnabled ? 'HTTPS enabled. ' : 'No HTTPS. '}${
    mobileReadiness.includes('Mobile-optimized')
      ? 'Mobile-optimized. '
      : 'Mobile optimization needed. '
  }${structuredDataPresence.includes('Schema.org') ? 'Structured data present.' : 'Missing structured data.'}`;

  // Ensure we have at least 3 quick wins
  while (quickWins.length < 3) {
    if (quickWins.length === 0) {
      quickWins.push({
        action: 'Run Lighthouse performance audit',
        impact: 'Identify specific performance bottlenecks',
        effort: 'easy',
      });
    } else if (quickWins.length === 1) {
      quickWins.push({
        action: 'Minify CSS and JavaScript',
        impact: 'Reduce file sizes by 20-30%',
        effort: 'easy',
      });
    } else {
      quickWins.push({
        action: 'Enable browser caching',
        impact: 'Faster repeat visits',
        effort: 'medium',
      });
    }
  }

  return {
    score,
    summary,
    keyIssues: keyIssues.slice(0, score >= 70 ? 2 : score >= 50 ? 3 : 5),
    quickWins: quickWins.slice(0, 5),
    detailedAnalysis:
      detailedAnalysis as TechnicalPerformance['detailedAnalysis'],
  };
}
