/**
 * Brand Recognition System
 *
 * Hybrid approach:
 * 1. Fast path: Check top 30 brands (instant recognition)
 * 2. Slow path: Dynamic multi-signal detection for unknown brands
 * 3. Caching: Store results in database for 30 days
 */

export interface BrandConfig {
  primaryUrl: string;
  additionalPages: string[];
  baselineScores: {
    technical: number;
    brandHealth: number;
    messaging: number;
    designAuth: number;
  };
}

export interface BrandRecognition {
  isMajorBrand: boolean;
  confidence: 'high' | 'medium' | 'low';
  signals: string[];
  baselineScores?: {
    technical: number;
    brandHealth: number;
    messaging: number;
    designAuth: number;
  };
  suggestedUrls?: string[];
}

// Top 30 brands for instant recognition (fast path)
const INSTANT_RECOGNITION: Record<string, BrandConfig> = {
  'facebook.com': {
    primaryUrl: 'https://www.facebook.com/business',
    additionalPages: [
      'https://www.facebook.com/business/marketing',
      'https://www.facebook.com/business/ads',
      'https://about.meta.com',
    ],
    baselineScores: { technical: 95, brandHealth: 95, messaging: 88, designAuth: 85 },
  },
  'linkedin.com': {
    primaryUrl: 'https://www.linkedin.com/business',
    additionalPages: [
      'https://www.linkedin.com/business/marketing',
      'https://www.linkedin.com/business/sales',
      'https://about.linkedin.com',
    ],
    baselineScores: { technical: 95, brandHealth: 92, messaging: 90, designAuth: 88 },
  },
  'apple.com': {
    primaryUrl: 'https://www.apple.com',
    additionalPages: [
      'https://www.apple.com/business',
      'https://www.apple.com/leadership',
      'https://www.apple.com/newsroom',
    ],
    baselineScores: { technical: 98, brandHealth: 95, messaging: 92, designAuth: 90 },
  },
  'google.com': {
    primaryUrl: 'https://about.google',
    additionalPages: [
      'https://about.google/products',
      'https://about.google/our-company',
      'https://workspace.google.com',
    ],
    baselineScores: { technical: 98, brandHealth: 94, messaging: 90, designAuth: 85 },
  },
  'microsoft.com': {
    primaryUrl: 'https://www.microsoft.com/en-us',
    additionalPages: [
      'https://www.microsoft.com/en-us/microsoft-365',
      'https://news.microsoft.com',
      'https://www.microsoft.com/en-us/about',
    ],
    baselineScores: { technical: 95, brandHealth: 92, messaging: 88, designAuth: 85 },
  },
  'amazon.com': {
    primaryUrl: 'https://www.aboutamazon.com',
    additionalPages: [
      'https://www.aboutamazon.com/about-us',
      'https://www.aboutamazon.com/news',
      'https://aws.amazon.com',
    ],
    baselineScores: { technical: 96, brandHealth: 90, messaging: 85, designAuth: 82 },
  },
  'netflix.com': {
    primaryUrl: 'https://about.netflix.com',
    additionalPages: [
      'https://about.netflix.com/en',
      'https://media.netflix.com',
      'https://jobs.netflix.com',
    ],
    baselineScores: { technical: 94, brandHealth: 90, messaging: 88, designAuth: 86 },
  },
  'twitter.com': {
    primaryUrl: 'https://about.twitter.com',
    additionalPages: [
      'https://business.twitter.com',
      'https://about.twitter.com/en/who-we-are',
      'https://developer.twitter.com',
    ],
    baselineScores: { technical: 92, brandHealth: 88, messaging: 85, designAuth: 83 },
  },
  'x.com': {
    primaryUrl: 'https://about.x.com',
    additionalPages: [
      'https://business.x.com',
      'https://help.x.com',
      'https://developer.x.com',
    ],
    baselineScores: { technical: 92, brandHealth: 88, messaging: 85, designAuth: 83 },
  },
  'instagram.com': {
    primaryUrl: 'https://about.instagram.com',
    additionalPages: [
      'https://business.instagram.com',
      'https://about.instagram.com/about-us',
      'https://about.meta.com',
    ],
    baselineScores: { technical: 94, brandHealth: 90, messaging: 87, designAuth: 85 },
  },
  'youtube.com': {
    primaryUrl: 'https://www.youtube.com/about',
    additionalPages: [
      'https://www.youtube.com/creators',
      'https://blog.youtube',
      'https://www.youtube.com/advertisers',
    ],
    baselineScores: { technical: 95, brandHealth: 91, messaging: 87, designAuth: 84 },
  },
  'shopify.com': {
    primaryUrl: 'https://www.shopify.com',
    additionalPages: [
      'https://www.shopify.com/about',
      'https://www.shopify.com/pricing',
      'https://www.shopify.com/blog',
    ],
    baselineScores: { technical: 92, brandHealth: 88, messaging: 86, designAuth: 84 },
  },
  'stripe.com': {
    primaryUrl: 'https://stripe.com',
    additionalPages: [
      'https://stripe.com/about',
      'https://stripe.com/pricing',
      'https://stripe.com/newsroom',
    ],
    baselineScores: { technical: 94, brandHealth: 89, messaging: 87, designAuth: 85 },
  },
  'salesforce.com': {
    primaryUrl: 'https://www.salesforce.com',
    additionalPages: [
      'https://www.salesforce.com/company',
      'https://www.salesforce.com/products',
      'https://www.salesforce.com/news',
    ],
    baselineScores: { technical: 93, brandHealth: 88, messaging: 85, designAuth: 82 },
  },
  'adobe.com': {
    primaryUrl: 'https://www.adobe.com',
    additionalPages: [
      'https://www.adobe.com/about-adobe.html',
      'https://www.adobe.com/products',
      'https://blog.adobe.com',
    ],
    baselineScores: { technical: 94, brandHealth: 90, messaging: 87, designAuth: 86 },
  },
  'slack.com': {
    primaryUrl: 'https://slack.com',
    additionalPages: [
      'https://slack.com/about',
      'https://slack.com/pricing',
      'https://slack.com/blog',
    ],
    baselineScores: { technical: 92, brandHealth: 87, messaging: 85, designAuth: 84 },
  },
  'zoom.us': {
    primaryUrl: 'https://zoom.us',
    additionalPages: [
      'https://explore.zoom.us/en/about',
      'https://explore.zoom.us/en/products',
      'https://blog.zoom.us',
    ],
    baselineScores: { technical: 91, brandHealth: 86, messaging: 84, designAuth: 82 },
  },
  'notion.so': {
    primaryUrl: 'https://www.notion.so',
    additionalPages: [
      'https://www.notion.so/product',
      'https://www.notion.so/pricing',
      'https://www.notion.so/about',
    ],
    baselineScores: { technical: 90, brandHealth: 85, messaging: 83, designAuth: 85 },
  },
  'figma.com': {
    primaryUrl: 'https://www.figma.com',
    additionalPages: [
      'https://www.figma.com/about',
      'https://www.figma.com/pricing',
      'https://www.figma.com/blog',
    ],
    baselineScores: { technical: 91, brandHealth: 86, messaging: 84, designAuth: 86 },
  },
  'github.com': {
    primaryUrl: 'https://github.com/about',
    additionalPages: [
      'https://github.com/features',
      'https://github.com/pricing',
      'https://github.blog',
    ],
    baselineScores: { technical: 93, brandHealth: 88, messaging: 85, designAuth: 83 },
  },
  'dropbox.com': {
    primaryUrl: 'https://www.dropbox.com',
    additionalPages: [
      'https://www.dropbox.com/about',
      'https://www.dropbox.com/features',
      'https://blog.dropbox.com',
    ],
    baselineScores: { technical: 90, brandHealth: 85, messaging: 83, designAuth: 81 },
  },
  'spotify.com': {
    primaryUrl: 'https://www.spotify.com',
    additionalPages: [
      'https://newsroom.spotify.com',
      'https://www.spotify.com/us/premium',
      'https://www.spotify.com/us/about-us',
    ],
    baselineScores: { technical: 92, brandHealth: 88, messaging: 86, designAuth: 84 },
  },
  'airbnb.com': {
    primaryUrl: 'https://www.airbnb.com',
    additionalPages: [
      'https://news.airbnb.com',
      'https://www.airbnb.com/about',
      'https://www.airbnb.com/help',
    ],
    baselineScores: { technical: 91, brandHealth: 87, messaging: 85, designAuth: 86 },
  },
  'uber.com': {
    primaryUrl: 'https://www.uber.com',
    additionalPages: [
      'https://www.uber.com/us/en/about',
      'https://www.uber.com/newsroom',
      'https://www.uber.com/us/en/business',
    ],
    baselineScores: { technical: 90, brandHealth: 85, messaging: 83, designAuth: 81 },
  },
  'tesla.com': {
    primaryUrl: 'https://www.tesla.com',
    additionalPages: [
      'https://www.tesla.com/about',
      'https://www.tesla.com/blog',
      'https://ir.tesla.com',
    ],
    baselineScores: { technical: 92, brandHealth: 90, messaging: 88, designAuth: 87 },
  },
  'coinbase.com': {
    primaryUrl: 'https://www.coinbase.com',
    additionalPages: [
      'https://www.coinbase.com/about',
      'https://www.coinbase.com/learn',
      'https://blog.coinbase.com',
    ],
    baselineScores: { technical: 89, brandHealth: 84, messaging: 82, designAuth: 80 },
  },
  'twitch.tv': {
    primaryUrl: 'https://www.twitch.tv',
    additionalPages: [
      'https://www.twitch.tv/p/en/about',
      'https://blog.twitch.tv',
      'https://www.twitch.tv/jobs',
    ],
    baselineScores: { technical: 90, brandHealth: 86, messaging: 84, designAuth: 82 },
  },
  'pinterest.com': {
    primaryUrl: 'https://www.pinterest.com',
    additionalPages: [
      'https://newsroom.pinterest.com',
      'https://business.pinterest.com',
      'https://www.pinterest.com/about',
    ],
    baselineScores: { technical: 90, brandHealth: 85, messaging: 83, designAuth: 84 },
  },
  'reddit.com': {
    primaryUrl: 'https://www.reddit.com',
    additionalPages: [
      'https://www.redditinc.com',
      'https://www.reddit.com/premium',
      'https://www.reddit.com/r/announcements',
    ],
    baselineScores: { technical: 88, brandHealth: 83, messaging: 81, designAuth: 79 },
  },
  'tiktok.com': {
    primaryUrl: 'https://www.tiktok.com',
    additionalPages: [
      'https://newsroom.tiktok.com',
      'https://www.tiktok.com/about',
      'https://www.tiktok.com/business',
    ],
    baselineScores: { technical: 91, brandHealth: 87, messaging: 85, designAuth: 85 },
  },
};

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
}

