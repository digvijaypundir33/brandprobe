'use client';

import { motion } from 'framer-motion';
import type { BrandHealth } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';
import { getScoreColorClass } from '@/lib/utils';

interface BrandHealthCardProps {
  brandHealth: BrandHealth;
}

function getScoreBadgeColor(score: number) {
  if (score >= 75) return { bg: 'bg-[#6bff8f]', text: 'text-[#005f28]', label: 'Excellent' };
  if (score >= 50) return { bg: 'bg-[#fed01b]', text: 'text-[#594700]', label: 'Average' };
  return { bg: 'bg-[#f74b6d]', text: 'text-[#510017]', label: 'Needs Work' };
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
  const badgeColor = getScoreBadgeColor(brandHealth.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(44,47,49,0.06)] overflow-hidden"
    >
      {/* Header */}
      <div className="p-8 border-b border-[#abadaf]/15">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold text-[#2c2f31] tracking-tight">
              Brand Health
            </h1>
            <p className="text-[#595c5e] font-body text-lg">Brand perception and consistency analysis</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 ${badgeColor.bg} ${badgeColor.text} rounded-full text-xs font-label font-bold uppercase tracking-wider mb-2`}>
              {badgeColor.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-headline font-bold text-[#2c2f31]">{brandHealth.score}</span>
              <span className="text-xl text-[#595c5e] font-light">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {brandHealth.summary && (
          <div className="bg-[#eef1f3]/30 rounded-xl p-6 mb-8">
            <p className="text-[#595c5e] leading-relaxed font-body">{brandHealth.summary}</p>
          </div>
        )}

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#f8f9ff] border border-[#5B5BD5]/10 rounded-xl p-4">
            <div className="text-xs text-[#5B5BD5] uppercase tracking-wider font-label font-bold mb-2">Voice</div>
            <div className="text-xs font-body text-[#2c2f31] line-clamp-3">{toDisplayString(analysis.voiceToneAnalysis).split('.')[0]}</div>
          </div>
          <div className="bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-4">
            <div className="text-xs text-[#595c5e] uppercase tracking-wider font-label font-bold mb-2">Personality</div>
            <div className="text-xs font-body text-[#2c2f31] line-clamp-3">{toDisplayString(analysis.brandPersonality).split('.')[0]}</div>
          </div>
          <div className="bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-4">
            <div className="text-xs text-[#595c5e] uppercase tracking-wider font-label font-bold mb-2">Memorability</div>
            <div className="text-xs font-body text-[#2c2f31] line-clamp-3">{toDisplayString(analysis.memorabilityScore).split('.')[0]}</div>
          </div>
          <div className="bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-4">
            <div className="text-xs text-[#595c5e] uppercase tracking-wider font-label font-bold mb-2">Trust</div>
            <div className="text-xs font-body text-[#2c2f31] line-clamp-3">{toDisplayString(analysis.trustPerception).split('.')[0]}</div>
          </div>
        </div>

        {/* Brand Analysis */}
        <div className="mb-8 space-y-6">
          <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Brand Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Brand Consistency', content: analysis.brandConsistency, icon: 'verified' },
              { title: 'Voice & Tone', content: analysis.voiceToneAnalysis, icon: 'campaign' },
              { title: 'Visual Identity', content: analysis.visualIdentityNotes, icon: 'visibility' },
              { title: 'Competitor Differentiation', content: analysis.competitorDifferentiation, icon: 'bolt' },
            ].map((item, idx) => {
              if (!item.content) return null;
              const isFirstItem = idx === 0;
              return (
                <div
                  key={item.title}
                  className={`flex items-start gap-4 p-4 rounded-xl border ${
                    isFirstItem
                      ? 'bg-[#f8f9ff] border-[#5B5BD5]/10'
                      : 'bg-[#eef1f3]/20 border-[#abadaf]/10'
                  }`}
                >
                  <span className={`material-symbols-outlined mt-0.5 ${
                    isFirstItem ? 'text-[#5B5BD5]' : 'text-[#595c5e]'
                  }`}>
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <h4 className={`font-headline font-semibold text-sm mb-2 ${
                      isFirstItem ? 'text-[#5B5BD5]' : 'text-[#2c2f31]'
                    }`}>
                      {item.title}
                    </h4>
                    <p className="text-sm text-[#595c5e] leading-relaxed font-body">{toDisplayString(item.content)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand Personality */}
        {analysis.brandPersonality && (
          <div className="mb-8 bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl mb-4">Brand Personality</h3>
            <p className="text-sm text-[#595c5e] font-body leading-relaxed">{toDisplayString(analysis.brandPersonality)}</p>
          </div>
        )}

        {/* Trust Perception */}
        {analysis.trustPerception && (
          <div className="mb-8 bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl mb-4">Trust Perception</h3>
            <p className="text-sm text-[#595c5e] font-body leading-relaxed">{toDisplayString(analysis.trustPerception)}</p>
          </div>
        )}

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
