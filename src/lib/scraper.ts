import { Browser, Page } from 'playwright-core';
import type { ScrapedData, SubPageData, TechnicalData } from '@/types/report';
import { normalizeUrl, cleanText } from './utils';
import { fetchSitemap, selectBestPages, extractSitemapMetadata } from './sitemap-parser';
import { getBrandUrlsToScrape } from './brand-recognizer';

// Playwright with serverless support (@sparticuz/chromium for Lambda/Vercel)
const TIMEOUT = 30000; // 30 seconds max per page
const MAX_SUBPAGES = 3;

// Helper function to launch browser (conditional based on environment)
async function launchBrowser(): Promise<Browser> {
  const isProduction = process.env.VERCEL === '1';

  if (isProduction) {
    // Production (Vercel): Use @sparticuz/chromium
    const { chromium } = await import('playwright-core');
    const chromiumPkg = await import('@sparticuz/chromium');

    return await chromium.launch({
      args: chromiumPkg.default.args,
      executablePath: await chromiumPkg.default.executablePath(),
      headless: true,
    });
  } else {
    // Local development: Use regular Playwright
    const { chromium } = await import('playwright');

    return await chromium.launch({
      headless: true,
    });
  }
}

/**
 * Main scraper function - scrapes a URL and returns structured data
 * Now supports both Quick (1 page) and Full (4 pages) analysis modes
 */
export async function scrapeWebsite(
  url: string,
  options: { analysisType?: 'quick' | 'full' } = {}
): Promise<ScrapedData & { brandConfig?: any; pagesAnalyzed: number }> {
  const { analysisType = 'full' } = options;
  const normalizedUrl = normalizeUrl(url);
  let browser: Browser | null = null;

  try {
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

    // Step 2: Launch browser (conditional based on environment)
    browser = await launchBrowser();

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    // Step 3: Scrape main page
    const mainPageData = await scrapeMainPage(page, urlsToScrape[0]);

    // Step 4: Scrape technical data
    const technicalData = await scrapeTechnicalData(page, urlsToScrape[0]);

    // Step 5: Scrape subpages (skip in Quick mode)
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

      subPages = await scrapeSubPages(page, subPageUrls);
    }

    // Step 6: Extract sitemap metadata (if available, for SEO analysis)
    let sitemapMetadata = undefined;
    if (useSitemap) {
      const sitemap = await fetchSitemap(normalizedUrl);
      if (sitemap.length > 0) {
        sitemapMetadata = extractSitemapMetadata(sitemap);
      }
    }

    await context.close();

    const pagesAnalyzed = 1 + subPages.length; // Main page + subpages

    return {
      ...mainPageData,
      subPages,
      technicalData,
      sitemapMetadata,
      brandConfig: brandRouting.useBrandBaselines ? brandRouting : undefined,
      pagesAnalyzed,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Scrape the main homepage
 */
async function scrapeMainPage(
  page: Page,
  url: string
): Promise<Omit<ScrapedData, 'subPages'>> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });

  // Wait a bit for dynamic content
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    // Helper to get text content
    const getText = (selector: string): string => {
      const el = document.querySelector(selector);
      return el?.textContent?.trim() || '';
    };

    // Helper to get all text from elements
    const getAllText = (selector: string): string[] => {
      return Array.from(document.querySelectorAll(selector))
        .map((el) => el.textContent?.trim() || '')
        .filter(Boolean);
    };

    // Get title
    const title = document.title || '';

    // Get meta description
    const metaDesc =
      document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    // Get headings
    const h1 = getAllText('h1');
    const h2 = getAllText('h2');

    // Get hero text (first section or main content area)
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
      const el = document.querySelector(selector);
      if (el) {
        heroText = el.textContent?.slice(0, 1000).trim() || '';
        break;
      }
    }
    if (!heroText && h1.length > 0) {
      heroText = h1[0];
    }

    // Get CTAs (buttons and links with action words)
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
    for (const selector of ctaSelectors) {
      document.querySelectorAll(selector).forEach((el) => {
        const text = el.textContent?.trim();
        if (text && text.length < 50 && !ctas.includes(text)) {
          ctas.push(text);
        }
      });
    }

    // Get nav links
    const navLinks: string[] = [];
    document.querySelectorAll('nav a, header a').forEach((el) => {
      const href = el.getAttribute('href');
      const text = el.textContent?.trim();
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
    for (const selector of testimonialSelectors) {
      document.querySelectorAll(selector).forEach((el) => {
        const text = el.textContent?.slice(0, 500).trim();
        if (text && text.length > 20) {
          testimonials.push(text);
        }
      });
    }

    // Get trust signals
    const trustSignals: string[] = [];
    const trustSelectors = [
      '[class*="trust"]',
      '[class*="partner"]',
      '[class*="client"]',
      '[class*="logo"]',
      '[class*="badge"]',
      '[class*="certification"]',
    ];
    for (const selector of trustSelectors) {
      document.querySelectorAll(selector).forEach((el) => {
        const alt = el.getAttribute('alt');
        const title = el.getAttribute('title');
        if (alt) trustSignals.push(alt);
        if (title) trustSignals.push(title);
      });
    }

    // Get pricing info
    let pricingInfo: string | null = null;
    const pricingSelectors = [
      '[class*="pricing"]',
      '[class*="price"]',
      '[id*="pricing"]',
      '[id*="price"]',
    ];
    for (const selector of pricingSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        pricingInfo = el.textContent?.slice(0, 1000).trim() || null;
        break;
      }
    }

    // Get social proof
    const socialProof: string[] = [];
    const socialSelectors = [
      '[class*="social-proof"]',
      '[class*="stats"]',
      '[class*="numbers"]',
      '[class*="metric"]',
    ];
    for (const selector of socialSelectors) {
      document.querySelectorAll(selector).forEach((el) => {
        const text = el.textContent?.trim();
        if (text && text.length < 200) {
          socialProof.push(text);
        }
      });
    }

    return {
      title,
      metaDescription: metaDesc,
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
  });

  // Get raw HTML for technical analysis
  const html = await page.content();

  return {
    url,
    ...data,
    html,
  };
}

