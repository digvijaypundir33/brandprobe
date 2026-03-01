'use client';

import type { Report, Issue as ReportIssue } from '@/types/report';

interface IssuesListProps {
  report: Report;
}

interface DisplayIssue {
  section: string;
  problem: string;
  solution?: string;
  severity: 'critical' | 'warning' | 'info';
  score: number;
}

// Helper to extract text from Issue objects or strings
function getIssueText(issue: ReportIssue | string): { problem: string; solution?: string } {
  if (typeof issue === 'string') {
    return { problem: issue };
  }
  return { problem: issue.problem, solution: issue.solution };
}

function extractIssues(report: Report): DisplayIssue[] {
  const issues: DisplayIssue[] = [];

  const sections = [
    { name: 'Messaging', data: report.messagingAnalysis, score: report.messagingScore },
    { name: 'SEO', data: report.seoOpportunities, score: report.seoScore },
    { name: 'Content', data: report.contentStrategy, score: report.contentScore },
    { name: 'Ads', data: report.adAngles, score: report.adsScore },
    { name: 'Conversion', data: report.conversionOptimization, score: report.conversionScore },
    { name: 'Distribution', data: report.distributionStrategy, score: report.distributionScore },
  ];

  sections.forEach(({ name, data, score }) => {
    if (data?.keyIssues) {
      data.keyIssues.forEach((issue) => {
        const { problem, solution } = getIssueText(issue);
        issues.push({
          section: name,
          problem,
          solution,
          severity: score && score <= 30 ? 'critical' : score && score <= 50 ? 'warning' : 'info',
          score: score || 0,
        });
      });
    }
  });

  // Sort by severity
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return issues;
}

export default function IssuesList({ report }: IssuesListProps) {
  const issues = extractIssues(report);

  if (issues.length === 0) return null;

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Issues Found</h2>
              <p className="text-gray-400 text-sm">Problems affecting your growth</p>
            </div>
          </div>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <span className="px-3 py-1 bg-red-500/20 text-red-200 text-sm font-medium rounded-md">
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-3 py-1 bg-white/10 text-white text-sm font-medium rounded-md">
                {warningCount} Warnings
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {issues.slice(0, 10).map((issue, index) => (
          <div
            key={index}
            className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3"
          >
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  {issue.section}
                </span>
                <span className="text-xs text-red-600">• Score: {issue.score}/100</span>
              </div>
              <p className="text-sm text-gray-700">{issue.problem}</p>
            </div>
          </div>
        ))}
      </div>

      {issues.length > 10 && (
        <div className="px-6 pb-6">
          <p className="text-center text-sm text-gray-500">
            +{issues.length - 10} more issues in detailed sections below
          </p>
        </div>
      )}
    </div>
  );
}
