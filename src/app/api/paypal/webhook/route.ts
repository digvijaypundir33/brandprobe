import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser, updateUser } from '@/lib/supabase';

/**
 * PayPal Webhook Handler
 *
 * Handles events from PayPal:
 * - PAYMENT.CAPTURE.COMPLETED - One-time payment completed
 * - BILLING.SUBSCRIPTION.ACTIVATED - Subscription activated
 * - BILLING.SUBSCRIPTION.CANCELLED - Subscription cancelled
 * - BILLING.SUBSCRIPTION.SUSPENDED - Subscription suspended (payment failed)
 * - BILLING.SUBSCRIPTION.EXPIRED - Subscription expired
 *
 * TODO (Production): Add webhook signature verification for security
 * See: https://developer.paypal.com/api/rest/webhooks/rest/#link-verifysignature
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.event_type;

    // TODO (Production): Verify webhook signature
    // const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    // const signature = request.headers.get('paypal-transmission-sig');
    // Verify signature matches to ensure request is from PayPal

    console.log(`[PayPal Webhook] Received event: ${eventType}`);

    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        // One-time payment (Starter tier) completed
        const capture = body.resource;
        const email = capture.payer.email_address;
        const captureId = capture.id;

        const user = await getOrCreateUser(email);

        await updateUser(user.id, {
          subscriptionStatus: 'starter',
          oneTimePurchaseId: captureId,
          reportsUsedThisMonth: 0,
          reportsLimit: 1,
        });

        console.log(`[PayPal Webhook] Starter tier activated for ${email}`);
        break;
      }

      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        // Subscription (Pro tier) activated
        const subscription = body.resource;
        const subscriberId = subscription.subscriber?.email_address;
        const subscriptionId = subscription.id;

        if (!subscriberId) {
          console.error('[PayPal Webhook] No subscriber email in subscription activated event');
          break;
        }

        const user = await getOrCreateUser(subscriberId);

        await updateUser(user.id, {
          subscriptionStatus: 'active',
          subscriptionId: subscriptionId,
          reportsUsedThisMonth: 0,
          reportsLimit: 10,
          currentPeriodStart: new Date().toISOString(),
        });

        console.log(`[PayPal Webhook] Pro subscription activated for ${subscriberId}`);
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        // Subscription cancelled or expired
        const subscription = body.resource;
        const subscriptionId = subscription.id;

        // Find user by subscription ID
        // Note: You'll need to add a getUserBySubscriptionId function to supabase.ts
        // For now, we'll just log it
        console.log(`[PayPal Webhook] Subscription ${subscriptionId} cancelled/expired`);

        // TODO: Implement getUserBySubscriptionId and update status to 'cancelled'
        break;
      }

      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        // Subscription suspended (payment failed)
        const subscription = body.resource;
        const subscriptionId = subscription.id;

        console.log(`[PayPal Webhook] Subscription ${subscriptionId} suspended`);

        // TODO: Implement getUserBySubscriptionId and update status to 'past_due'
        break;
      }

      default:
        console.log(`[PayPal Webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[PayPal Webhook] Error processing webhook:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Webhook processing failed',
      },
      { status: 500 }
    );
  }
}
