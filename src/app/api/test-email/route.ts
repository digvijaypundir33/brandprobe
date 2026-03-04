import { NextResponse } from 'next/server';
import { sendMagicLinkEmail } from '@/lib/email';

/**
 * Test endpoint to debug email sending in production
 * Visit: https://brandprobe.io/api/test-email?to=your-email@example.com
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get('to') || 'test@example.com';

  console.log('=== EMAIL TEST DEBUG ===');
  console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  console.log('RESEND_API_KEY prefix:', process.env.RESEND_API_KEY?.substring(0, 10));
  console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
  console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
  console.log('Test email to:', testEmail);
  console.log('========================');

  try {
    const result = await sendMagicLinkEmail(testEmail, 'test-token-123', null, false);

    return NextResponse.json({
      success: result.success,
      error: result.error,
      message: result.success
        ? `Email sent to ${testEmail}! Check your inbox (and spam folder).`
        : `Failed to send email: ${result.error}`,
      environment: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10),
        fromEmail: process.env.RESEND_FROM_EMAIL || 'NOT SET',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
      },
      instructions: result.success
        ? 'Check your email inbox and spam folder. Also check Resend dashboard at https://resend.com/emails'
        : 'Check Vercel logs and Resend dashboard for error details',
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        environment: {
          hasResendKey: !!process.env.RESEND_API_KEY,
          fromEmail: process.env.RESEND_FROM_EMAIL || 'NOT SET',
          appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
        },
      },
      { status: 500 }
    );
  }
}
