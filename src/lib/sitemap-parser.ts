/**
 * Sitemap Parser
 *
 * Fetches and parses sitemap.xml files to intelligently select best pages for analysis
 */

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  priority?: number;
  changefreq?: string;
}

export interface SitemapMetadata {
  totalPages: number;
  blogCount: number;
  productCount: number;
  recentlyUpdated: number;
  staleContent: number;
  urlQuality: 'good' | 'needs-improvement';
  averageDepth: number;
}

const SITEMAP_TIMEOUT = 5000; // 5 seconds max

const PRIORITY_PATTERNS = [
  '/about',
  '/pricing',
  '/features',
  '/product',
  '/solutions',
  '/services',
  '/how-it-works',
  '/company',
];

/**
 * Fetch sitemap.xml from a URL
 * Tries common sitemap locations
 */
export async function fetchSitemap(url: string): Promise<SitemapEntry[]> {
  try {
    const baseUrl = new URL(url).origin;

    // Try common sitemap locations
    const sitemapUrls = [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap_index.xml`,
      `${baseUrl}/sitemap-index.xml`,
    ];

    for (const sitemapUrl of sitemapUrls) {
      try {
        console.log(`[Sitemap] Trying: ${sitemapUrl}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), SITEMAP_TIMEOUT);

        const response = await fetch(sitemapUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'BrandProbe/1.0 (Sitemap Parser)',
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const xml = await response.text();
          const entries = parseSitemapXML(xml);

          if (entries.length > 0) {
            console.log(`[Sitemap] Found ${entries.length} URLs in ${sitemapUrl}`);
            return entries;
          }
        }
      } catch (error) {
        // Timeout or error, continue to next location
        if (error instanceof Error && error.name === 'AbortError') {
          console.log(`[Sitemap] Timeout fetching ${sitemapUrl}`);
        }
        continue;
      }
    }

    console.log('[Sitemap] No sitemap found');
    return []; // No sitemap found
  } catch (error) {
    console.error('[Sitemap] Error:', error);
    return [];
  }
}

/**
 * Parse sitemap XML and extract entries
 * Handles both <url> entries and <sitemap> index files
 */
function parseSitemapXML(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  try {
    // Handle sitemap index files (contains references to other sitemaps)
    const sitemapMatches = xml.matchAll(/<sitemap>(.*?)<\/sitemap>/gs);
    const hasSitemapIndex = Array.from(sitemapMatches).length > 0;

    if (hasSitemapIndex) {
      console.log('[Sitemap] Detected sitemap index file - parsing nested sitemaps not implemented yet');
      // For now, skip sitemap index files
      // Future: Fetch and parse nested sitemaps
      return [];
    }

    // Parse regular sitemap with <url> entries
    const urlMatches = xml.matchAll(/<url>(.*?)<\/url>/gs);

    for (const match of urlMatches) {
      const urlBlock = match[1];

      // Extract loc (required)
      const loc = urlBlock.match(/<loc>(.*?)<\/loc>/)?.[1];
      if (!loc) continue;

      // Extract optional fields
      const lastmod = urlBlock.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
      const priorityStr = urlBlock.match(/<priority>(.*?)<\/priority>/)?.[1];
      const changefreq = urlBlock.match(/<changefreq>(.*?)<\/changefreq>/)?.[1];

      entries.push({
        url: loc.trim(),
        lastmod: lastmod?.trim(),
        priority: priorityStr ? parseFloat(priorityStr) : undefined,
        changefreq: changefreq?.trim(),
      });
    }

    return entries;
  } catch (error) {
    console.error('[Sitemap] Parse error:', error);
    return [];
  }
}

/**
 * Select best pages from sitemap based on scoring algorithm
 */
