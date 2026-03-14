'use client';

import { useState, useEffect } from 'react';
import type { ShowcaseEntry } from '@/types/report';
import AnalysisCard from './AnalysisCard';

export default function AnalyzedWebsitesCarousel() {
  const [entries, setEntries] = useState<ShowcaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch all analyzed sites
  useEffect(() => {
    fetch('/api/showcase/extremes')
      .then(res => res.json())
      .then(data => {
        console.log('[CAROUSEL] API response:', data);
        if (data.success && data.entries && data.entries.length > 0) {
          console.log('[CAROUSEL] Setting entries:', data.entries.length);
          // Duplicate for seamless loop
          setEntries([...data.entries, ...data.entries]);
        } else {
          console.log('[CAROUSEL] No entries found');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('[CAROUSEL] Failed to fetch carousel entries:', error);
        setLoading(false);
      });
  }, []);

  console.log('[CAROUSEL] Render state:', { loading, entriesCount: entries.length });

  // Don't render if no entries
  if (loading || entries.length === 0) return null;

  // Calculate animation distance based on number of unique entries
  const uniqueCount = entries.length / 2;
  const cardWidth = 320 + 24; // w-80 = 320px, gap-6 = 24px
  const animationDistance = uniqueCount * cardWidth;

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
      <section className="py-12 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Recently Analyzed Websites
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Real scans from our community showing the range of scores
        </p>
      </div>

      {/* Infinite scroll container */}
      <div className="relative">
        <div
          className="flex gap-6"
          style={{
            animation: 'scroll 40s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {entries.map((entry, index) => (
            <AnalysisCard key={`${entry.reportId}-${index}`} entry={entry} />
          ))}
        </div>

        {/* Gradient fades on edges */}
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-blue-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
      </section>
    </>
  );
}
