export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using BrandProbe, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Service Description</h2>
            <p className="text-gray-700 mb-4">
              BrandProbe provides AI-powered website analysis and marketing insights. We offer:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Free tier: Limited report access with 4 sections visible</li>
              <li>Starter tier ($9): One-time payment for full report access (10 sections)</li>
              <li>Pro tier ($29/month): 10 full reports per month with progress tracking</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              All payments are processed securely through PayPal. By purchasing a plan, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide accurate payment information</li>
              <li>Authorize us to charge your payment method</li>
              <li>For subscriptions: Recurring monthly charges until cancelled</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Refund Policy</h2>
            <p className="text-gray-700 mb-4">
              All sales are final. Due to the digital nature of our reports, we do not offer refunds once a report has been generated and delivered. Please review the free sections before purchasing to ensure the service meets your needs.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Cancellation</h2>
            <p className="text-gray-700 mb-4">
              You may cancel your Pro subscription at any time. You will retain access until
              the end of your current billing period.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Acceptable Use</h2>
            <p className="text-gray-700 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Use the service for any illegal purposes</li>
              <li>Attempt to circumvent payment or access restrictions</li>
              <li>Abuse or overload our systems</li>
              <li>Share paid reports with unauthorized users</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              BrandProbe reports are provided "as is" for informational purposes. We make no
              guarantees about the accuracy or completeness of analysis. Results may vary.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Contact</h2>
            <p className="text-gray-700 mb-4">
              Questions about these Terms? Contact us at{' '}
              <a href="mailto:support@brandprobe.com" className="text-purple-600 hover:underline">
                support@brandprobe.com
              </a>
            </p>
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
