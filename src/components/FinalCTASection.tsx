'use client';

export default function FinalCTASection() {
  const scrollToInput = () => {
    const urlInput = document.getElementById('url-input');
    if (urlInput) {
      urlInput.scrollIntoView({ behavior: 'smooth' });
      const input = urlInput.querySelector('input');
      if (input) {
        setTimeout(() => input.focus(), 500);
      }
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <div className="bg-gradient-to-r from-[#5B5BD5] to-[#7B7BE5] rounded-xl p-10 md:p-16 text-center text-white">
        <h2 className="text-2xl md:text-4xl font-bold mb-6">
          Stop guessing, start probing.
        </h2>
        <p className="text-base md:text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Join 1,000+ founders who use BrandProbe to refine their marketing intelligence weekly.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={scrollToInput}
            className="bg-white text-[#5B5BD5] px-10 py-5 rounded-xl font-[family-name:var(--font-space-grotesk)] font-bold text-xl hover:scale-105 transition-transform"
          >
            Analyze My Site Now
          </button>
          <a
            href="/pricing"
            className="bg-transparent border-2 border-white/30 px-10 py-5 rounded-xl font-[family-name:var(--font-space-grotesk)] font-bold text-xl hover:bg-white/10 transition-all"
          >
            View Pricing
          </a>
        </div>
      </div>
    </section>
  );
}
