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
                background: linear-gradient(to bottom, #eff6ff, white);
              }
              .container {
                background: white;
                padding: 48px;
                border-radius: 16px;
                border: 2px solid #e5e7eb;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                max-width: 500px;
                text-align: center;
              }
              .icon {
                width: 64px;
                height: 64px;
                margin: 0 auto 24px;
                border-radius: 50%;
                background: #fef2f2;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
              }
              h1 {
                font-size: 28px;
                margin: 0 0 16px 0;
                color: #111827;
                font-weight: 700;
              }
              p {
                color: #6b7280;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 32px 0;
              }
              a {
                display: inline-block;
                background: rgb(91, 91, 213);
                color: white;
                padding: 14px 32px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 500;
                transition: background 0.2s;
              }
              a:hover {
                background: rgb(71, 71, 193);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">🔗</div>
              <h1>Invalid or Expired Link</h1>
              <p>
                This magic link is invalid, has already been used, or has expired.
                Magic links are valid for 15 minutes and can only be used once.
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io'}">
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
                background: linear-gradient(to bottom, #eff6ff, white);
              }
              .container {
                background: white;
                padding: 48px;
                border-radius: 16px;
                border: 2px solid #e5e7eb;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                max-width: 500px;
                text-align: center;
              }
              .icon {
                width: 64px;
                height: 64px;
                margin: 0 auto 24px;
                border-radius: 50%;
                background: #fef3c7;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
              }
              h1 {
                font-size: 28px;
                margin: 0 0 16px 0;
                color: #111827;
                font-weight: 700;
              }
              p {
                color: #6b7280;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 32px 0;
              }
              a {
                display: inline-block;
                background: rgb(91, 91, 213);
                color: white;
                padding: 14px 32px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 500;
                transition: background 0.2s;
              }
              a:hover {
                background: rgb(71, 71, 193);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">⏱️</div>
              <h1>Link Expired</h1>
              <p>
                This magic link has expired. For security, links are only valid for 15 minutes.
                Please request a new link to continue.
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io'}">
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
        // Get previous report for improvement tracking
        const previousReport = report.siteId
          ? await getLatestReportForSite(report.siteId)
          : null;

        // Trigger scan processing directly (don't await - let it run async)
        processReport(
          targetReportId,
          report.url,
          previousReport,
          Date.now(),
          'full',
          user.email
        ).catch((error) => {
          console.error('Failed to process report after verification:', error);
        });
      }
    }

    // Determine redirect URL
    const redirectUrl = targetReportId ? `/report/${targetReportId}` : '/dashboard';

    // Redirect to report or dashboard
    return NextResponse.redirect(
      new URL(redirectUrl, process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
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
              background: linear-gradient(to bottom, #eff6ff, white);
            }
            .container {
              background: white;
              padding: 48px;
              border-radius: 16px;
              border: 2px solid #e5e7eb;
              box-shadow: 0 10px 40px rgba(0,0,0,0.1);
              max-width: 500px;
              text-align: center;
            }
            .icon {
              width: 64px;
              height: 64px;
              margin: 0 auto 24px;
              border-radius: 50%;
              background: #fef2f2;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
            }
            h1 {
              font-size: 28px;
              margin: 0 0 16px 0;
              color: #111827;
              font-weight: 700;
            }
            p {
              color: #6b7280;
              font-size: 16px;
              line-height: 1.6;
              margin: 0 0 32px 0;
            }
            a {
              display: inline-block;
              background: rgb(91, 91, 213);
              color: white;
              padding: 14px 32px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 500;
              transition: background 0.2s;
            }
            a:hover {
              background: rgb(71, 71, 193);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">⚠️</div>
            <h1>Something Went Wrong</h1>
            <p>
              We encountered an error while verifying your access link.
              Please try again or contact support if the problem persists.
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io'}">
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
