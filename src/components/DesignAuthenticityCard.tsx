'use client';

import { motion } from 'framer-motion';
import type { DesignAuthenticity } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';
import { getScoreColorClass } from '@/lib/utils';

interface DesignAuthenticityCardProps {
  designAuth: DesignAuthenticity;
}

export default function DesignAuthenticityCard({ designAuth }: DesignAuthenticityCardProps) {
  const analysis = designAuth.detailedAnalysis || {};

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
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gray-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Design Authenticity</h2>
              <p className="text-gray-400 text-sm">AI pattern detection & originality analysis</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColorClass(designAuth.score)}`}>
              {designAuth.score}
            </div>
            <div className="text-gray-400 text-sm">/100</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <p className="text-gray-700 text-sm">{designAuth.summary}</p>
        </div>

        {/* Authenticity Rating Badge */}
        <div className="mb-6 flex items-center justify-center">
          <div className={`px-6 py-3 rounded-full font-semibold text-sm ${
            analysis.authenticityRating === 'Authentic'
              ? 'bg-green-100 text-green-800 border-2 border-green-300'
              : analysis.authenticityRating === 'Somewhat Generic'
              ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
              : 'bg-red-100 text-red-800 border-2 border-red-300'
          }`}>
            {analysis.authenticityRating || 'Analysis Pending'}
          </div>
        </div>

        {/* Screenshot (if available) */}
        {analysis.screenshotUrl && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 text-sm mb-3">Website Preview</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={analysis.screenshotUrl as string}
                alt="Website screenshot"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Cliché Phrases */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="font-medium text-red-800 text-sm">Cliché Phrases</h4>
            </div>
            <div className="text-2xl font-bold text-red-900 mb-1">{analysis.clicheCount || 0}</div>
            <div className={`text-xs font-medium uppercase ${
              analysis.clicheSeverity === 'high' ? 'text-red-700' :
              analysis.clicheSeverity === 'medium' ? 'text-yellow-700' :
              'text-green-700'
            }`}>
              {analysis.clicheSeverity || 'none'} severity
            </div>
          </div>

          {/* Layout Analysis */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
              </svg>
              <h4 className="font-medium text-blue-800 text-sm">Layout</h4>
            </div>
            <div className="text-sm font-medium text-blue-900 mb-1 capitalize">
              {analysis.layoutAuthenticity || 'N/A'}
            </div>
            <div className="text-xs text-blue-700 line-clamp-2">
              {analysis.layoutPattern || 'Pattern analysis pending'}
            </div>
          </div>

          {/* Icon Detection */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <h4 className="font-medium text-purple-800 text-sm">Icons</h4>
            </div>
            <div className="text-sm font-medium text-purple-900 mb-1">
              {analysis.usesCustomIcons ? 'Custom' : 'Default Library'}
            </div>
            <div className="text-xs text-purple-700 line-clamp-2">
              {iconLibs.length > 0 ? iconLibs.join(', ') : 'No libraries detected'}
            </div>
          </div>
        </div>

        {/* Detected Cliché Phrases */}
        {clichePhrases.length > 0 && (
          <div className="mb-6 bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <h4 className="font-medium text-yellow-800 text-sm mb-3">Detected AI Phrases</h4>
            <div className="flex flex-wrap gap-2">
              {clichePhrases.map((phrase, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-full text-xs font-medium"
                >
                  &quot;{phrase}&quot;
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Layout Description */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
            <h4 className="font-medium text-gray-800 text-sm">Layout Analysis</h4>
          </div>
          <p className="text-xs text-gray-600">{analysis.layoutDescription || 'No layout analysis available'}</p>
        </div>

        {/* Icon Analysis */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <h4 className="font-medium text-gray-800 text-sm">Icon Usage</h4>
          </div>
          <p className="text-xs text-gray-600">{analysis.iconAnalysis || 'No icon analysis available'}</p>
        </div>

        {/* Strengths */}
        {analysis.strengthsSummary && (
          <div className="mb-6 bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-medium text-green-800 text-sm">Unique Strengths</h4>
            </div>
            <p className="text-sm text-green-700">{analysis.strengthsSummary}</p>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-blue-800 text-sm mb-3">Recommendations</h4>
            <ul className="space-y-2">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-blue-900">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
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
