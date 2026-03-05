/**
 * Test Real Scraper - Uses actual scrapeWebsite function
 *
 * This tests your actual scraper code with native Playwright
 * Run: npx tsx scripts/test-scraper.ts
 */

import { scrapeWebsite } from '../src/lib/scraper';

async function testRealScraper() {
  console.log('\n🧪 Testing Real Scraper with Native Playwright...\n');

  const testUrls = [
    { url: 'https://example.com', name: 'Example.com (Simple site)' },
    { url: 'https://stripe.com', name: 'Stripe (Production site)' },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const { url, name } of testUrls) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📍 ${name}`);
    console.log(`🔗 ${url}`);
    console.log('='.repeat(70));

    try {
      const startTime = Date.now();

      // Test Quick mode (1 page)
      console.log('\n⏳ Running Quick Analysis (1 page)...');
      const quickResult = await scrapeWebsite(url, { analysisType: 'quick' });
      const quickTime = Date.now() - startTime;

      console.log(`\n✅ Scan completed in ${(quickTime / 1000).toFixed(2)}s`);
      console.log('\n📊 Results:');
      console.log(`   • Pages analyzed: ${quickResult.pagesAnalyzed}`);
      console.log(`   • Title: ${quickResult.title}`);
      console.log(`   • Meta description: ${quickResult.metaDescription ? '✓' : '✗'}`);
      console.log(`   • H1 headlines: ${quickResult.h1.length}`);
      console.log(`   • H2 headlines: ${quickResult.h2.length}`);
      console.log(`   • Navigation links: ${quickResult.navLinks.length}`);
      console.log(`   • CTAs found: ${quickResult.ctas.length}`);
      console.log(`   • Testimonials: ${quickResult.testimonials.length}`);
      console.log(`   • Trust signals: ${quickResult.trustSignals.length}`);

      if (quickResult.technicalData) {
        console.log('\n🔧 Technical Data:');
        console.log(`   • SSL/HTTPS: ${quickResult.technicalData.hasSSL ? '✅' : '❌'}`);
        console.log(`   • Favicon: ${quickResult.technicalData.hasFavicon ? '✅' : '❌'}`);
        console.log(`   • Open Graph: ${quickResult.technicalData.hasOpenGraph ? '✅' : '❌'}`);
        console.log(`   • Structured Data: ${quickResult.technicalData.hasStructuredData ? '✅' : '❌'}`);
        console.log(`   • Canonical Tag: ${quickResult.technicalData.hasCanonicalTag ? '✅' : '❌'}`);
        console.log(`   • Robots.txt: ${quickResult.technicalData.hasRobotsTxt ? '✅' : '❌'}`);
        console.log(`   • Sitemap: ${quickResult.technicalData.hasSitemap ? '✅' : '❌'}`);
        console.log(`   • Images with alt: ${quickResult.technicalData.imagesWithAlt}`);
        console.log(`   • Load time: ${quickResult.technicalData.loadTimeEstimate}`);
      }

      if (quickResult.ctas.length > 0) {
        console.log('\n🎯 Sample CTAs:');
        quickResult.ctas.slice(0, 5).forEach((cta, i) => {
          console.log(`   ${i + 1}. "${cta}"`);
        });
      }

      if (quickResult.h1.length > 0) {
        console.log('\n📰 H1 Headlines:');
        quickResult.h1.slice(0, 3).forEach((h1, i) => {
          console.log(`   ${i + 1}. "${h1}"`);
        });
      }

      successCount++;
      console.log(`\n✅ SUCCESS for ${name}\n`);

    } catch (error) {
      failCount++;
      console.error(`\n❌ FAILED for ${name}`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof Error && error.stack) {
        console.error(`   Stack: ${error.stack.split('\n').slice(0, 3).join('\n')}`);
      }
      console.log('');
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📈 TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Passed: ${successCount}/${testUrls.length}`);
  console.log(`❌ Failed: ${failCount}/${testUrls.length}`);

  if (failCount === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✨ Your scraper is working perfectly with native Playwright!');
    console.log('🚀 Ready to deploy to production!\n');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.\n');
    return false;
  }
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
