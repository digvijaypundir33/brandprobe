/**
 * Simple Scraper Test - Direct Playwright test
 *
 * Tests the browser launch without TypeScript complications
 * Run: node test-scraper-simple.js
 */

const { chromium } = require('playwright');

async function testBrowserScraping() {
  console.log('\n🧪 Testing Browser Scraping (Native Playwright)...\n');

  const testUrls = [
    { url: 'https://example.com', name: 'Example.com' },
    { url: 'https://stripe.com', name: 'Stripe.com' },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const { url, name } of testUrls) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📍 Testing: ${name}`);
    console.log(`🔗 URL: ${url}`);
    console.log('='.repeat(60));

    let browser = null;

    try {
      // Launch browser with same config as scraper
      console.log('\n⏳ Launching browser...');
      const startTime = Date.now();

      browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });

      const launchTime = Date.now() - startTime;
      console.log(`✅ Browser launched in ${launchTime}ms`);

      // Create context
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        viewport: { width: 1280, height: 720 },
      });

      const page = await context.newPage();

      // Navigate to URL
      console.log(`⏳ Loading ${url}...`);
      const navStart = Date.now();
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      const navTime = Date.now() - navStart;
      console.log(`✅ Page loaded in ${navTime}ms`);

      // Wait for dynamic content
      await page.waitForTimeout(2000);

      // Scrape data
      console.log('⏳ Scraping data...');
      const data = await page.evaluate(() => {
        // Get title
        const title = document.title || '';

        // Get meta description
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

        // Get headings
        const h1 = Array.from(document.querySelectorAll('h1'))
          .map(el => el.textContent?.trim() || '')
          .filter(Boolean);

        const h2 = Array.from(document.querySelectorAll('h2'))
          .map(el => el.textContent?.trim() || '')
          .filter(Boolean);

        // Get CTAs
        const ctaSelectors = ['a[class*="btn"]', 'button', '[role="button"]'];
        const ctas = [];
        for (const selector of ctaSelectors) {
          document.querySelectorAll(selector).forEach(el => {
            const text = el.textContent?.trim();
            if (text && text.length < 50 && !ctas.includes(text)) {
              ctas.push(text);
            }
          });
        }

        // Get nav links
        const navLinks = [];
        document.querySelectorAll('nav a, header a').forEach(el => {
          const href = el.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
            navLinks.push(href);
          }
        });

        return {
          title,
          metaDescription: metaDesc,
          h1Count: h1.length,
          h2Count: h2.length,
          h1Sample: h1.slice(0, 3),
          ctaCount: ctas.length,
          ctaSample: ctas.slice(0, 5),
          navLinkCount: navLinks.length,
        };
      });

      // Display results
      const totalTime = Date.now() - startTime;
      console.log(`✅ Data scraped in ${totalTime}ms total\n`);

      console.log('📊 Results:');
      console.log(`   • Title: ${data.title}`);
      console.log(`   • Meta description: ${data.metaDescription ? '✓' : '✗'}`);
      console.log(`   • H1 count: ${data.h1Count}`);
      console.log(`   • H2 count: ${data.h2Count}`);
      console.log(`   • CTA count: ${data.ctaCount}`);
      console.log(`   • Nav links: ${data.navLinkCount}`);

      if (data.h1Sample.length > 0) {
        console.log('\n   H1 Headlines:');
        data.h1Sample.forEach((h1, i) => {
          console.log(`   ${i + 1}. "${h1}"`);
        });
      }

      if (data.ctaSample.length > 0) {
        console.log('\n   Sample CTAs:');
        data.ctaSample.forEach((cta, i) => {
          console.log(`   ${i + 1}. "${cta}"`);
        });
      }

      // Close browser
      await context.close();
      await browser.close();

      successCount++;
      console.log(`\n✅ SUCCESS - ${name} scraped successfully!\n`);

    } catch (error) {
      failCount++;
      console.error(`\n❌ FAILED - ${name}`);
      console.error(`   Error: ${error.message}`);
      console.error(`   Stack: ${error.stack?.split('\n').slice(0, 3).join('\n')}`);
      console.log('');

      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          // Ignore close errors
        }
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${successCount}/${testUrls.length}`);
  console.log(`❌ Failed: ${failCount}/${testUrls.length}`);

  if (failCount === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✨ Native Playwright is working perfectly!');
    console.log('🚀 Ready to deploy to production!\n');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed. Check errors above.\n');
    return false;
  }
}

// Run test
testBrowserScraping()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Unhandled error:', error);
    process.exit(1);
  });
