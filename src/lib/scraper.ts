import type { ScrapedData, SubPageData, TechnicalData } from '@/types/report';
import { normalizeUrl, cleanText } from './utils';
import { fetchSitemap, selectBestPages, extractSitemapMetadata } from './sitemap-parser';
import { getBrandUrlsToScrape } from './brand-recognizer';

// Playwright service configuration
const TIMEOUT = 30000; // 30 seconds max per page
const MAX_SUBPAGES = 3;
const PLAYWRIGHT_SERVICE_URL = process.env.PLAYWRIGHT_SERVICE_URL || 'https://playwright-service.fly.dev';

// Helper function to scrape a URL using the Playwright service
async function scrapeWithService(url: string): Promise<{
  url: string;
  title: string;
  html: string;
}> {
  const response = await fetch(`${PLAYWRIGHT_SERVICE_URL}/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      options: {
        waitUntil: 'domcontentloaded',
        timeout: TIMEOUT,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Playwright service error: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Scraping failed');
  }

  return result.data;
}

// Parse HTML and extract structured data
async function parseHTML(url: string, html: string) {
  const { load } = await import('cheerio');
  const $ = load(html);

  // Get meta description
  const metaDescription = $('meta[name="description"]').attr('content') || '';

  // Get headings
  const h1 = $('h1')
    .map((_: number, el: any) => $(el).text().trim())
    .get()
    .filter(Boolean);
  const h2 = $('h2')
    .map((_: number, el: any) => $(el).text().trim())
    .get()
    .filter(Boolean);

  // Get hero text
  const heroSelectors = [
    'header + section',
    'main > section:first-child',
    '[class*="hero"]',
    '[class*="banner"]',
    '.hero',
    '#hero',
  ];
  let heroText = '';
  for (const selector of heroSelectors) {
    const el = $(selector);
    if (el.length > 0) {
      heroText = el.text().slice(0, 1000).trim();
      break;
    }
  }
  if (!heroText && h1.length > 0) {
    heroText = h1[0];
  }

  // Get CTAs
  const ctaSelectors = [
    'a[class*="cta"]',
    'button[class*="cta"]',
    'a[class*="btn"]',
    'button[class*="btn"]',
    'a[class*="button"]',
    'button',
    '[role="button"]',
  ];
  const ctas: string[] = [];
  ctaSelectors.forEach((selector) => {
    $(selector).each((_: number, el: any) => {
      const text = $(el).text().trim();
      if (text && text.length < 50 && !ctas.includes(text)) {
        ctas.push(text);
      }
    });
  });

  // Get nav links
  const navLinks: string[] = [];
  $('nav a, header a').each((_: number, el: any) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if (href && text && !href.startsWith('#') && !href.startsWith('mailto:')) {
      navLinks.push(href);
    }
  });

  // Get testimonials
  const testimonialSelectors = [
    '[class*="testimonial"]',
    '[class*="review"]',
    '[class*="quote"]',
    'blockquote',
  ];
  const testimonials: string[] = [];
  testimonialSelectors.forEach((selector) => {
    $(selector).each((_: number, el: any) => {
      const text = $(el).text().slice(0, 500).trim();
      if (text && text.length > 20) {
        testimonials.push(text);
      }
    });
  });

  // Get trust signals
  const trustSelectors = [
    '[class*="trust"]',
    '[class*="partner"]',
    '[class*="client"]',
    '[class*="logo"]',
    '[class*="badge"]',
    '[class*="certification"]',
  ];
  const trustSignals: string[] = [];
  trustSelectors.forEach((selector) => {
    $(selector).each((_: number, el: any) => {
      const alt = $(el).attr('alt');
      const title = $(el).attr('title');
      if (alt) trustSignals.push(alt);
      if (title) trustSignals.push(title);
    });
  });

  // Get pricing info
  let pricingInfo: string | null = null;
  const pricingSelectors = [
    '[class*="pricing"]',
    '[class*="price"]',
    '[id*="pricing"]',
    '[id*="price"]',
  ];
  for (const selector of pricingSelectors) {
    const el = $(selector);
    if (el.length > 0) {
      pricingInfo = el.text().slice(0, 1000).trim();
      break;
    }
  }

  // Get social proof
  const socialSelectors = [
    '[class*="social-proof"]',
    '[class*="stats"]',
    '[class*="numbers"]',
    '[class*="metric"]',
  ];
  const socialProof: string[] = [];
  socialSelectors.forEach((selector) => {
    $(selector).each((_: number, el: any) => {
      const text = $(el).text().trim();
      if (text && text.length < 200) {
        socialProof.push(text);
      }
    });
  });

  return {
    url,
    metaDescription,
    h1,
    h2,
    heroText,
    ctas: ctas.slice(0, 10),
    navLinks: [...new Set(navLinks)].slice(0, 20),
    testimonials: testimonials.slice(0, 5),
    trustSignals: [...new Set(trustSignals)].slice(0, 10),
    pricingInfo,
    socialProof: socialProof.slice(0, 5),
  };
}

/**
 * Main scraper function - scrapes a URL and returns structured data
 * Now supports both Quick (1 page) and Full (4 pages) analysis modes
 * Uses Fly.io Playwright service for all scraping
 */
export async function scrapeWebsite(
  url: string,
  options: { analysisType?: 'quick' | 'full' } = {}
): Promise<ScrapedData & { brandConfig?: any; pagesAnalyzed: number }> {
  const { analysisType = 'full' } = options;
  const normalizedUrl = normalizeUrl(url);

  // Step 1: Brand detection and URL routing
  console.log(`[Scraper] Analysis type: ${analysisType}`);
  const brandRouting = await getBrandUrlsToScrape(normalizedUrl);

  let urlsToScrape: string[] = [];
  let useSitemap = false;

  if (analysisType === 'quick') {
    // Quick mode: Only scrape the entered URL (or brand's primary URL)
    urlsToScrape = [brandRouting.urls[0]];
    console.log('[Scraper] Quick mode: Single page analysis');
  } else {
    // Full mode: Use brand routing or sitemap intelligence
    if (brandRouting.useBrandBaselines) {
      // Major brand detected - use curated URLs
      urlsToScrape = brandRouting.urls.slice(0, 4); // Primary + up to 3 additional
      console.log(`[Scraper] Major brand detected, using ${urlsToScrape.length} curated URLs`);
    } else {
      // Regular site - try sitemap first
      const sitemap = await fetchSitemap(normalizedUrl);

      if (sitemap.length > 0) {
        // Use sitemap to find best pages
        const sitemapPages = selectBestPages(sitemap, normalizedUrl, MAX_SUBPAGES);
        urlsToScrape = [normalizedUrl, ...sitemapPages];
        useSitemap = true;
        console.log(`[Scraper] Using sitemap: ${urlsToScrape.length} pages selected`);
      } else {
        // Will fall back to nav-based discovery after scraping main page
        urlsToScrape = [normalizedUrl];
        console.log('[Scraper] No sitemap found, will use nav-based discovery');
      }
    }
  }

  // Step 2: Scrape main page using Playwright service
  const rawData = await scrapeWithService(urlsToScrape[0]);
  const parsedData = await parseHTML(rawData.url, rawData.html);

  const mainPageData = {
    ...rawData,
    ...parsedData,
  };

  // Step 3: Scrape technical data
  const technicalData = await scrapeTechnicalData(mainPageData.url, mainPageData.html);

  // Step 4: Scrape subpages (skip in Quick mode)
  let subPages: SubPageData[] = [];
  let subPageUrls: string[] = [];

  if (analysisType === 'full') {
    if (brandRouting.useBrandBaselines || useSitemap) {
      // Already have URLs from brand routing or sitemap
      subPageUrls = urlsToScrape.slice(1);
    } else {
      // Fall back to nav-based discovery
      subPageUrls = getSubPageUrls(mainPageData.navLinks, normalizedUrl);
    }

    subPages = await scrapeSubPages(subPageUrls);
  }

  // Step 5: Extract sitemap metadata (if available, for SEO analysis)
  let sitemapMetadata = undefined;
  if (useSitemap) {
    const sitemap = await fetchSitemap(normalizedUrl);
    if (sitemap.length > 0) {
      sitemapMetadata = extractSitemapMetadata(sitemap);
    }
  }

  const pagesAnalyzed = 1 + subPages.length; // Main page + subpages

  return {
    url: mainPageData.url,
    title: mainPageData.title,
    metaDescription: mainPageData.metaDescription,
    h1: mainPageData.h1,
    h2: mainPageData.h2,
    heroText: mainPageData.heroText,
    ctas: mainPageData.ctas,
    navLinks: mainPageData.navLinks,
    testimonials: mainPageData.testimonials,
    trustSignals: mainPageData.trustSignals,
    pricingInfo: mainPageData.pricingInfo,
    socialProof: mainPageData.socialProof,
    html: mainPageData.html,
    subPages,
    technicalData,
    sitemapMetadata,
    brandConfig: brandRouting.useBrandBaselines ? brandRouting : undefined,
    pagesAnalyzed,
  };
}

/**
 * Scrape technical data from HTML
 */
async function scrapeTechnicalData(url: string, html: string): Promise<TechnicalData> {
  const startTime = Date.now();

  // Helper to extract meta content
  const getMetaContent = (nameOrProperty: string, isProperty = false): string | null => {
    const attr = isProperty ? 'property' : 'name';
    const regex = new RegExp(`<meta\\s+${attr}=["']${nameOrProperty}["'][^>]*content=["']([^"']*)["']`, 'i');
    const altRegex = new RegExp(`<meta\\s+content=["']([^"']*)["'][^>]*${attr}=["']${nameOrProperty}["']`, 'i');
    const match = html.match(regex) || html.match(altRegex);
    return match ? match[1] : null;
  };

  // Extract Open Graph data
  const ogTitle = getMetaContent('og:title', true);
  const ogDescription = getMetaContent('og:description', true);
  const ogImage = getMetaContent('og:image', true);
  const ogUrl = getMetaContent('og:url', true);
  const ogType = getMetaContent('og:type', true);

  // Check for Open Graph tags
  const hasOpenGraph = !!(ogTitle || ogDescription || ogImage);

  // Extract Twitter Card data
  const twitterCard = getMetaContent('twitter:card');
  const twitterTitle = getMetaContent('twitter:title');
  const twitterDescription = getMetaContent('twitter:description');
  const twitterImage = getMetaContent('twitter:image');

  // Check for Twitter Cards
  const hasTwitterCards = !!(twitterCard || twitterTitle);

  // Check for structured data (JSON-LD)
  const structuredDataMatches = html.match(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  const structuredDataTypes: string[] = [];
  let hasFAQSchema = false;

  if (structuredDataMatches) {
    for (const match of structuredDataMatches) {
      try {
        const jsonContent = match.replace(/<script[^>]*>|<\/script>/gi, '').trim();
        const data = JSON.parse(jsonContent);
        if (data['@type']) {
          structuredDataTypes.push(data['@type']);
          if (data['@type'] === 'FAQPage') {
            hasFAQSchema = true;
          }
        }
        if (Array.isArray(data['@graph'])) {
          data['@graph'].forEach((item: { '@type'?: string }) => {
            if (item['@type']) {
              structuredDataTypes.push(item['@type']);
              if (item['@type'] === 'FAQPage') {
                hasFAQSchema = true;
              }
            }
          });
        }
      } catch {
        // Invalid JSON, skip
      }
    }
  }

  // Check for favicon and extract URL
  const faviconMatch = html.match(/<link\s+[^>]*rel=["'](icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']*)["']/i) ||
    html.match(/<link\s+[^>]*href=["']([^"']*)["'][^>]*rel=["'](icon|shortcut icon|apple-touch-icon)["']/i);
  const hasFavicon = !!faviconMatch;
  let faviconUrl: string | null = null;
  if (faviconMatch) {
    faviconUrl = faviconMatch[2] || faviconMatch[1];
    if (faviconUrl && !faviconUrl.startsWith('http')) {
      try {
        faviconUrl = new URL(faviconUrl, url).href;
      } catch {
        // Keep relative URL
      }
    }
  }

  // Check for canonical tag and extract URL
  const canonicalMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
    html.match(/<link\s+[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  const hasCanonicalTag = !!canonicalMatch;
  const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;

  // Check for viewport meta and extract content
  const viewportMatch = html.match(/<meta\s+[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']viewport["']/i);
  const hasViewportMeta = !!viewportMatch;
  const viewportContent = viewportMatch ? viewportMatch[1] : null;

  // Check for charset meta and extract value
  const charsetMatch = html.match(/<meta\s+charset=["']([^"']*)["']/i) ||
    html.match(/<meta\s+[^>]*charset=["']([^"']*)["']/i);
  const contentTypeMatch = html.match(/charset=([^"'\s;]+)/i);
  const hasCharsetMeta = !!(charsetMatch || contentTypeMatch);
  const charset = charsetMatch ? charsetMatch[1] : (contentTypeMatch ? contentTypeMatch[1] : null);

  // Extract HTML lang attribute
  const langMatch = html.match(/<html[^>]*\slang=["']([^"']*)["']/i);
  const htmlLang = langMatch ? langMatch[1] : null;

  // Count images with and without alt text
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  let imagesWithAlt = 0;
  let imagesWithoutAlt = 0;
  imgMatches.forEach((img) => {
    if (img.match(/alt\s*=\s*["'][^"']+["']/i)) {
      imagesWithAlt++;
    } else {
      imagesWithoutAlt++;
    }
  });

  // Count forms
  const formCount = (html.match(/<form[^>]*>/gi) || []).length;

  // Count videos
  const videoCount =
    (html.match(/<video[^>]*>/gi) || []).length +
    (html.match(/<iframe[^>]*src=["'][^"']*youtube[^"']*["']/gi) || []).length +
    (html.match(/<iframe[^>]*src=["'][^"']*vimeo[^"']*["']/gi) || []).length;

  // Count links
  const linkMatches = html.match(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
  let externalLinkCount = 0;
  let internalLinkCount = 0;
  const currentHost = new URL(url).hostname;

  linkMatches.forEach((link) => {
    const hrefMatch = link.match(/href=["']([^"']*)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      try {
        const linkUrl = new URL(hrefMatch[1], url);
        if (linkUrl.hostname === currentHost) {
          internalLinkCount++;
        } else if (linkUrl.protocol.startsWith('http')) {
          externalLinkCount++;
        }
      } catch {
        // Invalid URL, skip
      }
    }
  });

  // Estimate page size
  const htmlSize = html.length;
  let pageSize = '';
  if (htmlSize < 100000) {
    pageSize = 'Small (<100KB)';
  } else if (htmlSize < 500000) {
    pageSize = 'Medium (100-500KB)';
  } else {
    pageSize = 'Large (>500KB)';
  }

  const loadTime = Date.now() - startTime;

  // Check if URL uses HTTPS
  const hasSSL = url.startsWith('https://');

  // Estimate load time category
  let loadTimeEstimate: 'fast' | 'medium' | 'slow' = 'fast';
  if (loadTime > 3000) {
    loadTimeEstimate = 'slow';
  } else if (loadTime > 1500) {
    loadTimeEstimate = 'medium';
  }

  // Analyze headings hierarchy
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
  const h4Count = (html.match(/<h4[^>]*>/gi) || []).length;
  const h5Count = (html.match(/<h5[^>]*>/gi) || []).length;
  const h6Count = (html.match(/<h6[^>]*>/gi) || []).length;

  // Check heading hierarchy issues
  const hierarchyIssues: string[] = [];
  if (h1Count === 0) {
    hierarchyIssues.push('Missing H1 heading');
  } else if (h1Count > 1) {
    hierarchyIssues.push(`Multiple H1 headings (${h1Count} found)`);
  }
  if (h3Count > 0 && h2Count === 0) {
    hierarchyIssues.push('H3 used without H2 (skipped heading level)');
  }
  if (h4Count > 0 && h3Count === 0) {
    hierarchyIssues.push('H4 used without H3 (skipped heading level)');
  }
  const hasProperHierarchy = hierarchyIssues.length === 0;

  const headingsHierarchy = {
    h1Count,
    h2Count,
    h3Count,
    h4Count,
    h5Count,
    h6Count,
    hasProperHierarchy,
    hierarchyIssues,
  };

  // Extract title and meta description lengths
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].trim() : '';
  const titleLength = titleText.length;
  const metaDescriptionText = getMetaContent('description') || '';
  const metaDescriptionLength = metaDescriptionText.length;

  // Check for robots.txt, sitemap, llms.txt, and security headers
  let hasRobotsTxt = false;
  let hasSitemap = false;
  let hasLlmsTxt = false;
  let robotsTxtContent: string | null = null;

  // Security headers
  let securityHeaders = {
    hasHSTS: false,
    hstsValue: null as string | null,
    hasCSP: false,
    cspValue: null as string | null,
    hasXFrameOptions: false,
    xFrameOptionsValue: null as string | null,
    hasXContentTypeOptions: false,
    xContentTypeOptionsValue: null as string | null,
    hasReferrerPolicy: false,
    referrerPolicyValue: null as string | null,
    hasPermissionsPolicy: false,
    permissionsPolicyValue: null as string | null,
  };

  try {
    const baseUrl = new URL(url);

    // Parallelize all HTTP requests for massive performance improvement
    // Previously: sequential (~10-15s), Now: parallel (~2-3s total)
    const [headersResponse, robotsResponse, sitemapResponse, llmsResponse] = await Promise.all([
      // Fetch security headers from the main URL
      fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
        redirect: 'follow',
      }).catch(() => null),

      // Check robots.txt and get content
      fetch(`${baseUrl.origin}/robots.txt`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      }).catch(() => null),

      // Check sitemap
      fetch(`${baseUrl.origin}/sitemap.xml`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      }).catch(() => null),

      // Check llms.txt (new AI visibility standard)
      fetch(`${baseUrl.origin}/llms.txt`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      }).catch(() => null),
    ]);

    // Process security headers
    if (headersResponse?.ok) {
      const headers = headersResponse.headers;

      // HSTS (Strict-Transport-Security)
      const hsts = headers.get('strict-transport-security');
      if (hsts) {
        securityHeaders.hasHSTS = true;
        securityHeaders.hstsValue = hsts;
      }

      // CSP (Content-Security-Policy)
      const csp = headers.get('content-security-policy');
      if (csp) {
        securityHeaders.hasCSP = true;
        securityHeaders.cspValue = csp.slice(0, 500); // Truncate for storage
      }

      // X-Frame-Options
      const xfo = headers.get('x-frame-options');
      if (xfo) {
        securityHeaders.hasXFrameOptions = true;
        securityHeaders.xFrameOptionsValue = xfo;
      }

      // X-Content-Type-Options
      const xcto = headers.get('x-content-type-options');
      if (xcto) {
        securityHeaders.hasXContentTypeOptions = true;
        securityHeaders.xContentTypeOptionsValue = xcto;
      }

      // Referrer-Policy
      const rp = headers.get('referrer-policy');
      if (rp) {
        securityHeaders.hasReferrerPolicy = true;
        securityHeaders.referrerPolicyValue = rp;
      }

      // Permissions-Policy (or Feature-Policy)
      const pp = headers.get('permissions-policy') || headers.get('feature-policy');
      if (pp) {
        securityHeaders.hasPermissionsPolicy = true;
        securityHeaders.permissionsPolicyValue = pp.slice(0, 500); // Truncate for storage
      }
    }

    // Process robots.txt
    if (robotsResponse?.ok) {
      hasRobotsTxt = true;
      const text = await robotsResponse.text();
      robotsTxtContent = text.slice(0, 500); // First 500 chars
    }

    // Process sitemap
    hasSitemap = sitemapResponse?.ok ?? false;

    // Process llms.txt
    hasLlmsTxt = llmsResponse?.ok ?? false;
  } catch {
    // Ignore errors
  }

  return {
    hasSSL,
    hasFavicon,
    hasOpenGraph,
    hasTwitterCards,
    hasStructuredData: structuredDataTypes.length > 0,
    structuredDataTypes: [...new Set(structuredDataTypes)],
    hasCanonicalTag,
    hasRobotsTxt,
    hasSitemap,
    hasLlmsTxt,
    imagesWithAlt,
    imagesWithoutAlt,
    formCount,
    videoCount,
    externalLinkCount,
    internalLinkCount,
    hasViewportMeta,
    hasCharsetMeta,
    hasFAQSchema,
    loadTimeEstimate,
    pageSize,
    htmlLang,
    titleLength,
    metaDescriptionLength,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonicalUrl,
    faviconUrl,
    viewportContent,
    charset,
    headingsHierarchy,
    robotsTxtContent,
    securityHeaders,
  };
}

/**
 * Get URLs of subpages to scrape
 */
function getSubPageUrls(navLinks: string[], baseUrl: string): string[] {
  const base = new URL(baseUrl);
  const priorityPaths = [
    '/about',
    '/pricing',
    '/features',
    '/product',
    '/services',
    '/solutions',
    '/how-it-works',
  ];

  const urls: string[] = [];

  // First, try to find priority pages
  for (const path of priorityPaths) {
    const matchingLink = navLinks.find((link) => {
      try {
        const linkUrl = new URL(link, baseUrl);
        return (
          linkUrl.hostname === base.hostname &&
          linkUrl.pathname.toLowerCase().includes(path.toLowerCase())
        );
      } catch {
        return false;
      }
    });
    if (matchingLink && urls.length < MAX_SUBPAGES) {
      try {
        const fullUrl = new URL(matchingLink, baseUrl).href;
        if (!urls.includes(fullUrl)) {
          urls.push(fullUrl);
        }
      } catch {
        // Skip invalid URLs
      }
    }
  }

  // Fill remaining slots with other internal links
  for (const link of navLinks) {
    if (urls.length >= MAX_SUBPAGES) break;
    try {
      const linkUrl = new URL(link, baseUrl);
      if (linkUrl.hostname === base.hostname && !urls.includes(linkUrl.href)) {
        urls.push(linkUrl.href);
      }
    } catch {
      // Skip invalid URLs
    }
  }

  return urls;
}

/**
 * Scrape subpages using Playwright service
 */
async function scrapeSubPages(urls: string[]): Promise<SubPageData[]> {
  // Parallelize subpage scraping for massive performance improvement
  // Previously: sequential (45-60s for 3 pages), Now: parallel (15-20s total)
  const scrapePromises = urls.map(async (url) => {
    try {
      const rawData = await scrapeWithService(url);
      const parsedData = await parseHTML(rawData.url, rawData.html);

      return {
        url: rawData.url,
        title: rawData.title,
        h1: parsedData.h1,
        h2: parsedData.h2,
        mainContent: parsedData.heroText || (parsedData.h1.length > 0 ? parsedData.h1[0] : ''),
      };
    } catch (error) {
      console.error(`Failed to scrape subpage ${url}:`, error);
      return null; // Return null for failed pages
    }
  });

  // Wait for all scrapes to complete in parallel
  const results = await Promise.all(scrapePromises);

  // Filter out null results (failed scrapes)
  return results.filter((page): page is SubPageData => page !== null);
}

/**
 * Format scraped data for Claude prompt
 */
export function formatScrapedDataForPrompt(data: ScrapedData): string {
  const sections: string[] = [];

  sections.push(`## Website: ${data.url}`);
  sections.push(`### Title: ${data.title}`);
  sections.push(`### Meta Description: ${data.metaDescription || 'None'}`);

  if (data.h1.length > 0) {
    sections.push(`### H1 Headlines:\n${data.h1.map((h) => `- ${h}`).join('\n')}`);
  }

  if (data.h2.length > 0) {
    sections.push(`### H2 Headlines:\n${data.h2.slice(0, 10).map((h) => `- ${h}`).join('\n')}`);
  }

  if (data.heroText) {
    sections.push(`### Hero Section:\n${cleanText(data.heroText).slice(0, 500)}`);
  }

  if (data.ctas.length > 0) {
    sections.push(`### Call-to-Action Buttons:\n${data.ctas.map((c) => `- ${c}`).join('\n')}`);
  }

  if (data.testimonials.length > 0) {
    sections.push(
      `### Testimonials:\n${data.testimonials.map((t) => `- "${cleanText(t).slice(0, 200)}"`).join('\n')}`
    );
  }

  if (data.trustSignals.length > 0) {
    sections.push(`### Trust Signals:\n${data.trustSignals.map((t) => `- ${t}`).join('\n')}`);
  }

  if (data.socialProof.length > 0) {
    sections.push(
      `### Social Proof:\n${data.socialProof.map((s) => `- ${cleanText(s)}`).join('\n')}`
    );
  }

  if (data.pricingInfo) {
    sections.push(`### Pricing Information:\n${cleanText(data.pricingInfo).slice(0, 500)}`);
  }

  // Add subpage content
  if (data.subPages.length > 0) {
    sections.push(`\n## Additional Pages Analyzed:`);
    for (const subPage of data.subPages) {
      sections.push(`\n### ${subPage.url}`);
      if (subPage.h1.length > 0) {
        sections.push(`H1: ${subPage.h1.join(', ')}`);
      }
      if (subPage.mainContent) {
        sections.push(`Content: ${cleanText(subPage.mainContent).slice(0, 500)}`);
      }
    }
  }

  // Add technical data
  if (data.technicalData) {
    const tech = data.technicalData;
    sections.push(`\n## Technical Data:`);
    sections.push(`- SSL/HTTPS: ${tech.hasSSL ? 'Yes' : 'No'}`);
    sections.push(`- Favicon: ${tech.hasFavicon ? 'Yes' : 'No'}`);
    sections.push(`- Open Graph Tags: ${tech.hasOpenGraph ? 'Yes' : 'No'}`);
    sections.push(`- Twitter Cards: ${tech.hasTwitterCards ? 'Yes' : 'No'}`);
    sections.push(`- Structured Data: ${tech.hasStructuredData ? 'Yes' : 'No'}`);
    if (tech.structuredDataTypes.length > 0) {
      sections.push(`- Schema Types: ${tech.structuredDataTypes.join(', ')}`);
    }
    sections.push(`- FAQ Schema: ${tech.hasFAQSchema ? 'Yes' : 'No'}`);
    sections.push(`- Canonical Tag: ${tech.hasCanonicalTag ? 'Yes' : 'No'}`);
    sections.push(`- Robots.txt: ${tech.hasRobotsTxt ? 'Yes' : 'No'}`);
    sections.push(`- Sitemap: ${tech.hasSitemap ? 'Yes' : 'No'}`);
    sections.push(`- Viewport Meta: ${tech.hasViewportMeta ? 'Yes' : 'No'}`);
    sections.push(`- Images with Alt: ${tech.imagesWithAlt}`);
    sections.push(`- Images without Alt: ${tech.imagesWithoutAlt}`);
    sections.push(`- Forms: ${tech.formCount}`);
    sections.push(`- Videos: ${tech.videoCount}`);
    sections.push(`- External Links: ${tech.externalLinkCount}`);
    sections.push(`- Internal Links: ${tech.internalLinkCount}`);
    sections.push(`- Page Size: ${tech.pageSize}`);
    sections.push(`- Load Time: ${tech.loadTimeEstimate}`);
  }

  return sections.join('\n\n');
}

/**
 * Capture a screenshot of a website using Playwright service
 * Returns a base64 encoded data URL
 */
export async function captureScreenshot(url: string): Promise<string | null> {
  try {
    const response = await fetch(`${PLAYWRIGHT_SERVICE_URL}/screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        options: {
          // Changed from 'networkidle' to 'domcontentloaded' for 5-10s performance gain
          // 'networkidle' waits for ALL assets (ads, trackers) to finish loading
          // 'domcontentloaded' captures as soon as the DOM is ready (faster, still accurate)
          waitUntil: 'domcontentloaded',
          timeout: TIMEOUT,
          fullPage: true,
          type: 'jpeg',
          quality: 80,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Screenshot service error: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Screenshot failed');
    }

    return result.screenshot;
  } catch (error) {
    console.error('[Screenshot] Capture failed:', error);
    return null;
  }
}
