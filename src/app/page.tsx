'use client';

import { useEffect, useState } from 'react';
import URLInput from '@/components/URLInput';
import ShowcaseFeatured from '@/components/ShowcaseFeatured';
import Link from 'next/link';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user has a session cookie
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--brand-primary)'}}>
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
          </div>
          <div className="flex items-center gap-4">
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
            <Link
              href="/plans"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Pricing
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Get real feedback on your
            <br />
            <span style={{color: 'var(--brand-primary)'}}>startup website</span>
            <br />
            in 60 seconds
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Paste your URL. Get brutally honest insights on what&apos;s working
            and what&apos;s killing your growth. No fluff, just actionable fixes.
          </p>

          {/* Trust Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>60-second analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{color: 'var(--brand-primary)'}} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span>Most sites score 35-45/100</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>No signup required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
          </div>

          <div id="url-input">
            <URLInput />
          </div>
        </div>
      </main>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)'}}>
                <span className="text-2xl font-bold" style={{color: 'var(--brand-primary)'}}>1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Paste Your URL</h3>
              <p className="text-gray-600">
                Enter your website URL and email. That&apos;s all we need.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)'}}>
                <span className="text-2xl font-bold" style={{color: 'var(--brand-primary)'}}>2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">We Probe</h3>
              <p className="text-gray-600">
                AI analyzes your messaging, SEO, content, ads, conversion, and distribution.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)'}}>
                <span className="text-2xl font-bold" style={{color: 'var(--brand-primary)'}}>3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">You Act</h3>
              <p className="text-gray-600">
                Get specific, actionable fixes you can implement this week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Showcase */}
      <ShowcaseFeatured />

      {/* What You Get */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            What You Get: 10 Comprehensive Sections
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            A complete analysis of your website covering messaging, SEO, content,
            ads, conversion, distribution, and more. 4 sections free, 6 unlock with Pro.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Messaging & Positioning',
                desc: 'Is your message clear? Do people understand what you do?',
                free: true,
              },
              {
                title: 'SEO & Content Opportunities',
                desc: 'What keywords are you missing? What should you write about?',
                free: true,
              },
              {
                title: 'Content Strategy',
                desc: 'What content should you create to stand out?',
                free: true,
              },
              {
                title: 'Ad Angle Suggestions',
                desc: 'What hooks and angles would work for paid ads?',
                free: true,
              },
              {
                title: 'Conversion Optimization',
                desc: 'Where and why are you losing visitors?',
                free: false,
              },
              {
                title: 'Distribution Strategy',
                desc: 'Which channels should you focus on and what tone?',
                free: false,
              },
              {
                title: 'AI Search Visibility',
                desc: 'Will AI assistants like ChatGPT recommend your brand?',
                free: false,
              },
              {
                title: 'Technical Performance',
                desc: 'Are technical issues killing your SEO and conversions?',
                free: false,
              },
              {
                title: 'Brand Health',
                desc: 'How strong is your brand positioning and consistency?',
                free: false,
              },
              {
                title: 'Design Authenticity',
                desc: 'Does your design look unique or generic?',
                free: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      item.free
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.free ? 'FREE' : 'PRO'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{backgroundColor: 'var(--brand-primary)'}}>
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
              <a href="/faq" className="text-sm text-gray-600 hover:text-gray-900">
                FAQ
              </a>
              <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy
              </a>
              <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                Terms
              </a>
              <a href="/support" className="text-sm text-gray-600 hover:text-gray-900">
                Support
              </a>
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
