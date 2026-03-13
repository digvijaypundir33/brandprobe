'use client';

import { motion } from 'framer-motion';
import type { TechnicalPerformance, TechnicalData } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';
import PageSpeedMetrics from './PageSpeedMetrics';
import { getScoreColorClass } from '@/lib/utils';

interface TechnicalPerformanceCardProps {
  technical: TechnicalPerformance;
  technicalData?: Partial<TechnicalData>;
}

function getSpeedColor(speed: string): string {
  switch (speed) {
    case 'Fast':
      return 'text-green-600 bg-green-100';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'Slow':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export default function TechnicalPerformanceCard({ technical, technicalData }: TechnicalPerformanceCardProps) {
  const analysis = technical.detailedAnalysis || {};
  const securityIndicators = Array.isArray(analysis.securityIndicators) ? analysis.securityIndicators : [];
  const accessibilityFlags = Array.isArray(analysis.accessibilityFlags) ? analysis.accessibilityFlags : [];

  // Security headers from scraped data
  const securityHeaders = technicalData?.securityHeaders;

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Technical Performance</h2>
              <p className="text-gray-400 text-sm">Website health and speed analysis</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColorClass(technical.score)}`}>{technical.score}</div>
            <div className="text-gray-400 text-sm">/100</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <p className="text-gray-700 text-sm">{technical.summary}</p>
        </div>

        {/* Speed Badge */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`rounded-lg px-4 py-3 ${getSpeedColor(analysis.pageSpeedEstimate)}`}>
            <div className="text-xs uppercase tracking-wide opacity-75">Page Speed</div>
            <div className="text-xl font-bold">{analysis.pageSpeedEstimate}</div>
          </div>
          <div className="flex-1 text-sm text-gray-600">
            {analysis.coreWebVitalsEstimate}
          </div>
        </div>

        {/* Analysis Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">Mobile Readiness</h4>
            </div>
            <p className="text-xs text-gray-600">{analysis.mobileReadiness}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 4 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">Image Optimization</h4>
            </div>
            <p className="text-xs text-gray-600">{analysis.imageOptimization}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">Structured Data</h4>
            </div>
            <p className="text-xs text-gray-600">{analysis.structuredDataPresence}</p>
          </div>
        </div>

        {/* PageSpeed Insights (when available) */}
        {analysis.pageSpeedInsights && (
          <div className="mb-6">
            <PageSpeedMetrics pageSpeedInsights={analysis.pageSpeedInsights} />
          </div>
        )}

        {/* Data source indicator */}
        {analysis.dataSource && (
          <div className="mb-4 text-xs text-gray-500 flex items-center gap-2">
            {analysis.dataSource === 'pagespeed-api' ? (
              <>
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Powered by Google PageSpeed Insights (Lighthouse {analysis.pageSpeedInsights?.lighthouseVersion})</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clipRule="evenodd" />
                </svg>
                <span>Estimated (PageSpeed API unavailable)</span>
              </>
            )}
          </div>
        )}

        {/* Security Indicators */}
        {securityIndicators.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Security Indicators
            </h4>
            <div className="flex flex-wrap gap-2">
              {securityIndicators.map((indicator, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-sm border border-gray-200"
                >
                  {indicator}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Security Headers */}
        {securityHeaders && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security Headers
            </h4>
            <div className="space-y-2">
              {/* HSTS */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  {securityHeaders.hasHSTS ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-700">Strict-Transport-Security (HSTS)</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${securityHeaders.hasHSTS ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {securityHeaders.hasHSTS ? 'Present' : 'Missing'}
                </span>
              </div>

              {/* CSP */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  {securityHeaders.hasCSP ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-700">Content-Security-Policy (CSP)</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${securityHeaders.hasCSP ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {securityHeaders.hasCSP ? 'Present' : 'Missing'}
                </span>
              </div>

              {/* X-Frame-Options */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  {securityHeaders.hasXFrameOptions ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-700">X-Frame-Options</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${securityHeaders.hasXFrameOptions ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {securityHeaders.hasXFrameOptions ? securityHeaders.xFrameOptionsValue || 'Present' : 'Missing'}
                </span>
              </div>

              {/* X-Content-Type-Options */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  {securityHeaders.hasXContentTypeOptions ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-700">X-Content-Type-Options</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${securityHeaders.hasXContentTypeOptions ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {securityHeaders.hasXContentTypeOptions ? securityHeaders.xContentTypeOptionsValue || 'Present' : 'Missing'}
                </span>
              </div>

              {/* Referrer-Policy */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  {securityHeaders.hasReferrerPolicy ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-700">Referrer-Policy</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${securityHeaders.hasReferrerPolicy ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {securityHeaders.hasReferrerPolicy ? securityHeaders.referrerPolicyValue || 'Present' : 'Optional'}
                </span>
              </div>

              {/* Permissions-Policy */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  {securityHeaders.hasPermissionsPolicy ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-700">Permissions-Policy</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${securityHeaders.hasPermissionsPolicy ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {securityHeaders.hasPermissionsPolicy ? 'Present' : 'Optional'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Flags */}
        {accessibilityFlags.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Accessibility Flags
            </h4>
            <ul className="space-y-2">
              {accessibilityFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Issues & Quick Wins */}
        <IssuesAndQuickWins
          keyIssues={technical.keyIssues}
          quickWins={technical.quickWins}
          issuesTitle="Technical Issues"
        />
      </div>
    </motion.div>
  );
}
