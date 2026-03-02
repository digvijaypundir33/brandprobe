/**
 * Technical Performance Analyzer
 * Uses constants and rules-based analysis instead of AI for faster, more accurate results
 */

interface TechnicalAnalysisResult {
  pageSpeedEstimate: 'Fast' | 'Medium' | 'Slow';
  mobileReadiness: string;
  httpsEnabled: boolean;
  imageOptimization: string;
  structuredDataPresence: string;
  securityIndicators: string[];
  accessibilityFlags: string[];
  score: number;
}

export async function analyzeTechnicalPerformance(
  url: string,
  scrapedData: { html?: string; images?: string[] }
): Promise<TechnicalAnalysisResult> {
  const results: TechnicalAnalysisResult = {
    pageSpeedEstimate: 'Medium',
    mobileReadiness: 'Unknown',
    httpsEnabled: false,
    imageOptimization: 'Unknown',
    structuredDataPresence: 'Not detected',
    securityIndicators: [],
    accessibilityFlags: [],
    score: 50,
  };

  // 1. HTTPS Check (Constant/Rule-based)
  results.httpsEnabled = url.startsWith('https://');
  if (results.httpsEnabled) {
    results.securityIndicators.push('HTTPS Enabled');
  }

  // 2. Mobile Readiness (Rule-based from HTML)
  if (scrapedData.html) {
    const hasViewportMeta = scrapedData.html.includes('name="viewport"');
    const hasResponsiveWidth = scrapedData.html.includes('width=device-width');

    if (hasViewportMeta && hasResponsiveWidth) {
      results.mobileReadiness = 'Mobile-optimized (viewport meta tag present)';
    } else if (hasViewportMeta) {
      results.mobileReadiness = 'Partially mobile-ready (missing responsive width)';
    } else {
      results.mobileReadiness = 'Not mobile-optimized (missing viewport meta)';
    }
  }

  // 3. Structured Data Detection (Rule-based)
  if (scrapedData.html) {
    const hasJsonLd = scrapedData.html.includes('application/ld+json');
    const hasSchemaOrg = scrapedData.html.includes('schema.org');
    const hasOpenGraph = scrapedData.html.includes('og:');

    if (hasJsonLd || hasSchemaOrg) {
      results.structuredDataPresence = 'Schema.org markup detected';
    } else if (hasOpenGraph) {
      results.structuredDataPresence = 'Open Graph tags only (no schema.org)';
    } else {
      results.structuredDataPresence = 'No structured data detected';
    }
  }

  // 4. Image Optimization (Rule-based)
  if (scrapedData.images && scrapedData.images.length > 0) {
    const modernFormats = scrapedData.images.filter(
      img => img.includes('.webp') || img.includes('.avif')
    ).length;
    const totalImages = scrapedData.images.length;

    if (modernFormats > totalImages * 0.5) {
      results.imageOptimization = 'Good (50%+ modern formats like WebP/AVIF)';
    } else if (modernFormats > 0) {
      results.imageOptimization = 'Fair (some modern formats used)';
    } else {
      results.imageOptimization = 'Poor (no modern image formats detected)';
    }
  }

  // 5. Accessibility Flags (Rule-based)
  if (scrapedData.html) {
    const hasAltMissing = !scrapedData.html.includes('alt="');
    const hasAriaLabels = scrapedData.html.includes('aria-label');
    const hasSkipLinks = scrapedData.html.includes('skip-to-content') ||
                          scrapedData.html.includes('skip-link');

    if (hasAltMissing) results.accessibilityFlags.push('Missing alt attributes on images');
    if (!hasAriaLabels) results.accessibilityFlags.push('No ARIA labels detected');
    if (!hasSkipLinks) results.accessibilityFlags.push('No skip-to-content links');
  }

  // 6. Calculate Score (Rule-based)
  let score = 0;

  // HTTPS (20 points)
  if (results.httpsEnabled) score += 20;

  // Mobile readiness (20 points)
  if (results.mobileReadiness.includes('Mobile-optimized')) score += 20;
  else if (results.mobileReadiness.includes('Partially')) score += 10;

  // Structured data (20 points)
  if (results.structuredDataPresence.includes('Schema.org')) score += 20;
  else if (results.structuredDataPresence.includes('Open Graph')) score += 10;

  // Image optimization (20 points)
  if (results.imageOptimization.includes('Good')) score += 20;
  else if (results.imageOptimization.includes('Fair')) score += 10;

  // Accessibility (20 points)
  const accessibilityScore = Math.max(0, 20 - (results.accessibilityFlags.length * 5));
  score += accessibilityScore;

  results.score = score;

  return results;
}
