import URLInput from '@/components/URLInput';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
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
          <a
            href="#pricing"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Pricing
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Paste your website.
            <br />
            <span className="text-blue-600">Know why you&apos;re not growing</span>
            <br />
            in 60 seconds.
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            BrandProbe analyzes your positioning, finds your content gaps, detects
            conversion leaks, and tells you exactly what to do this week.
          </p>

          <URLInput />
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
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Paste Your URL</h3>
              <p className="text-gray-600">
                Enter your website URL and email. That&apos;s all we need.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">We Probe</h3>
              <p className="text-gray-600">
                AI analyzes your messaging, SEO, content, ads, conversion, and distribution.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">You Act</h3>
              <p className="text-gray-600">
                Get specific, actionable fixes you can implement this week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            What You Get
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            A comprehensive 6-section analysis of your marketing with scores and actionable fixes.
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
                free: false,
              },
              {
                title: 'Ad Angle Suggestions',
                desc: 'What hooks and angles would work for paid ads?',
                free: false,
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

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple Pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                $0<span className="text-lg font-normal text-gray-500">/forever</span>
              </p>
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
                  Messaging & SEO sections
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  All scores visible
                </li>
              </ul>
              <button className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Get Started
              </button>
            </div>
            <div className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-4">
                $29<span className="text-lg font-normal text-blue-200">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  10 reports per month
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  All 6 sections unlocked
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Monthly auto re-scan
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Progress tracking
                </li>
              </ul>
              <button className="w-full py-3 px-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                Get Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'How does BrandProbe work?',
                a: 'We use AI to analyze your website\'s messaging, SEO, content, and conversion elements. We scrape your site, analyze it with our marketing intelligence engine, and deliver a detailed report with scores and actionable recommendations.',
              },
              {
                q: 'How long does the analysis take?',
                a: 'About 60-90 seconds. We scrape your homepage and key subpages, then run them through our AI analysis.',
              },
              {
                q: 'What makes this different from other website audit tools?',
                a: 'Most tools focus on technical SEO or performance. BrandProbe focuses on marketing strategy - your positioning, messaging, and growth opportunities. We tell you WHY you\'re not growing, not just what\'s broken.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your Pro subscription at any time. No questions asked.',
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
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
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BrandProbe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
