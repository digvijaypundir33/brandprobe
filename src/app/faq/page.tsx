export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">BrandProbe</span>
          </a>
          <a href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 mb-8">Everything you need to know about BrandProbe</p>

          <div className="prose prose-gray max-w-none">
            {/* General */}
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-6">General</h2>

            <div className="space-y-6 mb-12">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What is BrandProbe?
                </h3>
                <p className="text-gray-700">
                  BrandProbe is an AI-powered website analysis tool that gives you real, actionable feedback on your startup website. We analyze 10 key areas including messaging, SEO, content, conversion, and more to tell you exactly what's working and what's killing your growth.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How does BrandProbe work?
                </h3>
                <p className="text-gray-700">
                  We use AI to analyze your website across 10 key areas: messaging, SEO, content strategy, ad angles, conversion optimization, distribution, AI search visibility, technical performance, brand health, and design authenticity. You get specific, actionable recommendations for each area.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How long does the analysis take?
                </h3>
                <p className="text-gray-700">
                  About 60-90 seconds. We scrape your homepage and key subpages, then run them through our AI analysis to generate a comprehensive report.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What makes this different from other website audit tools?
                </h3>
                <p className="text-gray-700">
                  Most tools focus on technical SEO or performance metrics. BrandProbe focuses on marketing strategy and growth - your positioning, messaging, content opportunities, and conversion leaks. We tell you WHY you're not growing, not just what's technically broken. Plus, you get real, honest feedback, not sugar-coated fluff.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do I need to create an account?
                </h3>
                <p className="text-gray-700">
                  No account needed! Just enter your website URL and email. We'll send you a magic link to access your report. Simple and secure.
                </p>
              </div>
            </div>

            {/* Reports & Features */}
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Reports & Features</h2>

            <div className="space-y-6 mb-12">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What's included in the free report?
                </h3>
                <p className="text-gray-700">
                  Free reports include 4 full sections: Messaging, SEO, Content, and Ads. You'll see scores for all 10 sections but detailed analysis for only the free ones.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What do I get with the paid tiers?
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Starter ($9 one-time):</strong> Unlock all 10 sections for one report including AI Search, Technical Performance, Brand Health, and Design Authenticity.
                </p>
                <p className="text-gray-700">
                  <strong>Pro ($29/month):</strong> 10 full reports per month, monthly auto re-scan with progress tracking, and all sections unlocked.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I access my report?
                </h3>
                <p className="text-gray-700">
                  After submitting your website URL and email, we'll send you a magic link. Click the link to access your report instantly. No password required!
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I analyze multiple websites?
                </h3>
                <p className="text-gray-700">
                  Yes! Free users can generate one report per email. Pro users get 10 full reports per month, perfect for agencies or multiple projects.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Does BrandProbe analyze my entire website or just the homepage?
                </h3>
                <p className="text-gray-700">
                  We analyze your homepage and key subpages to get a complete picture of your site's messaging, content strategy, and conversion flow. The AI looks at multiple pages to provide comprehensive insights.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How accurate are the reports?
                </h3>
                <p className="text-gray-700">
                  Our AI is trained on thousands of successful startup websites and marketing best practices. While no tool is 100% perfect, BrandProbe provides actionable insights based on proven growth strategies and real data.
                </p>
              </div>
            </div>

            {/* Pricing & Payments */}
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Pricing & Payments</h2>

            <div className="space-y-6 mb-12">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I unlock the full report?
                </h3>
                <p className="text-gray-700">
                  Click "Unlock for $9" on your report page for one-time access to all 10 sections, or upgrade to Pro for $29/month to get 10 full reports per month with progress tracking.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-700">
                  We accept all major credit cards and PayPal through our secure payment processor. No PayPal account required - you can pay as a guest with your credit/debit card.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I cancel my Pro subscription?
                </h3>
                <p className="text-gray-700">
                  Yes! You can cancel anytime. You'll keep access until the end of your current billing period. No questions asked.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What is your refund policy?
                </h3>
                <p className="text-gray-700">
                  All sales are final. Due to the digital nature of our reports, refunds are not available once a report has been generated and delivered. We recommend reviewing the free sections (Messaging, SEO, Content, and Ads) before purchasing to ensure our analysis meets your needs.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a discount for annual subscriptions?
                </h3>
                <p className="text-gray-700">
                  Currently we only offer monthly subscriptions for Pro. This gives you flexibility to cancel anytime without a long-term commitment.
                </p>
              </div>
            </div>

            {/* Technical & Support */}
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Technical & Support</h2>

            <div className="space-y-6 mb-12">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  My report is taking longer than expected. What should I do?
                </h3>
                <p className="text-gray-700">
                  Most reports are ready in 60-90 seconds. If it takes longer than 5 minutes, please email us at support@brandprobe.com with your report URL and we'll investigate immediately.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  I didn't receive my magic link email. What now?
                </h3>
                <p className="text-gray-700">
                  Check your spam folder first. If you still can't find it, contact us at support@brandprobe.com and we'll resend it or provide direct access to your report.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I download or export my report?
                </h3>
                <p className="text-gray-700">
                  Yes! You can download your report as a PDF. Look for the "Download PDF" button at the top of your report page. You can also bookmark the report URL for easy web access.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I contact support?
                </h3>
                <p className="text-gray-700">
                  Email us at{' '}
                  <a href="mailto:support@brandprobe.com" className="text-blue-600 hover:underline">
                    support@brandprobe.com
                  </a>
                  . We typically respond within 24 hours (Monday-Friday).
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is my data secure?
                </h3>
                <p className="text-gray-700">
                  Yes! We only collect the information needed to generate your report (website URL and email). All payment processing is handled securely through PayPal. See our{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>{' '}
                  for details.
                </p>
              </div>
            </div>

            {/* Still Have Questions? */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
              <p className="text-gray-700 mb-4">
                We're here to help! Send us an email and we'll get back to you within 24 hours.
              </p>
              <a
                href="mailto:support@brandprobe.com"
                className="inline-block px-6 py-3 text-white font-semibold rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
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
