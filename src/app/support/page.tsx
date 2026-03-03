export default function SupportPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support</h1>
          <p className="text-gray-600 mb-8">We're here to help!</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-4">
              Have questions, feedback, or need assistance? We'd love to hear from you.
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Email Support</h3>
              <p className="text-gray-700 mb-4">
                Send us an email at{' '}
                <a href="mailto:support@brandprobe.com" className="text-purple-600 hover:underline font-semibold">
                  support@brandprobe.com
                </a>
              </p>
              <p className="text-gray-600 text-sm">
                We typically respond within 24 hours (Monday-Friday)
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I access my report?
                </h3>
                <p className="text-gray-700">
                  After submitting your website URL, we'll send you a magic link via email.
                  Click the link to access your report instantly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What's included in the free report?
                </h3>
                <p className="text-gray-700">
                  Free reports include 4 sections: Messaging, SEO, Content, and Ads.
                  You'll see scores for all 10 sections but only detailed
                  analysis for the free ones.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I unlock the full report?
                </h3>
                <p className="text-gray-700">
                  Click "Unlock for $9" on your report page for one-time access, or upgrade
                  to Pro for $29/month to get 10 full reports per month.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I cancel my Pro subscription?
                </h3>
                <p className="text-gray-700">
                  Yes! You can cancel anytime. You'll keep access until the end of your
                  current billing period.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How long does analysis take?
                </h3>
                <p className="text-gray-700">
                  Most reports are ready in 60 seconds. We analyze your website content,
                  SEO, messaging, and more using AI.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What is your refund policy?
                </h3>
                <p className="text-gray-700">
                  All sales are final. Due to the digital nature of our reports, refunds are not available once a report has been generated. We recommend reviewing the free sections before purchasing to ensure the service meets your needs.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Payment Issues</h2>
            <p className="text-gray-700 mb-4">
              Having trouble with payment? Here are common solutions:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Make sure you're using a valid PayPal account or credit card</li>
              <li>Check that your payment method has sufficient funds</li>
              <li>Try using an incognito/private window if you're logged into PayPal</li>
              <li>Contact us if the issue persists - we'll help resolve it quickly</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Report Issues</h2>
            <p className="text-gray-700 mb-4">
              If your report:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Takes longer than 5 minutes to generate</li>
              <li>Shows incorrect information</li>
              <li>Is missing sections or data</li>
            </ul>
            <p className="text-gray-700">
              Please email us the report URL and we'll investigate immediately.
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
