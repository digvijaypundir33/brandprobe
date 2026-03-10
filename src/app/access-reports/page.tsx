'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AccessReportsPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateReportLink, setShowCreateReportLink] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowCreateReportLink(false);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if this is a "no reports" error
        if (data.redirectUrl) {
          setShowCreateReportLink(true);
        }
        throw new Error(data.message || data.error || 'Failed to send access link');
      }

      setLinkSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (linkSent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
        <Header />

        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, white)' }}>
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: 'var(--brand-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Check Your Email</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  We've sent a secure access link to <strong className="break-all">{email}</strong>
                </p>

                <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl text-left mb-6">
                  <p className="text-xs sm:text-sm text-gray-700 mb-2">
                    <strong>Next steps:</strong>
                  </p>
                  <ol className="text-xs sm:text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Check your inbox (and spam folder)</li>
                    <li>Click the access link</li>
                    <li>You'll be taken to your dashboard</li>
                  </ol>
                </div>

                <p className="text-xs text-gray-500">
                  Link expires in 15 minutes • Didn't receive it?{' '}
                  <button
                    onClick={() => {
                      setLinkSent(false);
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

            <div className="text-center mt-6">
              <Link href="/" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">
                ← Back to home
              </Link>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 px-4 py-12 sm:py-16 md:py-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="heading-2 text-gray-900 mb-3 sm:mb-4">
              Access Your Reports
            </h1>
            <p className="text-responsive-base text-gray-600">
              Enter your email to receive a secure link to view all your BrandProbe reports
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-xs sm:text-sm text-center">
                  <p className="text-red-600 mb-3">{error}</p>
                  {showCreateReportLink && (
                    <Link
                      href="/"
                      className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
                    >
                      ← Create Your First Report
                    </Link>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 px-4 text-white text-sm sm:text-base rounded-lg sm:rounded-xl font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {loading ? 'Sending...' : 'Send Access Link'}
              </button>
            </form>

            <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs sm:text-sm text-gray-600">
                  We'll email you a secure link that will log you into your dashboard. No password needed.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
