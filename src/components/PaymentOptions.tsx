'use client';

import PayPalButton from './PayPalButton';

interface PaymentOptionsProps {
  tier: 'starter' | 'pro';
  reportId?: string | null;
  email: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Payment Options Component
 * Simplified to use PayPal only
 */
export default function PaymentOptions({
  tier,
  reportId,
  email,
  onSuccess,
  onError,
}: PaymentOptionsProps) {
  return (
    <div className="space-y-6">
      {/* PayPal Payment */}
      <div>
        <PayPalButton
          tier={tier}
          reportId={reportId}
          email={email}
          onSuccess={onSuccess}
          onError={onError}
        />

        {tier === 'pro' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-blue-900">
                Your subscription will automatically renew monthly. You can cancel anytime from your dashboard.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span className="text-sm text-gray-600">
          Payments processed securely by PayPal
        </span>
      </div>
    </div>
  );
}
