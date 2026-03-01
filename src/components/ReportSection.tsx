'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScoreGauge from './ScoreGauge';
import type { ReportSection as ReportSectionType, Issue, QuickWin } from '@/types/report';

// Helper to extract text from Issue/QuickWin objects or strings
function getIssueText(issue: Issue | string): string {
  return typeof issue === 'string' ? issue : issue.problem;
}

function getQuickWinText(win: QuickWin | string): string {
  return typeof win === 'string' ? win : win.action;
}

interface ReportSectionProps {
  title: string;
  section: ReportSectionType;
  isLocked?: boolean;
  onUnlock?: () => void;
  icon?: string;
}

function getScoreLabel(score: number): string {
  if (score <= 25) return 'Needs Work';
  if (score <= 50) return 'Below Average';
  if (score <= 70) return 'Average';
  if (score <= 85) return 'Good';
  return 'Excellent';
}

export default function ReportSection({
  title,
  section,
  isLocked = false,
  onUnlock,
}: ReportSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const scoreLabel = getScoreLabel(section.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <ScoreGauge score={section.score} size="sm" showLabel={false} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-900 text-white">
                {scoreLabel}
              </span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{section.summary}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLocked && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              LOCKED
            </span>
          )}
          <motion.svg
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`border-t border-gray-100 ${isLocked ? 'relative' : ''}`}
          >
            {isLocked && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4 p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">
                    Unlock full analysis with specific recommendations
                  </p>
                  <p className="text-sm text-gray-500">
                    See exactly what to fix and how to improve your score
                  </p>
                </div>
                <button
                  onClick={onUnlock}
                  className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all"
                >
                  Unlock Full Report - $29/mo
                </button>
              </div>
            )}

            <div className={`p-6 space-y-6 ${isLocked ? 'blur-sm select-none' : ''}`}>
              {/* Summary Card */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-gray-700 leading-relaxed">{section.summary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Key Issues */}
                <div className="bg-red-50/50 rounded-lg p-5 border border-red-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Key Issues ({section.keyIssues.length})
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {section.keyIssues.map((issue, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 bg-white rounded-lg p-3 border border-red-100"
                      >
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{getIssueText(issue)}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Quick Wins */}
                <div className="bg-green-50/50 rounded-lg p-5 border border-green-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Quick Wins ({section.quickWins.length})
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {section.quickWins.map((win, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 bg-white rounded-lg p-3 border border-green-100"
                      >
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{getQuickWinText(win)}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Detailed Analysis
                  </h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(section.detailedAnalysis).map(([key, value]) => {
                    // Skip arrays for now, render them differently
                    if (Array.isArray(value)) {
                      return (
                        <div key={key} className="bg-white rounded-lg p-4 border border-gray-100">
                          <h5 className="text-sm font-semibold text-gray-800 mb-2 capitalize flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h5>
                          <ul className="space-y-1.5">
                            {value.map((item, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-gray-400 mt-1">•</span>
                                <span>
                                  {typeof item === 'object'
                                    ? JSON.stringify(item)
                                    : String(item)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    if (typeof value === 'object' && value !== null) {
                      return (
                        <div key={key} className="bg-white rounded-lg p-4 border border-gray-100">
                          <h5 className="text-sm font-semibold text-gray-800 mb-2 capitalize flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h5>
                          <div className="space-y-2">
                            {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                              <div key={k} className="text-sm">
                                <span className="font-medium text-gray-700 capitalize">
                                  {k.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>{' '}
                                <span className="text-gray-600">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="bg-white rounded-lg p-4 border border-gray-100">
                        <h5 className="text-sm font-semibold text-gray-800 mb-1 capitalize flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h5>
                        <p className="text-gray-600 text-sm">{String(value)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
