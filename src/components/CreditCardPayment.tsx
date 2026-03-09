'use client';

import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalCardFields, PayPalCardFieldsProvider } from '@paypal/react-paypal-js';

interface CreditCardPaymentProps {
  tier: 'starter' | 'pro';
  reportId?: string | null;
  email: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Custom Credit Card Payment Component
 * Allows users to pay with credit/debit cards without PayPal account
 * Uses PayPal Advanced Credit and Debit Card Payments (ACDC)
 */
export default function CreditCardPayment({
  tier,
  reportId,
  email,
  onSuccess,
  onError,
}: CreditCardPaymentProps) {
  const [loading, setLoading] = useState(false);

  // Configure PayPal SDK with card-fields component
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: 'USD',
    intent: tier === 'starter' ? 'capture' : 'subscription',
    vault: tier === 'pro', // Enable vault for subscriptions
    components: 'buttons,card-fields',
    dataClientToken: undefined, // Will be set dynamically if needed
  } as any;

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="space-y-4">
        <CreditCardForm
          tier={tier}
          reportId={reportId}
          email={email}
          onSuccess={onSuccess}
          onError={onError}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </PayPalScriptProvider>
  );
}

/**
 * Credit Card Form Component
 */
function CreditCardForm({
  tier,
  reportId,
  email,
  onSuccess,
  onError,
  loading,
  setLoading,
}: CreditCardPaymentProps & {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const [cardholderName, setCardholderName] = useState('');

  const createOrder = async () => {
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
  };

  const createSubscription = async () => {
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
  };

  const handleApprove = async (data: any) => {
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
  };

  return (
    <PayPalCardFieldsProvider
      createOrder={tier === 'starter' ? createOrder : undefined}
      createSubscription={tier === 'pro' ? createSubscription : undefined}
      onApprove={handleApprove}
      onError={(err) => {
        console.error('PayPal card fields error:', err);
        setLoading(false);
        if (onError) {
          onError('Payment processing error');
        }
      }}
    >
      <div className="space-y-4">
        {/* Cardholder Name */}
        <div>
          <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <input
            id="card-name"
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="John Doe"
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
            autoComplete="cc-name"
          />
        </div>

        {/* PayPal Card Fields */}
        <CardFields />

        {/* Submit Button */}
        <SubmitButton loading={loading} tier={tier} />
      </div>
    </PayPalCardFieldsProvider>
  );
}

/**
 * Card Fields (Number, Expiry, CVV)
 */
function CardFields() {
  const { cardFieldsForm } = usePayPalCardFields();

  useEffect(() => {
    if (cardFieldsForm) {
      const cardNumberField = cardFieldsForm.NameField({
        placeholder: 'Card Number',
        style: {
          input: {
            'font-size': '16px',
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'color': '#1f2937',
          },
          '.invalid': {
            'color': '#ef4444',
          },
        },
      });

      const expiryField = cardFieldsForm.ExpiryField({
        placeholder: 'MM/YY',
        style: {
          input: {
            'font-size': '16px',
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'color': '#1f2937',
          },
        },
      });

      const cvvField = cardFieldsForm.CVVField({
        placeholder: 'CVV',
        style: {
          input: {
            'font-size': '16px',
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'color': '#1f2937',
          },
        },
      });

      cardNumberField?.render('#card-number-field');
      expiryField?.render('#card-expiry-field');
      cvvField?.render('#card-cvv-field');
    }
  }, [cardFieldsForm]);

  return (
    <>
      {/* Card Number */}
      <div>
        <label htmlFor="card-number-field" className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div
          id="card-number-field"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-transparent"
        />
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="card-expiry-field" className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <div
            id="card-expiry-field"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="card-cvv-field" className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <div
            id="card-cvv-field"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-transparent"
          />
        </div>
      </div>
    </>
  );
}

/**
 * Submit Payment Button
 */
function SubmitButton({ loading, tier }: { loading: boolean; tier: 'starter' | 'pro' }) {
  const { cardFieldsForm } = usePayPalCardFields();

  const handleClick = async () => {
    if (!cardFieldsForm) {
      return;
    }

    try {
      await cardFieldsForm.submit();
    } catch (error) {
      console.error('Card submission error:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || !cardFieldsForm}
      className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </span>
      ) : tier === 'starter' ? (
        'Pay $9'
      ) : (
        'Subscribe $29/month'
      )}
    </button>
  );
}
