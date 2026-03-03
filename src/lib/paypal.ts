import { Client, Environment, OrdersController, SubscriptionsController } from '@paypal/paypal-server-sdk';

// PayPal client configuration
const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment: process.env.PAYPAL_MODE === 'production'
    ? Environment.Production
    : Environment.Sandbox,
});

// Initialize controllers
const ordersController = new OrdersController(paypalClient);
const subscriptionsController = new SubscriptionsController(paypalClient);

// PayPal Product IDs (set these in your PayPal dashboard)
export const PAYPAL_PRODUCTS = {
  starter: process.env.PAYPAL_STARTER_PRODUCT_ID || '', // One-time $9
  pro: process.env.PAYPAL_PRO_PLAN_ID || '', // $29/month subscription
};

/**
 * Create PayPal order for one-time payment (Starter tier)
 */
export async function createPayPalOrder(
  amount: number,
  reportId: string,
  userEmail: string
): Promise<{ orderId: string; approvalUrl: string }> {
  try {
    const response = await ordersController.createOrder({
      body: {
        intent: 'CAPTURE',
        purchaseUnits: [
          {
            referenceId: reportId,
            description: 'BrandProbe - Full Report Access',
            customId: userEmail, // Store user email for webhook
            amount: {
              currencyCode: 'USD',
              value: amount.toFixed(2),
            },
          },
        ],
        applicationContext: {
          brandName: 'BrandProbe',
          landingPage: 'BILLING',
          userAction: 'PAY_NOW',
          returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/paypal/success?reportId=${reportId}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/report/${reportId}?payment=cancelled`,
        },
      },
    });

    const order = response.result;
    const orderId = order.id;
    const approvalUrl = order.links?.find(
      (link) => link.rel === 'approve'
    )?.href;

    if (!approvalUrl) {
      throw new Error('No approval URL found in PayPal response');
    }

    return { orderId, approvalUrl };
  } catch (error) {
    console.error('PayPal create order error:', error);
    throw new Error('Failed to create PayPal order');
  }
}

/**
 * Capture PayPal order payment
 */
export async function capturePayPalOrder(orderId: string): Promise<{
  success: boolean;
  captureId: string;
  payerEmail: string;
  reportId: string;
}> {
  try {
    const response = await ordersController.captureOrder({
      id: orderId,
    });

    const order = response.result;
    const captureId = order.purchaseUnits?.[0]?.payments?.captures?.[0]?.id;
    const payerEmail = order.payer?.emailAddress || '';
    const reportId = order.purchaseUnits?.[0]?.referenceId || '';

    if (!captureId) {
      throw new Error('No capture ID found in PayPal response');
    }

    return {
      success: true,
      captureId,
      payerEmail,
      reportId,
    };
  } catch (error) {
    console.error('PayPal capture error:', error);
    throw new Error('Failed to capture PayPal payment');
  }
}

/**
 * Create PayPal subscription for recurring payment (Pro tier)
 */
export async function createPayPalSubscription(
  planId: string,
  userEmail: string,
  reportId?: string
): Promise<{ subscriptionId: string; approvalUrl: string }> {
  try {
    const response = await subscriptionsController.createSubscription({
      body: {
        planId,
        subscriber: {
          emailAddress: userEmail,
        },
        customId: userEmail,
        applicationContext: {
          brandName: 'BrandProbe',
          userAction: 'SUBSCRIBE_NOW',
          returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/paypal/subscription/success${reportId ? `?reportId=${reportId}` : ''}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}${reportId ? `/report/${reportId}` : ''}?payment=cancelled`,
        },
      },
    });

    const subscription = response.result;
    const subscriptionId = subscription.id!;
    const approvalUrl = subscription.links?.find(
      (link) => link.rel === 'approve'
    )?.href;

    if (!approvalUrl) {
      throw new Error('No approval URL found in PayPal subscription response');
    }

    return { subscriptionId, approvalUrl };
  } catch (error) {
    console.error('PayPal create subscription error:', error);
    throw new Error('Failed to create PayPal subscription');
  }
}

/**
 * Cancel PayPal subscription
 */
export async function cancelPayPalSubscription(
  subscriptionId: string,
  reason: string = 'User requested cancellation'
): Promise<boolean> {
  try {
    await subscriptionsController.cancelSubscription({
      subscriptionId,
      body: {
        reason,
      },
    });

    return true;
  } catch (error) {
    console.error('PayPal cancel subscription error:', error);
    return false;
  }
}

/**
 * Get subscription details
 */
export async function getPayPalSubscription(subscriptionId: string): Promise<{
  status: string;
  startTime: string;
  nextBillingTime?: string;
}> {
  try {
    const response = await subscriptionsController.getSubscription({
      subscriptionId,
    });

    const subscription = response.result;

    return {
      status: subscription.status || '',
      startTime: subscription.startTime || '',
      nextBillingTime: subscription.billingInfo?.nextBillingTime,
    };
  } catch (error) {
    console.error('PayPal get subscription error:', error);
    throw new Error('Failed to get PayPal subscription details');
  }
}
