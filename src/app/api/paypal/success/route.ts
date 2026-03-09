import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder, getPayPalSubscription } from '@/lib/paypal';
import { getOrCreateUser, updateUser } from '@/lib/supabase';
import { createSession, setSessionCookie, getSessionFromRequest } from '@/lib/auth';

/**
 * Handle successful PayPal payment
 * Unified handler for both Starter (one-time) and Pro (subscription) payments
 * Called when user returns from PayPal after approving payment
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token'); // PayPal order ID (for one-time payments)
    const subscriptionId = searchParams.get('subscription_id'); // PayPal subscription ID (for subscriptions)
    const reportId = searchParams.get('reportId');

    // Detect payment type based on query parameters
    if (subscriptionId) {
      // Pro tier - Subscription payment
      return handleSubscriptionSuccess(request, subscriptionId, reportId);
    } else if (token) {
      // Starter tier - One-time payment
      return handleOneTimePaymentSuccess(token, reportId);
    } else {
      return NextResponse.redirect(
        new URL('/?error=missing_payment_info', process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
      );
    }
  } catch (error) {
    console.error('PayPal success handler error:', error);

    return NextResponse.redirect(
      new URL('/?error=payment_error', process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
    );
  }
}

/**
 * Handle one-time payment success (Starter tier - $9)
 */
async function handleOneTimePaymentSuccess(token: string, reportId: string | null) {
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

  // Refresh session with new subscription status
  const newToken = await createSession(user.id, capture.payerEmail, 'starter');
  await setSessionCookie(newToken);

  // Redirect to report
  const redirectUrl = reportId
    ? `/report/${reportId}?payment=success&tier=starter`
    : '/?payment=success&tier=starter';

  return NextResponse.redirect(
    new URL(redirectUrl, process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
  );
}

/**
 * Handle subscription success (Pro tier - $29/month)
 */
async function handleSubscriptionSuccess(
  request: NextRequest,
  subscriptionId: string,
  reportId: string | null
) {
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

  // Refresh session with new subscription status
  const newToken = await createSession(user.id, session.email, 'active');
  await setSessionCookie(newToken);

  // Redirect to report or homepage
  const redirectUrl = reportId
    ? `/report/${reportId}?payment=success&tier=pro`
    : '/?payment=success&tier=pro';

  return NextResponse.redirect(
    new URL(redirectUrl, process.env.NEXT_PUBLIC_APP_URL || 'https://brandprobe.io')
  );
}
