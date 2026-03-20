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

// Max items to show before "+ X more" card
const MAX_VISIBLE_ITEMS = 5;

export default function ImprovementsSummary({
  issueComparison,
  scanNumber = 2,
}: ImprovementsSummaryProps) {
  const { resolved, new: newIssues, summary } = issueComparison;

  // Don't show if no data
  if (summary.resolvedCount === 0 && summary.newCount === 0) {
    return null;
  }

  // Calculate fix progress percentage
  const totalIssues = summary.resolvedCount + summary.persistingCount + summary.newCount;
  const fixProgress = totalIssues > 0 ? Math.round((summary.resolvedCount / totalIssues) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
    >
      {/* Header with Progress Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E9E9FB] rounded-xl flex items-center justify-center text-[#5B5BD5]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg md:text-xl">Improvement Tracking</h3>
            <p className="text-xs text-gray-500 font-medium">Scan #{scanNumber} vs previous scan</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
          summary.overallProgress === 'improving'
            ? 'bg-green-50/50 border-green-200/50'
            : summary.overallProgress === 'declining'
            ? 'bg-red-50/50 border-red-200/50'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <svg className={`w-4 h-4 ${
            summary.overallProgress === 'improving' ? 'text-green-500' :
            summary.overallProgress === 'declining' ? 'text-red-500' : 'text-gray-500'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
              summary.overallProgress === 'improving' ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" :
              summary.overallProgress === 'declining' ? "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" :
              "M5 12h14"
            } />
          </svg>
          <span className={`text-sm font-bold ${
            summary.overallProgress === 'improving' ? 'text-green-700' :
            summary.overallProgress === 'declining' ? 'text-red-700' : 'text-gray-700'
          }`}>
            {summary.overallProgress === 'improving' ? 'Great progress!' :
             summary.overallProgress === 'declining' ? 'New issues detected' : 'Stable'}
          </span>
        </div>
      </div>

      {/* Stats Grid - Compact */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-slate-50 rounded-xl p-3 md:p-5 text-center border border-slate-100">
          <div className="text-2xl md:text-4xl font-bold text-green-500 mb-1">{summary.resolvedCount}</div>
          <div className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">Issues Fixed</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 md:p-5 text-center border border-slate-100">
          <div className="text-2xl md:text-4xl font-bold text-red-500 mb-1">{summary.newCount}</div>
          <div className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">New Found</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 md:p-5 text-center border border-slate-100">
          <div className="text-2xl md:text-4xl font-bold text-gray-700 mb-1">{summary.persistingCount}</div>
          <div className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ongoing</div>
        </div>
      </div>

      {/* Issues Grids - Compact Card Layout */}
      <div className="space-y-6 md:space-y-8">
        {/* Fixed Issues Grid */}
        {resolved.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-green-600 uppercase tracking-[0.15em] mb-3 md:mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Issues You Fixed
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              {resolved.slice(0, MAX_VISIBLE_ITEMS).map((issue, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-green-50/30 border border-green-100/50 rounded-xl flex flex-col gap-2"
                >
                  <span className="w-fit text-[9px] font-bold text-green-600 bg-green-100/50 px-1.5 py-0.5 rounded uppercase">
                    {CATEGORY_LABELS[issue.category] || issue.category}
                  </span>
                  <p className="text-sm text-gray-500 line-through opacity-60 leading-tight">
                    {issue.issue}
                  </p>
                </div>
              ))}
              {resolved.length > MAX_VISIBLE_ITEMS && (
                <div className="p-3 bg-green-50/20 border border-green-100/30 border-dashed rounded-xl flex items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-500">+ {resolved.length - MAX_VISIBLE_ITEMS} more fixed</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* New Issues Grid */}
        {newIssues.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-red-600 uppercase tracking-[0.15em] mb-3 md:mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              New Issues to Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              {newIssues.slice(0, MAX_VISIBLE_ITEMS).map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl flex flex-col gap-2 ${
                    issue.priority === 'high'
                      ? 'bg-red-50/50 border border-red-100/50'
                      : 'bg-orange-50/50 border border-orange-200/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`w-fit text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      issue.priority === 'high'
                        ? 'text-red-600 bg-red-100/50'
                        : 'text-orange-600 bg-orange-100/50'
                    }`}>
                      {CATEGORY_LABELS[issue.category] || issue.category}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      issue.priority === 'high' ? 'bg-red-500' : 'bg-orange-400'
                    }`} />
                  </div>
                  <p className="text-sm font-medium leading-tight text-gray-700">{issue.issue}</p>
                </div>
              ))}
              {newIssues.length > MAX_VISIBLE_ITEMS && (
                <div className="p-3 bg-slate-50 border border-gray-200 border-dashed rounded-xl flex items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-500">+ {newIssues.length - MAX_VISIBLE_ITEMS} more found</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-100">
        <div className="flex justify-between text-xs font-bold px-1 mb-3">
          <span className="text-gray-500 uppercase tracking-wider">Overall Fix Progress</span>
          <span className="text-[#5B5BD5]">{fixProgress}%</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#5B5BD5] rounded-full transition-all duration-500"
            style={{ width: `${fixProgress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
