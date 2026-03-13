/**
 * Site Quality Analyzer
 * Calculates a site quality score similar to YourWebsiteScore
 * Rules-based scoring for SEO and technical best practices
 */

import type { TechnicalData, SiteQualityScore } from '@/types/report';

/**
 * Analyze site quality and return detailed score breakdown
 */
export function analyzeSiteQuality(
  technicalData: Partial<TechnicalData>,
  title: string,
  metaDescription: string
): SiteQualityScore {
  let totalScore = 0;
  const maxScore = 100;

  // Provide defaults for all fields that might be missing in old reports
  const data = {
    hasFavicon: technicalData.hasFavicon ?? false,
    hasViewportMeta: technicalData.hasViewportMeta ?? false,
    hasRobotsTxt: technicalData.hasRobotsTxt ?? false,
    hasSitemap: technicalData.hasSitemap ?? false,
    hasLlmsTxt: technicalData.hasLlmsTxt ?? false,
    hasStructuredData: technicalData.hasStructuredData ?? false,
    hasCanonicalTag: technicalData.hasCanonicalTag ?? false,
    hasCharsetMeta: technicalData.hasCharsetMeta ?? false,
    hasOpenGraph: technicalData.hasOpenGraph ?? false,
    hasTwitterCards: technicalData.hasTwitterCards ?? false,
    structuredDataTypes: technicalData.structuredDataTypes ?? [],
    viewportContent: technicalData.viewportContent ?? null,
    robotsTxtContent: technicalData.robotsTxtContent ?? null,
    htmlLang: technicalData.htmlLang ?? null,
    ogTitle: technicalData.ogTitle ?? null,
    ogDescription: technicalData.ogDescription ?? null,
    ogImage: technicalData.ogImage ?? null,
    ogUrl: technicalData.ogUrl ?? null,
    ogType: technicalData.ogType ?? null,
    twitterCard: technicalData.twitterCard ?? null,
    twitterTitle: technicalData.twitterTitle ?? null,
    twitterDescription: technicalData.twitterDescription ?? null,
    twitterImage: technicalData.twitterImage ?? null,
    canonicalUrl: technicalData.canonicalUrl ?? null,
    faviconUrl: technicalData.faviconUrl ?? null,
    charset: technicalData.charset ?? null,
    headingsHierarchy: technicalData.headingsHierarchy ?? {
      h1Count: 0,
      h2Count: 0,
      h3Count: 0,
      h4Count: 0,
      h5Count: 0,
      h6Count: 0,
      hasProperHierarchy: false,
      hierarchyIssues: ['Headings data not available'],
    },
  };

  // 1. Title (20 points max)
  const titleLength = title.length;
  let titleScore = 0;
  let titleStatus: 'good' | 'warning' | 'error' = 'error';

  if (titleLength >= 30 && titleLength <= 60) {
    titleScore = 20;
    titleStatus = 'good';
  } else if (titleLength > 0 && titleLength < 30) {
    titleScore = 12;
    titleStatus = 'warning';
  } else if (titleLength > 60 && titleLength <= 70) {
    titleScore = 15;
    titleStatus = 'warning';
  } else if (titleLength > 70) {
    titleScore = 10;
    titleStatus = 'warning';
  }
  totalScore += titleScore;

  // 2. Meta Description (15 points max)
  const metaDescLength = metaDescription.length;
  let metaDescScore = 0;
  let metaDescStatus: 'good' | 'warning' | 'error' = 'error';

  if (metaDescLength >= 120 && metaDescLength <= 160) {
    metaDescScore = 15;
    metaDescStatus = 'good';
  } else if (metaDescLength > 0 && metaDescLength < 120) {
    metaDescScore = 10;
    metaDescStatus = 'warning';
  } else if (metaDescLength > 160 && metaDescLength <= 200) {
    metaDescScore = 12;
    metaDescStatus = 'warning';
  } else if (metaDescLength > 200) {
    metaDescScore = 8;
    metaDescStatus = 'warning';
  }
  totalScore += metaDescScore;

  // 3. Favicon (3 points max)
  const faviconScore = data.hasFavicon ? 3 : 0;
  totalScore += faviconScore;

  // 4. Viewport Meta (8 points max)
  let viewportScore = 0;
  let viewportStatus: 'good' | 'warning' | 'error' = 'error';

  if (data.hasViewportMeta) {
    const content = data.viewportContent || '';
    if (content.includes('width=device-width') && content.includes('initial-scale=1')) {
      viewportScore = 8;
      viewportStatus = 'good';
    } else if (content.includes('width=device-width')) {
      viewportScore = 6;
      viewportStatus = 'warning';
    } else {
      viewportScore = 4;
      viewportStatus = 'warning';
    }
  }
  totalScore += viewportScore;

  // 5. robots.txt (6 points max)
  let robotsScore = 0;
  let robotsStatus: 'good' | 'warning' | 'error' = 'error';

  if (data.hasRobotsTxt) {
    const content = data.robotsTxtContent || '';
    const hasUserAgent = content.toLowerCase().includes('user-agent');
    const hasAllow = content.toLowerCase().includes('allow');
    const hasSitemap = content.toLowerCase().includes('sitemap');

    if (hasUserAgent && hasAllow && hasSitemap) {
      robotsScore = 6;
      robotsStatus = 'good';
    } else if (hasUserAgent && hasAllow) {
      robotsScore = 4;
      robotsStatus = 'warning';
    } else {
      robotsScore = 2;
      robotsStatus = 'warning';
    }
  }
  totalScore += robotsScore;

  // 6. Sitemap (7 points max)
  const sitemapScore = data.hasSitemap ? 7 : 0;
  totalScore += sitemapScore;

  // 7. llms.txt (bonus - counts towards score)
  const llmsTxtScore = data.hasLlmsTxt ? 2 : 0;
  totalScore += llmsTxtScore;

  // 8. Headings (6 points max) - with fallback for old reports
  let headingsScore = 0;
  const hierarchy = data.headingsHierarchy;

  if (hierarchy.hasProperHierarchy && hierarchy.h1Count === 1) {
    headingsScore = 6;
  } else if (hierarchy.h1Count === 1) {
    headingsScore = 4;
  } else if (hierarchy.h1Count > 0) {
    headingsScore = 2;
  }
  totalScore += headingsScore;

  // 9. Schema.org JSON-LD (4 points max)
  let schemaScore = 0;
  if (data.hasStructuredData) {
    schemaScore = data.structuredDataTypes.length >= 2 ? 4 : 2;
  }
  totalScore += schemaScore;

  // 10. Canonical URL (8 points max)
  const canonicalScore = data.hasCanonicalTag ? 8 : 0;
  totalScore += canonicalScore;

  // 11. HTML lang (4 points max)
  const htmlLangScore = data.htmlLang ? 4 : 0;
  totalScore += htmlLangScore;

  // 12. Character encoding (4 points max)
  const charsetScore = data.hasCharsetMeta ? 4 : 0;
  totalScore += charsetScore;

  // 13. Open Graph (13 points max)
  let ogScore = 0;
  if (data.ogTitle) ogScore += 3;
  if (data.ogDescription) ogScore += 3;
  if (data.ogImage) ogScore += 3;
  if (data.ogUrl) ogScore += 3;
  if (data.ogType) ogScore += 1;
  totalScore += ogScore;

  // 14. Twitter Cards (4 points max)
  let twitterScore = 0;
  if (data.twitterCard) twitterScore += 1;
  if (data.twitterTitle) twitterScore += 1;
  if (data.twitterDescription) twitterScore += 1;
  if (data.twitterImage) twitterScore += 1;
  totalScore += twitterScore;

  // Cap at maxScore (in case of bonus points)
  totalScore = Math.min(totalScore, maxScore);

  return {
    totalScore,
    maxScore,

    title: {
      score: titleScore,
      max: 20,
      value: title,
      length: titleLength,
      status: titleStatus,
    },

    metaDescription: {
      score: metaDescScore,
      max: 15,
      value: metaDescription,
      length: metaDescLength,
      status: metaDescStatus,
    },

    favicon: {
      score: faviconScore,
      max: 3,
      present: data.hasFavicon,
      url: data.faviconUrl,
    },

    viewport: {
      score: viewportScore,
      max: 8,
      present: data.hasViewportMeta,
      content: data.viewportContent,
      status: viewportStatus,
    },

    robotsTxt: {
      score: robotsScore,
      max: 6,
      present: data.hasRobotsTxt,
      content: data.robotsTxtContent,
      status: robotsStatus,
    },

    sitemap: {
      score: sitemapScore,
      max: 7,
      present: data.hasSitemap,
    },

    llmsTxt: {
      score: llmsTxtScore,
      max: 2,
      present: data.hasLlmsTxt,
    },

    headings: {
      score: headingsScore,
      max: 6,
      hasProperHierarchy: hierarchy.hasProperHierarchy,
      issues: hierarchy.hierarchyIssues,
    },

    schemaOrg: {
      score: schemaScore,
      max: 4,
      present: data.hasStructuredData,
      types: data.structuredDataTypes,
    },

    canonical: {
      score: canonicalScore,
      max: 8,
      present: data.hasCanonicalTag,
      url: data.canonicalUrl,
    },

    htmlLang: {
      score: htmlLangScore,
      max: 4,
      present: !!data.htmlLang,
      value: data.htmlLang,
    },

    charset: {
      score: charsetScore,
      max: 4,
      present: data.hasCharsetMeta,
      value: data.charset,
    },

    openGraph: {
      score: ogScore,
      max: 13,
      title: { present: !!data.ogTitle, value: data.ogTitle },
      description: { present: !!data.ogDescription, value: data.ogDescription },
      image: { present: !!data.ogImage, url: data.ogImage },
      url: { present: !!data.ogUrl, value: data.ogUrl },
      type: { present: !!data.ogType, value: data.ogType },
    },

    twitterCards: {
      score: twitterScore,
      max: 4,
      cardType: { present: !!data.twitterCard, value: data.twitterCard },
      title: { present: !!data.twitterTitle, value: data.twitterTitle },
      description: { present: !!data.twitterDescription, value: data.twitterDescription },
      image: { present: !!data.twitterImage, url: data.twitterImage },
    },
  };
}

