'use client';

import { motion } from 'framer-motion';
import type { BrandHealth } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';
import { getScoreColorClass } from '@/lib/utils';

interface BrandHealthCardProps {
  brandHealth: BrandHealth;
}

// Helper to safely convert any value to string
function toDisplayString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if ('type' in obj && 'issue' in obj) {
      return `${obj.type}: ${obj.issue}`;
    }
    const stringVals = Object.values(obj).filter(v => typeof v === 'string');
    if (stringVals.length > 0) return stringVals.join(' ');
    return 'N/A';
  }
  return String(value);
}

export default function BrandHealthCard({ brandHealth }: BrandHealthCardProps) {
  const analysis = brandHealth.detailedAnalysis || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gray-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Brand Health</h2>
              <p className="text-gray-400 text-sm">Brand perception and consistency analysis</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColorClass(brandHealth.score)}`}>{brandHealth.score}</div>
            <div className="text-gray-400 text-sm">/100</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <p className="text-gray-700 text-sm">{brandHealth.summary}</p>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Voice</div>
            <div className="text-xs font-medium text-gray-800 line-clamp-3">{toDisplayString(analysis.voiceToneAnalysis).split('.')[0]}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Personality</div>
            <div className="text-xs font-medium text-gray-800 line-clamp-3">{toDisplayString(analysis.brandPersonality).split('.')[0]}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Memorability</div>
            <div className="text-xs font-medium text-gray-800 line-clamp-3">{toDisplayString(analysis.memorabilityScore).split('.')[0]}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Trust</div>
            <div className="text-xs font-medium text-gray-800 line-clamp-3">{toDisplayString(analysis.trustPerception).split('.')[0]}</div>
          </div>
        </div>

        {/* Analysis Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">Brand Consistency</h4>
            </div>
            <p className="text-xs text-gray-600">{toDisplayString(analysis.brandConsistency)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">Voice & Tone</h4>
            </div>
            <p className="text-xs text-gray-600">{toDisplayString(analysis.voiceToneAnalysis)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">Visual Identity</h4>
            </div>
            <p className="text-xs text-gray-600">{toDisplayString(analysis.visualIdentityNotes)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">Competitor Differentiation</h4>
            </div>
            <p className="text-xs text-gray-600">{toDisplayString(analysis.competitorDifferentiation)}</p>
          </div>
        </div>

        {/* Brand Personality */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-medium text-gray-800 text-sm">Brand Personality</h4>
          </div>
          <p className="text-sm text-gray-600">{toDisplayString(analysis.brandPersonality)}</p>
        </div>

        {/* Trust Perception */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h4 className="font-medium text-gray-800 text-sm">Trust Perception</h4>
          </div>
          <p className="text-sm text-gray-600">{toDisplayString(analysis.trustPerception)}</p>
        </div>

        {/* Key Issues & Quick Wins */}
        <IssuesAndQuickWins
          keyIssues={brandHealth.keyIssues}
          quickWins={brandHealth.quickWins}
          issuesTitle="Brand Issues"
        />
      </div>
    </motion.div>
  );
}
