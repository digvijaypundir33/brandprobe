'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import type { Report, Issue, QuickWin } from '@/types/report';

// Helper to extract text from Issue/QuickWin objects or strings
function getIssueProblem(issue: Issue | string): string {
  return typeof issue === 'string' ? issue : issue.problem;
}

function getIssueSolution(issue: Issue | string): string | null {
  if (typeof issue === 'string') return null;
  return issue.solution || null;
}

function getQuickWinAction(win: QuickWin | string): string {
  return typeof win === 'string' ? win : win.action;
}

function getQuickWinImpact(win: QuickWin | string): string | null {
  if (typeof win === 'string') return null;
  return win.impact || null;
}

// Helper to safely convert any value to string
function toDisplayString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if ('type' in obj && 'issue' in obj) {
      return `${obj.type}: ${obj.issue}`;
    }
    const stringVals = Object.values(obj).filter(v => typeof v === 'string');
    if (stringVals.length > 0) return stringVals.join(' ');
    return 'N/A';
  }
  return String(value);
}

export default function PrintReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('free');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/report/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch report');
        }

        setReport(data.report);
        setHasFullAccess(data.hasFullAccess || false);
        setSubscriptionStatus(data.subscriptionStatus || 'free');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      }
    };

    fetchReport();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  const scores = {
    messaging: report.messagingScore || 0,
    seo: report.seoScore || 0,
    content: report.contentScore || 0,
    ads: report.adsScore || 0,
    conversion: report.conversionScore || 0,
    distribution: report.distributionScore || 0,
    aiSearch: report.aiSearchScore || 0,
    technical: report.technicalScore || 0,
    brand: report.brandHealthScore || 0,
    design: report.designAuthenticityScore || 0,
  };

  // Count locked sections
  const lockedSections = [];
  if (!hasFullAccess) {
    if (report.contentStrategy) lockedSections.push('Content Strategy');
    if (report.adAngles) lockedSections.push('Ad Creative Ideas');
    if (report.conversionOptimization) lockedSections.push('Conversion Optimization');
    if (report.distributionStrategy) lockedSections.push('Distribution Channels');
    if (report.aiSearchVisibility) lockedSections.push('AI Search Visibility');
    if (report.technicalPerformance) lockedSections.push('Technical Performance');
    if (report.brandHealth) lockedSections.push('Brand Health');
    if (report.designAuthenticity) lockedSections.push('Design Authenticity');
  }

  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* Print Controls - Hidden when printing */}
      <div className="print:hidden sticky top-0 bg-white border-b border-gray-200 p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push(`/report/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Report
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-4xl mx-auto px-8 py-12 print:px-0 print:py-0 print:min-h-screen print:flex print:flex-col">
        {/* Header */}
        <header className="mb-12 print:mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center print:bg-gray-900">
                <span className="text-white font-bold text-xl">BP</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">BrandProbe</h1>
                <p className="text-gray-500">Marketing Analysis Report</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Powered by</p>
              <p className="text-sm font-semibold text-gray-900">BrandProbe.ai</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Website Analyzed</p>
                <p className="font-medium text-gray-900 break-all">{report.url}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Report Generated</p>
                <p className="font-medium text-gray-900">
                  {new Date(report.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            {!hasFullAccess && lockedSections.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Plan:</span> Free (Limited Access)
                </p>
              </div>
            )}
          </div>
        </header>

        {/* Overall Score */}
        <section id="overall-score" className="mb-12 print:mb-8 page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">1</span>
            Overall Score
          </h2>

          <div className="bg-gray-900 rounded-lg p-8 text-white">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-2">Marketing Health Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold">{report.overallScore || 0}</span>
                  <span className="text-2xl text-gray-400">/100</span>
                </div>
                <p className="text-gray-400 mt-4 max-w-md">
                  {(report.overallScore || 0) >= 70
                    ? 'Your website has a solid marketing foundation with room for targeted improvements.'
                    : (report.overallScore || 0) >= 50
                    ? 'Your website has potential but needs work in several key areas.'
                    : 'Your website needs significant improvements to effectively convert visitors.'}
                </p>
              </div>
              <div className="flex-shrink-0">
                {/* Right side content */}
                <div className="text-right space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Issues Found</p>
                    <p className="text-2xl font-bold">
                      {[
                        report.messagingAnalysis?.keyIssues?.length || 0,
                        report.seoOpportunities?.keyIssues?.length || 0,
                        report.contentStrategy?.keyIssues?.length || 0,
                        report.adAngles?.keyIssues?.length || 0,
                        report.conversionOptimization?.keyIssues?.length || 0,
                        report.distributionStrategy?.keyIssues?.length || 0,
                        report.aiSearchVisibility?.keyIssues?.length || 0,
                        report.technicalPerformance?.keyIssues?.length || 0,
                        report.brandHealth?.keyIssues?.length || 0,
                        report.designAuthenticity?.keyIssues?.length || 0,
                      ].reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Quick Wins Available</p>
                    <p className="text-2xl font-bold text-green-400">
                      {[
                        report.messagingAnalysis?.quickWins?.length || 0,
                        report.seoOpportunities?.quickWins?.length || 0,
                        report.contentStrategy?.quickWins?.length || 0,
                        report.adAngles?.quickWins?.length || 0,
                        report.conversionOptimization?.quickWins?.length || 0,
                        report.distributionStrategy?.quickWins?.length || 0,
                        report.aiSearchVisibility?.quickWins?.length || 0,
                        report.technicalPerformance?.quickWins?.length || 0,
                        report.brandHealth?.quickWins?.length || 0,
                        report.designAuthenticity?.quickWins?.length || 0,
                      ].reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                  {report.previousOverallScore !== null && report.scoreChange !== null && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Score Change</p>
                      <p className={`text-xl font-bold ${report.scoreChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {report.scoreChange >= 0 ? '+' : ''}{report.scoreChange}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Score Summary Grid */}
        <section id="score-breakdown" className="mb-12 print:mb-8 page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">2</span>
            Score Breakdown
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {Object.entries(scores).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 capitalize">{key}</span>
                  <span className="text-2xl font-bold text-gray-900">{value}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {value >= 70 ? 'Strong' : value >= 50 ? 'Average' : 'Needs Work'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Messaging Analysis */}
        {report.messagingAnalysis && (
          <section className="mb-12 print:mb-8 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">3</span>
              Messaging & Positioning
              <span className="ml-auto text-lg font-normal text-gray-500">{scores.messaging}/100</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{report.messagingAnalysis.summary}</p>
              </div>

              {/* Detailed Analysis */}
              {report.messagingAnalysis.detailedAnalysis && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Detailed Analysis</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(report.messagingAnalysis.detailedAnalysis).map(([key, value]) => {
                      if (typeof value === 'string') {
                        return (
                          <div key={key}>
                            <p className="font-medium text-gray-700 capitalize mb-1">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-gray-600">{value}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-4">
                    {report.messagingAnalysis.keyIssues.map((issue, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-red-200 rounded-lg overflow-hidden">
                          <div className="bg-red-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getIssueProblem(issue)}</div>
                            </div>
                          </div>
                          {getIssueSolution(issue) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Solution</div>
                                  <div className="text-gray-700 text-xs">{getIssueSolution(issue)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quick Wins
                  </h4>
                  <ul className="space-y-4">
                    {report.messagingAnalysis.quickWins.map((win, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-green-200 rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getQuickWinAction(win)}</div>
                            </div>
                          </div>
                          {getQuickWinImpact(win) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Impact</div>
                                  <div className="text-gray-700 text-xs">{getQuickWinImpact(win)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SEO Analysis */}
        {report.seoOpportunities && (
          <section className="mb-12 print:mb-8 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">4</span>
              SEO & Content Opportunities
              <span className="ml-auto text-lg font-normal text-gray-500">{scores.seo}/100</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{report.seoOpportunities.summary}</p>
              </div>

              {/* Detailed Analysis */}
              {report.seoOpportunities.detailedAnalysis && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Detailed Analysis</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(report.seoOpportunities.detailedAnalysis).map(([key, value]) => {
                      if (typeof value === 'string') {
                        return (
                          <div key={key}>
                            <p className="font-medium text-gray-700 capitalize mb-1">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-gray-600">{value}</p>
                          </div>
                        );
                      }
                      if (Array.isArray(value) && value.length > 0) {
                        return (
                          <div key={key} className="col-span-2">
                            <p className="font-medium text-gray-700 capitalize mb-2">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {value.slice(0, 5).map((item, i) => (
                                <li key={i} className="text-sm">{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-4">
                    {report.seoOpportunities.keyIssues.map((issue, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-red-200 rounded-lg overflow-hidden">
                          <div className="bg-red-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getIssueProblem(issue)}</div>
                            </div>
                          </div>
                          {getIssueSolution(issue) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Solution</div>
                                  <div className="text-gray-700 text-xs">{getIssueSolution(issue)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quick Wins
                  </h4>
                  <ul className="space-y-4">
                    {report.seoOpportunities.quickWins.map((win, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-green-200 rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getQuickWinAction(win)}</div>
                            </div>
                          </div>
                          {getQuickWinImpact(win) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Impact</div>
                                  <div className="text-gray-700 text-xs">{getQuickWinImpact(win)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content Strategy - Show if user has access */}
        {hasFullAccess && report.contentStrategy && (
          <section className="mb-12 print:mb-8 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">5</span>
              Content Strategy
              <span className="ml-auto text-lg font-normal text-gray-500">{scores.content}/100</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{report.contentStrategy.summary}</p>
              </div>

              {/* Content Pillars */}
              {report.contentStrategy.detailedAnalysis?.contentPillars && Array.isArray(report.contentStrategy.detailedAnalysis.contentPillars) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Content Pillars</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {report.contentStrategy.detailedAnalysis.contentPillars.map((pillar, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="font-medium text-gray-900 text-sm mb-1">
                          {typeof pillar === 'string' ? pillar : (pillar as any).pillar || (pillar as any).title}
                        </p>
                        {typeof pillar === 'object' && (pillar as any).description && (
                          <p className="text-xs text-gray-600">{(pillar as any).description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-4">
                    {report.contentStrategy.keyIssues.map((issue, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-red-200 rounded-lg overflow-hidden">
                          <div className="bg-red-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getIssueProblem(issue)}</div>
                            </div>
                          </div>
                          {getIssueSolution(issue) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Solution</div>
                                  <div className="text-gray-700 text-xs">{getIssueSolution(issue)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quick Wins
                  </h4>
                  <ul className="space-y-4">
                    {report.contentStrategy.quickWins.map((win, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-green-200 rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getQuickWinAction(win)}</div>
                            </div>
                          </div>
                          {getQuickWinImpact(win) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Impact</div>
                                  <div className="text-gray-700 text-xs">{getQuickWinImpact(win)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Ad Angles - Show if user has access */}
        {hasFullAccess && report.adAngles && (
          <section className="mb-12 print:mb-8 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">6</span>
              Ad Creative Ideas
              <span className="ml-auto text-lg font-normal text-gray-500">{scores.ads}/100</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{report.adAngles.summary}</p>
              </div>

              {report.adAngles.detailedAnalysis?.adHooks && Array.isArray(report.adAngles.detailedAnalysis.adHooks) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Ad Hooks</h4>
                  <div className="grid gap-2">
                    {report.adAngles.detailedAnalysis.adHooks.map((hook, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded p-2 border border-gray-100">
                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-semibold">{i + 1}</span>
                        <span className="flex-1">{typeof hook === 'string' ? hook : (hook as any).hook || JSON.stringify(hook)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-4">
                    {report.adAngles.keyIssues.map((issue, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-red-200 rounded-lg overflow-hidden">
                          <div className="bg-red-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getIssueProblem(issue)}</div>
                            </div>
                          </div>
                          {getIssueSolution(issue) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Solution</div>
                                  <div className="text-gray-700 text-xs">{getIssueSolution(issue)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quick Wins
                  </h4>
                  <ul className="space-y-4">
                    {report.adAngles.quickWins.map((win, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-green-200 rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getQuickWinAction(win)}</div>
                            </div>
                          </div>
                          {getQuickWinImpact(win) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Impact</div>
                                  <div className="text-gray-700 text-xs">{getQuickWinImpact(win)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Conversion Optimization - Show if user has access */}
        {hasFullAccess && report.conversionOptimization && (
          <section className="mb-12 print:mb-8 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">7</span>
              Conversion Optimization
              <span className="ml-auto text-lg font-normal text-gray-500">{scores.conversion}/100</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{report.conversionOptimization.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-4">
                    {report.conversionOptimization.keyIssues.map((issue, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-red-200 rounded-lg overflow-hidden">
                          <div className="bg-red-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getIssueProblem(issue)}</div>
                            </div>
                          </div>
                          {getIssueSolution(issue) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Solution</div>
                                  <div className="text-gray-700 text-xs">{getIssueSolution(issue)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quick Wins
                  </h4>
                  <ul className="space-y-4">
                    {report.conversionOptimization.quickWins.map((win, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-green-200 rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getQuickWinAction(win)}</div>
                            </div>
                          </div>
                          {getQuickWinImpact(win) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Impact</div>
                                  <div className="text-gray-700 text-xs">{getQuickWinImpact(win)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Distribution Strategy - Show if user has access */}
        {hasFullAccess && report.distributionStrategy && (
          <section className="mb-12 print:mb-8 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">8</span>
              Distribution Channels
              <span className="ml-auto text-lg font-normal text-gray-500">{scores.distribution}/100</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{report.distributionStrategy.summary}</p>
              </div>

              {report.distributionStrategy.detailedAnalysis?.channelRecommendations && Array.isArray(report.distributionStrategy.detailedAnalysis.channelRecommendations) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Channel Recommendations</h4>
                  <div className="space-y-3">
                    {report.distributionStrategy.detailedAnalysis.channelRecommendations.map((channel, i) => (
                      <div key={i} className="flex items-center justify-between bg-white rounded p-3 border border-gray-100">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{(channel as any).channel}</span>
                          <p className="text-sm text-gray-600 mt-1">{(channel as any).rationale}</p>
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-lg font-bold text-gray-900">{(channel as any).fit}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-4">
                    {report.distributionStrategy.keyIssues.map((issue, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-red-200 rounded-lg overflow-hidden">
                          <div className="bg-red-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getIssueProblem(issue)}</div>
                            </div>
                          </div>
                          {getIssueSolution(issue) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Solution</div>
                                  <div className="text-gray-700 text-xs">{getIssueSolution(issue)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quick Wins
                  </h4>
                  <ul className="space-y-4">
                    {report.distributionStrategy.quickWins.map((win, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-green-200 rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getQuickWinAction(win)}</div>
                            </div>
                          </div>
                          {getQuickWinImpact(win) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Impact</div>
                                  <div className="text-gray-700 text-xs">{getQuickWinImpact(win)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* AI Search Visibility - Show if user has access */}
        {hasFullAccess && report.aiSearchVisibility && (
          <section className="mb-12 print:mb-8 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">9</span>
              AI Search Visibility
              <span className="ml-auto text-lg font-normal text-gray-500">{scores.aiSearch}/100</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{report.aiSearchVisibility.summary}</p>
              </div>

              {/* AEO Score */}
              {report.aiSearchVisibility.detailedAnalysis?.aeoScore && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800 text-sm">Answer Engine Optimization (AEO)</h4>
                    <span className="text-lg font-semibold text-gray-900">{report.aiSearchVisibility.detailedAnalysis.aeoScore}/100</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Measures how likely your content is to be cited by AI assistants like ChatGPT and Perplexity.
                  </p>
                </div>
              )}

              {/* Analysis Cards Grid */}
              {report.aiSearchVisibility.detailedAnalysis && (
                <div className="grid grid-cols-2 gap-4">
                  {report.aiSearchVisibility.detailedAnalysis.entityClarity && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="font-medium text-gray-800 text-sm mb-1">Entity Clarity</p>
                      <p className="text-xs text-gray-600">{report.aiSearchVisibility.detailedAnalysis.entityClarity}</p>
                    </div>
                  )}
                  {report.aiSearchVisibility.detailedAnalysis.citationReadiness && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="font-medium text-gray-800 text-sm mb-1">Citation Readiness</p>
                      <p className="text-xs text-gray-600">{report.aiSearchVisibility.detailedAnalysis.citationReadiness}</p>
                    </div>
                  )}
                  {report.aiSearchVisibility.detailedAnalysis.contentStructureForAI && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="font-medium text-gray-800 text-sm mb-1">Content Structure</p>
                      <p className="text-xs text-gray-600">{report.aiSearchVisibility.detailedAnalysis.contentStructureForAI}</p>
                    </div>
                  )}
                  {report.aiSearchVisibility.detailedAnalysis.schemaMarkupAnalysis && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="font-medium text-gray-800 text-sm mb-1">Schema Markup</p>
                      <p className="text-xs text-gray-600">{report.aiSearchVisibility.detailedAnalysis.schemaMarkupAnalysis}</p>
                    </div>
                  )}
                </div>
              )}

              {/* AI Search Queries */}
              {report.aiSearchVisibility.detailedAnalysis?.aiSearchAppearance && Array.isArray(report.aiSearchVisibility.detailedAnalysis.aiSearchAppearance) && report.aiSearchVisibility.detailedAnalysis.aiSearchAppearance.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 text-sm mb-3">Potential AI Search Queries</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.aiSearchVisibility.detailedAnalysis.aiSearchAppearance.map((query, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white text-gray-700 rounded-md text-sm border border-gray-200">
                        {query}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Opportunities */}
              {report.aiSearchVisibility.detailedAnalysis?.faqOpportunities && Array.isArray(report.aiSearchVisibility.detailedAnalysis.faqOpportunities) && report.aiSearchVisibility.detailedAnalysis.faqOpportunities.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 text-sm mb-3">FAQ Opportunities</h4>
                  <ul className="space-y-2">
                    {report.aiSearchVisibility.detailedAnalysis.faqOpportunities.map((faq, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100">
                        <span className="text-gray-500 font-medium">Q:</span>
                        {faq}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-4">
                    {report.aiSearchVisibility.keyIssues.map((issue, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-red-200 rounded-lg overflow-hidden">
                          <div className="bg-red-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getIssueProblem(issue)}</div>
                            </div>
                          </div>
                          {getIssueSolution(issue) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Solution</div>
                                  <div className="text-gray-700 text-xs">{getIssueSolution(issue)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quick Wins
                  </h4>
                  <ul className="space-y-4">
                    {report.aiSearchVisibility.quickWins.map((win, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-green-200 rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getQuickWinAction(win)}</div>
                            </div>
                          </div>
                          {getQuickWinImpact(win) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Impact</div>
                                  <div className="text-gray-700 text-xs">{getQuickWinImpact(win)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Technical Performance - Show if user has access */}
        {hasFullAccess && report.technicalPerformance && (
          <section className="mb-12 print:mb-8 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">10</span>
              Technical Performance
              <span className="ml-auto text-lg font-normal text-gray-500">{scores.technical}/100</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{report.technicalPerformance.summary}</p>
              </div>

              {/* Page Speed */}
              {report.technicalPerformance.detailedAnalysis?.pageSpeedEstimate && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800 text-sm">Page Speed</h4>
                    <span className="text-lg font-semibold text-gray-900">{report.technicalPerformance.detailedAnalysis.pageSpeedEstimate}</span>
                  </div>
                  {report.technicalPerformance.detailedAnalysis.coreWebVitalsEstimate && (
                    <p className="text-xs text-gray-600">{report.technicalPerformance.detailedAnalysis.coreWebVitalsEstimate}</p>
                  )}
                </div>
              )}

              {/* Analysis Cards Grid */}
              {report.technicalPerformance.detailedAnalysis && (
                <div className="grid grid-cols-2 gap-4">
                  {report.technicalPerformance.detailedAnalysis.mobileReadiness && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="font-medium text-gray-800 text-sm mb-1">Mobile Readiness</p>
                      <p className="text-xs text-gray-600">{report.technicalPerformance.detailedAnalysis.mobileReadiness}</p>
                    </div>
                  )}
                  {report.technicalPerformance.detailedAnalysis.imageOptimization && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="font-medium text-gray-800 text-sm mb-1">Image Optimization</p>
                      <p className="text-xs text-gray-600">{report.technicalPerformance.detailedAnalysis.imageOptimization}</p>
                    </div>
                  )}
                  {report.technicalPerformance.detailedAnalysis.structuredDataPresence && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="font-medium text-gray-800 text-sm mb-1">Structured Data</p>
                      <p className="text-xs text-gray-600">{report.technicalPerformance.detailedAnalysis.structuredDataPresence}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Security Indicators */}
              {report.technicalPerformance.detailedAnalysis?.securityIndicators && Array.isArray(report.technicalPerformance.detailedAnalysis.securityIndicators) && report.technicalPerformance.detailedAnalysis.securityIndicators.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 text-sm mb-3">Security Indicators</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.technicalPerformance.detailedAnalysis.securityIndicators.map((indicator, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white text-gray-700 rounded-md text-sm border border-gray-200">
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Accessibility Flags */}
              {report.technicalPerformance.detailedAnalysis?.accessibilityFlags && Array.isArray(report.technicalPerformance.detailedAnalysis.accessibilityFlags) && report.technicalPerformance.detailedAnalysis.accessibilityFlags.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 text-sm mb-3">Accessibility Flags</h4>
                  <ul className="space-y-2">
                    {report.technicalPerformance.detailedAnalysis.accessibilityFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-white rounded-lg p-3 border border-gray-100">
                        <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-4">
                    {report.technicalPerformance.keyIssues.map((issue, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-red-200 rounded-lg overflow-hidden">
                          <div className="bg-red-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getIssueProblem(issue)}</div>
                            </div>
                          </div>
                          {getIssueSolution(issue) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Solution</div>
                                  <div className="text-gray-700 text-xs">{getIssueSolution(issue)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quick Wins
                  </h4>
                  <ul className="space-y-4">
                    {report.technicalPerformance.quickWins.map((win, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-green-200 rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getQuickWinAction(win)}</div>
                            </div>
                          </div>
                          {getQuickWinImpact(win) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Impact</div>
                                  <div className="text-gray-700 text-xs">{getQuickWinImpact(win)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Brand Health - Show if user has access */}
        {hasFullAccess && report.brandHealth && (
          <section className="mb-12 print:mb-8 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">11</span>
              Brand Health
              <span className="ml-auto text-lg font-normal text-gray-500">{scores.brand}/100</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{report.brandHealth.summary}</p>
              </div>

              {/* Key Metrics Grid */}
              {report.brandHealth.detailedAnalysis && (
                <div className="grid grid-cols-4 gap-3">
                  {report.brandHealth.detailedAnalysis.voiceToneAnalysis && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Voice</p>
                      <p className="text-xs font-medium text-gray-800 line-clamp-2">{toDisplayString(report.brandHealth.detailedAnalysis.voiceToneAnalysis).split('.')[0]}</p>
                    </div>
                  )}
                  {report.brandHealth.detailedAnalysis.brandPersonality && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Personality</p>
                      <p className="text-xs font-medium text-gray-800 line-clamp-2">{toDisplayString(report.brandHealth.detailedAnalysis.brandPersonality).split('.')[0]}</p>
                    </div>
                  )}
                  {report.brandHealth.detailedAnalysis.memorabilityScore && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Memorability</p>
                      <p className="text-xs font-medium text-gray-800 line-clamp-2">{toDisplayString(report.brandHealth.detailedAnalysis.memorabilityScore).split('.')[0]}</p>
                    </div>
                  )}
                  {report.brandHealth.detailedAnalysis.trustPerception && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Trust</p>
                      <p className="text-xs font-medium text-gray-800 line-clamp-2">{toDisplayString(report.brandHealth.detailedAnalysis.trustPerception).split('.')[0]}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis Cards Grid */}
              {report.brandHealth.detailedAnalysis && (
                <div className="grid grid-cols-2 gap-4">
                  {report.brandHealth.detailedAnalysis.brandConsistency && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="font-medium text-gray-800 text-sm mb-1">Brand Consistency</p>
                      <p className="text-xs text-gray-600">{toDisplayString(report.brandHealth.detailedAnalysis.brandConsistency)}</p>
                    </div>
                  )}
                  {report.brandHealth.detailedAnalysis.visualIdentityNotes && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="font-medium text-gray-800 text-sm mb-1">Visual Identity</p>
                      <p className="text-xs text-gray-600">{toDisplayString(report.brandHealth.detailedAnalysis.visualIdentityNotes)}</p>
                    </div>
                  )}
                  {report.brandHealth.detailedAnalysis.competitorDifferentiation && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 col-span-2">
                      <p className="font-medium text-gray-800 text-sm mb-1">Competitor Differentiation</p>
                      <p className="text-xs text-gray-600">{toDisplayString(report.brandHealth.detailedAnalysis.competitorDifferentiation)}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-4">
                    {report.brandHealth.keyIssues.map((issue, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-red-200 rounded-lg overflow-hidden">
                          <div className="bg-red-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getIssueProblem(issue)}</div>
                            </div>
                          </div>
                          {getIssueSolution(issue) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Solution</div>
                                  <div className="text-gray-700 text-xs">{getIssueSolution(issue)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quick Wins
                  </h4>
                  <ul className="space-y-4">
                    {report.brandHealth.quickWins.map((win, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-green-200 rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getQuickWinAction(win)}</div>
                            </div>
                          </div>
                          {getQuickWinImpact(win) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Impact</div>
                                  <div className="text-gray-700 text-xs">{getQuickWinImpact(win)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Design Authenticity - Show if user has access */}
        {hasFullAccess && report.designAuthenticity && (
          <section className="mb-12 print:mb-8 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">12</span>
              Design Authenticity
              <span className="ml-auto text-lg font-normal text-gray-500">{scores.design}/100</span>
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{report.designAuthenticity.summary}</p>
              </div>

              {/* Authenticity Rating */}
              {report.designAuthenticity.detailedAnalysis?.authenticityRating && (
                <div className="flex items-center justify-center">
                  <div className="px-6 py-3 rounded-full font-semibold text-sm bg-gray-100 text-gray-800 border-2 border-gray-300">
                    {report.designAuthenticity.detailedAnalysis.authenticityRating}
                  </div>
                </div>
              )}

              {/* Key Metrics Grid */}
              {report.designAuthenticity.detailedAnalysis && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="font-medium text-gray-800 text-sm mb-1">Cliché Phrases</p>
                    <p className="text-2xl font-bold text-gray-900">{report.designAuthenticity.detailedAnalysis.clicheCount || 0}</p>
                    <p className="text-xs font-medium uppercase text-gray-600 mt-1">
                      {report.designAuthenticity.detailedAnalysis.clicheSeverity || 'none'} severity
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="font-medium text-gray-800 text-sm mb-1">Layout</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {report.designAuthenticity.detailedAnalysis.layoutAuthenticity || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {report.designAuthenticity.detailedAnalysis.layoutPattern || 'Pattern analysis pending'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="font-medium text-gray-800 text-sm mb-1">Icons</p>
                    <p className="text-sm font-medium text-gray-900">
                      {report.designAuthenticity.detailedAnalysis.usesCustomIcons ? 'Custom' : 'Default Library'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {Array.isArray(report.designAuthenticity.detailedAnalysis.iconLibrariesFound) && report.designAuthenticity.detailedAnalysis.iconLibrariesFound.length > 0
                        ? report.designAuthenticity.detailedAnalysis.iconLibrariesFound.join(', ')
                        : 'No libraries detected'}
                    </p>
                  </div>
                </div>
              )}

              {/* Detected Cliché Phrases */}
              {report.designAuthenticity.detailedAnalysis?.clichePhrasesDetected && Array.isArray(report.designAuthenticity.detailedAnalysis.clichePhrasesDetected) && report.designAuthenticity.detailedAnalysis.clichePhrasesDetected.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 text-sm mb-3">Detected AI Phrases</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.designAuthenticity.detailedAnalysis.clichePhrasesDetected.map((phrase, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-200 text-gray-900 rounded-full text-xs font-medium">
                        &quot;{phrase}&quot;
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Layout & Icon Analysis */}
              {report.designAuthenticity.detailedAnalysis && (
                <div className="grid grid-cols-2 gap-4">
                  {report.designAuthenticity.detailedAnalysis.layoutDescription && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="font-medium text-gray-800 text-sm mb-1">Layout Analysis</p>
                      <p className="text-xs text-gray-600">{report.designAuthenticity.detailedAnalysis.layoutDescription}</p>
                    </div>
                  )}
                  {report.designAuthenticity.detailedAnalysis.iconAnalysis && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="font-medium text-gray-800 text-sm mb-1">Icon Usage</p>
                      <p className="text-xs text-gray-600">{report.designAuthenticity.detailedAnalysis.iconAnalysis}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Strengths & Recommendations */}
              {report.designAuthenticity.detailedAnalysis?.strengthsSummary && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 text-sm mb-2">Unique Strengths</h4>
                  <p className="text-sm text-gray-600">{report.designAuthenticity.detailedAnalysis.strengthsSummary}</p>
                </div>
              )}

              {report.designAuthenticity.detailedAnalysis?.recommendations && Array.isArray(report.designAuthenticity.detailedAnalysis.recommendations) && report.designAuthenticity.detailedAnalysis.recommendations.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 text-sm mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {report.designAuthenticity.detailedAnalysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-4">
                    {report.designAuthenticity.keyIssues.map((issue, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-red-200 rounded-lg overflow-hidden">
                          <div className="bg-red-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getIssueProblem(issue)}</div>
                            </div>
                          </div>
                          {getIssueSolution(issue) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Solution</div>
                                  <div className="text-gray-700 text-xs">{getIssueSolution(issue)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quick Wins
                  </h4>
                  <ul className="space-y-4">
                    {report.designAuthenticity.quickWins.map((win, i) => (
                      <li key={i} className="text-sm">
                        <div className="border border-green-200 rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{getQuickWinAction(win)}</div>
                            </div>
                          </div>
                          {getQuickWinImpact(win) && (
                            <div className="bg-white p-3 border-t border-gray-200">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-xs mb-1">Impact</div>
                                  <div className="text-gray-700 text-xs">{getQuickWinImpact(win)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Locked Sections Notice - Show if not paid */}
        {!hasFullAccess && lockedSections.length > 0 && (
          <section className="mb-12 print:mb-8 page-break-inside-avoid">
            <div className="bg-gray-100 rounded-lg p-8 text-center border border-gray-200">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{lockedSections.length} Section{lockedSections.length !== 1 ? 's' : ''} Locked</h3>
              <p className="text-gray-600 mb-4">
                Unlock the full report to access:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                {lockedSections.map((section, i) => (
                  <li key={i}>• {section}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-500">
                Visit the report page to upgrade your plan
              </p>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-8 border-t-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BP</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">BrandProbe</p>
                <p className="text-xs text-gray-500">AI-Powered Marketing Intelligence</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Report Generated on</p>
              <p className="font-semibold text-gray-900">{new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600">
            <p>This report was generated by <span className="font-semibold text-gray-900">BrandProbe</span>, an AI-powered marketing analysis platform.</p>
            <p className="mt-2">For more information, visit <span className="font-semibold text-gray-900">brandprobe.ai</span></p>
            <p className="mt-3 text-xs text-gray-500">&copy; {new Date().getFullYear()} BrandProbe. All rights reserved. | Confidential Report</p>
          </div>
        </footer>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.75in;
            size: A4;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Force each section to start on a new page */
          section {
            page-break-before: always;
            break-before: page;
            margin-bottom: 1.5rem !important;
          }

          /* Allow Overall Score and Score Breakdown on first page */
          #overall-score,
          #score-breakdown {
            page-break-before: auto;
            break-before: auto;
          }

          /* Prevent breaks in the middle of cards */
          .border.border-red-200,
          .border.border-green-200 {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          /* Keep subsections together when possible */
          .bg-gray-50.rounded-lg,
          .bg-red-50.rounded-lg,
          .bg-green-50.rounded-lg {
            break-inside: avoid-page;
            page-break-inside: avoid;
          }

          /* Avoid orphan headings */
          h2, h3, h4 {
            break-after: avoid;
            page-break-after: avoid;
          }

          /* Keep footer at bottom of last page */
          footer {
            page-break-before: auto;
            break-before: auto;
            margin-top: 3rem !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
