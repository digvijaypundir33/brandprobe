'use client';

import { motion } from 'framer-motion';
import type { ContentStrategy } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';
import { getScoreColorClass } from '@/lib/utils';

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

export default function ContentPillarsCard({ content }: ContentPillarsCardProps) {
  const analysis = content.detailedAnalysis || {};
  const pillars = Array.isArray(analysis.contentPillars) ? analysis.contentPillars : [];
  const formats = Array.isArray(analysis.formatRecommendations) ? analysis.formatRecommendations : [];
  const topics = Array.isArray(analysis.topicClusters) ? analysis.topicClusters : [];
  const angles = Array.isArray(analysis.differentiationAngles) ? analysis.differentiationAngles : [];
  const cadence = analysis.publishingCadence || '';
  const platforms = analysis.platformGuidance || {};

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Content Strategy</h2>
              <p className="text-gray-400 text-sm">Your content pillars & roadmap</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColorClass(content.score)}`}>{content.score}</div>
            <div className="text-gray-400 text-sm">/100</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <p className="text-gray-700 text-sm">{content.summary}</p>
        </div>

        {/* Content Pillars */}
        {pillars.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Content Pillars
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pillars.map((pillar, i) => (
                <div
                  key={i}
                  className="bg-gray-900 rounded-lg p-4 text-white"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 font-semibold text-sm">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-sm">{toDisplayString(pillar)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topic Clusters */}
        {topics.length > 0 && (
          <div className="mb-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Topic Clusters
            </h4>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm border border-gray-200"
                >
                  {toDisplayString(topic)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Format Recommendations */}
        {formats.length > 0 && (
          <div className="mb-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Recommended Formats
            </h4>
            <div className="space-y-2">
              {formats.map((format, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 rounded flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700">{toDisplayString(format)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Differentiation Angles */}
        {angles.length > 0 && (
          <div className="mb-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Differentiation Angles
            </h4>
            <div className="space-y-2">
              {angles.map((angle, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700">{toDisplayString(angle)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publishing Cadence & Platform Guidance */}
        <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
          {cadence && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h5 className="font-medium text-gray-800 text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Publishing Cadence
              </h5>
              <p className="text-sm text-gray-600">{cadence}</p>
            </div>
          )}

          {Object.keys(platforms).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h5 className="font-medium text-gray-800 text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Platform Focus
              </h5>
              <div className="space-y-1">
                {Object.entries(platforms).map(([key, value]) => (
                  <p key={key} className="text-sm text-gray-600">
                    <span className="font-medium capitalize">{key}:</span> {String(value)}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

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
