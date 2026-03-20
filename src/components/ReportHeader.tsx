'use client';

import { useState } from 'react';
import { getScoreInterpretation } from '@/lib/utils';
import ShareModal from './ShareModal';

interface ReportHeaderProps {
  url: string;
  overallScore: number;
  createdAt: string;
  reportId?: string;
  isPublic?: boolean;
  onPrint?: () => void;
  isSample?: boolean;
}

export default function ReportHeader({
  url,
  overallScore,
  createdAt,
  reportId,
  isPublic = true,
  onPrint,
  isSample = false,
}: ReportHeaderProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const interpretation = getScoreInterpretation(overallScore);

  // Extract domain from URL
  const getDomain = (urlString: string) => {
    try {
      return new URL(urlString).hostname;
    } catch {
      return urlString;
    }
  };

  const domain = getDomain(url);

  // Calculate gauge offset for SVG circle
  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (overallScore / 100) * circumference;

  return (
    <header className="bg-[#0F172A] rounded-2xl p-6 md:p-10 mb-8 text-white relative overflow-hidden shadow-2xl">
      {/* Glow effect */}
      <div className="header-glow" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
        {/* Left: Domain + badges + actions */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#5B5BD5]/20 text-[#5B5BD5] border border-[#5B5BD5]/30 rounded-full text-[10px] font-bold tracking-widest uppercase">
              {isSample ? 'Sample Audit' : 'Live Audit'}
            </span>
            <span className="text-slate-400 text-xs">
              Generated {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-space-grotesk)] font-bold mb-6 md:mb-8 tracking-tight break-all">
            {domain}
          </h1>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {reportId && !isSample && (
              <button
                onClick={() => {
                  if (!isPublic) {
                    alert('Please make your report public before sharing.');
                    return;
                  }
                  setShowShareModal(true);
                }}
                className="bg-[#5B5BD5] hover:bg-[#5B5BD5]/90 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-sm font-bold flex items-center gap-2 md:gap-2.5 transition-all shadow-lg shadow-[#5B5BD5]/20"
                title={!isPublic ? 'Make report public to share' : 'Share your results'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="hidden sm:inline">Share Results</span>
                <span className="sm:hidden">Share</span>
              </button>
            )}
            {onPrint && (
              <button
                onClick={onPrint}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-sm font-bold flex items-center gap-2 md:gap-2.5 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span className="hidden sm:inline">Print/PDF</span>
                <span className="sm:hidden">Print</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Score gauge */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 flex flex-row sm:flex-row items-center gap-6 md:gap-8 border border-white/10 w-full md:w-auto md:min-w-[340px]">
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 128 128">
              {/* Background circle */}
              <circle
                className="text-white/10"
                cx="64"
                cy="64"
                fill="transparent"
                r="58"
                stroke="currentColor"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                className="text-[#5B5BD5] gauge-ring"
                cx="64"
                cy="64"
                fill="transparent"
                r="58"
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                strokeWidth="10"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold">{overallScore}</span>
              <span className="text-[10px] uppercase tracking-tighter opacity-60">/ 100</span>
            </div>
          </div>

          <div className="text-left">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
              Overall Score
            </div>
            <div className="text-xl md:text-2xl font-bold text-white mb-1">
              {interpretation.label}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[160px]">
              {interpretation.description}
            </p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && reportId && (
        <ShareModal
          reportId={reportId}
          overallScore={overallScore}
          websiteUrl={url}
          onClose={() => setShowShareModal(false)}
          onShare={() => {}}
        />
      )}
    </header>
  );
}
