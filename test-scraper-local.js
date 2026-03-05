/**
 * Local Test Script - Native Playwright Scraper
 *
 * This tests the scraper with native Playwright (no Browserless)
 * Run: node test-scraper-local.js
 */

const { chromium } = require('playwright');

async function testNativePlaywright() {
  console.log('\n🧪 Testing Native Playwright Scraper...\n');

  let browser = null;

  try {
    console.log('1️⃣  Launching Chromium browser...');
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
    console.log(`   ✅ Browser launched in ${launchTime}ms\n`);

    console.log('2️⃣  Creating browser context...');
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      viewport: { width: 1280, height: 720 },
    });
    console.log('   ✅ Context created\n');

    console.log('3️⃣  Opening new page...');
    const page = await context.newPage();
    console.log('   ✅ Page opened\n');

    console.log('4️⃣  Navigating to test URL (example.com)...');
    const navStartTime = Date.now();
    await page.goto('https://example.com', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    const navTime = Date.now() - navStartTime;
    console.log(`   ✅ Page loaded in ${navTime}ms\n`);

    console.log('5️⃣  Scraping page data...');
    const data = await page.evaluate(() => {
      return {
        title: document.title,
        h1: Array.from(document.querySelectorAll('h1')).map(el => el.textContent?.trim()),
        bodyText: document.body.textContent?.slice(0, 200).trim(),
      };
    });
    console.log('   ✅ Data scraped successfully\n');

    console.log('📊 Scraped Data:');
    console.log('   Title:', data.title);
    console.log('   H1 tags:', data.h1);
    console.log('   Body preview:', data.bodyText);
    console.log('');

    console.log('6️⃣  Closing browser...');
    await context.close();
    await browser.close();
    console.log('   ✅ Browser closed\n');

    const totalTime = Date.now() - startTime;
    console.log('✅ TEST PASSED!');
    console.log(`⏱️  Total time: ${totalTime}ms\n`);
    console.log('🎉 Native Playwright is working perfectly!\n');

    return true;

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
    console.log('');

    if (browser) {
      await browser.close();
    }

    return false;
  }
}

// Run the test
testNativePlaywright()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