/**
 * Get brand config from instant recognition (fast path)
 */
function getInstantRecognition(domain: string): BrandConfig | null {
  return INSTANT_RECOGNITION[domain] || null;
}

/**
 * Dynamic brand recognition using multiple signals
 */
export async function recognizeBrand(url: string): Promise<BrandRecognition> {
  const domain = extractDomain(url);
  const signals: string[] = [];
  let score = 0;

  // Signal 1: Domain Age (via DNS heuristic)
  const domainAge = await checkDomainAge(domain);
  if (domainAge > 15) {
    score += 30;
    signals.push('domain-age-15y+');
  } else if (domainAge > 10) {
    score += 20;
    signals.push('domain-age-10y+');
  } else if (domainAge > 5) {
    score += 10;
    signals.push('domain-age-5y+');
  }

  // Signal 2: CDN Detection
  const hasCDN = await checkForCDN(domain);
  if (hasCDN) {
    score += 15;
    signals.push('enterprise-cdn');
  }

  // Signal 3: Security Headers
  const hasStrictSecurity = await checkSecurityHeaders(domain);
  if (hasStrictSecurity) {
    score += 10;
    signals.push('enterprise-security');
  }

  // Signal 4: Subdomain Count
  const subdomainCount = await countSubdomains(domain);
  if (subdomainCount > 20) {
    score += 15;
    signals.push('many-subdomains');
  } else if (subdomainCount > 10) {
    score += 8;
    signals.push('moderate-subdomains');
  }

  // Signal 5: Wikipedia Page
  const hasWikipedia = await checkWikipediaPage(domain);
  if (hasWikipedia) {
    score += 25;
    signals.push('wikipedia-page');
  }

  // Determine if major brand
  const isMajorBrand = score >= 50;
  const confidence: 'high' | 'medium' | 'low' = score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';

  // Calculate baseline scores
  let baselineScores = undefined;
  if (isMajorBrand) {
    const techScore = Math.min(95, 75 + Math.floor(score / 5));
    const brandScore = Math.min(95, 70 + Math.floor(score / 4));

    baselineScores = {
      technical: techScore,
      brandHealth: brandScore,
      messaging: brandScore - 5,
      designAuth: brandScore - 10,
    };
  }

  // Suggest better URLs
  const suggestedUrls = isMajorBrand ? await suggestBetterUrls(domain, url) : undefined;

  return {
    isMajorBrand,
    confidence,
    signals,
    baselineScores,
    suggestedUrls,
  };
}

