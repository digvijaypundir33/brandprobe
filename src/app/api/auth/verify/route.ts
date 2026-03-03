import { NextRequest, NextResponse } from 'next/server';
import {
  getMagicLinkByToken,
  markMagicLinkAsUsed,
  getOrCreateUser,
  updateUserLastLogin,
} from '@/lib/supabase';
import { createSession, setSessionCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const reportId = searchParams.get('reportId');

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing token',
        },
        { status: 400 }
      );
    }

    // Get magic link from database
    const magicLink = await getMagicLinkByToken(token);

    if (!magicLink) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invalid Link - BrandProbe</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                padding: 48px;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 500px;
                text-align: center;
              }
              h1 {
                font-size: 32px;
                margin: 0 0 16px 0;
                color: #dc2626;
              }
              p {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 24px 0;
              }
              a {
                display: inline-block;
                background: rgb(91, 91, 213);
                color: white;
                padding: 12px 32px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 500;
              }
              a:hover {
                background: rgb(71, 71, 193);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🔗 Invalid or Expired Link</h1>
              <p>
                This magic link is invalid, has already been used, or has expired.
                Magic links are valid for 15 minutes and can only be used once.
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">
                Return to BrandProbe
              </a>
            </div>
          </body>
        </html>
        `,
        {
          status: 400,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    // Check if expired
    const expiresAt = new Date(magicLink.expiresAt);
    if (expiresAt < new Date()) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Link Expired - BrandProbe</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                padding: 48px;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 500px;
                text-align: center;
              }
              h1 {
                font-size: 32px;
                margin: 0 0 16px 0;
                color: #dc2626;
              }
              p {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 24px 0;
              }
              a {
                display: inline-block;
                background: rgb(91, 91, 213);
                color: white;
                padding: 12px 32px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 500;
              }
              a:hover {
                background: rgb(71, 71, 193);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>⏱️ Link Expired</h1>
              <p>
                This magic link has expired. For security, links are only valid for 15 minutes.
                Please request a new link to continue.
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">
                Return to BrandProbe
              </a>
            </div>
          </body>
        </html>
        `,
        {
          status: 410,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    // Mark magic link as used
    await markMagicLinkAsUsed(token);

    // Get or create user
    const user = await getOrCreateUser(magicLink.email);

    // Update last login
    await updateUserLastLogin(user.id);

    // Create session
    const sessionToken = await createSession(
      user.id,
      user.email,
      user.subscriptionStatus
    );

    // Set session cookie
    await setSessionCookie(sessionToken);

    // Determine target report ID
    const targetReportId = reportId || magicLink.reportId;

    // If there's a report ID, trigger the scan automatically
    if (targetReportId) {
      // Import scan processing function and required utilities
      const { getReportById, getLatestReportForSite } = await import('@/lib/supabase');
      const { processReport } = await import('@/app/api/scan/route');
      const report = await getReportById(targetReportId);

      // Only trigger if report is still in pending/scanning state
      if (report && report.status === 'scanning') {
        // Get previous score for progress tracking
        const previousReport = report.siteId
          ? await getLatestReportForSite(report.siteId)
          : null;
        const previousOverallScore = previousReport?.overallScore ?? null;

        // Trigger scan processing directly (don't await - let it run async)
        processReport(
          targetReportId,
          report.url,
          previousOverallScore,
          Date.now(),
          'full',
          user.email
        ).catch((error) => {
          console.error('Failed to process report after verification:', error);
        });
      }
    }

    // Determine redirect URL
    const redirectUrl = targetReportId ? `/report/${targetReportId}` : '/';

    // Redirect to report or home
    return NextResponse.redirect(
      new URL(redirectUrl, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    );
  } catch (error) {
    console.error('Verify magic link error:', error);

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error - BrandProbe</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 48px;
              border-radius: 12px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 500px;
              text-align: center;
            }
            h1 {
              font-size: 32px;
              margin: 0 0 16px 0;
              color: #dc2626;
            }
            p {
              color: #666;
              font-size: 16px;
              line-height: 1.6;
              margin: 0 0 24px 0;
            }
            a {
              display: inline-block;
              background: rgb(91, 91, 213);
              color: white;
              padding: 12px 32px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 500;
            }
            a:hover {
              background: rgb(71, 71, 193);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>⚠️ Something Went Wrong</h1>
            <p>
              We encountered an error while verifying your access link.
              Please try again or contact support if the problem persists.
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">
              Return to BrandProbe
            </a>
          </div>
        </body>
      </html>
      `,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}
