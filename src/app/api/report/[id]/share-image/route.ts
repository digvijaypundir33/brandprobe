import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadImage, generateImageFilename } from '@/lib/storage';

// Dynamic imports for Playwright
let chromium: any;
let playwright: any;

// Check if we're in production (Vercel) or local development
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reportId } = await params;

  try {
    // 1. Fetch report data
    const { data: report, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error || !report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // 2. Check if image already exists and is recent
    if (report.share_image_url && !report.share_image_url.startsWith('data:')) {
      // Only use cached if it's a real URL (not base64) and from the correct bucket
      if (report.share_image_url.includes('/share-images/')) {
        return NextResponse.json({
          success: true,
          imageUrl: report.share_image_url,
          cached: true,
        });
      }
      // Invalid cache (old bucket), regenerate
      console.log('Invalidating old cache from showcase-images bucket');
    }

    // 3. Calculate top 5 scores
    const scores = [
      { label: 'Messaging', score: report.messaging_score || 0 },
      { label: 'SEO', score: report.seo_score || 0 },
      { label: 'Content', score: report.content_score || 0 },
      { label: 'Ads', score: report.ads_score || 0 },
      { label: 'Conversion', score: report.conversion_score || 0 },
      { label: 'Distribution', score: report.distribution_score || 0 },
      { label: 'AI Search', score: report.ai_search_score || 0 },
      { label: 'Technical', score: report.technical_score || 0 },
      { label: 'Brand Health', score: report.brand_health_score || 0 },
      { label: 'Design', score: report.design_authenticity_score || 0 },
    ];

    const topScores = scores
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // If less than 5 scores, pad with zeros
    while (topScores.length < 5) {
      topScores.push({ label: '-', score: 0 });
    }

    // 4. Generate HTML for screenshot
    const websiteName = new URL(report.url).hostname.replace(/^www\./, '');
    const overallScore = report.overall_score || 0;

    const getScoreColor = (score: number) => {
      if (score >= 70) return '#16a34a'; // green-600
      if (score >= 50) return '#ca8a04'; // yellow-600
      if (score >= 30) return '#ea580c'; // orange-600
      return '#dc2626'; // red-600
    };

    // Helper function to generate SVG circle ring
    const generateScoreRing = (score: number, size: number = 150, strokeWidth: number = 14) => {
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (score / 100) * circumference;
      const color = getScoreColor(score);

      return `
        <svg width="${size}" height="${size}" style="transform: rotate(-90deg);">
          <!-- Background circle -->
          <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            fill="none"
            stroke="#1f2937"
            stroke-width="${strokeWidth}"
            opacity="0.3"
          />
          <!-- Progress circle -->
          <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            fill="none"
            stroke="${color}"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
            stroke-linecap="round"
          />
        </svg>
        <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 38px; font-weight: 700; color: #ffffff;">${score}</span>
        </div>
      `;
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
            }
            .container {
              width: 1200px;
              height: 630px;
              background: #0a0a0a;
              padding: 40px 48px;
              display: flex;
              flex-direction: column;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 24px;
            }
            .logo-container {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .logo-icon {
              width: 32px;
              height: 32px;
              background-color: #5b5bd5;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #ffffff;
            }
            .subtitle {
              font-size: 14px;
              color: #9ca3af;
            }
            .score-large {
              font-size: 72px;
              font-weight: bold;
              color: ${getScoreColor(overallScore)};
              line-height: 1;
            }
            .score-label {
              font-size: 14px;
              color: #9ca3af;
              margin-top: 4px;
            }
            .brandprobe-section {
              margin-bottom: 32px;
              text-align: center;
            }
            .brandprobe-title {
              font-size: 56px;
              font-weight: bold;
              color: #ffffff;
              margin-bottom: 6px;
            }
            .brandprobe-subtitle {
              font-size: 18px;
              color: #9ca3af;
            }
            .website-info {
              text-align: center;
              margin-top: 24px;
            }
            .website-label {
              font-size: 14px;
              color: #9ca3af;
              margin-bottom: 4px;
            }
            .website-name {
              font-size: 24px;
              font-weight: 600;
              color: #ffffff;
            }
            .scores-row {
              display: flex;
              gap: 28px;
              margin-bottom: 28px;
              align-items: center;
              justify-content: center;
            }
            .score-card {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 14px;
            }
            .ring-container {
              position: relative;
              width: 150px;
              height: 150px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .score-category {
              font-size: 16px;
              color: #d1d5db;
              font-weight: 600;
              letter-spacing: -0.01em;
            }
            .footer {
              text-align: center;
            }
            .footer-text {
              font-size: 16px;
              color: #9ca3af;
              margin-bottom: 8px;
            }
            .cta {
              font-size: 32px;
              font-weight: bold;
              color: #ffffff;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>
                <div class="logo-container">
                  <div class="logo-icon">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="white"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div class="logo">BrandProbe</div>
                </div>
                <div class="subtitle">Marketing Analysis</div>
              </div>
              <div style="text-align: right;">
                <div class="score-large">${overallScore}/100</div>
                <div class="score-label">Overall Score</div>
              </div>
            </div>

            <div class="brandprobe-section">
              <div class="brandprobe-title">BrandProbe.io</div>
              <div class="brandprobe-subtitle">Free Website Analysis Tool</div>
            </div>

            <div class="scores-row">
              ${topScores
                .map(
                  (s) => `
                <div class="score-card">
                  <div class="ring-container">
                    ${generateScoreRing(s.score, 150, 14)}
                  </div>
                  <div class="score-category">${s.label}</div>
                </div>
              `
                )
                .join('')}
            </div>

            <div class="website-info">
              <div class="website-label">Analysis for</div>
              <div class="website-name">${websiteName}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    // 5. Launch headless browser and take screenshot
    let browser;

    if (isProduction) {
      // Production: Use @sparticuz/chromium for Vercel serverless
      chromium = (await import('@sparticuz/chromium')).default;
      playwright = await import('playwright-core');

      browser = await playwright.chromium.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      // Local development: Use system Chromium/Chrome
      playwright = await import('playwright');

      browser = await playwright.chromium.launch({
        headless: true,
      });
    }

    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 },
    });

    await page.setContent(html, { waitUntil: 'networkidle' });

    const screenshot = await page.screenshot({
      type: 'png',
      omitBackground: false,
    });

    await browser.close();

    // 6. Upload to Supabase Storage
    const filename = `share/${reportId}.png`;

    let imageUrl: string;

    try {
      // Convert screenshot buffer to Blob
      const blob = new Blob([screenshot], { type: 'image/png' });

      // Upload using the helper function
      imageUrl = await uploadImage(blob, filename, 'share-images');
    } catch (uploadError) {
      console.error('Failed to upload to storage:', uploadError);
      // Fallback to base64 for preview
      const base64 = screenshot.toString('base64');
      imageUrl = `data:image/png;base64,${base64}`;

      return NextResponse.json({
        success: true,
        imageUrl,
        cached: false,
        warning: 'Image uploaded as base64 (storage upload failed)',
      });
    }

    // 7. Save URL to database (optional - will fail if migration not run)
    try {
      await supabaseAdmin
        .from('reports')
        .update({ share_image_url: imageUrl })
        .eq('id', reportId);
    } catch (dbError) {
      console.warn('Failed to save share_image_url (migration may not be run):', dbError);
      // Continue anyway - image was generated successfully
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      cached: false,
    });
  } catch (error) {
    console.error('Failed to generate share image:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image',
      },
      { status: 500 }
    );
  }
}
