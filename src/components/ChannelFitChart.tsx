'use client';

import { motion } from 'framer-motion';
import type { DistributionStrategy } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';
import { getFitColorClass, getFitTextColorClass } from '@/lib/utils';

interface ChannelFitChartProps {
  distribution: DistributionStrategy;
}

function getScoreBadgeColor(score: number) {
  if (score >= 75) return { bg: 'bg-[#6bff8f]', text: 'text-[#005f28]', label: 'Excellent' };
  if (score >= 50) return { bg: 'bg-[#fed01b]', text: 'text-[#594700]', label: 'Average' };
  return { bg: 'bg-[#f74b6d]', text: 'text-[#510017]', label: 'Needs Work' };
}

export default function ChannelFitChart({ distribution }: ChannelFitChartProps) {
  const analysis = distribution.detailedAnalysis || {};
  const channels = analysis.channelRecommendations || [];
  const contentMapping = analysis.contentChannelMapping || {};
  const tonePerPlatform = analysis.tonePerPlatform || {};
  const partnerships = analysis.partnershipSuggestions || [];
  const badgeColor = getScoreBadgeColor(distribution.score);

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
              Distribution Channels
            </h1>
            <p className="text-[#595c5e] font-body text-lg">Where to reach your audience</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 ${badgeColor.bg} ${badgeColor.text} rounded-full text-xs font-label font-bold uppercase tracking-wider mb-2`}>
              {badgeColor.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-headline font-bold text-[#2c2f31]">{distribution.score}</span>
              <span className="text-xl text-[#595c5e] font-light">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {distribution.summary && (
          <div className="bg-[#eef1f3]/30 rounded-xl p-6 mb-8">
            <p className="text-[#595c5e] leading-relaxed font-body">{distribution.summary}</p>
          </div>
        )}

        {/* Channel Fit Bars */}
        {channels.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Channel Recommendations</h3>
            <div className="space-y-4">
              {channels.map((channel, i) => (
                <motion.div
                  key={channel.channel}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    i === 0
                      ? 'bg-[#f8f9ff] border-[#5B5BD5]/10'
                      : 'bg-[#eef1f3]/20 border-[#abadaf]/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-headline font-semibold text-sm ${
                      i === 0 ? 'text-[#5B5BD5]' : 'text-[#2c2f31]'
                    }`}>{channel.channel}</span>
                    <span className={`text-sm font-bold font-headline ${getFitTextColorClass(channel.fit)}`}>{channel.fit}/10</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-[#eef1f3] rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${channel.fit * 10}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`h-full rounded-full ${getFitColorClass(channel.fit)}`}
                    />
                  </div>

                  <p className="text-sm text-[#595c5e] leading-relaxed font-body">{channel.rationale}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Content Channel Mapping */}
        {Object.keys(contentMapping).length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Content-Channel Mapping</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(contentMapping).map(([contentType, channels]) => {
                const channelArray = Array.isArray(channels) ? channels : [];
                return (
                  <div
                    key={contentType}
                    className="bg-[#eef1f3]/20 rounded-xl p-4 border border-[#abadaf]/10"
                  >
                    <h5 className="font-headline font-semibold text-[#2c2f31] text-sm capitalize mb-2">{contentType}</h5>
                    <div className="flex flex-wrap gap-2">
                      {channelArray.map((ch, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-md text-xs font-label font-medium"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tone Per Platform */}
        {Object.keys(tonePerPlatform).length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Tone & Voice Per Platform</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {Object.entries(tonePerPlatform).map(([platform, tone]) => (
                <div
                  key={platform}
                  className="bg-[#eef1f3]/20 rounded-xl p-4 border border-[#abadaf]/10"
                >
                  <span className="font-label font-semibold text-[#2c2f31] text-sm capitalize block mb-2">{platform}</span>
                  <p className="text-sm text-[#595c5e] font-body leading-relaxed">{String(tone)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partnership Suggestions */}
        {partnerships.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Partnership Opportunities</h3>
            <div className="space-y-3">
              {partnerships.map((partnership, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg flex items-center justify-center text-sm font-headline font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#2c2f31] font-body leading-relaxed">{partnership}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Issues & Quick Wins */}
        <IssuesAndQuickWins
          keyIssues={distribution.keyIssues}
          quickWins={distribution.quickWins}
          issuesTitle="Distribution Issues"
        />
      </div>
    </motion.div>
  );
}
