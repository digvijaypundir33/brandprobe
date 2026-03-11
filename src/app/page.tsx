'use client';

import { useEffect, useState } from 'react';
import URLInput from '@/components/URLInput';
import ShowcaseFeatured from '@/components/ShowcaseFeatured';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
    // Fetch testimonials
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

      {/* Hero Section */}
      <main className="px-4 py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="heading-1 text-gray-900 leading-tight mb-4 sm:mb-6">
            Get real feedback on your
            <br className="hidden sm:block" />
            <span className="sm:inline block" style={{color: 'var(--brand-primary)'}}> startup website</span>
            <br className="hidden sm:block" />
            <span className="sm:inline block"> in 60 seconds</span>
          </h1>
          <p className="text-responsive-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Paste your URL. Get brutally honest insights on what&apos;s working
            and what&apos;s killing your growth. No fluff, just actionable fixes.
          </p>

          {/* Trust Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-600 px-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="whitespace-nowrap">100+ websites analyzed</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{color: 'var(--brand-primary)'}} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span className="whitespace-nowrap">60-second analysis</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="whitespace-nowrap">No signup required</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="whitespace-nowrap">No credit card</span>
            </div>
          </div>

          <div id="url-input">
            <URLInput />
          </div>
        </div>
      </main>

      {/* How It Works */}
      <section className="section-spacing px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-2 text-center text-gray-900 mb-8 sm:mb-12">
            How Our Website Marketing Analysis Tool Works
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-gap-mobile">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)'}}>
                <span className="text-xl sm:text-2xl font-bold" style={{color: 'var(--brand-primary)'}}>1</span>
              </div>
              <h3 className="heading-3 text-gray-900 mb-2">Paste Your URL</h3>
              <p className="text-responsive-base text-gray-600">
                Enter your website URL and email. That&apos;s all we need.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)'}}>
                <span className="text-xl sm:text-2xl font-bold" style={{color: 'var(--brand-primary)'}}>2</span>
              </div>
              <h3 className="heading-3 text-gray-900 mb-2">We Probe</h3>
              <p className="text-responsive-base text-gray-600">
                We analyze your messaging, SEO, content, ads, conversion, and distribution.
              </p>
            </div>
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)'}}>
                <span className="text-xl sm:text-2xl font-bold" style={{color: 'var(--brand-primary)'}}>3</span>
              </div>
              <h3 className="heading-3 text-gray-900 mb-2">You Act</h3>
              <p className="text-responsive-base text-gray-600">
                Get specific, actionable fixes you can implement this week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Showcase */}
      <ShowcaseFeatured />

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="section-spacing px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="heading-2 text-gray-900 mb-3 sm:mb-4">
                Real Founders Using BrandProbe
              </h2>
              <p className="text-responsive-base text-gray-600">Join 100+ websites analyzed and improved with BrandProbe</p>
            </div>
            <div className="grid sm:grid-cols-2 grid-gap-mobile max-w-4xl mx-auto">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-4 italic">&ldquo;{testimonial.testimonial_text}&rdquo;</p>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">{testimonial.author_name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{testimonial.author_role}</p>
                    {testimonial.website_url && (
                      <a
                        href={testimonial.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 break-all"
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

      {/* What You Get */}
      <section className="section-spacing px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-2 text-center text-gray-900 mb-3 sm:mb-4">
            What You Get: 10 Comprehensive Sections
          </h2>
          <p className="text-center text-responsive-base text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
            A complete analysis of your website covering messaging, SEO, content,
            ads, conversion, distribution, and more. 4 sections free, 6 unlock with Pro.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-gap-mobile">
            {[
              {
                title: 'Messaging & Positioning',
                desc: 'Is your message clear? Do people understand what you do?',
                free: true,
              },
              {
                title: 'SEO & Content Opportunities',
                desc: 'What keywords are you missing? What should you write about?',
                free: true,
              },
              {
                title: 'Content Strategy',
                desc: 'What content should you create to stand out?',
                free: true,
              },
              {
                title: 'Ad Angle Suggestions',
                desc: 'What hooks and angles would work for paid ads?',
                free: true,
              },
              {
                title: 'Conversion Optimization',
                desc: 'Where and why are you losing visitors?',
                free: false,
              },
              {
                title: 'Distribution Strategy',
                desc: 'Which channels should you focus on and what tone?',
                free: false,
              },
              {
                title: 'AI Search Visibility',
                desc: 'Will AI assistants like ChatGPT recommend your brand?',
                free: false,
              },
              {
                title: 'Technical Performance',
                desc: 'Are technical issues killing your SEO and conversions?',
                free: false,
              },
              {
                title: 'Brand Health',
                desc: 'How strong is your brand positioning and consistency?',
                free: false,
              },
              {
                title: 'Design Authenticity',
                desc: 'Does your design look unique or generic?',
                free: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 pr-2">{item.title}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded flex-shrink-0 ${
                      item.free
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.free ? 'FREE' : 'PRO'}
                  </span>
                </div>
                <p className="text-responsive-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
