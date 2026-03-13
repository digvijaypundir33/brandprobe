import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12 px-4 mt-12 sm:mt-20 safe-bottom">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
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
              <span className="text-lg sm:text-xl font-bold text-white">BrandProbe</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">
              AI-powered marketing intelligence for startups
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/#features" className="text-xs sm:text-sm hover:text-white transition-colors block py-1">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/plans" className="text-xs sm:text-sm hover:text-white transition-colors block py-1">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/showcase" className="text-xs sm:text-sm hover:text-white transition-colors block py-1">
                  Showcase
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-xs sm:text-sm hover:text-white transition-colors block py-1">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/contact" className="text-xs sm:text-sm hover:text-white transition-colors block py-1">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/submit-testimonial" className="text-xs sm:text-sm hover:text-white transition-colors block py-1">
                  Submit Testimonial
                </Link>
              </li>
              <li>
                <Link href="/access-reports" className="text-xs sm:text-sm hover:text-white transition-colors block py-1">
                  View My Reports
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-xs sm:text-sm hover:text-white transition-colors block py-1">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/privacy" className="text-xs sm:text-sm hover:text-white transition-colors block py-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs sm:text-sm hover:text-white transition-colors block py-1">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-gray-800 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()} BrandProbe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
