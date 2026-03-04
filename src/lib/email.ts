import { Resend } from 'resend';

// Initialize Resend with a placeholder key if not set (for build time)
// The actual key will be checked at runtime before sending emails
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_build');

const FROM_EMAIL = process.env.FROM_EMAIL || 'BrandProbe <noreply@brandprobe.io>';
// Remove trailing slash from APP_URL to avoid double slashes in URLs
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

/**
 * Send magic link email for authentication
 */
export async function sendMagicLinkEmail(
  email: string,
  token: string,
  reportId?: string | null,
  isDashboardAccess = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const verifyUrl = `${APP_URL}/api/auth/verify?token=${token}${
      reportId ? `&reportId=${reportId}` : ''
    }`;

    // In local development, log the magic link URL instead of sending email
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_your_')) {
      console.log('\n========================================');
      console.log('🔐 MAGIC LINK (Local Development)');
      console.log('========================================');
      console.log(`Email: ${email}`);
      console.log(`Link:  ${verifyUrl}`);
      console.log(`Type:  ${isDashboardAccess ? 'Dashboard Access' : 'Report Verification'}`);
      console.log('========================================\n');
      return { success: true };
    }

    const subject = isDashboardAccess
      ? '🔐 Access Your BrandProbe Reports'
      : '🔐 Your BrandProbe Access Link';

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html: getMagicLinkEmailTemplate(verifyUrl, isDashboardAccess),
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send magic link email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send report ready notification
 */
export async function sendReportReadyEmail(
  email: string,
  reportId: string,
  url: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const reportUrl = `${APP_URL}/report/${reportId}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '✅ Your BrandProbe Report is Ready!',
      html: getReportReadyEmailTemplate(url, reportUrl),
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send report ready email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Magic link email template
 */
function getMagicLinkEmailTemplate(verifyUrl: string, isDashboardAccess = false): string {
  const heading = isDashboardAccess
    ? 'Access Your Reports'
    : 'Verify Your Email';
  const message = isDashboardAccess
    ? 'Click the button below to access your BrandProbe dashboard and view all your reports.'
    : 'Click the button below to verify your email and access your report.';
  const buttonText = isDashboardAccess
    ? 'Go to Dashboard'
    : 'Verify Email & View Report';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 8px;
            padding: 40px;
            border: 1px solid #e5e7eb;
          }
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: rgb(91, 91, 213);
            margin-bottom: 24px;
          }
          h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 16px 0;
            color: #111;
          }
          p {
            margin: 0 0 24px 0;
            color: #666;
          }
          .button {
            display: inline-block;
            background: rgb(91, 91, 213);
            color: white !important;
            padding: 14px 32px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            margin: 8px 0;
          }
          .button:hover {
            background: rgb(71, 71, 193);
          }
          .footer {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #999;
          }
          .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px 16px;
            margin: 24px 0;
            font-size: 14px;
            color: #92400e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">BrandProbe</div>

          <h1>${heading}</h1>
          <p>${message}</p>

          <a href="${verifyUrl}" class="button">${buttonText}</a>

          <div class="warning">
            <strong>⏱️ This link expires in 15 minutes</strong><br>
            For security, this access link can only be used once.
          </div>

          <p style="font-size: 14px; color: #999;">
            If you didn't request this, you can safely ignore this email.
          </p>

          <div class="footer">
            <p>
              © ${new Date().getFullYear()} BrandProbe. All rights reserved.<br>
              <a href="${APP_URL}" style="color: rgb(91, 91, 213);">Visit BrandProbe</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Report ready email template
 */
function getReportReadyEmailTemplate(websiteUrl: string, reportUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 8px;
            padding: 40px;
            border: 1px solid #e5e7eb;
          }
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: rgb(91, 91, 213);
            margin-bottom: 24px;
          }
          h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 16px 0;
            color: #111;
          }
          p {
            margin: 0 0 24px 0;
            color: #666;
          }
          .button {
            display: inline-block;
            background: rgb(91, 91, 213);
            color: white !important;
            padding: 14px 32px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            margin: 8px 0;
          }
          .button:hover {
            background: rgb(71, 71, 193);
          }
          .website-url {
            background: #f3f4f6;
            padding: 12px 16px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 14px;
            margin: 16px 0;
          }
          .footer {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">BrandProbe</div>

          <h1>✅ Your Report is Ready!</h1>

          <p>We've finished analyzing your website and your comprehensive marketing report is ready to view.</p>

          <div class="website-url">
            ${websiteUrl}
          </div>

          <a href="${reportUrl}" class="button">View My Report</a>

          <p style="font-size: 14px; color: #666; margin-top: 24px;">
            Your report includes insights on messaging, SEO, content strategy, ad angles, conversion optimization, and more.
          </p>

          <div class="footer">
            <p>
              © ${new Date().getFullYear()} BrandProbe. All rights reserved.<br>
              <a href="${APP_URL}" style="color: rgb(91, 91, 213);">Visit BrandProbe</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
