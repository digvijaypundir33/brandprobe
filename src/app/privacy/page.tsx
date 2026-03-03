export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Email address for authentication and report delivery</li>
              <li>Website URLs you submit for analysis</li>
              <li>Payment information processed securely through PayPal</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Generate website analysis reports</li>
              <li>Send you magic link authentication emails</li>
              <li>Process payments and manage subscriptions</li>
              <li>Improve our services and user experience</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We take reasonable measures to protect your information from unauthorized access,
              disclosure, alteration, or destruction. All payment processing is handled securely
              through PayPal.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as your account is active or as needed to
              provide you services. You may request deletion of your data at any time.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy, please contact us at{' '}
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