/**
 * Check domain age via DNS heuristic
 */
async function checkDomainAge(domain: string): Promise<number> {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=ANY`, {
      signal: AbortSignal.timeout(3000),
    });
    const data = await response.json();

    // Heuristic: More record types = older domain
    const recordTypeCount = new Set(data.Answer?.map((a: any) => a.type) || []).size;

    if (recordTypeCount > 8) return 15;
    if (recordTypeCount > 5) return 10;
    if (recordTypeCount > 3) return 5;
    return 2;
  } catch {
    return 0;
  }
}

/**
 * Check for enterprise CDN
 */
async function checkForCDN(domain: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      redirect: 'manual',
      signal: AbortSignal.timeout(3000),
    });

    const headers = response.headers;
    const cdnHeaders = ['cf-ray', 'x-amz-cf-id', 'x-akamai', 'x-fastly', 'x-cdn'];

    return cdnHeaders.some(header =>
      Array.from(headers.keys()).some(h => h.toLowerCase().includes(header))
    );
  } catch {
    return false;
  }
}

/**
 * Check for strict security headers
 */
async function checkSecurityHeaders(domain: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    });

    const hasHSTS = response.headers.has('strict-transport-security');
    const hasCSP = response.headers.has('content-security-policy');

    return hasHSTS && hasCSP;
  } catch {
    return false;
  }
}

/**
 * Count subdomains via certificate transparency
 */
async function countSubdomains(domain: string): Promise<number> {
  try {
    const response = await fetch(
      `https://crt.sh/?q=%25.${domain}&output=json`,
      { signal: AbortSignal.timeout(5000) }
    );
    const certs = await response.json();

    const subdomains = new Set(
      certs.flatMap((cert: any) =>
        cert.name_value.split('\n').filter((name: string) => name.endsWith(domain))
      )
    );

    return subdomains.size;
  } catch {
    return 0;
  }
}

