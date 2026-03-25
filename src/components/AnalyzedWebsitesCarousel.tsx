'use client';

import { useState, useEffect } from 'react';
import type { ShowcaseEntry } from '@/types/report';
import ReportPreviewModal from './ReportPreviewModal';

function getScoreStatus(score: number | null): { label: string; className: string; color: string } {
  if (score === null) return { label: 'Analyzing', className: 'bg-slate-50 text-slate-600', color: '#94a3b8' };
  if (score >= 70) return { label: 'Optimized', className: 'bg-emerald-50 text-emerald-600', color: '#10b981' };
  if (score >= 50) return { label: 'Needs Work', className: 'bg-amber-50 text-amber-600', color: '#f59e0b' };
  return { label: 'Critical SEO', className: 'bg-rose-50 text-rose-600', color: '#ef4444' };
}

function ScoreRing({ score, color }: { score: number | null; color: string }) {
  const size = 40;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((score ?? 0) / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-slate-700 font-[family-name:var(--font-space-grotesk)]">
          {score ?? '--'}
        </span>
      </div>
    </div>
  );
}

interface SelectedEntry {
  reportId: string;
  url: string;
  displayName: string;
  overallScore: number | null;
}

export default function AnalyzedWebsitesCarousel() {
  const [entries, setEntries] = useState<ShowcaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<SelectedEntry | null>(null);

  useEffect(() => {
    fetch('/api/showcase/extremes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.entries && data.entries.length > 0) {
          // Triple the entries for seamless infinite loop
          setEntries([...data.entries, ...data.entries, ...data.entries]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch carousel entries:', error);
        setLoading(false);
      });
  }, []);

  if (loading || entries.length === 0) return null;

  const uniqueCount = entries.length / 3;
  const cardWidth = 260 + 32; // Card width + gap
  const animationDistance = uniqueCount * cardWidth;

  const handleCardClick = (entry: ShowcaseEntry, displayName: string) => {
    setSelectedEntry({
      reportId: entry.reportId,
      url: entry.url,
      displayName,
      overallScore: entry.overallScore,
    });
  };

  return (
    <>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${animationDistance}px);
          }
        }
      `}</style>
      <section className="py-8 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-[10px] font-bold uppercase tracking-[0.25em] text-gray-700 mb-6 md:mb-10">
            Recently Probed
          </h3>

          <div
            className="flex flex-nowrap gap-8 pb-8 no-scrollbar"
            style={{
              animation: 'scroll 40s linear infinite',
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {entries.map((entry, index) => {
              const status = getScoreStatus(entry.overallScore);
              const displayName = entry.displayName || new URL(entry.url).hostname;

              return (
                <button
                  key={`${entry.reportId}-${index}`}
                  onClick={() => handleCardClick(entry, displayName)}
                  className="group min-w-[260px] bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4 border border-slate-100/50 text-left cursor-pointer"
                >
                  <ScoreRing score={entry.overallScore} color={status.color} />
                  <div>
                    <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-slate-900">
                      {displayName}
                    </p>
                    <span
                      className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {selectedEntry && (
        <ReportPreviewModal
          reportId={selectedEntry.reportId}
          websiteUrl={selectedEntry.url}
          displayName={selectedEntry.displayName}
          overallScore={selectedEntry.overallScore}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </>
  );
}
