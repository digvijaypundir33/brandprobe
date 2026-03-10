'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ShowcaseEntry } from '@/types/report';

export default function ShowcaseFeatured() {
  const [entries, setEntries] = useState<ShowcaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/showcase/featured?limit=4');
        const data = await res.json();
        console.log('[ShowcaseFeatured] Received data:', data);
        if (data.success) {
          setEntries(data.entries);
          data.entries.forEach((entry: ShowcaseEntry) => {
            console.log(`[ShowcaseFeatured] Entry: ${entry.displayName}, isPriority: ${entry.isPriority}`);
          });
        }
      } catch (err) {
        console.error('Failed to fetch featured showcase:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Don't render if no entries or loading
  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (entries.length === 0) {
    return null;
  }

  // Track click
  const handleClick = (reportId: string) => {
    fetch(`/api/showcase/${reportId}/click`, { method: 'POST' }).catch(() => {});
  };

  // Score color based on value
  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    if (score >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number | null) => {
    if (!score) return 'bg-gray-100';
    if (score >= 70) return 'bg-green-50';
    if (score >= 50) return 'bg-yellow-50';
    if (score >= 30) return 'bg-orange-50';
    return 'bg-red-50';
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Startup Showcase
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-3">
            Founders showcasing their startups with BrandProbe analysis. See how top sites score, share your work, and learn from other builders.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-700">Free for all users during launch</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
          {entries.map((entry) => (
            <div key={entry.reportId} className="relative pt-3 min-w-0">
              <Link
                href={`/showcase/${entry.reportId}`}
                onClick={() => handleClick(entry.reportId)}
                className={`block bg-white rounded-xl border p-5 hover:shadow-lg transition-all duration-200 group relative overflow-hidden ${
                  entry.isPriority
                    ? 'border-yellow-400 ring-2 ring-yellow-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  WebkitTransform: 'translateZ(0)', // Safari fix for overflow
                  isolation: 'isolate' // Create stacking context
                }}
              >
                {/* Featured Badge */}
                {entry.isPriority && (
                  <div
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                    style={{ zIndex: 10 }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </div>
                )}

              {/* Header with Icon and Name */}
              <div className="flex items-center gap-3 mb-3 min-w-0">
                {/* Icon */}
                {entry.iconUrl ? (
                  <img
                    src={entry.iconUrl}
                    alt={entry.displayName}
                    className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0"
                    style={{ backgroundColor: 'var(--brand-primary, #2563eb)' }}
                  >
                    {entry.displayName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {entry.displayName}
                  </h3>
                  {entry.category && (
                    <span className="text-xs text-gray-500 truncate block">{entry.category}</span>
                  )}
                </div>
              </div>

              {/* Tagline */}
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[2.5rem] break-words">
                {entry.tagline}
              </p>

              {/* Screenshot */}
              {entry.screenshotUrl && (
                <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={entry.screenshotUrl}
                    alt={`${entry.displayName} screenshot`}
                    className="w-full h-32 object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).parentElement?.classList.add('hidden');
                    }}
                  />
                </div>
              )}

              {/* Score and Upvotes */}
              <div className="flex items-center justify-between">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getScoreBgColor(
                    entry.overallScore
                  )}`}
                >
                  <span className={`text-sm font-bold ${getScoreColor(entry.overallScore)}`}>
                    {entry.overallScore ?? '--'}
                  </span>
                  <span className="text-xs text-gray-500">/100</span>
                </div>

                {/* Upvotes */}
                <div className="flex items-center gap-1 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span className="text-xs font-medium">{entry.showcaseUpvotes || 0}</span>
                </div>
              </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: 'var(--brand-primary, #2563eb)' }}
          >
            Explore all startups
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
