import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
          <h1 className="heading-2 text-gray-900 mb-3 sm:mb-4">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">1. Information We Collect</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 mb-4">
              <li>Email address for authentication and report delivery</li>
              <li>Website URLs you submit for analysis</li>
              <li>Payment information processed securely through PayPal</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">2. How We Use Your Information</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 mb-4">
              <li>Generate website analysis reports</li>
              <li>Send you magic link authentication emails</li>
              <li>Process payments and manage subscriptions</li>
              <li>Improve our services and user experience</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">3. Data Security</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              We take reasonable measures to protect your information from unauthorized access,
              disclosure, alteration, or destruction. All payment processing is handled securely
              through PayPal.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">4. Data Retention</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              We retain your information for as long as your account is active or as needed to
              provide you services. You may request deletion of your data at any time.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">5. Contact Us</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:support@brandprobe.com" style={{ color: 'var(--brand-primary)' }} className="hover:underline">
                support@brandprobe.com
              </a>
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                Have questions about our privacy practices? We're here to help.
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
