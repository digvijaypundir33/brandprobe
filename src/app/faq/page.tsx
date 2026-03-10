import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Frequently Asked Questions</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Everything you need to know about BrandProbe</p>

          <div className="prose prose-gray max-w-none">
            {/* General */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 sm:mt-8 mb-4 sm:mb-6">General</h2>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What is BrandProbe?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  BrandProbe is an AI-powered website analysis tool that gives you real, actionable feedback on your startup website. We analyze 10 key areas including messaging, SEO, content, conversion, and more to tell you exactly what's working and what's killing your growth.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How does BrandProbe work?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  We use AI to analyze your website across 10 key areas: messaging, SEO, content strategy, ad angles, conversion optimization, distribution, AI search visibility, technical performance, brand health, and design authenticity. You get specific, actionable recommendations for each area.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How long does the analysis take?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  About 60-90 seconds. We scrape your homepage and key subpages, then run them through our AI analysis to generate a comprehensive report.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What makes this different from other website audit tools?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Most tools focus on technical SEO or performance metrics. BrandProbe focuses on marketing strategy and growth - your positioning, messaging, content opportunities, and conversion leaks. We tell you WHY you're not growing, not just what's technically broken. Plus, you get real, honest feedback, not sugar-coated fluff.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Do I need to create an account?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  No account needed! Just enter your website URL and email. We'll send you a magic link to access your report. Simple and secure.
                </p>
              </div>
            </div>

            {/* Reports & Features */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 sm:mt-12 mb-4 sm:mb-6">Reports & Features</h2>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What's included in the free report?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Free reports include 4 full sections: Messaging, SEO, Content, and Ads. You'll see scores for all 10 sections but detailed analysis for only the free ones.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What do I get with the paid tiers?
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Starter ($9 one-time):</strong> 2 complete website analyses with all 10 sections unlocked including AI Search, Technical Performance, Brand Health, and Design Authenticity. Perfect for analyzing your main site plus one competitor or client site.
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  <strong>Pro ($29/month):</strong> 10 full reports per month, monthly auto re-scan with progress tracking, and all sections unlocked.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How do I access my report?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  After submitting your website URL and email, we'll send you a magic link. Click the link to access your report instantly. No password required!
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Can I analyze multiple websites?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Yes! Free users can generate one report per email. Pro users get 10 full reports per month, perfect for agencies or multiple projects.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Does BrandProbe analyze my entire website or just the homepage?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  We analyze your homepage and key subpages to get a complete picture of your site's messaging, content strategy, and conversion flow. The AI looks at multiple pages to provide comprehensive insights.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How accurate are the reports?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Our AI is trained on thousands of successful startup websites and marketing best practices. While no tool is 100% perfect, BrandProbe provides actionable insights based on proven growth strategies and real data.
                </p>
              </div>
            </div>

            {/* Pricing & Payments */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 sm:mt-12 mb-4 sm:mb-6">Pricing & Payments</h2>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How do I unlock the full report?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Click "Unlock for $9" on your report page for one-time access to all 10 sections, or upgrade to Pro for $29/month to get 10 full reports per month with progress tracking.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  We accept all major credit cards and PayPal through our secure payment processor. No PayPal account required - you can pay as a guest with your credit/debit card.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Can I cancel my Pro subscription?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Yes! You can cancel anytime. You'll keep access until the end of your current billing period. No questions asked.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What is your refund policy?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  All sales are final. Due to the digital nature of our reports, refunds are not available once a report has been generated and delivered. We recommend reviewing the free sections (Messaging, SEO, Content, and Ads) before purchasing to ensure our analysis meets your needs.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Is there a discount for annual subscriptions?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Currently we only offer monthly subscriptions for Pro. This gives you flexibility to cancel anytime without a long-term commitment.
                </p>
              </div>
            </div>

            {/* Showcase */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 sm:mt-12 mb-4 sm:mb-6">Showcase</h2>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What is the Showcase feature?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  The Showcase is a community platform where founders can display their startups alongside their BrandProbe analysis scores. It's a place to get discovered, share your work, and learn from other builders. Visitors can browse startups, see how they score, and get inspired by real examples.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Is the Showcase free to use?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Yes! During our launch period, the Showcase feature is <strong>completely free for all users</strong> - whether you're on the free plan, Starter, or Pro. You can showcase your startup and get visibility at no extra cost.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How do I add my startup to the Showcase?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  After running a BrandProbe analysis on your website, go to your dashboard and click "Manage Showcase." You can customize your display name, tagline, description, icon, and category. Once you enable showcase mode, your startup will appear in the public gallery for others to discover.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What information is shown publicly in the Showcase?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Your showcase listing displays your startup name, tagline, description, icon, category, overall BrandProbe score, and website URL. Your full report analysis remains private unless you choose to share it. You have full control over what information to display.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Can I edit my Showcase profile after publishing?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Yes! You can edit your showcase profile anytime from your dashboard. Update your tagline, description, icon, category, or even remove your listing from the showcase whenever you want. Changes appear instantly.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How are upvotes and views tracked?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Views are automatically tracked when someone visits your showcase listing. Upvotes allow the community to show appreciation for great startups. You can see your engagement stats (views, upvotes, comments, and engagement rate) in your showcase dashboard.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Can visitors comment on my showcase listing?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Yes! The Showcase includes a comments section where visitors can leave feedback, ask questions, or share insights about your startup. This creates an opportunity for community engagement and valuable feedback from other founders.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What is Priority Showcase?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Priority Showcase is a premium feature for Starter and Pro users. Your showcase listing gets a "Featured" badge and appears higher in the gallery, giving your startup more visibility and clicks. It's perfect for founders who want maximum exposure for their product.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Will the Showcase always be free?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  During our launch period, the Showcase is free for all users. We'll announce any future changes well in advance. Our goal is to build a thriving community of founders showcasing their work and learning from each other.
                </p>
              </div>
            </div>

            {/* Technical & Support */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 sm:mt-12 mb-4 sm:mb-6">Technical & Support</h2>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  My report is taking longer than expected. What should I do?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Most reports are ready in 60-90 seconds. If it takes longer than 5 minutes, please email us at support@brandprobe.com with your report URL and we'll investigate immediately.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  I didn't receive my magic link email. What now?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Check your spam folder first. If you still can't find it, contact us at support@brandprobe.com and we'll resend it or provide direct access to your report.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Can I download or export my report?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Yes! You can download your report as a PDF. Look for the "Download PDF" button at the top of your report page. You can also bookmark the report URL for easy web access.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How do I contact support?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Visit our{' '}
                  <a href="/contact" className="text-blue-600 hover:underline">
                    contact page
                  </a>{' '}
                  or email us at{' '}
                  <a href="mailto:support@brandprobe.com" className="text-blue-600 hover:underline">
                    support@brandprobe.com
                  </a>
                  . We typically respond within 24 hours (Monday-Friday).
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Is my data secure?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Yes! We only collect the information needed to generate your report (website URL and email). All payment processing is handled securely through PayPal. See our{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>{' '}
                  for details.
                </p>
              </div>
            </div>

            {/* Still Have Questions? */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 mt-8 sm:mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Still have questions?</h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                We're here to help! Send us an email and we'll get back to you within 24 hours.
              </p>
              <a
                href="/contact"
                className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold rounded-lg transition-opacity hover:opacity-90 touch-target"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
