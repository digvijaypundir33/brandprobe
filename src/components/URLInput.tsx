'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UpgradeOptions {
  starter: { price: number; type: string; reports: number; description?: string };
  pro: { price: number; type: string; reports: number; description?: string };
}

interface ExistingReport {
  id: string;
  url: string;
  createdAt: string;
  overallScore: number | null;
}

export default function URLInput() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeOptions, setUpgradeOptions] = useState<UpgradeOptions | null>(null);
  const [showRescanModal, setShowRescanModal] = useState(false);
  const [existingReport, setExistingReport] = useState<ExistingReport | null>(null);
  const [canRescan, setCanRescan] = useState(false);

  const handleSubmit = async (e: React.FormEvent, forceRescan = false) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Client-side URL validation
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a website URL');
      setLoading(false);
      return;
    }

    // Basic URL validation
    try {
      let testUrl = trimmedUrl;
      if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
        testUrl = `https://${testUrl}`;
      }
      const parsed = new URL(testUrl);

      // Check for valid hostname
      if (!parsed.hostname || parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        setError('Please enter a valid public website URL');
        setLoading(false);
        return;
      }

      // Check for TLD (at least one dot in hostname)
      if (!parsed.hostname.includes('.')) {
        setError('Please enter a valid website URL (e.g., example.com)');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError('Please enter a valid website URL (e.g., example.com)');
      setLoading(false);
      return;
    }

    // Email validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl, email: trimmedEmail, forceRescan }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if this is an upgrade required error
        if (data.requiresUpgrade && data.upgradeOptions) {
          setUpgradeOptions(data.upgradeOptions);
          setShowUpgradeModal(true);
          setLoading(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to start scan');
      }

      // Check if there's an existing report (cached)
      if (data.cached && data.existingReport && !forceRescan) {
        setExistingReport(data.existingReport);
        setCanRescan(data.canRescan);
        setShowRescanModal(true);
        setLoading(false);
        return;
      }

      // Check if verification is required
      if (data.requiresVerification) {
        setVerificationSent(true);
        setLoading(false);
        return;
      }

      // Redirect to report page (for authenticated users or new reports)
      router.push(`/report/${data.reportId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const handleRescan = async () => {
    setShowRescanModal(false);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(fakeEvent, true);
  };

  const handleViewExisting = () => {
    if (existingReport) {
      router.push(`/report/${existingReport.id}`);
    }
  };

  // Rescan Modal
  if (showRescanModal && existingReport) {
    const reportDate = new Date(existingReport.createdAt);
    const daysAgo = Math.floor((Date.now() - reportDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="p-8 bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Report Already Exists</h3>
            <p className="text-gray-600 mb-4">
              We found an existing report for this website created {daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`}
            </p>
            {existingReport.overallScore !== null && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-600">Previous Score:</span>
                <span className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                  {existingReport.overallScore}/100
                </span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* View Existing */}
            <button
              onClick={handleViewExisting}
              className="py-4 px-6 bg-white border-2 border-gray-300 text-gray-900 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <div className="font-semibold mb-1">View Existing Report</div>
                <div className="text-xs text-gray-600">Free • See your previous analysis</div>
              </div>
            </button>

            {/* Re-analyze */}
            <button
              onClick={handleRescan}
              disabled={!canRescan}
              className="py-4 px-6 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: canRescan ? 'var(--brand-primary)' : '#9ca3af' }}
            >
              <div className="text-left">
                <div className="font-semibold mb-1">
                  {canRescan ? 'Re-analyze Now' : 'Re-analyze (Pro Only)'}
                </div>
                <div className="text-xs text-white/80">
                  {canRescan ? 'Get fresh insights' : 'Upgrade to re-scan'}
                </div>
              </div>
            </button>
          </div>

          {!canRescan && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <p className="text-sm text-gray-700 text-center">
                <strong>Pro users</strong> can re-analyze websites anytime to track improvements. Free users get 1 report per website.
              </p>
            </div>
          )}

          <button
            onClick={() => {
              setShowRescanModal(false);
              setUrl('');
              setEmail('');
            }}
            className="text-sm text-gray-500 hover:text-gray-700 mx-auto block"
          >
            ← Try a different website
          </button>
        </div>
      </div>
    );
  }

  // Upgrade Modal
  if (showUpgradeModal && upgradeOptions) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="p-8 bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Free Plan Limit Reached</h3>
            <p className="text-gray-600">
              You've already created your free report. Choose an option below to continue:
            </p>
          </div>

          {/* Pricing Options */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Starter Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900">Starter</h4>
                <p className="text-sm text-gray-600">{upgradeOptions.starter.description || 'One-time purchase'}</p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">${upgradeOptions.starter.price}</span>
                <span className="text-gray-600 ml-2">one-time</span>
              </div>
              <a
                href="#pricing"
                className="block w-full py-3 px-4 bg-gray-900 text-white text-center rounded-lg font-medium hover:bg-gray-800 transition-colors"
                onClick={() => setShowUpgradeModal(false)}
              >
                Get Starter
              </a>
            </div>

            {/* Pro Plan */}
            <div className="border-2 rounded-xl p-6 relative overflow-hidden hover:border-blue-400 transition-colors"
              style={{ borderColor: 'var(--brand-primary)' }}>
              <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg"
                style={{ backgroundColor: 'var(--brand-primary)' }}>
                POPULAR
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900">Pro</h4>
                <p className="text-sm text-gray-600">{upgradeOptions.pro.description || 'Monthly subscription'}</p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">${upgradeOptions.pro.price}</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <a
                href="#pricing"
                className="block w-full py-3 px-4 text-white text-center rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--brand-primary)' }}
                onClick={() => setShowUpgradeModal(false)}
              >
                Get Pro
              </a>
            </div>
          </div>

          <button
            onClick={() => {
              setShowUpgradeModal(false);
              setUrl('');
              setEmail('');
            }}
            className="text-sm text-gray-500 hover:text-gray-700 mx-auto block"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

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
