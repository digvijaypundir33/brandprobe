import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { getOrCreateUser, updateUser } from '@/lib/supabase';

/**
 * Handle successful PayPal payment (Starter tier - one-time $9)
 * Called when user returns from PayPal after approving payment
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token'); // PayPal order ID
    const reportId = searchParams.get('reportId');

    if (!token) {
      return NextResponse.redirect(
        new URL('/?error=missing_token', process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
      );
    }

    // Capture the payment
    const capture = await capturePayPalOrder(token);

    if (!capture.success) {
      return NextResponse.redirect(
        new URL(
          reportId
            ? `/report/${reportId}?payment=failed`
            : '/?error=payment_failed',
          process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io'
        )
      );
    }

    // Update user to Starter tier
    const user = await getOrCreateUser(capture.payerEmail);

    await updateUser(user.id, {
      subscriptionStatus: 'starter',
      reportsUsedThisMonth: 0,
      reportsLimit: 2, // 2 full reports with all 10 sections unlocked
    });

    // Redirect to report
    const redirectUrl = reportId
      ? `/report/${reportId}?payment=success&tier=starter`
      : '/?payment=success&tier=starter';

    return NextResponse.redirect(
      new URL(redirectUrl, process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
    );
  } catch (error) {
    console.error('PayPal success handler error:', error);

    return NextResponse.redirect(
      new URL('/?error=payment_error', process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
    );
  }
}
