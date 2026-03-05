/**
 * Test Real Scraper - Uses actual scrapeWebsite function
 *
 * This tests your actual scraper code with native Playwright
 * Run: node test-real-scraper.mjs
 */

import { scrapeWebsite } from './src/lib/scraper.ts';

async function testRealScraper() {
  console.log('\n🧪 Testing Real Scraper with Native Playwright...\n');

  const testUrls = [
    'https://example.com',
    'https://stripe.com',
  ];

  for (const url of testUrls) {
    console.log(`\n📍 Testing URL: ${url}`);
    console.log('━'.repeat(60));

    try {
      const startTime = Date.now();

      // Test Quick mode (1 page)
      console.log('\n1️⃣  Testing Quick Analysis (1 page)...');
      const quickResult = await scrapeWebsite(url, { analysisType: 'quick' });
      const quickTime = Date.now() - startTime;

      console.log(`   ✅ Quick scan completed in ${quickTime}ms`);
      console.log(`   📄 Pages analyzed: ${quickResult.pagesAnalyzed}`);
      console.log(`   📰 Title: ${quickResult.title}`);
      console.log(`   🏷️  H1 count: ${quickResult.h1.length}`);
      console.log(`   🔗 Nav links: ${quickResult.navLinks.length}`);
      console.log(`   🎯 CTAs: ${quickResult.ctas.length}`);

      if (quickResult.technicalData) {
        console.log(`   🔒 SSL: ${quickResult.technicalData.hasSSL ? '✅' : '❌'}`);
        console.log(`   📊 Structured Data: ${quickResult.technicalData.hasStructuredData ? '✅' : '❌'}`);
      }

      console.log(`\n   ✅ SUCCESS - ${url} scraped successfully!\n`);

    } catch (error) {
      console.error(`\n   ❌ FAILED - ${url}`);
      console.error(`   Error: ${error.message}\n`);
      return false;
    }
  }

  console.log('\n✅ ALL TESTS PASSED!');
  console.log('🎉 Your scraper is working perfectly with native Playwright!\n');
  return true;
}

// Run the test
testRealScraper()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Unhandled error:', error);
    process.exit(1);
  });
