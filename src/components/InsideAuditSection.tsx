'use client';

export default function InsideAuditSection() {
  return (
    <section className="pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            Inside a BrandProbe Audit
          </h2>
          <p className="text-gray-600 text-base max-w-xl">
            We don&apos;t just give you a score. We give you a roadmap.
          </p>
        </div>
        <a
          href="/showcase"
          className="text-[#5B5BD5] font-bold font-[family-name:var(--font-space-grotesk)] group flex items-center gap-2 hover:gap-3 transition-all"
        >
          View Full Sample Report
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Insight Card 1 */}
        <div className="bg-white rounded-xl p-8 ambient-shadow border-l-4 border-[#5B5BD5]">
          <div className="mb-6">
            <span className="text-[#5B5BD5] font-bold text-xs uppercase tracking-widest font-[family-name:var(--font-space-grotesk)]">
              Insight #42
            </span>
            <h4 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mt-2 text-gray-900">
              &quot;The pricing table is hiding your best feature.&quot;
            </h4>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Our AI detected that your &apos;Advanced Analytics&apos; feature is buried in a sub-menu,
            yet it&apos;s the #1 reason users churn from competitors. Move it to the Hero section
            to increase CTA clicks by 14%.
          </p>
          <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">Actionable Fix</p>
              <p className="text-xs text-gray-600">
                Update Hero H2 to include Analytics value-prop.
              </p>
            </div>
          </div>
        </div>

        {/* Insight Card 2 */}
        <div className="bg-white rounded-xl p-8 ambient-shadow border-l-4 border-amber-500">
          <div className="mb-6">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest font-[family-name:var(--font-space-grotesk)]">
              SEO ALERT
            </span>
            <h4 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mt-2 text-gray-900">
              &quot;Zero mention of &apos;AI agent&apos; in your metadata.&quot;
            </h4>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            You&apos;re ranking for &apos;workflow tools&apos; but missing the &apos;AI automation&apos; surge.
            You&apos;re invisible to 60% of current high-intent search traffic in your niche.
          </p>
          <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">Priority Adjustment</p>
              <p className="text-xs text-gray-600">
                Inject latent semantic keywords into Footer and About page.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
