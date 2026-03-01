import { scrapeWebsite, formatScrapedDataForPrompt } from '../src/lib/scraper';

// Test URL - will be provided by user
const TEST_URL = process.env.TEST_URL || 'https://example.com';

describe('Scraper', () => {
  describe('scrapeWebsite', () => {
    it('should scrape a website and return structured data', async () => {
      const data = await scrapeWebsite(TEST_URL);

      // Basic structure checks
      expect(data).toHaveProperty('url');
      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('metaDescription');
      expect(data).toHaveProperty('h1');
      expect(data).toHaveProperty('h2');
      expect(data).toHaveProperty('heroText');
      expect(data).toHaveProperty('ctas');
      expect(data).toHaveProperty('navLinks');
      expect(data).toHaveProperty('testimonials');
      expect(data).toHaveProperty('trustSignals');
      expect(data).toHaveProperty('socialProof');
      expect(data).toHaveProperty('subPages');

      // Type checks
      expect(Array.isArray(data.h1)).toBe(true);
      expect(Array.isArray(data.h2)).toBe(true);
      expect(Array.isArray(data.ctas)).toBe(true);
      expect(Array.isArray(data.navLinks)).toBe(true);
      expect(Array.isArray(data.subPages)).toBe(true);

      // URL should be normalized
      expect(data.url).toContain('http');

      console.log('\n=== Scraped Data Summary ===');
      console.log(`URL: ${data.url}`);
      console.log(`Title: ${data.title}`);
      console.log(`Meta Description: ${data.metaDescription?.slice(0, 100)}...`);
      console.log(`H1 Count: ${data.h1.length}`);
      console.log(`H2 Count: ${data.h2.length}`);
      console.log(`CTA Count: ${data.ctas.length}`);
      console.log(`Nav Links: ${data.navLinks.length}`);
      console.log(`Subpages Scraped: ${data.subPages.length}`);
      console.log(`Testimonials Found: ${data.testimonials.length}`);
      console.log(`Trust Signals: ${data.trustSignals.length}`);
    });

    it('should handle invalid URLs gracefully', async () => {
      await expect(scrapeWebsite('not-a-valid-url')).rejects.toThrow();
    });
  });

  describe('formatScrapedDataForPrompt', () => {
    it('should format scraped data into a readable prompt', async () => {
      const data = await scrapeWebsite(TEST_URL);
      const formatted = formatScrapedDataForPrompt(data);

      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(100);
      expect(formatted).toContain('Website:');

      console.log('\n=== Formatted Prompt (first 500 chars) ===');
      console.log(formatted.slice(0, 500));
    });
  });
});
