'use client';

export default function HeroIntelligenceDeck() {
  return (
    <div className="relative aspect-square flex items-center justify-center">
      <div className="w-full max-w-lg bg-blue-50/50 rounded-3xl p-8 relative overflow-hidden border border-white/40 shadow-2xl">
        {/* Browser Frame */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[460px] flex flex-col relative border border-slate-100">
          {/* Traffic Lights */}
          <div className="h-10 bg-slate-50 border-b border-slate-100 px-4 flex items-center gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <div className="ml-4 h-5 w-48 bg-slate-200/50 rounded-full"></div>
          </div>

          {/* Dynamic Content Area */}
          <div className="p-6 flex-grow relative overflow-hidden bg-white">
            {/* Group 1: Messaging, SEO, Content Strategy */}
            <div className="deck-group space-y-4 p-6">
              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-start gap-4 transform -rotate-1">
                <span className="text-[#5B5BD5] bg-[#5B5BD5]/10 p-2 rounded-lg text-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
                <div>
                  <h6 className="font-bold text-sm font-[family-name:var(--font-space-grotesk)]">Messaging &amp; Positioning</h6>
                  <div className="h-1.5 w-24 bg-slate-100 rounded-full mt-2">
                    <div className="h-full bg-[#5B5BD5] w-2/3 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-start gap-4 transform rotate-2 ml-4">
                <span className="text-[#5B5BD5] bg-[#5B5BD5]/10 p-2 rounded-lg text-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <div>
                  <h6 className="font-bold text-sm font-[family-name:var(--font-space-grotesk)]">SEO &amp; Content</h6>
                  <p className="text-[10px] text-slate-400 mt-1">High Intent Keywords: Found (12)</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-start gap-4 transform -rotate-1">
                <span className="text-[#5B5BD5] bg-[#5B5BD5]/10 p-2 rounded-lg text-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                <div>
                  <h6 className="font-bold text-sm font-[family-name:var(--font-space-grotesk)]">Content Strategy</h6>
                  <div className="flex gap-1 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Group 2: Ad Angles, Conversion, Distribution */}
            <div className="deck-group space-y-4 p-6">
              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-start gap-4 transform rotate-1">
                <span className="text-[#5B5BD5] bg-[#5B5BD5]/10 p-2 rounded-lg text-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </span>
                <div>
                  <h6 className="font-bold text-sm font-[family-name:var(--font-space-grotesk)]">Ad Angles</h6>
                  <p className="text-[10px] text-slate-400 mt-1">3 New Conversion Angles Generated</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-start gap-4 transform -rotate-2">
                <span className="text-[#5B5BD5] bg-[#5B5BD5]/10 p-2 rounded-lg text-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </span>
                <div>
                  <h6 className="font-bold text-sm font-[family-name:var(--font-space-grotesk)]">Conversion</h6>
                  <div className="h-1.5 w-32 bg-slate-100 rounded-full mt-2">
                    <div className="h-full bg-amber-400 w-1/2 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-start gap-4 transform rotate-1">
                <span className="text-[#5B5BD5] bg-[#5B5BD5]/10 p-2 rounded-lg text-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </span>
                <div>
                  <h6 className="font-bold text-sm font-[family-name:var(--font-space-grotesk)]">Distribution</h6>
                  <p className="text-[10px] text-slate-400 mt-1">Target: IndieHackers &amp; Twitter</p>
                </div>
              </div>
            </div>

            {/* Group 3: AI Search, Technical, Brand Health */}
            <div className="deck-group space-y-4 p-6">
              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-start gap-4 transform -rotate-1">
                <span className="text-[#5B5BD5] bg-[#5B5BD5]/10 p-2 rounded-lg text-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                <div>
                  <h6 className="font-bold text-sm font-[family-name:var(--font-space-grotesk)]">AI Search Visibility</h6>
                  <p className="text-[10px] italic text-slate-400 mt-1">&quot;Perceived as modern &amp; fast&quot;</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-start gap-4 transform rotate-2">
                <span className="text-[#5B5BD5] bg-[#5B5BD5]/10 p-2 rounded-lg text-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <div>
                  <h6 className="font-bold text-sm font-[family-name:var(--font-space-grotesk)]">Technical Performance</h6>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-emerald-500">98/100</span>
                    <div className="h-1 w-16 bg-emerald-100 rounded-full">
                      <div className="h-full bg-emerald-500 w-[98%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-start gap-4">
                <span className="text-[#5B5BD5] bg-[#5B5BD5]/10 p-2 rounded-lg text-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </span>
                <div>
                  <h6 className="font-bold text-sm font-[family-name:var(--font-space-grotesk)]">Brand Health</h6>
                  <div className="flex gap-1 mt-2 text-rose-400">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Group 4: Design Authenticity (centered, larger) */}
            <div className="deck-group space-y-4 p-6">
              <div className="bg-white p-8 rounded-xl shadow-md border border-slate-100 flex flex-col items-center justify-center gap-4 transform transition-all">
                <span className="text-[#5B5BD5] bg-[#5B5BD5]/10 p-4 rounded-full text-4xl">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </span>
                <div className="text-center">
                  <h6 className="font-bold text-lg font-[family-name:var(--font-space-grotesk)]">Design Authenticity</h6>
                  <p className="text-xs text-slate-400 mt-2 max-w-[200px]">Measuring visual trust signals and brand consistency across sections.</p>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full">
                  <div className="h-full bg-[#5B5BD5] w-[88%] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar & Status */}
          <div className="bg-slate-50 border-t border-slate-100 p-4 shrink-0">
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-[#5B5BD5] w-0 rounded-full inner-progress-bar"></div>
            </div>
            <p className="dynamic-status text-[10px] font-bold text-[#5B5BD5] uppercase tracking-[0.15em] text-center font-[family-name:var(--font-space-grotesk)]"></p>
          </div>
        </div>
      </div>
    </div>
  );
}
