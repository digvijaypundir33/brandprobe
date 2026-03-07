'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PlansPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Failed to check auth:', error);
      }
    };
    checkAuth();
  }, []);

  const scrollToInput = () => {
    window.location.href = '/#url-input';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">BrandProbe</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="/showcase"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Showcase
            </Link>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/access-reports"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                View My Reports
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <main className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple Pricing
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees, cancel anytime.
            </p>
          </div>

          {/* Showcase Launch Offer */}
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🎉 Launch Offer: Free Showcase for Everyone
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Showcase your startup on BrandProbe with your analysis score and get discovered by other founders.
                    This feature is <strong>completely free for all users</strong> during our launch period.
                  </p>
                  <Link
                    href="/showcase"
                    className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
                  >
                    Browse the Showcase
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                $0<span className="text-lg font-normal text-gray-500">/forever</span>
              </p>
              <p className="text-gray-600 text-sm mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  1 report per email
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  4 sections visible
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  All 10 scores shown
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Preview of locked sections
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Free Showcase
                </li>
              </ul>
              <button
                onClick={scrollToInput}
                className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Starter Tier ($9) */}
            <div
              className="bg-white rounded-2xl border-2 p-8 relative"
              style={{ borderColor: 'var(--brand-primary)' }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Best Value
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                $9<span className="text-lg font-normal text-gray-500">/one-time</span>
              </p>
              <p className="text-gray-600 text-sm mb-6">2 complete website analyses</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  2 full reports
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  All 10 sections unlocked
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Complete analysis
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No subscription
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Priority Showcase
                </li>
              </ul>
              <button
                onClick={scrollToInput}
                className="w-full py-3 px-4 font-semibold text-white rounded-xl transition-colors hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Get Started
              </button>
            </div>

            {/* Pro Tier ($29/month) */}
            <div
              className="rounded-2xl p-8 text-white relative overflow-hidden"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-4">
                $29<span className="text-lg font-normal opacity-80">/month</span>
              </p>
              <p className="text-white/80 text-sm mb-6">For serious founders and marketers</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  10 reports per month
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  All 10 sections unlocked
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Monthly auto re-scan
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Priority Showcase
                </li>
              </ul>
              <button
                onClick={scrollToInput}
                className="w-full py-3 px-4 bg-white font-semibold rounded-xl transition-colors hover:bg-gray-100"
                style={{ color: 'var(--brand-primary)' }}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-2">Have questions?</p>
            <Link
              href="/faq"
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--brand-primary)' }}
            >
              View our FAQ
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">BrandProbe</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900">
                FAQ
              </Link>
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                Terms
              </Link>
              <Link href="/support" className="text-sm text-gray-600 hover:text-gray-900">
                Support
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} BrandProbe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
