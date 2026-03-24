'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const urlParam = searchParams.get('url');
  const decodedUrl = urlParam ? decodeURIComponent(urlParam) : null;
  const hostname = decodedUrl ? new URL(decodedUrl).hostname : null;

  // Redirect if no URL provided
  useEffect(() => {
    if (!urlParam) {
      router.push('/');
    }
  }, [urlParam, router]);

  const handleGoogleSignIn = () => {
    if (decodedUrl) {
      sessionStorage.setItem('pendingAuditUrl', decodedUrl);
    }
    window.location.href = '/api/auth/google';
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
        body: JSON.stringify({ url: decodedUrl, email: trimmedEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresUpgrade && data.upgradeOptions) {
          // Redirect to pricing with upgrade info
          router.push('/pricing');
          return;
        }
        throw new Error(data.message || data.error || 'Failed to start scan');
      }

      if (data.cached && data.existingReport) {
        // Redirect to existing report
        router.push(`/report/${data.existingReport.id}`);
        return;
      }

      if (data.requiresVerification) {
        setVerificationSent(true);
        setLoading(false);
        return;
      }

      // Redirect to report page
      router.push(`/report/${data.reportId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  if (!urlParam) {
    return null;
  }

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="pt-32 pb-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#5B5BD5]/10 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#5B5BD5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                <p className="text-gray-600 mb-6">
                  We&apos;ve sent a magic link to <strong>{email}</strong>
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left mb-6">
                  <p className="text-sm text-gray-700 mb-2 font-medium">Next steps:</p>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Check your inbox (and spam folder)</li>
                    <li>Click the magic link</li>
                    <li>Your report will start generating</li>
                  </ol>
                </div>

                <p className="text-xs text-gray-500">
                  Link expires in 15 minutes.{' '}
                  <button
                    onClick={() => setVerificationSent(false)}
                    className="text-[#5B5BD5] font-medium hover:underline"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to continue</h1>
              <p className="text-gray-600">
                Analyzing <span className="font-medium text-gray-900">{hostname}</span>
              </p>
            </div>

            {/* Auth Options */}
            <div className="space-y-4">
              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or continue with email</span>
                </div>
              </div>

              {/* Magic Link Form */}
              <form onSubmit={handleMagicLinkSubmit} className="space-y-3">
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B5BD5]/20 focus:border-[#5B5BD5] transition-all"
                    disabled={loading}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3.5 bg-[#5B5BD5] text-white rounded-xl font-semibold hover:bg-[#4a4ac4] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending magic link...
                    </span>
                  ) : (
                    'Send Magic Link'
                  )}
                </button>
              </form>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-[#5B5BD5] hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[#5B5BD5] hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#5B5BD5] border-t-transparent rounded-full"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
