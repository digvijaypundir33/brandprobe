'use client';

import { useState, useEffect } from 'react';

const insights = [
  {
    id: 1,
    number: '01',
    title: (
      <>Your best feature is <span className="text-[#5B5BD5]">buried in the pricing table</span></>
    ),
    description: (
      <>We found that &apos;Advanced Analytics&apos; — the #1 reason competitors lose customers — is hidden three clicks deep. Moving it to your hero could <span className="text-[#5B5BD5] font-medium">lift conversions by 14%</span>.</>
    ),
    action: 'Restructure feature hierarchy in hero section',
  },
  {
    id: 2,
    number: '02',
    title: (
      <>AI assistants <span className="text-[#5B5BD5]">don&apos;t know you exist</span></>
    ),
    description: (
      <>When users ask ChatGPT or Perplexity for recommendations in your space, <span className="text-[#5B5BD5] font-medium">you&apos;re absent</span>. Your competitors are already optimizing for this new discovery channel.</>
    ),
    action: 'Add structured data for AI crawlers',
  },
  {
    id: 3,
    number: '03',
    title: (
      <>Your CTA <span className="text-[#5B5BD5]">disappears on mobile</span></>
    ),
    description: (
      <>The signup button uses a color that&apos;s nearly invisible on smaller screens. <span className="text-[#5B5BD5] font-medium">40% of mobile visitors</span> never see your primary action.</>
    ),
    action: 'Increase contrast ratio to 4.5:1 minimum',
  },
  {
    id: 4,
    number: '04',
    title: (
      <>You&apos;re missing the <span className="text-[#5B5BD5]">keyword surge</span></>
    ),
    description: (
      <>Your metadata targets &apos;workflow tools&apos; but ignores &apos;AI automation&apos; — a term with <span className="text-[#5B5BD5] font-medium">3x search volume growth</span> this quarter.</>
    ),
    action: 'Update meta tags with trending keywords',
  },
  {
    id: 5,
    number: '05',
    title: (
      <>Headlines talk <span className="text-[#5B5BD5]">features, not outcomes</span></>
    ),
    description: (
      <>Technical language in your H1 <span className="text-[#5B5BD5] font-medium">loses 35% of visitors</span> in 3 seconds. Users scan for benefits, not specifications.</>
    ),
    action: 'Rewrite copy around user pain points',
  },
  {
    id: 6,
    number: '06',
    title: (
      <><span className="text-[#5B5BD5]">4.2 seconds</span> is costing you customers</>
    ),
    description: (
      <>Every second of load time <span className="text-[#5B5BD5] font-medium">reduces conversions by 7%</span>. Your mobile experience is slower than 80% of competitors.</>
    ),
    action: 'Compress images and enable lazy loading',
  },
];

export default function InsideAuditSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 2) % insights.length);
        setIsVisible(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentInsights = [
    insights[currentIndex],
    insights[(currentIndex + 1) % insights.length],
  ];

  const totalDots = Math.ceil(insights.length / 2);
  const currentDot = Math.floor(currentIndex / 2);

  return (
    <section className="pt-4 pb-10 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-gray-900">
            Inside a BrandProbe Audit
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Real insights from real analyses. No fluff.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 transition-all duration-400 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {currentInsights.map((insight) => (
            <article
              key={insight.id}
              className="group relative bg-white rounded-xl md:rounded-2xl p-5 md:p-8 border border-gray-100 hover:border-gray-200 transition-colors min-h-[220px] md:min-h-[280px] flex flex-col"
            >
              {/* Large faded number */}
              <span className="absolute top-4 md:top-6 right-4 md:right-8 text-5xl md:text-7xl font-bold text-gray-100 select-none font-[family-name:var(--font-space-grotesk)]">
                {insight.number}
              </span>

              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 leading-snug pr-12 md:pr-16">
                  {insight.title}
                </h3>

                <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed mb-4 md:mb-6 flex-1">
                  {insight.description}
                </p>

                <div className="flex items-center gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-[#5B5BD5]" />
                  <span className="text-xs md:text-sm text-gray-900 font-medium">
                    {insight.action}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Minimal dots */}
        <div className="flex justify-center gap-1.5 mt-6 md:mt-10">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setCurrentIndex(index * 2);
                  setIsVisible(true);
                }, 200);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentDot === index
                  ? 'bg-gray-900 w-8'
                  : 'bg-gray-200 w-1.5 hover:bg-gray-300'
              }`}
              aria-label={`View insights ${index * 2 + 1} and ${index * 2 + 2}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
