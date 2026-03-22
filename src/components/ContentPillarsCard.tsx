'use client';

import { motion } from 'framer-motion';
import type { ContentStrategy } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';

interface ContentPillarsCardProps {
  content: ContentStrategy;
}

// Helper to safely convert any value to string
function toDisplayString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if ('format' in obj && 'rationale' in obj) {
      return `${obj.format}: ${obj.rationale}`;
    }
    if ('name' in obj && 'description' in obj) {
      return `${obj.name}: ${obj.description}`;
    }
    const stringVals = Object.values(obj).filter(v => typeof v === 'string');
    if (stringVals.length > 0) return stringVals.join(' - ');
    return JSON.stringify(value);
  }
  return String(value);
}

function getScoreBadgeColor(score: number) {
  if (score >= 75) return { bg: 'bg-[#6bff8f]', text: 'text-[#005f28]', label: 'Excellent' };
  if (score >= 50) return { bg: 'bg-[#fed01b]', text: 'text-[#594700]', label: 'Average' };
  return { bg: 'bg-[#f74b6d]', text: 'text-[#510017]', label: 'Needs Work' };
}

export default function ContentPillarsCard({ content }: ContentPillarsCardProps) {
  const analysis = content.detailedAnalysis || {};
  const pillars = Array.isArray(analysis.contentPillars) ? analysis.contentPillars : [];
  const formats = Array.isArray(analysis.formatRecommendations) ? analysis.formatRecommendations : [];
  const topics = Array.isArray(analysis.topicClusters) ? analysis.topicClusters : [];
  const angles = Array.isArray(analysis.differentiationAngles) ? analysis.differentiationAngles : [];
  const cadence = analysis.publishingCadence || '';
  const platforms = analysis.platformGuidance || {};

  const badgeColor = getScoreBadgeColor(content.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(44,47,49,0.06)] overflow-hidden"
    >
      {/* Header */}
      <div className="p-8 flex justify-between items-start border-b border-[#abadaf]/15">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-[#2c2f31] tracking-tight">Content Strategy Analysis</h1>
          <p className="text-[#595c5e] font-body text-lg">Pillars & Roadmap</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 ${badgeColor.bg} ${badgeColor.text} rounded-full text-xs font-label font-bold uppercase tracking-wider mb-2`}>
              {badgeColor.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-headline font-bold text-[#2c2f31]">{content.score}</span>
              <span className="text-xl text-[#595c5e] font-light">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {content.summary && (
          <div className="bg-[#eef1f3]/30 rounded-xl p-6 mb-8">
            <p className="text-[#595c5e] leading-relaxed font-body">{content.summary}</p>
          </div>
        )}

        {/* Content Pillars */}
        {pillars.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Content Pillars</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {pillars.map((pillar, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-xl border space-y-3 ${
                    i === 0
                      ? 'bg-[#f8f9ff] border-[#5B5BD5]/10'
                      : 'bg-[#eef1f3]/20 border-[#abadaf]/10'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${i === 0 ? 'text-[#5B5BD5]' : 'text-[#2c2f31]'}`}>
                    <span className="material-symbols-outlined">description</span>
                    <h4 className="font-headline font-bold uppercase text-xs tracking-widest">
                      Pillar {i + 1}
                    </h4>
                  </div>
                  <p className="text-sm text-[#595c5e] leading-relaxed">{toDisplayString(pillar)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topic Clusters */}
        {topics.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Topic Clusters</h3>
            <div className="space-y-3">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg flex items-center justify-center text-sm font-headline font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#2c2f31] leading-relaxed">{toDisplayString(topic)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Differentiation Angles */}
        {angles.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Differentiation Angles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {angles.map((angle, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10"
                >
                  <span className="material-symbols-outlined text-[#595c5e] mt-0.5">trending_flat</span>
                  <p className="text-sm font-medium text-[#2c2f31]">{toDisplayString(angle)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Format Recommendations */}
        {formats.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Recommended Formats</h3>
            <div className="space-y-3">
              {formats.map((format, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg flex items-center justify-center text-sm font-headline font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#2c2f31] leading-relaxed">{toDisplayString(format)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publishing Cadence & Platform Guidance */}
        {(cadence || Object.keys(platforms).length > 0) && (
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {cadence && (
                <div className="bg-[#eef1f3]/20 rounded-xl p-6 border border-[#abadaf]/10">
                  <h5 className="font-headline font-bold text-[#2c2f31] text-sm mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#595c5e]">event</span>
                    Publishing Cadence
                  </h5>
                  <p className="text-sm text-[#595c5e] leading-relaxed">{cadence}</p>
                </div>
              )}

              {Object.keys(platforms).length > 0 && (
                <div className="bg-[#eef1f3]/20 rounded-xl p-6 border border-[#abadaf]/10">
                  <h5 className="font-headline font-bold text-[#2c2f31] text-sm mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#595c5e]">public</span>
                    Platform Focus
                  </h5>
                  <div className="space-y-2">
                    {Object.entries(platforms).map(([key, value]) => (
                      <p key={key} className="text-sm text-[#595c5e]">
                        <span className="font-semibold capitalize">{key}:</span> {String(value)}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Key Issues & Quick Wins */}
        <IssuesAndQuickWins
          keyIssues={content.keyIssues}
          quickWins={content.quickWins}
          issuesTitle="Content Issues"
        />
      </div>
    </motion.div>
  );
}
