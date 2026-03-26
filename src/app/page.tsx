'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import URLInput from '@/components/URLInput';
import AnalyzedWebsitesCarousel from '@/components/AnalyzedWebsitesCarousel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorksEditorial from '@/components/HowItWorksEditorial';
import IntelligenceDeck from '@/components/IntelligenceDeck';
import InsideAuditSection from '@/components/InsideAuditSection';
import ShowcaseFeatured from '@/components/ShowcaseFeatured';
import MorphingBackground from '@/components/MorphingBackground';

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  website_url: string | null;
  testimonial_text: string;
  rating: number;
}

const rotatingTexts = [
  "Something's broken.",
  "Let's find out why.",
  "We'll fix that.",
  "Get instant clarity.",
  "Time to dig deeper.",
];

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [textIndex, setTextIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        setIsFading(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <MorphingBackground />
      <Header />

      {/* ChatCrafter Widget */}
      <Script
        id="chatcrafter-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(){if(!window.ChatCrafterWidget||window.ChatCrafterWidget("getState")!=="initialized"){window.ChatCrafterWidget=(...args)=>{if(!window.ChatCrafterWidget.q){window.ChatCrafterWidget.q=[]}window.ChatCrafterWidget.q.push(args)};window.ChatCrafterWidget=new Proxy(window.ChatCrafterWidget,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://chatcrafterai.com/widget-embed.min.js";script.id="0ff3687f-8880-4f43-a07b-6cf630ca6208";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
          `,
        }}
      />

      <main className="pt-16 md:pt-24 relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left: Content */}
          <div className="lg:col-span-6">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-gray-900 mb-6">
              <span className="whitespace-nowrap">Traffic but no customers?</span>{' '}
              <span className="relative inline-block align-baseline">
                <span
                  className="absolute left-0 top-0 text-[#5B5BD5] whitespace-nowrap transition-all duration-500"
                  style={{
                    opacity: isFading ? 0 : 1,
                    filter: isFading ? 'blur(8px)' : 'blur(0px)',
                    transform: isFading ? 'translateY(4px)' : 'translateY(0px)',
                  }}
                >
                  {rotatingTexts[textIndex]}
                </span>
                <span className="invisible whitespace-nowrap">{rotatingTexts[textIndex]}</span>
              </span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold uppercase tracking-wider">
                  No credit card
                </span>
              </div>
            </div>
          </div>

          {/* Right: Demo Video */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50">
              <iframe
                src="https://player.cloudinary.com/embed/?cloud_name=dqk3vdvee&public_id=BrandProbe__Find_What_s_Killing_Your_Growth_SaaS_Demo_pd5clj&autoplay=false"
                width="640"
                height="360"
                style={{ height: 'auto', width: '100%', aspectRatio: '640 / 360' }}
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
                frameBorder="0"
                title="BrandProbe Demo Video"
              />
            </div>
          </div>
        </section>

        {/* Recently Probed + How It Works - Combined Section */}
        <div>
          <AnalyzedWebsitesCarousel />
          <div id="how-it-works">
            <HowItWorksEditorial />
          </div>
        </div>

        {/* Intelligence Deck + Inside Audit + Testimonials - Combined Section */}
        <div>
          <IntelligenceDeck />
          <InsideAuditSection />

          {/* Startup Showcase */}
          <ShowcaseFeatured />

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <section className="pt-4 pb-10 md:pb-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="mb-6 md:mb-10">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-900">
                    Real Founders Using BrandProbe
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    Join 100+ websites analyzed and improved with BrandProbe
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                  {testimonials.slice(0, 3).map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-white p-6 md:p-10 rounded-xl border border-gray-100 shadow-sm relative"
                    >
                      {/* Stars */}
                      <div className="flex text-amber-500 mb-4 md:mb-6">
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <svg
                            key={j}
                            className="w-4 h-4 md:w-5 md:h-5 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-gray-900 font-medium italic mb-6 md:mb-10 leading-relaxed text-base md:text-lg">
                        &ldquo;{testimonial.testimonial_text}&rdquo;
                      </p>

                      {/* Author */}
                      <div className="mt-auto">
                        <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm md:text-base">
                          {testimonial.author_name}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
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
