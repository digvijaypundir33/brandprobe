# Debugging Emails on Production (Vercel)

## Method 1: Check Vercel Logs

1. Go to https://vercel.com/dashboard
2. Click your project
3. Click "Logs" tab
4. Try to trigger an email (request magic link)
5. Look for:
   - `Failed to send magic link email:` (error messages)
   - Any Resend API errors
   - Environment variable issues

## Method 2: Check Resend Dashboard

1. Go to https://resend.com/emails
2. Check if emails are showing up (even failed ones)
3. Look for:
   - "Domain not verified" errors
   - "Invalid API key" errors
   - Bounce/reject reasons

## Method 3: Add Debug Logging

Add console.logs to see what's happening in production:

```typescript
// In src/lib/email.ts - line 20
console.log('[EMAIL DEBUG] Attempting to send email');
console.log('[EMAIL DEBUG] RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
console.log('[EMAIL DEBUG] FROM_EMAIL:', FROM_EMAIL);
console.log('[EMAIL DEBUG] To:', email);
console.log('[EMAIL DEBUG] Verify URL:', verifyUrl);

try {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject,
    html: getMagicLinkEmailTemplate(verifyUrl, isDashboardAccess),
  });
  console.log('[EMAIL DEBUG] Email sent successfully!');
  return { success: true };
} catch (error) {
  console.error('[EMAIL DEBUG] Failed to send:', error);
  // Log full error details
  if (error instanceof Error) {
    console.error('[EMAIL DEBUG] Error message:', error.message);
    console.error('[EMAIL DEBUG] Error stack:', error.stack);
  }
  return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
}
```

## Method 4: Test Email Endpoint Directly

Create a test endpoint to debug email sending:

File: `src/app/api/test-email/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { sendMagicLinkEmail } from '@/lib/email';

export async function GET() {
  const testEmail = 'your-email@example.com'; // Replace with your email
  const testToken = 'test-token-123';

  console.log('Testing email with:');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
  console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
  console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

  try {
    const result = await sendMagicLinkEmail(testEmail, testToken, null, false);
    return NextResponse.json({
      success: result.success,
      error: result.error,
      env: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
```

Then visit: `https://brandprobe.io/api/test-email`

## Method 5: Check Environment Variables

Verify env vars are actually set in Vercel:

```bash
# In Vercel Dashboard → Settings → Environment Variables
# Make sure these exist for "Production":

RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=BrandProbe <noreply@brandprobe.io>
NEXT_PUBLIC_APP_URL=https://brandprobe.io
```

## Method 6: Common Issues Checklist

- [ ] RESEND_API_KEY is set in Vercel (not just locally)
- [ ] Domain is verified in Resend dashboard
- [ ] FROM_EMAIL matches verified domain (noreply@brandprobe.io)
- [ ] DNS records added to GoDaddy (SPF, DKIM, CNAME)
- [ ] Redeployed after adding env vars
- [ ] Not using sandbox/test API key in production
- [ ] Email isn't going to spam folder

## Method 7: Quick Verification Script

Run this in Vercel Function logs to see what's set:

Add to any API route temporarily:

```typescript
console.log('=== EMAIL CONFIG DEBUG ===');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET ✓' : 'MISSING ✗');
console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'NOT SET');
console.log('APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'NOT SET');
console.log('=========================');
```

## What to Look For

### If emails aren't sending at all:
- Check Vercel logs for "Failed to send magic link email"
- Check Resend dashboard - are emails appearing?
- Verify RESEND_API_KEY is set correctly

### If emails are sent but not received:
- Check spam folder
- Check Resend dashboard for delivery status
- Verify domain DNS records in Resend
- Check email address is valid

### If getting "Domain not verified":
- Go to Resend → Domains
- Check if brandprobe.io is verified
- Add required DNS records to GoDaddy
- Wait for verification (can take a few minutes)

## Quick Test Steps

1. Deploy the test endpoint above
2. Visit `https://brandprobe.io/api/test-email`
3. Check the JSON response
4. Check Vercel logs
5. Check Resend dashboard
6. Check your email (including spam)

This will tell you exactly where the problem is!
