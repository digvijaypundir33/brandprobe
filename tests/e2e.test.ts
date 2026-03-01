/**
 * End-to-End Test for BrandProbe
 *
 * This test simulates the full user flow:
 * 1. Submit URL for scanning
 * 2. Wait for report to complete
 * 3. Validate report results
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const TEST_URL = process.env.TEST_URL || 'https://example.com';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@brandprobe.io';

interface ScanResponse {
  success: boolean;
  reportId?: string;
  error?: string;
  cached?: boolean;
}

interface ReportResponse {
  success: boolean;
  report?: {
    id: string;
    url: string;
    status: 'scanning' | 'ready' | 'failed';
    overallScore: number | null;
    messagingScore: number | null;
    seoScore: number | null;
    contentScore: number | null;
    adsScore: number | null;
    conversionScore: number | null;
    distributionScore: number | null;
    messagingAnalysis: { score: number; summary: string } | null;
    seoOpportunities: { score: number; summary: string } | null;
  };
  error?: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('BrandProbe E2E Test', () => {
  let reportId: string;

  describe('1. Submit URL for Scanning', () => {
    it('should accept a URL and return a report ID', async () => {
      console.log(`\n[E2E] Submitting URL: ${TEST_URL}`);
      console.log(`[E2E] API: ${API_BASE_URL}/api/scan`);

      const response = await fetch(`${API_BASE_URL}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: TEST_URL, email: TEST_EMAIL }),
      });

      const data: ScanResponse = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.reportId).toBeDefined();

      reportId = data.reportId!;
      console.log(`[E2E] Report ID: ${reportId}`);
      console.log(`[E2E] Cached: ${data.cached}`);
    });
  });

  describe('2. Poll for Report Completion', () => {
    it('should complete the report within 10 minutes', async () => {
      console.log('\n[E2E] Waiting for report to complete...');

      const maxWaitTime = 10 * 60 * 1000; // 10 minutes
      const pollInterval = 10 * 1000; // 10 seconds
      const startTime = Date.now();
      let report: ReportResponse['report'];

      while (Date.now() - startTime < maxWaitTime) {
        const response = await fetch(`${API_BASE_URL}/api/report/${reportId}`);
        const data: ReportResponse = await response.json();

        if (!data.success || !data.report) {
          throw new Error(`Failed to fetch report: ${data.error}`);
        }

        report = data.report;

        if (report.status === 'ready') {
          console.log(`[E2E] Report ready in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
          break;
        }

        if (report.status === 'failed') {
          throw new Error('Report generation failed');
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
        console.log(`[E2E] Status: ${report.status} (${elapsed}s elapsed)`);
        await sleep(pollInterval);
      }

      expect(report).toBeDefined();
      expect(report!.status).toBe('ready');
    }, 660000); // 11 minute timeout
  });

  describe('3. Validate Report Results', () => {
    it('should have all scores populated', async () => {
      const response = await fetch(`${API_BASE_URL}/api/report/${reportId}`);
      const data: ReportResponse = await response.json();

      expect(data.success).toBe(true);
      const report = data.report!;

      // Check overall score
      expect(report.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.overallScore).toBeLessThanOrEqual(100);

      // Check all section scores
      expect(report.messagingScore).toBeGreaterThanOrEqual(0);
      expect(report.seoScore).toBeGreaterThanOrEqual(0);
      expect(report.contentScore).toBeGreaterThanOrEqual(0);
      expect(report.adsScore).toBeGreaterThanOrEqual(0);
      expect(report.conversionScore).toBeGreaterThanOrEqual(0);
      expect(report.distributionScore).toBeGreaterThanOrEqual(0);

      console.log('\n=== BrandProbe Report Results ===');
      console.log(`URL: ${report.url}`);
      console.log(`Overall Score: ${report.overallScore}/100`);
      console.log('\nSection Scores:');
      console.log(`  Messaging:    ${report.messagingScore}/100`);
      console.log(`  SEO:          ${report.seoScore}/100`);
      console.log(`  Content:      ${report.contentScore}/100`);
      console.log(`  Ads:          ${report.adsScore}/100`);
      console.log(`  Conversion:   ${report.conversionScore}/100`);
      console.log(`  Distribution: ${report.distributionScore}/100`);
    });

    it('should have analysis content for free sections', async () => {
      const response = await fetch(`${API_BASE_URL}/api/report/${reportId}`);
      const data: ReportResponse = await response.json();
      const report = data.report!;

      // Check messaging analysis (free section)
      expect(report.messagingAnalysis).toBeDefined();
      expect(report.messagingAnalysis!.summary).toBeTruthy();
      console.log('\nMessaging Summary:', report.messagingAnalysis!.summary);

      // Check SEO analysis (free section)
      expect(report.seoOpportunities).toBeDefined();
      expect(report.seoOpportunities!.summary).toBeTruthy();
      console.log('SEO Summary:', report.seoOpportunities!.summary);
    });
  });
});
