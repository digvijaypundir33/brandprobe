'use client';

const modules = [
  {
    title: 'Messaging & Positioning',
    description: 'We analyze if your value prop is clear to a 5-year-old and if it resonates with your target persona.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    isFree: true,
    size: 'large', // spans 2 columns
  },
  {
    title: 'AI Search Visibility',
    description: 'How Perplexity and ChatGPT see your brand when users ask for recommendations.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    isFree: true,
    size: 'small',
  },
  {
    title: 'SEO & Content',
    description: 'Technical health and keyword density checks for organic ranking dominance.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    isFree: true,
    size: 'small',
  },
  {
    title: 'Technical Performance',
    description: 'Core Web Vitals and load speeds that affect your bounce rate.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    isFree: true,
    size: 'small',
  },
  {
    title: 'Ad Angle Suggestions',
    description: 'We generate high-converting ad copy angles based on your landing page\'s strongest benefits.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
    isFree: false,
    size: 'large', // spans 2 columns
  },
  {
    title: 'Conversion Optimization',
    description: 'Friction points and CTA placement fixes to drive higher signups.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    isFree: false,
    size: 'small',
  },
  {
    title: 'Design Authenticity',
    description: 'Measuring visual trust signals and brand consistency across sections.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    isFree: true,
    size: 'small',
  },
  {
    title: 'Content Strategy',
    description: 'Gap analysis on what you should write next to attract your ideal buyer.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    isFree: false,
    size: 'small',
  },
  {
    title: 'Distribution Strategy',
    description: 'Where your audience hangs out and how to reach them effectively.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    isFree: false,
    size: 'small',
  },
  {
    title: 'Brand Health',
    description: 'Sentiment analysis of how your brand is perceived across the web.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    isFree: false,
    size: 'small',
  },
];

export default function IntelligenceDeck() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            The Intelligence Deck
          </h2>
          <p className="text-gray-600 text-base">
            Every scan includes 10 deep-dive analysis modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module, index) => (
            <div
              key={index}
              className={`${
                module.size === 'large' ? 'lg:col-span-2' : ''
              } bg-white p-8 rounded-xl ${
                module.isFree ? 'ambient-shadow' : 'ghost-border'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-gray-400 text-3xl">
                  {module.icon}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    module.isFree
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                  }`}
                >
                  {module.isFree ? 'FREE' : 'PRO'}
                </span>
              </div>
              <h5 className="text-xl font-bold mb-2">
                {module.title}
              </h5>
              <p className="text-gray-600 text-sm">
                {module.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
