'use client';

import { useState } from 'react';
import type { Issue, QuickWin } from '@/types/report';

interface IssuesAndQuickWinsProps {
  keyIssues: Issue[] | string[];
  quickWins: QuickWin[] | string[];
  issuesTitle?: string;
  quickWinsTitle?: string;
}

// Helper to normalize old string format to new object format
function normalizeIssues(issues: Issue[] | string[]): Issue[] {
  return issues.map((issue) => {
    if (typeof issue === 'string') {
      return { problem: issue, solution: '', priority: 'medium' as const };
    }
    return issue;
  });
}

function normalizeQuickWins(wins: QuickWin[] | string[]): QuickWin[] {
  return wins.map((win) => {
    if (typeof win === 'string') {
      return { action: win, impact: '', effort: 'medium' as const };
    }
    return win;
  });
}

function getPriorityBadge(priority?: 'high' | 'medium' | 'low') {
  switch (priority) {
    case 'high':
      return <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-medium">High</span>;
    case 'low':
      return <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">Low</span>;
    default:
      return <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">Med</span>;
  }
}

function getEffortBadge(effort?: 'easy' | 'medium' | 'hard') {
  switch (effort) {
    case 'easy':
      return <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">Easy</span>;
    case 'hard':
      return <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-medium">Hard</span>;
    default:
      return <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">Med</span>;
  }
}

function getEEATBadge(eeat?: 'experience' | 'expertise' | 'authoritativeness' | 'trustworthiness') {
  const config = {
    experience: { label: 'E', full: 'Experience', bg: 'bg-blue-100', text: 'text-blue-700' },
    expertise: { label: 'E', full: 'Expertise', bg: 'bg-purple-100', text: 'text-purple-700' },
    authoritativeness: { label: 'A', full: 'Authority', bg: 'bg-amber-100', text: 'text-amber-700' },
    trustworthiness: { label: 'T', full: 'Trust', bg: 'bg-green-100', text: 'text-green-700' },
  };

  if (!eeat || !config[eeat]) return null;

  const { label, full, bg, text } = config[eeat];
  return (
    <span className={`text-xs px-1.5 py-0.5 ${bg} ${text} rounded font-medium`} title={full}>
      {label}-{full}
    </span>
  );
}

function getCategoryBadge(category?: 'contents' | 'technology' | 'schema' | 'messaging' | 'seo') {
  const config = {
    contents: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
    technology: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
    schema: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
    messaging: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
    seo: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  };

  if (!category || !config[category]) return null;

  const { bg, text, border } = config[category];
  return (
    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 ${bg} ${text} border ${border} rounded font-medium`}>
      {category}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors flex items-center gap-1"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function IssuesAndQuickWins({
  keyIssues,
  quickWins,
  issuesTitle = 'Key Issues',
  quickWinsTitle = 'Quick Wins',
}: IssuesAndQuickWinsProps) {
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [expandedWin, setExpandedWin] = useState<number | null>(null);

  const normalizedIssues = normalizeIssues(keyIssues);
  const normalizedWins = normalizeQuickWins(quickWins);

  return (
    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
      {/* Key Issues */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {issuesTitle}
        </h4>
        <ul className="space-y-3">
          {normalizedIssues.map((issue, i) => (
            <li key={i} className="bg-red-50 rounded-lg border border-red-100 overflow-hidden">
              <button
                onClick={() => setExpandedIssue(expandedIssue === i ? null : i)}
                className="w-full text-left p-3 flex items-start gap-2"
              >
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">{issue.problem}</span>
                    {issue.priority && getPriorityBadge(issue.priority)}
                  </div>
                  {issue.solution && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Click to see solution
                    </div>
                  )}
                </div>
                {issue.solution && (
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedIssue === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {expandedIssue === i && issue.solution && (
                <div className="px-3 pb-3 pt-0 space-y-2">
                  {/* EEAT Badges Row */}
                  {(issue.eeat || issue.category || issue.targetArea) && (
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {issue.eeat && getEEATBadge(issue.eeat)}
                      {issue.category && getCategoryBadge(issue.category)}
                      {issue.targetArea && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                          📍 {issue.targetArea}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Solution */}
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 text-xs font-medium text-green-700 mb-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Solution
                    </div>
                    <p className="text-sm text-gray-700">{issue.solution}</p>
                  </div>

                  {/* Exact Replacement - Copy-ready */}
                  {issue.exactReplacement && (
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-blue-700">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Ready-to-Use Replacement
                        </div>
                        <CopyButton text={issue.exactReplacement} />
                      </div>
                      <div className="bg-blue-50 rounded p-2 font-mono text-sm text-gray-800 whitespace-pre-wrap">
                        {issue.exactReplacement}
                      </div>
                    </div>
                  )}

                  {/* Expected Effect */}
                  {issue.expectedEffect && (
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center gap-2 text-xs font-medium text-purple-700 mb-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Expected Effect
                      </div>
                      <p className="text-sm text-gray-700">{issue.expectedEffect}</p>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Wins */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {quickWinsTitle}
        </h4>
        <ul className="space-y-3">
          {normalizedWins.map((win, i) => (
            <li key={i} className="bg-green-50 rounded-lg border border-green-100 overflow-hidden">
              <button
                onClick={() => setExpandedWin(expandedWin === i ? null : i)}
                className="w-full text-left p-3 flex items-start gap-2"
              >
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">{win.action}</span>
                    {win.effort && getEffortBadge(win.effort)}
                  </div>
                  {win.impact && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Click to see impact
                    </div>
                  )}
                </div>
                {win.impact && (
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedWin === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {expandedWin === i && win.impact && (
                <div className="px-3 pb-3 pt-0">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-700 mb-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Expected Impact
                    </div>
                    <p className="text-sm text-gray-700">{win.impact}</p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