/**
 * Generate a summary of site quality issues
 */
export function getSiteQualityIssues(score: SiteQualityScore): Array<{
  category: string;
  issue: string;
  priority: 'high' | 'medium' | 'low';
}> {
  const issues: Array<{ category: string; issue: string; priority: 'high' | 'medium' | 'low' }> = [];

  // Title issues
  if (score.title.score < score.title.max) {
    if (score.title.length === 0) {
      issues.push({ category: 'Title', issue: 'Missing page title', priority: 'high' });
    } else if (score.title.length < 30) {
      issues.push({ category: 'Title', issue: `Title too short (${score.title.length} chars, ideal 30-60)`, priority: 'medium' });
    } else if (score.title.length > 60) {
      issues.push({ category: 'Title', issue: `Title too long (${score.title.length} chars, ideal 30-60)`, priority: 'low' });
    }
  }

  // Meta description issues
  if (score.metaDescription.score < score.metaDescription.max) {
    if (score.metaDescription.length === 0) {
      issues.push({ category: 'Meta Description', issue: 'Missing meta description', priority: 'high' });
    } else if (score.metaDescription.length < 120) {
      issues.push({ category: 'Meta Description', issue: `Meta description too short (${score.metaDescription.length} chars, ideal 120-160)`, priority: 'medium' });
    } else if (score.metaDescription.length > 160) {
      issues.push({ category: 'Meta Description', issue: `Meta description too long (${score.metaDescription.length} chars, ideal 120-160)`, priority: 'low' });
    }
  }

  // Favicon
  if (!score.favicon.present) {
    issues.push({ category: 'Favicon', issue: 'Missing favicon', priority: 'medium' });
  }

  // Viewport
  if (!score.viewport.present) {
    issues.push({ category: 'Viewport', issue: 'Missing viewport meta tag', priority: 'high' });
  } else if (score.viewport.status !== 'good') {
    issues.push({ category: 'Viewport', issue: 'Viewport meta tag not properly configured', priority: 'medium' });
  }

  // robots.txt
  if (!score.robotsTxt.present) {
    issues.push({ category: 'robots.txt', issue: 'Missing robots.txt file', priority: 'medium' });
  } else if (score.robotsTxt.status !== 'good') {
    issues.push({ category: 'robots.txt', issue: 'robots.txt missing recommended directives (User-agent, Allow, Sitemap)', priority: 'low' });
  }

  // Sitemap
  if (!score.sitemap.present) {
    issues.push({ category: 'Sitemap', issue: 'Missing sitemap.xml', priority: 'medium' });
  }

  // llms.txt
  if (!score.llmsTxt.present) {
    issues.push({ category: 'llms.txt', issue: 'Missing llms.txt for AI visibility', priority: 'low' });
  }

  // Headings
  if (score.headings.issues.length > 0) {
    score.headings.issues.forEach(issue => {
      const priority = issue.includes('Missing H1') ? 'high' : 'medium';
      issues.push({ category: 'Headings', issue, priority });
    });
  }

  // Schema.org
  if (!score.schemaOrg.present) {
    issues.push({ category: 'Schema.org', issue: 'Missing structured data (JSON-LD)', priority: 'medium' });
  }

  // Canonical
  if (!score.canonical.present) {
    issues.push({ category: 'Canonical', issue: 'Missing canonical URL tag', priority: 'medium' });
  }

  // HTML lang
  if (!score.htmlLang.present) {
    issues.push({ category: 'HTML Lang', issue: 'Missing HTML lang attribute', priority: 'low' });
  }

  // Charset
  if (!score.charset.present) {
    issues.push({ category: 'Charset', issue: 'Missing character encoding declaration', priority: 'low' });
  }

  // Open Graph
  if (score.openGraph.score < score.openGraph.max) {
    if (!score.openGraph.title.present) {
      issues.push({ category: 'Open Graph', issue: 'Missing og:title', priority: 'medium' });
    }
    if (!score.openGraph.description.present) {
      issues.push({ category: 'Open Graph', issue: 'Missing og:description', priority: 'medium' });
    }
    if (!score.openGraph.image.present) {
      issues.push({ category: 'Open Graph', issue: 'Missing og:image', priority: 'medium' });
    }
    if (!score.openGraph.url.present) {
      issues.push({ category: 'Open Graph', issue: 'Missing og:url', priority: 'low' });
    }
    if (!score.openGraph.type.present) {
      issues.push({ category: 'Open Graph', issue: 'Missing og:type', priority: 'low' });
    }
  }

  // Twitter Cards
  if (score.twitterCards.score < score.twitterCards.max) {
    if (!score.twitterCards.cardType.present) {
      issues.push({ category: 'Twitter Cards', issue: 'Missing twitter:card', priority: 'low' });
    }
    if (!score.twitterCards.title.present) {
      issues.push({ category: 'Twitter Cards', issue: 'Missing twitter:title', priority: 'low' });
    }
    if (!score.twitterCards.description.present) {
      issues.push({ category: 'Twitter Cards', issue: 'Missing twitter:description', priority: 'low' });
    }
    if (!score.twitterCards.image.present) {
      issues.push({ category: 'Twitter Cards', issue: 'Missing twitter:image', priority: 'low' });
    }
  }

  return issues;
}