/**
 * Check for Wikipedia page
 */
async function checkWikipediaPage(domain: string): Promise<boolean> {
  try {
    const companyName = domain.split('.')[0];
    const capitalizedName = companyName.charAt(0).toUpperCase() + companyName.slice(1);

    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${capitalizedName}`,
      {
        redirect: 'manual',
        signal: AbortSignal.timeout(3000),
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Suggest better URLs for login-walled brands
 */
async function suggestBetterUrls(domain: string, originalUrl: string): Promise<string[]> {
  const patterns = [
    '/business',
    '/business/marketing',
    '/enterprise',
    '/solutions',
    '/about',
    '/company',
    '/newsroom',
  ];

  const suggestions: string[] = [];

  for (const pattern of patterns) {
    const testUrl = `https://${domain}${pattern}`;
    try {
      const response = await fetch(testUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok && !response.url.includes('login')) {
        suggestions.push(testUrl);
      }
    } catch {
      continue;
    }
  }

  return suggestions.slice(0, 3);
}

/**
 * Main hybrid detection function
 */
export async function detectBrand(url: string): Promise<{
  config: BrandConfig | null;
  recognition: BrandRecognition | null;
}> {
  const domain = extractDomain(url);

  // Fast path: Check instant recognition
  const instantConfig = getInstantRecognition(domain);
  if (instantConfig) {
    console.log(`[Brand] Instant recognition: ${domain}`);
    return { config: instantConfig, recognition: null };
  }

  // Slow path: Dynamic recognition
  console.log(`[Brand] Running dynamic recognition for: ${domain}`);
  const recognition = await recognizeBrand(url);

  if (recognition.isMajorBrand) {
    console.log(`[Brand] Detected as major brand (confidence: ${recognition.confidence})`);
    return { config: null, recognition };
  }

  console.log(`[Brand] Not a major brand`);
  return { config: null, recognition: null };
}

/**
 * Get URLs to scrape based on brand detection
 */
export async function getBrandUrlsToScrape(inputUrl: string): Promise<{
  urls: string[];
  useBrandBaselines: boolean;
  baselineScores?: BrandConfig['baselineScores'];
  brandInfo?: BrandRecognition;
}> {
  const { config, recognition } = await detectBrand(inputUrl);

  if (config) {
    // Instant recognition
    return {
      urls: [config.primaryUrl, ...config.additionalPages.slice(0, 3)],
      useBrandBaselines: true,
      baselineScores: config.baselineScores,
    };
  } else if (recognition?.isMajorBrand) {
    // Dynamic recognition
    const urls = recognition.suggestedUrls && recognition.suggestedUrls.length > 0
      ? recognition.suggestedUrls
      : [inputUrl];

    return {
      urls,
      useBrandBaselines: true,
      baselineScores: recognition.baselineScores,
      brandInfo: recognition,
    };
  } else {
    // Not a major brand
    return {
      urls: [inputUrl],
      useBrandBaselines: false,
    };
  }
}
