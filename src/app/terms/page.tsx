import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
          <h1 className="heading-2 text-gray-900 mb-3 sm:mb-4">Terms of Service</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">1. Acceptance of Terms</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              By accessing and using BrandProbe, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">2. Service Description</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              BrandProbe provides AI-powered website analysis and marketing insights. We offer:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 mb-4">
              <li>Free tier: Limited report access with 4 sections visible</li>
              <li>Starter tier ($9): One-time payment for full report access (10 sections)</li>
              <li>Pro tier ($29/month): 10 full reports per month with progress tracking</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">3. Payment Terms</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              All payments are processed securely through PayPal. By purchasing a plan, you agree to:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 mb-4">
              <li>Provide accurate payment information</li>
              <li>Authorize us to charge your payment method</li>
              <li>For subscriptions: Recurring monthly charges until cancelled</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">4. Refund Policy</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              All sales are final. Due to the digital nature of our reports, we do not offer refunds once a report has been generated and delivered. Please review the free sections before purchasing to ensure the service meets your needs.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">5. Cancellation</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              You may cancel your Pro subscription at any time. You will retain access until
              the end of your current billing period.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">6. Acceptable Use</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 mb-4">
              <li>Use the service for any illegal purposes</li>
              <li>Attempt to circumvent payment or access restrictions</li>
              <li>Abuse or overload our systems</li>
              <li>Share paid reports with unauthorized users</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">7. Disclaimer</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              BrandProbe reports are provided "as is" for informational purposes. We make no
              guarantees about the accuracy or completeness of analysis. Results may vary.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">8. Contact</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Questions about these Terms? Contact us at{' '}
              <a href="mailto:support@brandprobe.com" style={{ color: 'var(--brand-primary)' }} className="hover:underline">
                support@brandprobe.com
              </a>
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Need Clarification?</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                Have questions about our terms of service? We're happy to help.
              </p>
              <Link
                href="/contact"
                className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Contact Us
              </Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
