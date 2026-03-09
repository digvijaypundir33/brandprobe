'use client';

import { motion } from 'framer-motion';
import type { IssueComparison } from '@/types/report';

interface ImprovementsSummaryProps {
  issueComparison: IssueComparison;
  scanNumber?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  messaging: 'Messaging',
  seo: 'SEO',
  content: 'Content',
  ads: 'Ads',
  conversion: 'Conversion',
  distribution: 'Distribution',
  aiSearch: 'AI Search',
  technical: 'Technical',
  brandHealth: 'Brand Health',
  designAuth: 'Design',
};

export default function ImprovementsSummary({
  issueComparison,
  scanNumber = 2,
}: ImprovementsSummaryProps) {
  const { resolved, new: newIssues, summary } = issueComparison;

  // Don't show if no data
  if (summary.resolvedCount === 0 && summary.newCount === 0) {
    return null;
  }

  const progressColor =
    summary.overallProgress === 'improving'
      ? 'text-green-600'
      : summary.overallProgress === 'declining'
      ? 'text-red-600'
      : 'text-gray-600';

  const progressBg =
    summary.overallProgress === 'improving'
      ? 'bg-green-50 border-green-200'
      : summary.overallProgress === 'declining'
      ? 'bg-red-50 border-red-200'
      : 'bg-gray-50 border-gray-200';

  const progressIcon =
    summary.overallProgress === 'improving' ? (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ) : summary.overallProgress === 'declining' ? (
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ) : (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Improvement Tracking</h2>
          <p className="text-sm text-gray-500">Scan #{scanNumber} vs previous scan</p>
        </div>
      </div>

      {/* Progress Summary */}
      <div className={`rounded-lg border p-4 mb-6 ${progressBg}`}>
        <div className="flex items-center gap-3">
          {progressIcon}
          <div>
            <p className={`font-semibold ${progressColor}`}>
              {summary.overallProgress === 'improving'
                ? 'Great progress!'
                : summary.overallProgress === 'declining'
                ? 'New issues detected'
                : 'Stable'}
            </p>
            <p className="text-sm text-gray-600">
              {summary.resolvedCount} issue{summary.resolvedCount !== 1 ? 's' : ''} fixed
              {summary.newCount > 0 && `, ${summary.newCount} new issue${summary.newCount !== 1 ? 's' : ''}`}
              {summary.persistingCount > 0 && `, ${summary.persistingCount} ongoing`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{summary.resolvedCount}</p>
          <p className="text-sm text-green-700 font-medium">Fixed</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{summary.newCount}</p>
          <p className="text-sm text-red-700 font-medium">New</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{summary.persistingCount}</p>
          <p className="text-sm text-gray-700 font-medium">Ongoing</p>
        </div>
      </div>

      {/* Resolved Issues */}
      {resolved.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Issues You Fixed
          </h3>
          <div className="space-y-2">
            {resolved.slice(0, 5).map((issue, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-green-50/50 rounded-lg border border-green-100"
              >
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-medium text-green-600 uppercase">
                    {CATEGORY_LABELS[issue.category] || issue.category}
                  </span>
                  <p className="text-sm text-gray-700 line-through opacity-75">{issue.issue}</p>
                </div>
              </div>
            ))}
            {resolved.length > 5 && (
              <p className="text-xs text-gray-500 pl-8">+ {resolved.length - 5} more fixed</p>
            )}
          </div>
        </div>
      )}

      {/* New Issues */}
      {newIssues.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            New Issues to Address
          </h3>
          <div className="space-y-2">
            {newIssues.slice(0, 5).map((issue, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-red-50/50 rounded-lg border border-red-100"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    issue.priority === 'high'
                      ? 'bg-red-500'
                      : issue.priority === 'medium'
                      ? 'bg-orange-400'
                      : 'bg-yellow-400'
                  }`}
                >
                  <span className="text-[10px] font-bold text-white">
                    {issue.priority === 'high' ? '!' : issue.priority === 'medium' ? '-' : '.'}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium text-red-600 uppercase">
                    {CATEGORY_LABELS[issue.category] || issue.category}
                  </span>
                  <p className="text-sm text-gray-700">{issue.issue}</p>
                </div>
              </div>
            ))}
            {newIssues.length > 5 && (
              <p className="text-xs text-gray-500 pl-8">+ {newIssues.length - 5} more new issues</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