export function selectBestPages(
  sitemap: SitemapEntry[],
  baseUrl: string,
  maxPages: number = 3
): string[] {
  if (sitemap.length === 0) return [];

  try {
    const baseDomain = new URL(baseUrl).hostname;

    // Score each entry
    const scored = sitemap
      .map(entry => {
        try {
          const entryUrl = new URL(entry.url);

          // Skip if different domain
          if (entryUrl.hostname !== baseDomain) {
            return null;
          }

          const path = entryUrl.pathname.toLowerCase();
          let score = 0;

          // 1. Sitemap priority (0.0-1.0) → 0-10 points
          score += (entry.priority || 0.5) * 10;

          // 2. Matches priority pattern → +20 points
          const patternMatch = PRIORITY_PATTERNS.find(p => path.includes(p));
          if (patternMatch) {
            score += 20;
          }

          // 3. Recently updated → +10 points (within 30 days), +5 (within 90 days)
          if (entry.lastmod) {
            const lastmodDate = new Date(entry.lastmod);
            const daysOld = (Date.now() - lastmodDate.getTime()) / (1000 * 60 * 60 * 24);

            if (!isNaN(daysOld)) {
              if (daysOld < 30) score += 10;
              else if (daysOld < 90) score += 5;
            }
          }

          // 4. Penalize deep nesting → -2 per level
          const depth = path.split('/').filter(Boolean).length;
          score -= depth * 2;

          // 5. Penalize blog/news → -15 points
          if (path.includes('/blog/') || path.includes('/news/') || path.includes('/post/')) {
            score -= 15;
          }

          // 6. Boost homepage → +5 points
          if (path === '/' || path === '') {
            score += 5;
          }

          return { entry, score };
        } catch {
          return null;
        }
      })
      .filter((item): item is { entry: SitemapEntry; score: number } => item !== null);

    // Sort by score descending and return top N URLs
    const selectedUrls = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPages)
      .map(s => s.entry.url);

    console.log(`[Sitemap] Selected ${selectedUrls.length} best pages from ${sitemap.length} total`);

    return selectedUrls;
  } catch (error) {
    console.error('[Sitemap] Error selecting pages:', error);
    return [];
  }
}

/**
 * Extract metadata from sitemap for SEO analysis
 */
export function extractSitemapMetadata(sitemap: SitemapEntry[]): SitemapMetadata {
  if (sitemap.length === 0) {
    return {
      totalPages: 0,
      blogCount: 0,
      productCount: 0,
      recentlyUpdated: 0,
      staleContent: 0,
      urlQuality: 'good',
      averageDepth: 0,
    };
  }

  const now = Date.now();

  const metadata: SitemapMetadata = {
    totalPages: sitemap.length,

    blogCount: sitemap.filter(e => {
      const path = e.url.toLowerCase();
      return path.includes('/blog/') || path.includes('/post/') || path.includes('/article/');
    }).length,

    productCount: sitemap.filter(e => {
      const path = e.url.toLowerCase();
      return path.includes('/product/') || path.includes('/shop/') || path.includes('/item/');
    }).length,

    recentlyUpdated: sitemap.filter(e => {
      if (!e.lastmod) return false;
      const lastmodDate = new Date(e.lastmod);
      const daysOld = (now - lastmodDate.getTime()) / (1000 * 60 * 60 * 24);
      return !isNaN(daysOld) && daysOld < 30;
    }).length,

    staleContent: sitemap.filter(e => {
      if (!e.lastmod) return false;
      const lastmodDate = new Date(e.lastmod);
      const daysOld = (now - lastmodDate.getTime()) / (1000 * 60 * 60 * 24);
      return !isNaN(daysOld) && daysOld > 365;
    }).length,

    urlQuality: sitemap.some(e => e.url.includes('?')) ? 'needs-improvement' : 'good',

    averageDepth: sitemap.reduce((sum, e) => {
      try {
        const path = new URL(e.url).pathname;
        const depth = path.split('/').filter(Boolean).length;
        return sum + depth;
      } catch {
        return sum;
      }
    }, 0) / sitemap.length,
  };

  return metadata;
}
