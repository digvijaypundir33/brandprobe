import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder, getPayPalSubscription } from '@/lib/paypal';
import { getOrCreateUser, updateUser } from '@/lib/supabase';

/**
 * Capture PayPal payment after user approval
 * Handles both one-time orders (Starter) and subscriptions (Pro)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, subscriptionId, tier, reportId, email } = body;

    if (tier === 'starter' && orderId) {
      // Handle one-time payment (Starter tier - $9)
      const capture = await capturePayPalOrder(orderId);

      if (!capture.success) {
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to capture payment',
          },
          { status: 400 }
        );
      }

      // Update user to Starter tier
      const user = await getOrCreateUser(email);

      await updateUser(user.id, {
        subscriptionStatus: 'starter',
        oneTimePurchaseId: null, // Starter users can create multiple reports, not tied to one
        reportsUsedThisMonth: 0,
        reportsLimit: 2, // 2 full reports with all 10 sections unlocked
      });

      console.log(`[PayPal Capture] Starter tier activated for ${email}`);

      return NextResponse.json({
        success: true,
        tier: 'starter',
        captureId: capture.captureId,
      });
    } else if (tier === 'pro' && subscriptionId) {
      // Handle subscription (Pro tier - $29/month)
      const subscription = await getPayPalSubscription(subscriptionId);

      if (subscription.status !== 'ACTIVE' && subscription.status !== 'APPROVED') {
        return NextResponse.json(
          {
            success: false,
            error: 'Subscription not active',
          },
          { status: 400 }
        );
      }

      // Update user to Pro tier
      const user = await getOrCreateUser(email);

      await updateUser(user.id, {
        subscriptionStatus: 'active',
        subscriptionId: subscriptionId,
        reportsUsedThisMonth: 0,
        reportsLimit: 10,
        currentPeriodStart: new Date().toISOString(),
      });

      console.log(`[PayPal Capture] Pro subscription activated for ${email}`);

      return NextResponse.json({
        success: true,
        tier: 'pro',
        subscriptionId,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment data',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[PayPal Capture] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
