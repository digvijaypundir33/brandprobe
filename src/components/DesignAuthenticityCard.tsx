'use client';

import { motion } from 'framer-motion';
import type { DesignAuthenticity } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';

interface DesignAuthenticityCardProps {
  designAuth: DesignAuthenticity;
}

function getScoreBadgeColor(score: number) {
  if (score >= 75) return { bg: 'bg-[#6bff8f]', text: 'text-[#005f28]', label: 'Excellent' };
  if (score >= 50) return { bg: 'bg-[#fed01b]', text: 'text-[#594700]', label: 'Average' };
  return { bg: 'bg-[#f74b6d]', text: 'text-[#510017]', label: 'Needs Work' };
}

export default function DesignAuthenticityCard({ designAuth }: DesignAuthenticityCardProps) {
  const analysis = designAuth.detailedAnalysis || {};
  const badgeColor = getScoreBadgeColor(designAuth.score);

  // Safely handle arrays with Array.isArray() checks
  const clichePhrases = Array.isArray(analysis.clichePhrasesDetected)
    ? analysis.clichePhrasesDetected
    : [];
  const iconLibs = Array.isArray(analysis.iconLibrariesFound)
    ? analysis.iconLibrariesFound
    : [];
  const recommendations = Array.isArray(analysis.recommendations)
    ? analysis.recommendations
    : [];

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
              Design Authenticity
            </h1>
            <p className="text-[#595c5e] font-body text-lg">AI pattern detection & originality analysis</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 ${badgeColor.bg} ${badgeColor.text} rounded-full text-xs font-label font-bold uppercase tracking-wider mb-2`}>
              {badgeColor.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-headline font-bold text-[#2c2f31]">{designAuth.score}</span>
              <span className="text-xl text-[#595c5e] font-light">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {designAuth.summary && (
          <div className="bg-[#eef1f3]/30 rounded-xl p-6 mb-8">
            <p className="text-[#595c5e] leading-relaxed font-body">{designAuth.summary}</p>
          </div>
        )}

        {/* Authenticity Rating Badge */}
        <div className="mb-8 flex items-center justify-center">
          <div className="px-6 py-3 rounded-full font-label font-semibold text-sm bg-[#f8f9ff] text-[#5B5BD5] border border-[#5B5BD5]/10">
            {analysis.authenticityRating || 'Analysis Pending'}
          </div>
        </div>

        {/* Screenshot (if available) */}
        {analysis.screenshotUrl && (
          <div className="mb-8">
            <h4 className="font-headline font-semibold text-[#2c2f31] text-sm mb-3 uppercase tracking-wider">Website Preview</h4>
            <div className="border border-[#abadaf]/10 rounded-xl overflow-hidden">
              <img
                src={analysis.screenshotUrl as string}
                alt="Website screenshot"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Cliché Phrases */}
          <div className="bg-[#f8f9ff] border border-[#5B5BD5]/10 rounded-xl p-4">
            <div className="text-xs text-[#5B5BD5] uppercase tracking-wider font-label font-bold mb-2">Cliché Phrases</div>
            <div className="text-2xl font-headline font-bold text-[#2c2f31] mb-1">{analysis.clicheCount || 0}</div>
            <div className="text-xs font-label font-medium uppercase text-[#595c5e]">
              {analysis.clicheSeverity || 'none'} severity
            </div>
          </div>

          {/* Layout Analysis */}
          <div className="bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-4">
            <div className="text-xs text-[#595c5e] uppercase tracking-wider font-label font-bold mb-2">Layout</div>
            <div className="text-sm font-headline font-semibold text-[#2c2f31] mb-1 capitalize">
              {analysis.layoutAuthenticity || 'N/A'}
            </div>
            <div className="text-xs text-[#595c5e] font-body line-clamp-2">
              {analysis.layoutPattern || 'Pattern analysis pending'}
            </div>
          </div>

          {/* Icon Detection */}
          <div className="bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-4">
            <div className="text-xs text-[#595c5e] uppercase tracking-wider font-label font-bold mb-2">Icons</div>
            <div className="text-sm font-headline font-semibold text-[#2c2f31] mb-1">
              {analysis.usesCustomIcons ? 'Custom' : 'Default Library'}
            </div>
            <div className="text-xs text-[#595c5e] font-body line-clamp-2">
              {iconLibs.length > 0 ? iconLibs.join(', ') : 'No libraries detected'}
            </div>
          </div>
        </div>

        {/* Detected Cliché Phrases */}
        {clichePhrases.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Detected AI Phrases</h3>
            <div className="flex flex-wrap gap-2">
              {clichePhrases.map((phrase, idx) => (
                <span
                  key={idx}
                  className="px-3 py-2 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg text-sm font-label font-medium"
                >
                  &quot;{phrase}&quot;
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Design Analysis */}
        <div className="mb-8 space-y-6">
          <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Design Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Layout Description */}
            {analysis.layoutDescription && (
              <div className="flex items-start gap-4 p-4 rounded-xl border bg-[#f8f9ff] border-[#5B5BD5]/10">
                <span className="material-symbols-outlined mt-0.5 text-[#5B5BD5]">
                  view_quilt
                </span>
                <div className="flex-1">
                  <h4 className="font-headline font-semibold text-sm mb-2 text-[#5B5BD5]">
                    Layout Analysis
                  </h4>
                  <p className="text-sm text-[#595c5e] leading-relaxed font-body">{analysis.layoutDescription}</p>
                </div>
              </div>
            )}

            {/* Icon Analysis */}
            {analysis.iconAnalysis && (
              <div className="flex items-start gap-4 p-4 rounded-xl border bg-[#eef1f3]/20 border-[#abadaf]/10">
                <span className="material-symbols-outlined mt-0.5 text-[#595c5e]">
                  palette
                </span>
                <div className="flex-1">
                  <h4 className="font-headline font-semibold text-sm mb-2 text-[#2c2f31]">
                    Icon Usage
                  </h4>
                  <p className="text-sm text-[#595c5e] leading-relaxed font-body">{analysis.iconAnalysis}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Strengths */}
        {analysis.strengthsSummary && (
          <div className="mb-8 bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl mb-4">Unique Strengths</h3>
            <p className="text-sm text-[#595c5e] font-body leading-relaxed">{analysis.strengthsSummary}</p>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg flex items-center justify-center text-sm font-headline font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-[#2c2f31] font-body leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Issues & Quick Wins */}
        <IssuesAndQuickWins
          keyIssues={designAuth.keyIssues}
          quickWins={designAuth.quickWins}
          issuesTitle="Authenticity Issues"
        />
      </div>
    </motion.div>
  );
}
