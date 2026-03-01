'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import type { Report, Issue, QuickWin } from '@/types/report';

// Helper to extract text from Issue/QuickWin objects or strings
function getIssueText(issue: Issue | string): string {
  return typeof issue === 'string' ? issue : issue.problem;
}

function getQuickWinText(win: QuickWin | string): string {
  return typeof win === 'string' ? win : win.action;
}

export default function PrintReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPaid] = useState(process.env.NODE_ENV === 'development');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/report/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch report');
        }

        setReport(data.report);
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
  };

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
      <div className="max-w-4xl mx-auto px-8 py-12 print:px-0 print:py-0">
        {/* Header */}
        <header className="mb-12 print:mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center print:bg-gray-900">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">BrandProbe</h1>
              <p className="text-gray-500">Marketing Analysis Report</p>
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
          </div>
        </header>

        {/* Overall Score */}
        <section className="mb-12 print:mb-8 page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">1</span>
            Overall Score
          </h2>

          <div className="bg-gray-900 rounded-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
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
              <div className="text-right">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(scores).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-3xl font-bold">{value}</p>
                      <p className="text-xs text-gray-400 capitalize">{key}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Score Summary Grid */}
        <section className="mb-12 print:mb-8 page-break-inside-avoid">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-2">
                    {report.messagingAnalysis.keyIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {getIssueText(issue)}
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
                  <ul className="space-y-2">
                    {report.messagingAnalysis.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {getQuickWinText(win)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-2">
                    {report.seoOpportunities.keyIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {getIssueText(issue)}
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
                  <ul className="space-y-2">
                    {report.seoOpportunities.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {getQuickWinText(win)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

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
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Content Strategy - Only show if paid */}
        {isPaid && report.contentStrategy && (
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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-2">
                    {report.contentStrategy.keyIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {getIssueText(issue)}
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
                  <ul className="space-y-2">
                    {report.contentStrategy.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {getQuickWinText(win)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Ad Angles - Only show if paid */}
        {isPaid && report.adAngles && (
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

              {report.adAngles.detailedAnalysis?.adHooks && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Ad Hooks</h4>
                  <ul className="space-y-2">
                    {report.adAngles.detailedAnalysis.adHooks.slice(0, 5).map((hook, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                        {typeof hook === 'string' ? hook : JSON.stringify(hook)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.adAngles.detailedAnalysis?.headlineSuggestions && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Headline Suggestions</h4>
                  <ul className="space-y-2">
                    {report.adAngles.detailedAnalysis.headlineSuggestions.slice(0, 5).map((headline, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                        {typeof headline === 'string' ? headline : JSON.stringify(headline)}
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
                  <ul className="space-y-2">
                    {report.adAngles.keyIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {getIssueText(issue)}
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
                  <ul className="space-y-2">
                    {report.adAngles.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {getQuickWinText(win)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Conversion Optimization - Only show if paid */}
        {isPaid && report.conversionOptimization && (
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
                  <ul className="space-y-2">
                    {report.conversionOptimization.keyIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {getIssueText(issue)}
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
                  <ul className="space-y-2">
                    {report.conversionOptimization.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {getQuickWinText(win)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Distribution Strategy - Only show if paid */}
        {isPaid && report.distributionStrategy && (
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

              {report.distributionStrategy.detailedAnalysis?.channelRecommendations && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Channel Recommendations</h4>
                  <div className="space-y-3">
                    {report.distributionStrategy.detailedAnalysis.channelRecommendations.map((channel, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">{channel.channel}</span>
                          <p className="text-sm text-gray-600">{channel.rationale}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900">{channel.fit}/10</span>
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
                  <ul className="space-y-2">
                    {report.distributionStrategy.keyIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {getIssueText(issue)}
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
                  <ul className="space-y-2">
                    {report.distributionStrategy.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {getQuickWinText(win)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* AI Search Visibility - Only show if paid */}
        {isPaid && report.aiSearchVisibility && (
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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-2">
                    {report.aiSearchVisibility.keyIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {getIssueText(issue)}
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
                  <ul className="space-y-2">
                    {report.aiSearchVisibility.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {getQuickWinText(win)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Technical Performance - Only show if paid */}
        {isPaid && report.technicalPerformance && (
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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-2">
                    {report.technicalPerformance.keyIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {getIssueText(issue)}
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
                  <ul className="space-y-2">
                    {report.technicalPerformance.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {getQuickWinText(win)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Brand Health - Only show if paid */}
        {isPaid && report.brandHealth && (
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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Key Issues
                  </h4>
                  <ul className="space-y-2">
                    {report.brandHealth.keyIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {getIssueText(issue)}
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
                  <ul className="space-y-2">
                    {report.brandHealth.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {getQuickWinText(win)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Locked Sections Notice - Show if not paid */}
        {!isPaid && (
          <section className="mb-12 print:mb-8">
            <div className="bg-gray-100 rounded-lg p-8 text-center border border-gray-200">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">4 Sections Locked</h3>
              <p className="text-gray-600 mb-4">
                Unlock the full report to access Content Strategy, Ad Creative Ideas,
                Conversion Optimization, and Distribution Channels.
              </p>
              <p className="text-sm text-gray-500">
                Visit {report.url ? new URL(report.url).origin : 'brandprobe.com'} to unlock
              </p>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">BrandProbe</span>
          </div>
          <p>Generated on {new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} BrandProbe. All rights reserved.</p>
        </footer>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 1in;
            size: A4;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .page-break-inside-avoid {
            page-break-inside: avoid;
          }

          .page-break-before {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
}
