import { NextResponse } from 'next/server';

export async function GET() {
  const logs: string[] = [];
  const startTime = Date.now();

  try {
    logs.push('Step 1: Starting Playwright test...');

    // Test 1: Check environment
    const isProduction = process.env.VERCEL === '1';
    logs.push(`Step 2: Environment detected: ${isProduction ? 'Production (Vercel)' : 'Local Development'}`);

    // Test 2: Launch browser
    logs.push(`Step 3: Launching chromium browser...`);
    const launchStart = Date.now();

    let browser;
    if (isProduction) {
      // Production: Use @sparticuz/chromium
      const { chromium } = await import('playwright-core');
      const chromiumPkg = (await import('@sparticuz/chromium')).default;
      browser = await chromium.launch({
        args: chromiumPkg.args,
        executablePath: await chromiumPkg.executablePath(),
        headless: true,
      });
    } else {
      // Local: Use regular Playwright
      const { chromium } = await import('playwright');
      browser = await chromium.launch({
        headless: true,
      });
    }

    const launchTime = Date.now() - launchStart;
    logs.push(`Step 4: Browser launched successfully in ${launchTime}ms`);

    // Test 3: Create context and page
    logs.push('Step 5: Creating browser context...');
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      viewport: { width: 1280, height: 720 },
    });
    logs.push('Step 6: Context created successfully');

    const page = await context.newPage();
    logs.push('Step 7: Page created successfully');

    // Test 4: Navigate to a simple page
    logs.push('Step 8: Navigating to example.com...');
    const navStart = Date.now();

    await page.goto('https://example.com', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    const navTime = Date.now() - navStart;
    logs.push(`Step 9: Page loaded in ${navTime}ms`);

    // Test 5: Extract some data
    logs.push('Step 10: Extracting page data...');
    const data = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        h1Count: document.querySelectorAll('h1').length,
      };
    });
    logs.push(`Step 11: Data extracted - Title: "${data.title}"`);

    // Test 6: Close browser
    logs.push('Step 12: Closing browser...');
    await context.close();
    await browser.close();
    logs.push('Step 13: Browser closed successfully');

    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: 'Playwright is working perfectly!',
      totalTime: `${totalTime}ms`,
      breakdown: {
        browserLaunch: `${launchTime}ms`,
        pageNavigation: `${navTime}ms`,
      },
      scrapedData: data,
      logs,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage(),
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    logs.push(`ERROR: ${errorMessage}`);

    return NextResponse.json({
      success: false,
      error: errorMessage,
      stack: errorStack,
      logs,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage(),
      }
    }, { status: 500 });
  }
}
