// Utility functions

/**
 * Validate and normalize a URL
 */
export function normalizeUrl(input: string): string {
  let url = input.trim();

  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    // Remove trailing slash
    return parsed.origin + parsed.pathname.replace(/\/$/, '');
  } catch {
    throw new Error('Invalid URL');
  }
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(normalizeUrl(url));
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calculate overall score from section scores
 */
export function calculateOverallScore(scores: {
  messaging: number;
  seo: number;
  content: number;
  ads: number;
  conversion: number;
  distribution: number;
  aiSearch?: number;
  technical?: number;
  brandHealth?: number;
}): number {
  const values = Object.values(scores).filter((v): v is number => typeof v === 'number');
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(sum / values.length);
}

/**
 * Get score interpretation
 */
export function getScoreInterpretation(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score <= 25) {
    return {
      label: 'Critical',
      color: 'red',
      description: 'Major foundational issues that need immediate attention',
    };
  }
  if (score <= 50) {
    return {
      label: 'Weak',
      color: 'orange',
      description: 'Common problems with significant room to improve',
    };
  }
  if (score <= 70) {
    return {
      label: 'Developing',
      color: 'yellow',
      description: 'Foundation exists, specific fixes needed',
    };
  }
  if (score <= 85) {
    return {
      label: 'Strong',
      color: 'green',
      description: 'Above average, fine-tuning required',
    };
  }
  return {
    label: 'Excellent',
    color: 'emerald',
    description: 'Top tier marketing',
  };
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Clean HTML text (remove tags, normalize whitespace)
 */
export function cleanText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
