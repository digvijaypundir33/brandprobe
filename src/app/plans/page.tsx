'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PlansPage() {
  const scrollToInput = () => {
    window.location.href = '/#url-input';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* Pricing Section */}
      <main className="py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="heading-1 text-gray-900 mb-3 sm:mb-4">
              Simple Pricing
            </h1>
            <p className="text-responsive-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees, cancel anytime.
            </p>
          </div>

          {/* Showcase Launch Offer */}
          <div className="mb-8 sm:mb-12 max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    🎉 Launch Offer: Free Showcase for Everyone
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-3">
                    Showcase your startup on BrandProbe with your analysis score and get discovered by other founders.
                    This feature is <strong>completely free for all users</strong> during our launch period.
                  </p>
                  <Link
                    href="/showcase"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-green-700 hover:text-green-800"
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Free</h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                $0<span className="text-base sm:text-lg font-normal text-gray-500">/forever</span>
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mb-6">Perfect for getting started</p>
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
              className="bg-white rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 relative"
              style={{ borderColor: 'var(--brand-primary)' }}
            >
              <div
                className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Best Value
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Starter</h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                $9<span className="text-base sm:text-lg font-normal text-gray-500">/one-time</span>
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mb-6">2 complete website analyses</p>
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
              className="rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden sm:col-span-2 lg:col-span-1"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                Popular
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Pro</h3>
              <p className="text-3xl sm:text-4xl font-bold mb-4">
                $29<span className="text-base sm:text-lg font-normal opacity-80">/month</span>
              </p>
              <p className="text-white/80 text-xs sm:text-sm mb-6">For serious founders and marketers</p>
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
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-sm sm:text-base text-gray-600 mb-2">Have questions?</p>
            <Link
              href="/faq"
              className="text-xs sm:text-sm font-medium hover:underline"
              style={{ color: 'var(--brand-primary)' }}
            >
              View our FAQ
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
