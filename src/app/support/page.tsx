import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
          <h1 className="heading-2 text-gray-900 mb-3 sm:mb-4">Support</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">We're here to help!</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">Get in Touch</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Have questions, feedback, or need assistance? We'd love to hear from you.
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Email Support</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                Send us an email at{' '}
                <a href="mailto:support@brandprobe.com" style={{ color: 'var(--brand-primary)' }} className="hover:underline font-semibold">
                  support@brandprobe.com
                </a>
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                We typically respond within 24 hours (Monday-Friday)
              </p>
              <Link
                href="/contact"
                className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Contact Us
              </Link>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">Frequently Asked Questions</h2>

            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How do I access my report?
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  After submitting your website URL, we'll send you a magic link via email.
                  Click the link to access your report instantly.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What's included in the free report?
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Free reports include 4 sections: Messaging, SEO, Content, and Ads.
                  You'll see scores for all 10 sections but only detailed
                  analysis for the free ones.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How do I unlock the full report?
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Click "Unlock for $9" on your report page for one-time access, or upgrade
                  to Pro for $29/month to get 10 full reports per month.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Can I cancel my Pro subscription?
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Yes! You can cancel anytime. You'll keep access until the end of your
                  current billing period.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How long does analysis take?
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Most reports are ready in 60 seconds. We analyze your website content,
                  SEO, messaging, and more using AI.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What is your refund policy?
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  All sales are final. Due to the digital nature of our reports, refunds are not available once a report has been generated. We recommend reviewing the free sections before purchasing to ensure the service meets your needs.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 sm:mt-12 mb-3 sm:mb-4">Payment Issues</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Having trouble with payment? Here are common solutions:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 mb-4">
              <li>Make sure you're using a valid PayPal account or credit card</li>
              <li>Check that your payment method has sufficient funds</li>
              <li>Try using an incognito/private window if you're logged into PayPal</li>
              <li>Contact us if the issue persists - we'll help resolve it quickly</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 sm:mt-12 mb-3 sm:mb-4">Report Issues</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              If your report:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 mb-4">
              <li>Takes longer than 5 minutes to generate</li>
              <li>Shows incorrect information</li>
              <li>Is missing sections or data</li>
            </ul>
            <p className="text-sm sm:text-base text-gray-700">
              Please email us the report URL and we'll investigate immediately.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
