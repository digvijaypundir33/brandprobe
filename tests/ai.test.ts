import { analyzeWebsite, analyzeSection, getAIProvider } from '../src/lib/ai';
import { scrapeWebsite, formatScrapedDataForPrompt } from '../src/lib/scraper';

// Test URL - will be provided by user
const TEST_URL = process.env.TEST_URL || 'https://example.com';

describe('AI Analysis', () => {
  let websiteContent: string;

  beforeAll(async () => {
    console.log(`\n[Setup] Scraping ${TEST_URL}...`);
    const scrapedData = await scrapeWebsite(TEST_URL);
    websiteContent = formatScrapedDataForPrompt(scrapedData);
    console.log(`[Setup] Scraped ${websiteContent.length} characters`);
  });

  describe('getAIProvider', () => {
    it('should return the configured AI provider', () => {
      const provider = getAIProvider();
      expect(['anthropic', 'openai', 'groq', 'ollama']).toContain(provider);
      console.log(`\n[AI Provider] Using: ${provider}`);
    });
  });

  describe('analyzeSection', () => {
    it('should analyze messaging section', async () => {
      console.log('\n[Test] Analyzing messaging section...');
      const result = await analyzeSection('messaging', websiteContent);

      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('keyIssues');
      expect(result).toHaveProperty('quickWins');
      expect(result).toHaveProperty('detailedAnalysis');

      const r = result as { score: number; summary: string; keyIssues: string[] };
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
      expect(Array.isArray(r.keyIssues)).toBe(true);

      console.log(`  Score: ${r.score}/100`);
      console.log(`  Summary: ${r.summary.slice(0, 150)}...`);
      console.log(`  Key Issues: ${r.keyIssues.length}`);
    });

    it('should analyze SEO section', async () => {
      console.log('\n[Test] Analyzing SEO section...');
      const result = await analyzeSection('seo', websiteContent);

      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('summary');

      const r = result as { score: number; summary: string };
      console.log(`  Score: ${r.score}/100`);
      console.log(`  Summary: ${r.summary.slice(0, 150)}...`);
    });
  });

  describe('analyzeWebsite (full analysis)', () => {
    it('should analyze all 6 sections', async () => {
      console.log('\n[Test] Running full website analysis (6 sections)...');
      console.log('[Note] This may take several minutes with local Ollama...\n');

      const startTime = Date.now();
      const result = await analyzeWebsite(websiteContent);
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      // Check all sections exist
      expect(result).toHaveProperty('messaging');
      expect(result).toHaveProperty('seo');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('adAngles');
      expect(result).toHaveProperty('conversion');
      expect(result).toHaveProperty('distribution');

      // Check all sections have scores
      expect(result.messaging.score).toBeGreaterThanOrEqual(0);
      expect(result.seo.score).toBeGreaterThanOrEqual(0);
      expect(result.content.score).toBeGreaterThanOrEqual(0);
      expect(result.adAngles.score).toBeGreaterThanOrEqual(0);
      expect(result.conversion.score).toBeGreaterThanOrEqual(0);
      expect(result.distribution.score).toBeGreaterThanOrEqual(0);

      // Calculate overall score
      const overall = Math.round(
        (result.messaging.score +
          result.seo.score +
          result.content.score +
          result.adAngles.score +
          result.conversion.score +
          result.distribution.score) /
          6
      );

      console.log('=== Full Analysis Results ===');
      console.log(`URL: ${TEST_URL}`);
      console.log(`Duration: ${duration}s`);
      console.log(`Overall Score: ${overall}/100\n`);
      console.log('Section Scores:');
      console.log(`  Messaging:    ${result.messaging.score}/100`);
      console.log(`  SEO:          ${result.seo.score}/100`);
      console.log(`  Content:      ${result.content.score}/100`);
      console.log(`  Ads:          ${result.adAngles.score}/100`);
      console.log(`  Conversion:   ${result.conversion.score}/100`);
      console.log(`  Distribution: ${result.distribution.score}/100`);
      console.log('\nMessaging Summary:', result.messaging.summary);
      console.log('\nSEO Summary:', result.seo.summary);
    }, 600000); // 10 minute timeout for full analysis
  });
});
