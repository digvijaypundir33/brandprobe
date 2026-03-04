import { NextRequest, NextResponse } from 'next/server';
import { getPayPalSubscription } from '@/lib/paypal';
import { getOrCreateUser, updateUser } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

/**
 * Handle successful PayPal subscription (Pro tier - $29/month)
 * Called when user returns from PayPal after subscribing
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscription_id');
    const reportId = searchParams.get('reportId');

    if (!subscriptionId) {
      return NextResponse.redirect(
        new URL('/?error=missing_subscription', process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
      );
    }

    // Get subscription details from PayPal
    const subscription = await getPayPalSubscription(subscriptionId);

    if (subscription.status !== 'ACTIVE' && subscription.status !== 'APPROVED') {
      return NextResponse.redirect(
        new URL(
          reportId
            ? `/report/${reportId}?payment=failed`
            : '/?error=subscription_failed',
          process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io'
        )
      );
    }

    // Get user email from session
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.redirect(
        new URL('/?error=not_authenticated', process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
      );
    }

    // Update user to Pro tier
    const user = await getOrCreateUser(session.email);

    await updateUser(user.id, {
      subscriptionStatus: 'active',
      subscriptionId: subscriptionId,
      reportsUsedThisMonth: 0,
      reportsLimit: 10,
      currentPeriodStart: new Date().toISOString(),
    });

    // Redirect to report or homepage
    const redirectUrl = reportId
      ? `/report/${reportId}?payment=success&tier=pro`
      : '/?payment=success&tier=pro';

    return NextResponse.redirect(
      new URL(redirectUrl, process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
    );
  } catch (error) {
    console.error('PayPal subscription success handler error:', error);

    return NextResponse.redirect(
      new URL('/?error=subscription_error', process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
    );
  }
}
