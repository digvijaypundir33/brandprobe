'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function URLInput() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to start scan');
      }

      // Check if verification is required
      if (data.requiresVerification) {
        setVerificationSent(true);
        setLoading(false);
        return;
      }

      // Redirect to report page (for authenticated users or cached reports)
      router.push(`/report/${data.reportId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="p-8 bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, white)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--brand-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold mb-2 text-gray-900">Check Your Email</h3>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <strong>{email}</strong>
            </p>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Check your inbox (and spam folder)</li>
                <li>Click the verification link</li>
                <li>Your report will start generating automatically</li>
              </ol>
            </div>

            <p className="text-xs text-gray-500">
              Link expires in 15 minutes • Didn't receive it?{' '}
              <button
                onClick={() => {
                  setVerificationSent(false);
                  setUrl('');
                  setEmail('');
                }}
                className="font-medium hover:underline"
                style={{ color: 'var(--brand-primary)' }}
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="space-y-4">
        <div>
          <label htmlFor="url" className="sr-only">
            Website URL
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourwebsite.com"
            className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-8 text-lg font-semibold text-white rounded-xl transition-colors shadow-lg"
          style={{
            backgroundColor: loading ? 'color-mix(in srgb, var(--brand-primary) 60%, white)' : 'var(--brand-primary)',
            boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--brand-primary) 20%, transparent)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--brand-primary) 90%, black)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
            }
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Analyzing...
            </span>
          ) : (
            'Get My Report'
          )}
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        Free report ready in 60 seconds • No credit card required
      </p>
    </form>
  );
}
