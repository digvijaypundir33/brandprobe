import { Resend } from 'resend';

// Initialize Resend with a placeholder key if not set (for build time)
// The actual key will be checked at runtime before sending emails
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_build');

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'BrandProbe <team@brandprobe.io>';
// Remove trailing slash from APP_URL to avoid double slashes in URLs
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io').replace(/\/$/, '');

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
      ? 'Access Your BrandProbe Reports'
      : 'Your BrandProbe Access Link';

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
      subject: 'Your BrandProbe Report is Ready',
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
            background: #f9fafb;
          }
          .container {
            background: #ffffff;
            border-radius: 12px;
            padding: 48px 40px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 32px;
          }
          .logo-icon {
            width: 40px;
            height: 40px;
            background: rgb(91, 91, 213);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .logo-text {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
          }
          h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 16px 0;
            color: #111827;
            line-height: 1.3;
          }
          p {
            margin: 0 0 24px 0;
            color: #6b7280;
            font-size: 16px;
          }
          .button-container {
            margin: 32px 0;
          }
          .button {
            display: inline-block;
            background: rgb(91, 91, 213);
            color: white !important;
            padding: 16px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
          }
          .notice {
            background: #f3f4f6;
            border-left: 4px solid rgb(91, 91, 213);
            padding: 16px 20px;
            margin: 32px 0;
            border-radius: 4px;
          }
          .notice-title {
            font-weight: 600;
            color: #374151;
            margin: 0 0 4px 0;
          }
          .notice-text {
            color: #6b7280;
            font-size: 14px;
            margin: 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 32px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
          }
          .footer-text {
            font-size: 14px;
            color: #9ca3af;
            margin: 0 0 8px 0;
          }
          .footer-link {
            color: rgb(91, 91, 213);
            text-decoration: none;
            font-weight: 500;
          }
          .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 32px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header with Logo -->
          <div class="header">
            <div class="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
            </div>
            <span class="logo-text">BrandProbe</span>
          </div>

          <!-- Main Content -->
          <h1>${heading}</h1>
          <p>${message}</p>

          <!-- CTA Button -->
          <div class="button-container">
            <a href="${verifyUrl}" class="button">${buttonText}</a>
          </div>

          <!-- Security Notice -->
          <div class="notice">
            <p class="notice-title">Security Notice</p>
            <p class="notice-text">This link expires in 15 minutes and can only be used once for your security.</p>
          </div>

          <div class="divider"></div>

          <!-- Footer Note -->
          <p style="font-size: 14px; color: #9ca3af; margin-bottom: 0;">
            If you didn't request this, you can safely ignore this email.
          </p>

          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              &copy; ${new Date().getFullYear()} BrandProbe. All rights reserved.
            </p>
            <a href="${APP_URL}" class="footer-link">Visit BrandProbe &rarr;</a>
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
            background: #f9fafb;
          }
          .container {
            background: #ffffff;
            border-radius: 12px;
            padding: 48px 40px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 32px;
          }
          .logo-icon {
            width: 40px;
            height: 40px;
            background: rgb(91, 91, 213);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .logo-text {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
          }
          h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 16px 0;
            color: #111827;
            line-height: 1.3;
          }
          p {
            margin: 0 0 24px 0;
            color: #6b7280;
            font-size: 16px;
          }
          .website-url {
            background: #f3f4f6;
            padding: 16px 20px;
            border-radius: 8px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
            font-size: 14px;
            margin: 24px 0;
            color: #374151;
            border: 1px solid #e5e7eb;
          }
          .button-container {
            margin: 32px 0;
          }
          .button {
            display: inline-block;
            background: rgb(91, 91, 213);
            color: white !important;
            padding: 16px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
          }
          .highlight-box {
            background: #f0f9ff;
            border-left: 4px solid rgb(91, 91, 213);
            padding: 16px 20px;
            margin: 32px 0;
            border-radius: 4px;
          }
          .highlight-text {
            color: #374151;
            font-size: 14px;
            margin: 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 32px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
          }
          .footer-text {
            font-size: 14px;
            color: #9ca3af;
            margin: 0 0 8px 0;
          }
          .footer-link {
            color: rgb(91, 91, 213);
            text-decoration: none;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header with Logo -->
          <div class="header">
            <div class="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
            </div>
            <span class="logo-text">BrandProbe</span>
          </div>

          <!-- Main Content -->
          <h1>Your Report is Ready</h1>
          <p>We've finished analyzing your website and your comprehensive marketing report is ready to view.</p>

          <!-- Website URL -->
          <div class="website-url">${websiteUrl}</div>

          <!-- CTA Button -->
          <div class="button-container">
            <a href="${reportUrl}" class="button">View My Report</a>
          </div>

          <!-- Report Details -->
          <div class="highlight-box">
            <p class="highlight-text">
              Your report includes insights on messaging, SEO, content strategy, ad angles, conversion optimization, and more.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              &copy; ${new Date().getFullYear()} BrandProbe. All rights reserved.
            </p>
            <a href="${APP_URL}" class="footer-link">Visit BrandProbe &rarr;</a>
          </div>
        </div>
      </body>
    </html>
  `;
}
