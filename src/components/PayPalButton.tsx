'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface PayPalButtonProps {
  tier: 'starter' | 'pro';
  reportId?: string | null;
  email: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PayPalButton({
  tier,
  reportId,
  email,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const [loading, setLoading] = useState(false);

  // Configure PayPal SDK options based on tier
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: 'USD',
    intent: tier === 'starter' ? 'capture' : 'subscription',
    vault: tier === 'pro', // Enable vault for subscriptions
    components: 'buttons,funding-eligibility',
  } as any;

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        disabled={loading}
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          tagline: false,
          height: 48,
        }}
        fundingSource={undefined} // Show all available payment methods
        createOrder={
          tier === 'starter'
            ? async () => {
                setLoading(true);
                try {
                  const payload: { tier: 'starter'; email: string; reportId?: string } = {
                    tier: 'starter',
                    email,
                  };
                  if (reportId) {
                    payload.reportId = reportId;
                  }

                  const response = await fetch('/api/paypal/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });

                  const data = await response.json();

                  if (!data.success) {
                    throw new Error(data.error || 'Failed to create PayPal order');
                  }

                  return data.orderId;
                } catch (error) {
                  console.error('PayPal create order error:', error);
                  if (onError) {
                    onError(error instanceof Error ? error.message : 'Unknown error');
                  }
                  setLoading(false);
                  throw error;
                }
              }
            : undefined
        }
        createSubscription={
          tier === 'pro'
            ? async () => {
                setLoading(true);
                try {
                  const payload: { tier: 'pro'; email: string; reportId?: string } = {
                    tier: 'pro',
                    email,
                  };
                  if (reportId) {
                    payload.reportId = reportId;
                  }

                  const response = await fetch('/api/paypal/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });

                  const data = await response.json();

                  if (!data.success) {
                    throw new Error(data.error || 'Failed to create PayPal subscription');
                  }

                  return data.subscriptionId;
                } catch (error) {
                  console.error('PayPal create subscription error:', error);
                  if (onError) {
                    onError(error instanceof Error ? error.message : 'Unknown error');
                  }
                  setLoading(false);
                  throw error;
                }
              }
            : undefined
        }
        onApprove={async (data) => {
          setLoading(true);
          try {
            // Capture the payment on the backend
            const captureResponse = await fetch('/api/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderID,
                subscriptionId: data.subscriptionID,
                tier,
                reportId,
                email,
              }),
            });

            const captureData = await captureResponse.json();

            if (!captureData.success) {
              throw new Error(captureData.error || 'Payment capture failed');
            }

            // Payment successful - call success callback
            if (onSuccess) {
              onSuccess();
            }
          } catch (error) {
            console.error('PayPal approval error:', error);
            if (onError) {
              onError(error instanceof Error ? error.message : 'Unknown error');
            }
          } finally {
            setLoading(false);
          }
        }}
        onCancel={() => {
          setLoading(false);
          if (onError) {
            onError('Payment cancelled');
          }
        }}
        onError={(err) => {
          console.error('PayPal error:', err);
          setLoading(false);
          if (onError) {
            onError('PayPal error occurred');
          }
        }}
      />
    </PayPalScriptProvider>
  );
}
