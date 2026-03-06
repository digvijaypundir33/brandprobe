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

  // Parse HTML using DOMParser (available in Node.js via linkedom or similar)
  // For now, we'll use regex-based parsing for meta tags

  // Check for Open Graph tags
  const hasOpenGraph = !!(
    html.match(/<meta\s+property="og:title"/i) ||
    html.match(/<meta\s+property="og:description"/i) ||
    html.match(/<meta\s+property="og:image"/i)
  );

  // Check for Twitter Cards
  const hasTwitterCards = !!(
    html.match(/<meta\s+name="twitter:card"/i) ||
    html.match(/<meta\s+name="twitter:title"/i)
  );

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

  // Check for favicon
  const hasFavicon = !!(
    html.match(/<link\s+rel="icon"/i) ||
    html.match(/<link\s+rel="shortcut icon"/i) ||
    html.match(/<link\s+rel="apple-touch-icon"/i)
  );

  // Check for canonical tag
  const hasCanonicalTag = !!html.match(/<link\s+rel="canonical"/i);

  // Check for viewport meta
  const hasViewportMeta = !!html.match(/<meta\s+name="viewport"/i);

  // Check for charset meta
  const hasCharsetMeta = !!(
    html.match(/<meta\s+charset/i) ||
    html.match(/<meta\s+http-equiv="Content-Type"/i)
  );

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

  // Check for robots.txt and sitemap (basic check)
  let hasRobotsTxt = false;
  let hasSitemap = false;
  try {
    const baseUrl = new URL(url);
    const robotsResponse = await fetch(`${baseUrl.origin}/robots.txt`, { method: 'HEAD' });
    hasRobotsTxt = robotsResponse.ok;

    const sitemapResponse = await fetch(`${baseUrl.origin}/sitemap.xml`, { method: 'HEAD' });
    hasSitemap = sitemapResponse.ok;
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
  const subPages: SubPageData[] = [];

  for (const url of urls) {
    try {
      const rawData = await scrapeWithService(url);
      const parsedData = await parseHTML(rawData.url, rawData.html);

      subPages.push({
        url: rawData.url,
        title: rawData.title,
        h1: parsedData.h1,
        h2: parsedData.h2,
        mainContent: parsedData.heroText || (parsedData.h1.length > 0 ? parsedData.h1[0] : ''),
      });
    } catch (error) {
      console.error(`Failed to scrape subpage ${url}:`, error);
      // Continue with other pages
    }
  }

  return subPages;
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
          waitUntil: 'networkidle',
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
