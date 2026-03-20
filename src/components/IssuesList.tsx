'use client';

import type { Report, Issue as ReportIssue } from '@/types/report';

interface IssuesListProps {
  report: Report;
  hasFullAccess?: boolean;
}

interface DisplayIssue {
  section: string;
  problem: string;
  solution?: string;
  severity: 'critical' | 'warning' | 'info';
  score: number;
  locked?: boolean;
}

// Max items to show before "+ X more" card
const MAX_VISIBLE_ITEMS = 8;

// Helper to extract text from Issue objects or strings
function getIssueText(issue: ReportIssue | string): { problem: string; solution?: string } {
  if (typeof issue === 'string') {
    return { problem: issue };
  }
  return { problem: issue.problem, solution: issue.solution };
}

function extractIssues(report: Report, hasFullAccess: boolean): DisplayIssue[] {
  const issues: DisplayIssue[] = [];

  // Show all issues for all users (blur locked ones for free users)
  const allSections = [
    { name: 'Messaging', data: report.messagingAnalysis, score: report.messagingScore, free: true },
    { name: 'SEO', data: report.seoOpportunities, score: report.seoScore, free: true },
    { name: 'Content', data: report.contentStrategy, score: report.contentScore, free: true },
    { name: 'Ads', data: report.adAngles, score: report.adsScore, free: true },
    { name: 'Conversion', data: report.conversionOptimization, score: report.conversionScore, free: false },
    { name: 'Distribution', data: report.distributionStrategy, score: report.distributionScore, free: false },
    { name: 'AI Search', data: report.aiSearchVisibility, score: report.aiSearchScore, free: false },
    { name: 'Technical', data: report.technicalPerformance, score: report.technicalScore, free: false },
    { name: 'Brand Health', data: report.brandHealth, score: report.brandHealthScore, free: false },
    { name: 'Design', data: report.designAuthenticity, score: report.designAuthenticityScore, free: false },
  ];

  allSections.forEach(({ name, data, score, free }) => {
    const isLocked = !free && !hasFullAccess;

    if (data?.keyIssues) {
      data.keyIssues.forEach((issue) => {
        const { problem, solution } = getIssueText(issue);
        issues.push({
          section: name,
          problem,
          solution,
          severity: score && score <= 30 ? 'critical' : score && score <= 50 ? 'warning' : 'info',
          score: score || 0,
          locked: isLocked,
        });
      });
    } else if (isLocked && score) {
      // Add placeholder issues for locked sections (backend stripped the data)
      issues.push({
        section: name,
        problem: 'Upgrade to unlock detailed issues and recommendations for this section.',
        solution: undefined,
        severity: score <= 30 ? 'critical' : score <= 50 ? 'warning' : 'info',
        score: score || 0,
        locked: true,
      });
    }
  });

  // Sort by severity
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return issues;
}

export default function IssuesList({ report, hasFullAccess = false }: IssuesListProps) {
  const issues = extractIssues(report, hasFullAccess);

  if (issues.length === 0) return null;

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg md:text-xl">Issues Found</h3>
            <p className="text-xs text-gray-500 font-medium">Problems affecting your growth</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {criticalCount > 0 && (
            <span className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100">
              {criticalCount} Critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg border border-orange-100">
              {warningCount} Warning{warningCount !== 1 ? 's' : ''}
            </span>
          )}
          {infoCount > 0 && (
            <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100">
              {infoCount} Info
            </span>
          )}
        </div>
      </div>

      {/* Issues Grid - Compact Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3">
        {issues.slice(0, MAX_VISIBLE_ITEMS).map((issue, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl flex flex-col gap-2 relative ${
              issue.severity === 'critical'
                ? 'bg-red-50/50 border border-red-100/50'
                : issue.severity === 'warning'
                ? 'bg-orange-50/50 border border-orange-200/50'
                : 'bg-slate-50/50 border border-slate-100/50'
            } ${issue.locked ? 'overflow-hidden' : ''}`}
          >
            <div className="flex justify-between items-start">
              <span className={`w-fit text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                issue.severity === 'critical'
                  ? 'text-red-600 bg-red-100/50'
                  : issue.severity === 'warning'
                  ? 'text-orange-600 bg-orange-100/50'
                  : 'text-slate-600 bg-slate-100/50'
              }`}>
                {issue.section}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${
                issue.severity === 'critical'
                  ? 'bg-red-500'
                  : issue.severity === 'warning'
                  ? 'bg-orange-400'
                  : 'bg-slate-400'
              }`} />
            </div>
            <p className={`text-sm font-medium leading-tight text-gray-700 ${issue.locked ? 'blur-sm select-none' : ''}`}>
              {issue.problem}
            </p>
            {issue.locked && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <svg className="w-4 h-4 text-gray-400 mx-auto mb-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[9px] text-gray-500 font-bold uppercase">Pro</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {issues.length > MAX_VISIBLE_ITEMS && (
          <div className="p-3 bg-slate-50 border border-gray-200 border-dashed rounded-xl flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-500">+ {issues.length - MAX_VISIBLE_ITEMS} more issues</span>
          </div>
        )}
      </div>

      {/* Hint to scroll */}
      {issues.length > MAX_VISIBLE_ITEMS && (
        <p className="text-center text-xs text-gray-400 mt-4">
          See detailed sections below for all issues
        </p>
      )}
    </div>
  );
}
