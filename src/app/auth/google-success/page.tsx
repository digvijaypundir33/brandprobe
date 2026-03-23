'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function GoogleSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'scanning' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleSuccess = async () => {
      // Get the pending URL from sessionStorage
      const pendingUrl = sessionStorage.getItem('pendingAuditUrl');

      if (!pendingUrl) {
        // No pending URL - redirect to dashboard or home
        router.push('/dashboard');
        return;
      }

      // Get email from cookie
      const email = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_email='))
        ?.split('=')[1];

      if (!email) {
        setError('Session expired. Please try again.');
        setStatus('error');
        return;
      }

      // Clear the pending URL
      sessionStorage.removeItem('pendingAuditUrl');

      setStatus('scanning');

      try {
        // Start the scan
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: pendingUrl, email: decodeURIComponent(email) }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.requiresUpgrade && data.upgradeOptions) {
            router.push('/#pricing');
            return;
          }
          throw new Error(data.message || data.error || 'Failed to start scan');
        }

        if (data.cached && data.existingReport) {
          router.push(`/report/${data.existingReport.id}`);
          return;
        }

        // Redirect to report page
        router.push(`/report/${data.reportId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setStatus('error');
      }
    };

    handleGoogleSuccess();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
            <div className="text-center">
              {status === 'loading' && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-[#5B5BD5]/10 flex items-center justify-center mb-6">
                    <svg className="animate-spin h-8 w-8 text-[#5B5BD5]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Signing you in...</h1>
                  <p className="text-gray-600">Please wait while we set up your session.</p>
                </>
              )}

              {status === 'scanning' && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Signed in successfully!</h1>
                  <p className="text-gray-600 mb-4">Starting your website analysis...</p>
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#5B5BD5]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-gray-500">Initializing scan...</span>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-[#5B5BD5] text-white rounded-xl font-semibold hover:bg-[#4a4ac4] transition-colors"
                  >
                    Go to Home
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
