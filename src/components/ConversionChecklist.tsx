'use client';

import { motion } from 'framer-motion';
import type { ConversionOptimization } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';

interface ConversionChecklistProps {
  conversion: ConversionOptimization;
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
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const stringVals = Object.values(obj).filter(v => typeof v === 'string');
    if (stringVals.length > 0) return stringVals.join(' - ');
    return JSON.stringify(value);
  }
  return String(value);
}

export default function ConversionChecklist({ conversion }: ConversionChecklistProps) {
  const analysis = conversion.detailedAnalysis || {};
  const frictionPoints = analysis.frictionPoints || [];
  const trustAudit = analysis.trustSignalAudit || '';
  const ctaOpt = analysis.ctaOptimization || '';
  const pageStructure = analysis.pageStructureAnalysis || '';
  const socialProof = analysis.socialProofAssessment || '';
  const aboveFold = analysis.aboveFoldEffectiveness || '';
  const badgeColor = getScoreBadgeColor(conversion.score);

  const analysisItems = [
    { title: 'Trust Signals', content: trustAudit, icon: 'verified' },
    { title: 'CTA Optimization', content: ctaOpt, icon: 'ads_click' },
    { title: 'Page Structure', content: pageStructure, icon: 'dashboard' },
    { title: 'Social Proof', content: socialProof, icon: 'groups' },
    { title: 'Above-Fold', content: aboveFold, icon: 'visibility' },
  ];

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
              Conversion Optimization
            </h1>
            <p className="text-[#595c5e] font-body text-lg">Turn visitors into customers</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 ${badgeColor.bg} ${badgeColor.text} rounded-full text-xs font-label font-bold uppercase tracking-wider mb-2`}>
              {badgeColor.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-headline font-bold text-[#2c2f31]">{conversion.score}</span>
              <span className="text-xl text-[#595c5e] font-light">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {conversion.summary && (
          <div className="bg-[#eef1f3]/30 rounded-xl p-6 mb-8">
            <p className="text-[#595c5e] leading-relaxed font-body">{conversion.summary}</p>
          </div>
        )}

        {/* Friction Points */}
        {frictionPoints.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Friction Points to Fix</h3>
            <div className="space-y-3">
              {frictionPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg flex items-center justify-center text-sm font-headline font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#2c2f31] leading-relaxed font-body">{toDisplayString(point)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Analysis */}
        <div className="mb-8 space-y-6">
          <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Conversion Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {analysisItems.map((item, idx) => {
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
                    <p className="text-sm text-[#595c5e] leading-relaxed font-body">{item.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Issues & Quick Wins */}
        <IssuesAndQuickWins
          keyIssues={conversion.keyIssues}
          quickWins={conversion.quickWins}
          issuesTitle="Conversion Issues"
        />
      </div>
    </motion.div>
  );
}
