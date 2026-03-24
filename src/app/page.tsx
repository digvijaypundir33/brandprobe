'use client';

import { useEffect, useState } from 'react';
import URLInput from '@/components/URLInput';
import AnalyzedWebsitesCarousel from '@/components/AnalyzedWebsitesCarousel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroIntelligenceDeck from '@/components/HeroIntelligenceDeck';
import HowItWorksEditorial from '@/components/HowItWorksEditorial';
import IntelligenceDeck from '@/components/IntelligenceDeck';
import InsideAuditSection from '@/components/InsideAuditSection';
import ShowcaseFeatured from '@/components/ShowcaseFeatured';

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  website_url: string | null;
  testimonial_text: string;
  rating: number;
}

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials?featured=true');
        const data = await response.json();
        if (data.success) {
          setTestimonials(data.testimonials);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Content */}
          <div className="lg:col-span-6">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.1] text-gray-900 mb-6">
              Traffic but no customers?{' '}
              <span className="text-[#5B5BD5]">Something&apos;s broken.</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
              Find out what — messaging, SEO, conversions, AI visibility. Complete audit in 60 seconds.
            </p>

            {/* URL Input */}
            <div id="url-input" className="mb-12">
              <URLInput />
            </div>

            {/* Trust Bar */}
            <div className="flex flex-wrap gap-6 items-center opacity-80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#5B5BD5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold uppercase tracking-wider">
                  100+ websites analyzed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#5B5BD5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold uppercase tracking-wider">
                  60-second analysis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#5B5BD5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold uppercase tracking-wider">
                  No signup required
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#5B5BD5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold uppercase tracking-wider">
                  No credit card
                </span>
              </div>
            </div>
          </div>

          {/* Right: Animated Hero Deck */}
          <div className="lg:col-span-6 hidden lg:block">
            <HeroIntelligenceDeck />
          </div>
        </section>

        {/* Recently Probed + How It Works - Combined Section */}
        <div className="bg-blue-50/50">
          <AnalyzedWebsitesCarousel />
          <div id="how-it-works">
            <HowItWorksEditorial />
          </div>
        </div>

        {/* Intelligence Deck + Inside Audit + Testimonials - Combined Section */}
        <div className="bg-gradient-to-b from-blue-50/80 to-white">
          <IntelligenceDeck />
          <InsideAuditSection />

          {/* Startup Showcase */}
          <ShowcaseFeatured />

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <section className="pt-4 pb-16">
              <div className="max-w-7xl mx-auto px-8">
                <div className="mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                    Real Founders Using BrandProbe
                  </h2>
                  <p className="text-gray-600 text-base">
                    Join 100+ websites analyzed and improved with BrandProbe
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.slice(0, 3).map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm relative"
                    >
                      {/* Stars */}
                      <div className="flex text-amber-500 mb-6">
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <svg
                            key={j}
                            className="w-5 h-5 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-gray-900 font-medium italic mb-10 leading-relaxed text-lg">
                        &ldquo;{testimonial.testimonial_text}&rdquo;
                      </p>

                      {/* Author */}
                      <div className="mt-auto">
                        <p className="font-[family-name:var(--font-space-grotesk)] font-bold">
                          {testimonial.author_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {testimonial.author_role}
                        </p>
                        {testimonial.website_url && (
                          <a
                            href={testimonial.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#5B5BD5] mt-1 block hover:underline"
                          >
                            {testimonial.website_url.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
