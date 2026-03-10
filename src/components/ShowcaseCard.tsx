'use client';

import Link from 'next/link';
import type { ShowcaseEntry } from '@/types/report';

interface ShowcaseCardProps {
  entry: ShowcaseEntry;
  onView?: () => void;
}

export default function ShowcaseCard({ entry, onView }: ShowcaseCardProps) {
  const {
    reportId,
    displayName,
    tagline,
    iconUrl,
    screenshotUrl,
    overallScore,
    category,
    showcaseViews,
    showcaseUpvotes,
    websiteUrl,
    isPriority,
  } = entry;

  // Generate a letter avatar if no icon
  const firstLetter = displayName.charAt(0).toUpperCase();

  // Score color based on value
  const getScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-200';
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleClick = () => {
    // Track click
    fetch(`/api/showcase/${reportId}/click`, { method: 'POST' }).catch(() => {});
    onView?.();
  };

  return (
    <div className="relative pt-3 min-w-0">
      <Link
        href={`/showcase/${reportId}`}
        onClick={handleClick}
        className={`block bg-white rounded-xl border p-5 hover:shadow-lg transition-all duration-200 group relative ${
          isPriority
            ? 'border-yellow-400 ring-2 ring-yellow-100'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        style={{
          WebkitTransform: 'translateZ(0)', // Safari fix for overflow
          isolation: 'isolate' // Create stacking context
        }}
      >
        {/* Featured Badge */}
        {isPriority && (
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

      {/* Header: Icon + Name + Tagline */}
      <div className="flex items-start gap-3 mb-4 min-w-0">
        {/* Icon */}
        <div className="flex-shrink-0">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={displayName}
              className="w-10 h-10 rounded-lg object-cover bg-gray-100"
              onError={(e) => {
                // Fallback to letter avatar on error
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-lg ${
              iconUrl ? 'hidden' : ''
            }`}
            style={{ backgroundColor: 'var(--brand-primary, #2563eb)' }}
          >
            {firstLetter}
          </div>
        </div>

        {/* Name + Tagline */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {displayName}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 break-words">{tagline}</p>
        </div>
      </div>

      {/* Screenshot */}
      {screenshotUrl && (
        <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={screenshotUrl}
            alt={`${displayName} screenshot`}
            className="w-full h-40 object-cover object-top"
            onError={(e) => {
              (e.target as HTMLImageElement).parentElement?.classList.add('hidden');
            }}
          />
        </div>
      )}

      {/* Score Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">BrandProbe Score</span>
          <span className="text-sm font-bold text-gray-900">
            {overallScore ?? '--'}/100
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getScoreColor(overallScore)}`}
            style={{ width: `${overallScore ?? 0}%` }}
          />
        </div>
      </div>

      {/* Footer: Category + Stats */}
      <div className="flex items-center justify-between text-sm">
        {category ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {category}
          </span>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          {/* Upvotes */}
          <div className="flex items-center gap-1 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-xs">{showcaseUpvotes || 0}</span>
          </div>
          {/* Views */}
          <div className="flex items-center gap-1 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="text-xs">{showcaseViews}</span>
          </div>
        </div>
      </div>

      {/* Website URL (subtle) */}
      <div className="mt-3 pt-3 border-t border-gray-100 min-w-0">
        <p className="text-xs text-gray-400 truncate break-all">{websiteUrl}</p>
      </div>
    </Link>
    </div>
  );
}
