'use client';

import { ReactNode } from 'react';

interface LockedSectionOverlayProps {
  children: ReactNode;
  title: string;
  description: string;
  onUnlock: () => void;
  ctaText?: string;
}

export default function LockedSectionOverlay({
  children,
  title,
  description,
  onUnlock,
  ctaText = 'Upgrade to Pro for $29/mo',
}: LockedSectionOverlayProps) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-soft relative overflow-hidden group">
      {/* Blurred content */}
      <div className="locked-blur">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] p-6 md:p-10 text-center">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 md:mb-6 border border-slate-100 transform group-hover:scale-110 transition-transform duration-500">
          <svg className="w-7 h-7 md:w-8 md:h-8 text-[#5B5BD5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-space-grotesk)] font-bold text-slate-900 mb-2 md:mb-3">
          {title}
        </h3>

        <p className="max-w-md text-slate-600 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
          {description}
        </p>

        <button
          onClick={onUnlock}
          className="bg-[#5B5BD5] hover:bg-[#4a4ac4] text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold shadow-xl shadow-[#5B5BD5]/30 transition-all active:scale-95"
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
}

// Placeholder content for locked sections
export function LockedPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-10">
        <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl">
          Section Content
        </h3>
        <div className="text-4xl font-bold text-slate-200">--</div>
      </div>
      <div className="space-y-6">
        <div className="h-4 bg-slate-100 rounded-full w-full" />
        <div className="h-4 bg-slate-100 rounded-full w-3/4" />
        <div className="h-32 bg-slate-50 rounded-2xl w-full border border-slate-100" />
      </div>
    </div>
  );
}
