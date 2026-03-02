'use client';

import { motion } from 'framer-motion';
import type { DistributionStrategy } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';
import { getScoreColorClass, getFitColorClass, getFitTextColorClass } from '@/lib/utils';

interface ChannelFitChartProps {
  distribution: DistributionStrategy;
}

export default function ChannelFitChart({ distribution }: ChannelFitChartProps) {
  const analysis = distribution.detailedAnalysis || {};
  const channels = analysis.channelRecommendations || [];
  const contentMapping = analysis.contentChannelMapping || {};
  const tonePerPlatform = analysis.tonePerPlatform || {};
  const partnerships = analysis.partnershipSuggestions || [];

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Distribution Channels</h2>
              <p className="text-gray-400 text-sm">Where to reach your audience</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColorClass(distribution.score)}`}>{distribution.score}</div>
            <div className="text-gray-400 text-sm">/100</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <p className="text-gray-700 text-sm">{distribution.summary}</p>
        </div>

        {/* Channel Fit Bars */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700">Channel Recommendations</h4>
          {channels.map((channel, i) => (
            <motion.div
              key={channel.channel}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800 text-sm">{channel.channel}</span>
                <span className={`text-sm font-medium ${getFitTextColorClass(channel.fit)}`}>{channel.fit}/10</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${channel.fit * 10}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`h-full rounded-full ${getFitColorClass(channel.fit)}`}
                />
              </div>

              <p className="text-xs text-gray-500">{channel.rationale}</p>
            </motion.div>
          ))}
        </div>

        {/* Content Channel Mapping */}
        {Object.keys(contentMapping).length > 0 && (
          <div className="mb-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Content-Channel Mapping</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(contentMapping).map(([contentType, channels]) => {
                const channelArray = Array.isArray(channels) ? channels : [];
                return (
                  <div
                    key={contentType}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <h5 className="font-medium text-gray-800 text-sm capitalize mb-2">{contentType}</h5>
                    <div className="flex flex-wrap gap-1">
                      {channelArray.map((ch, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
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
          <div className="mb-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Tone & Voice Per Platform</h4>
            <div className="grid md:grid-cols-3 gap-3">
              {Object.entries(tonePerPlatform).map(([platform, tone]) => (
                <div
                  key={platform}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <span className="font-medium text-gray-800 text-sm capitalize block mb-1">{platform}</span>
                  <p className="text-xs text-gray-600">{String(tone)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partnership Suggestions */}
        {partnerships.length > 0 && (
          <div className="pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Partnership Opportunities
            </h4>
            <div className="space-y-2">
              {partnerships.map((partnership, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 rounded flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700">{partnership}</p>
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
