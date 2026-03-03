import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createPayPalOrder, createPayPalSubscription, PAYPAL_PRODUCTS } from '@/lib/paypal';
import { getSessionFromRequest } from '@/lib/auth';

const checkoutSchema = z.object({
  tier: z.enum(['starter', 'pro']),
  reportId: z.string().uuid().optional(),
  email: z.string().email(),
});

/**
 * Create PayPal checkout
 * - Starter ($9): One-time payment order
 * - Pro ($29/month): Subscription
 */
export async function POST(request: NextRequest) {
  try {
    // Get session (optional - user might not be authenticated yet)
    const session = await getSessionFromRequest(request);

    const body = await request.json();
    const { tier, reportId, email } = checkoutSchema.parse(body);

    // Verify email matches session if authenticated
    if (session && session.email !== email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email mismatch',
          message: 'Email does not match authenticated user',
        },
        { status: 403 }
      );
    }

    if (tier === 'starter') {
      // Create one-time payment order for $9
      if (!reportId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Report ID required',
            message: 'Report ID is required for Starter tier',
          },
          { status: 400 }
        );
      }

      const { orderId, approvalUrl } = await createPayPalOrder(9, reportId, email);

      return NextResponse.json({
        success: true,
        tier: 'starter',
        orderId,
        approvalUrl,
      });
    } else if (tier === 'pro') {
      // Create subscription for $29/month
      const planId = PAYPAL_PRODUCTS.pro;

      if (!planId) {
        return NextResponse.json(
          {
            success: false,
            error: 'PayPal plan not configured',
            message: 'Please set PAYPAL_PRO_PLAN_ID in environment variables',
          },
          { status: 500 }
        );
      }

      const { subscriptionId, approvalUrl } = await createPayPalSubscription(
        planId,
        email,
        reportId
      );

      return NextResponse.json({
        success: true,
        tier: 'pro',
        subscriptionId,
        approvalUrl,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid tier',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('PayPal checkout error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create PayPal checkout',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