/**
 * Scrape technical data from the page
 */
async function scrapeTechnicalData(page: Page, url: string): Promise<TechnicalData> {
  const startTime = Date.now();

  const technicalData = await page.evaluate(() => {
    // Check for Open Graph tags
    const hasOpenGraph = !!(
      document.querySelector('meta[property="og:title"]') ||
      document.querySelector('meta[property="og:description"]') ||
      document.querySelector('meta[property="og:image"]')
    );

    // Check for Twitter Cards
    const hasTwitterCards = !!(
      document.querySelector('meta[name="twitter:card"]') ||
      document.querySelector('meta[name="twitter:title"]')
    );

    // Check for structured data (JSON-LD)
    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
    const structuredDataTypes: string[] = [];
    let hasFAQSchema = false;
    structuredDataScripts.forEach((script) => {
      try {
        const data = JSON.parse(script.textContent || '');
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
    });

    // Check for favicon
    const hasFavicon = !!(
      document.querySelector('link[rel="icon"]') ||
      document.querySelector('link[rel="shortcut icon"]') ||
      document.querySelector('link[rel="apple-touch-icon"]')
    );

    // Check for canonical tag
    const hasCanonicalTag = !!document.querySelector('link[rel="canonical"]');

    // Check for viewport meta
    const hasViewportMeta = !!document.querySelector('meta[name="viewport"]');

    // Check for charset meta
    const hasCharsetMeta = !!(
      document.querySelector('meta[charset]') ||
      document.querySelector('meta[http-equiv="Content-Type"]')
    );

    // Count images with and without alt text
    const images = document.querySelectorAll('img');
    let imagesWithAlt = 0;
    let imagesWithoutAlt = 0;
    images.forEach((img) => {
      if (img.getAttribute('alt') && img.getAttribute('alt')!.trim() !== '') {
        imagesWithAlt++;
      } else {
        imagesWithoutAlt++;
      }
    });

    // Count forms
    const formCount = document.querySelectorAll('form').length;

    // Count videos
    const videoCount =
      document.querySelectorAll('video').length +
      document.querySelectorAll('iframe[src*="youtube"]').length +
      document.querySelectorAll('iframe[src*="vimeo"]').length;

    // Count links
    const links = document.querySelectorAll('a[href]');
    let externalLinkCount = 0;
    let internalLinkCount = 0;
    const currentHost = window.location.hostname;
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href) {
        try {
          const linkUrl = new URL(href, window.location.href);
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

    // Estimate page size based on DOM
    const htmlSize = document.documentElement.outerHTML.length;
    let pageSize = '';
    if (htmlSize < 100000) {
      pageSize = 'Small (<100KB)';
    } else if (htmlSize < 500000) {
      pageSize = 'Medium (100-500KB)';
    } else {
      pageSize = 'Large (>500KB)';
    }

    return {
      hasOpenGraph,
      hasTwitterCards,
      hasStructuredData: structuredDataTypes.length > 0,
      structuredDataTypes: [...new Set(structuredDataTypes)],
      hasFavicon,
      hasCanonicalTag,
      hasViewportMeta,
      hasCharsetMeta,
      hasFAQSchema,
      imagesWithAlt,
      imagesWithoutAlt,
      formCount,
      videoCount,
      externalLinkCount,
      internalLinkCount,
      pageSize,
    };
  });

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
    hasFavicon: technicalData.hasFavicon,
    hasOpenGraph: technicalData.hasOpenGraph,
    hasTwitterCards: technicalData.hasTwitterCards,
    hasStructuredData: technicalData.hasStructuredData,
    structuredDataTypes: technicalData.structuredDataTypes,
    hasCanonicalTag: technicalData.hasCanonicalTag,
    hasRobotsTxt,
    hasSitemap,
    imagesWithAlt: technicalData.imagesWithAlt,
    imagesWithoutAlt: technicalData.imagesWithoutAlt,
    formCount: technicalData.formCount,
    videoCount: technicalData.videoCount,
    externalLinkCount: technicalData.externalLinkCount,
    internalLinkCount: technicalData.internalLinkCount,
    hasViewportMeta: technicalData.hasViewportMeta,
    hasCharsetMeta: technicalData.hasCharsetMeta,
    hasFAQSchema: technicalData.hasFAQSchema,
    loadTimeEstimate,
    pageSize: technicalData.pageSize,
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
 * Scrape subpages
 */
async function scrapeSubPages(page: Page, urls: string[]): Promise<SubPageData[]> {
  const subPages: SubPageData[] = [];

  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
      await page.waitForTimeout(1000);

      const data = await page.evaluate(() => {
        const getText = (selector: string): string => {
          const el = document.querySelector(selector);
          return el?.textContent?.trim() || '';
        };

        const getAllText = (selector: string): string[] => {
          return Array.from(document.querySelectorAll(selector))
            .map((el) => el.textContent?.trim() || '')
            .filter(Boolean);
        };

        // Get main content
        let mainContent = '';
        const mainSelectors = ['main', 'article', '[role="main"]', '.content', '#content'];
        for (const selector of mainSelectors) {
          const el = document.querySelector(selector);
          if (el) {
            mainContent = el.textContent?.slice(0, 2000).trim() || '';
            break;
          }
        }

        return {
          title: document.title || '',
          h1: getAllText('h1'),
          h2: getAllText('h2'),
          mainContent,
        };
      });

      subPages.push({
        url,
        ...data,
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
 * Capture a screenshot of a website
 * Returns a base64 encoded data URL
 */
export async function captureScreenshot(url: string): Promise<string | null> {
  let browser: Browser | null = null;

  try {
    // Launch browser (conditional based on environment)
    browser = await launchBrowser();

    const context = await browser.newContext({
      viewport: { width: 1280, height: 1024 },
    });

    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: TIMEOUT
    });

    // Wait for page to settle
    await page.waitForTimeout(2000);

    // Capture screenshot as buffer
    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      type: 'jpeg',
      quality: 80
    });

    await context.close();

    // Convert to base64 data URL
    const base64 = screenshotBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;

  } catch (error) {
    console.error('[Screenshot] Capture failed:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
