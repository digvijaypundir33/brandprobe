/**
 * Technical Performance Analyzer
 * Uses constants and rules-based analysis instead of AI for faster, more accurate results
 */

import type { TechnicalPerformance } from '@/types/report';

export async function analyzeTechnicalPerformance(
  url: string,
  html: string = ''
): Promise<TechnicalPerformance> {
  // Initialize results
  const detailedAnalysis: Record<string, unknown> = {};
  const keyIssues: Array<{ problem: string; solution: string; priority: 'high' | 'medium' | 'low' }> = [];
  const quickWins: Array<{ action: string; impact: string; effort: 'easy' | 'medium' | 'hard' }> = [];

  // If no HTML provided, assume it's a major site with bot protection
  // Give benefit of the doubt with reasonable baseline score
  if (!html || html.length < 100) {
    const httpsEnabled = url.startsWith('https://');
    return {
      score: httpsEnabled ? 75 : 60, // Higher baseline for HTTPS sites
      summary: httpsEnabled
        ? 'Site uses HTTPS. Full technical analysis unavailable (possible bot protection or login required).'
        : 'Full technical analysis unavailable. Consider enabling HTTPS.',
      keyIssues: httpsEnabled ? [] : [{
        problem: 'Site not using HTTPS',
        solution: 'Enable HTTPS with SSL certificate',
        priority: 'high' as const
      }],
      quickWins: [{
        action: 'Ensure site is accessible to crawlers',
        impact: 'Better SEO and analysis coverage',
        effort: 'medium' as const
      }],
      detailedAnalysis: {
        pageSpeedEstimate: 'Medium' as const,
        coreWebVitalsEstimate: 'Likely optimized for major sites',
        mobileReadiness: 'Assumed mobile-optimized for established sites',
        imageOptimization: 'Unknown',
        structuredDataPresence: 'Unknown - analysis limited',
        securityIndicators: httpsEnabled ? ['HTTPS Enabled'] : [],
        accessibilityFlags: [],
        recommendations: []
      }
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
      solution: 'Enable HTTPS with SSL certificate (free via Let\'s Encrypt)',
      priority: 'high'
    });
    quickWins.push({
      action: 'Enable HTTPS',
      impact: 'Improved security and SEO ranking',
      effort: 'medium'
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
      priority: 'medium'
    });
  } else {
    mobileReadiness = 'Not mobile-optimized (missing viewport meta)';
    keyIssues.push({
      problem: 'No viewport meta tag detected',
      solution: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
      priority: 'high'
    });
    quickWins.push({
      action: 'Add viewport meta tag',
      impact: 'Mobile-friendly site, better mobile rankings',
      effort: 'easy'
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
      effort: 'medium'
    });
  } else {
    structuredDataPresence = 'No structured data detected';
    keyIssues.push({
      problem: 'No structured data found',
      solution: 'Add schema.org JSON-LD markup for better search visibility',
      priority: 'medium'
    });
    quickWins.push({
      action: 'Add basic schema.org markup',
      impact: 'Rich snippets in search results',
      effort: 'medium'
    });
  }

  // 4. Image Optimization (Rule-based)
  const imgTags = html.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
  const modernFormats = imgTags.filter(
    img => img.includes('.webp') || img.includes('.avif')
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
        effort: 'medium'
      });
    } else {
      imageOptimization = 'Poor (no modern image formats detected)';
      keyIssues.push({
        problem: 'Images not using modern formats',
        solution: 'Convert images to WebP or AVIF format',
        priority: 'medium'
      });
      quickWins.push({
        action: 'Use WebP format for images',
        impact: '30-50% smaller file sizes, faster loading',
        effort: 'easy'
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
      priority: 'medium'
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
      effort: 'easy'
    });
  }

  // 6. Core Web Vitals Estimate
  const coreWebVitalsEstimate = pageSpeedEstimate === 'Fast'
    ? 'Likely good based on page structure'
    : pageSpeedEstimate === 'Medium'
    ? 'May need optimization for Core Web Vitals'
    : 'Likely failing Core Web Vitals thresholds';

  // 7. Accessibility Flags (Rule-based)
  const accessibilityFlags: string[] = [];
  const imgsWithoutAlt = (html.match(/<img(?![^>]*alt=)/gi) || []).length;
  const hasAriaLabels = html.includes('aria-label');
  const hasSkipLinks = html.includes('skip-to-content') || html.includes('skip-link');

  if (imgsWithoutAlt > 0) {
    accessibilityFlags.push(`${imgsWithoutAlt} images missing alt attributes`);
    keyIssues.push({
      problem: `${imgsWithoutAlt} images missing alt text`,
      solution: 'Add descriptive alt attributes to all images',
      priority: 'medium'
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
      effort: 'easy'
    });
  }

  // 8. Calculate Score (Rule-based)
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
  const accessibilityScore = Math.max(0, 10 - (accessibilityFlags.length * 2));
  score += accessibilityScore;

  // Build detailed analysis
  detailedAnalysis.pageSpeedEstimate = pageSpeedEstimate;
  detailedAnalysis.coreWebVitalsEstimate = coreWebVitalsEstimate;
  detailedAnalysis.mobileReadiness = mobileReadiness;
  detailedAnalysis.imageOptimization = imageOptimization;
  detailedAnalysis.structuredDataPresence = structuredDataPresence;
  detailedAnalysis.securityIndicators = securityIndicators;
  detailedAnalysis.accessibilityFlags = accessibilityFlags;

  // Build summary
  const summary = `Technical score: ${score}/100. ${httpsEnabled ? 'HTTPS enabled. ' : 'No HTTPS. '}${
    mobileReadiness.includes('Mobile-optimized') ? 'Mobile-optimized. ' : 'Mobile optimization needed. '
  }${structuredDataPresence.includes('Schema.org') ? 'Structured data present.' : 'Missing structured data.'}`;

  // Ensure we have at least 3 quick wins
  while (quickWins.length < 3) {
    if (quickWins.length === 0) {
      quickWins.push({
        action: 'Run Lighthouse performance audit',
        impact: 'Identify specific performance bottlenecks',
        effort: 'easy'
      });
    } else if (quickWins.length === 1) {
      quickWins.push({
        action: 'Minify CSS and JavaScript',
        impact: 'Reduce file sizes by 20-30%',
        effort: 'easy'
      });
    } else {
      quickWins.push({
        action: 'Enable browser caching',
        impact: 'Faster repeat visits',
        effort: 'medium'
      });
    }
  }

  return {
    score,
    summary,
    keyIssues: keyIssues.slice(0, score >= 70 ? 2 : score >= 50 ? 3 : 5),
    quickWins: quickWins.slice(0, 5),
    detailedAnalysis: detailedAnalysis as TechnicalPerformance['detailedAnalysis']
  };
}
