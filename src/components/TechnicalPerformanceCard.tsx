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

function getScoreBadgeColor(score: number) {
  if (score >= 75) return { bg: 'bg-[#6bff8f]', text: 'text-[#005f28]', label: 'Excellent' };
  if (score >= 50) return { bg: 'bg-[#fed01b]', text: 'text-[#594700]', label: 'Average' };
  return { bg: 'bg-[#f74b6d]', text: 'text-[#510017]', label: 'Needs Work' };
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
  const badgeColor = getScoreBadgeColor(technical.score);

  // Security headers from scraped data
  const securityHeaders = technicalData?.securityHeaders;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(44,47,49,0.06)] overflow-hidden"
    >
      {/* Header */}
      <div className="p-8 border-b border-[#abadaf]/15">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold text-[#2c2f31] tracking-tight">
              Technical Performance
            </h1>
            <p className="text-[#595c5e] font-body text-lg">Website health and speed analysis</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 ${badgeColor.bg} ${badgeColor.text} rounded-full text-xs font-label font-bold uppercase tracking-wider mb-2`}>
              {badgeColor.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-headline font-bold text-[#2c2f31]">{technical.score}</span>
              <span className="text-xl text-[#595c5e] font-light">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {technical.summary && (
          <div className="bg-[#eef1f3]/30 rounded-xl p-6 mb-8">
            <p className="text-[#595c5e] leading-relaxed font-body">{technical.summary}</p>
          </div>
        )}

        {/* Speed Badge */}
        {analysis.pageSpeedEstimate && (
          <div className="bg-[#f8f9ff] border border-[#5B5BD5]/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-headline font-semibold text-[#5B5BD5] text-sm">Page Speed</h4>
              <span className="text-2xl font-headline font-bold text-[#5B5BD5]">{analysis.pageSpeedEstimate}</span>
            </div>
            {analysis.coreWebVitalsEstimate && (
              <p className="text-sm text-[#595c5e] font-body leading-relaxed">
                {analysis.coreWebVitalsEstimate}
              </p>
            )}
          </div>
        )}

        {/* Performance Analysis */}
        <div className="mb-8 space-y-6">
          <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Performance Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Mobile Readiness', content: analysis.mobileReadiness, icon: 'phone_iphone' },
              { title: 'Image Optimization', content: analysis.imageOptimization, icon: 'image' },
              { title: 'Structured Data', content: analysis.structuredDataPresence, icon: 'sell' },
            ].map((item, idx) => {
              if (!item.content) return null;
              const isFirstItem = idx === 0;
              return (
                <div
                  key={item.title}
                  className={`flex items-start gap-4 p-4 rounded-xl border ${
                    isFirstItem
                      ? 'bg-[#f8f9ff] border-[#5B5BD5]/10'
                      : 'bg-[#eef1f3]/20 border-[#abadaf]/10'
                  }`}
                >
                  <span className={`material-symbols-outlined mt-0.5 ${
                    isFirstItem ? 'text-[#5B5BD5]' : 'text-[#595c5e]'
                  }`}>
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <h4 className={`font-headline font-semibold text-sm mb-2 ${
                      isFirstItem ? 'text-[#5B5BD5]' : 'text-[#2c2f31]'
                    }`}>
                      {item.title}
                    </h4>
                    <p className="text-sm text-[#595c5e] leading-relaxed font-body">{item.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PageSpeed Insights (when available) */}
        {analysis.pageSpeedInsights && (
          <div className="mb-8">
            <PageSpeedMetrics pageSpeedInsights={analysis.pageSpeedInsights} />
          </div>
        )}

        {/* Data source indicator */}
        {analysis.dataSource && (
          <div className="mb-8 text-xs text-[#595c5e] flex items-center gap-2 bg-[#eef1f3]/30 rounded-xl p-4">
            {analysis.dataSource === 'pagespeed-api' ? (
              <>
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-body">Powered by Google PageSpeed Insights (Lighthouse {analysis.pageSpeedInsights?.lighthouseVersion})</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clipRule="evenodd" />
                </svg>
                <span className="font-body">Estimated (PageSpeed API unavailable)</span>
              </>
            )}
          </div>
        )}

        {/* Security Indicators */}
        {securityIndicators.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Security Indicators</h3>
            <div className="flex flex-wrap gap-2">
              {securityIndicators.map((indicator, i) => (
                <span
                  key={i}
                  className="px-3 py-2 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg text-sm font-label font-medium"
                >
                  {indicator}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Security Headers */}
        {securityHeaders && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Security Headers</h3>
            <div className="space-y-3">
              {/* HSTS */}
              <div className="flex items-center justify-between p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10">
                <div className="flex items-center gap-3">
                  {securityHeaders.hasHSTS ? (
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  )}
                  <span className="text-sm font-headline font-semibold text-[#2c2f31]">Strict-Transport-Security (HSTS)</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-label ${securityHeaders.hasHSTS ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {securityHeaders.hasHSTS ? 'Present' : 'Missing'}
                </span>
              </div>

              {/* CSP */}
              <div className="flex items-center justify-between p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10">
                <div className="flex items-center gap-3">
                  {securityHeaders.hasCSP ? (
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  )}
                  <span className="text-sm font-headline font-semibold text-[#2c2f31]">Content-Security-Policy (CSP)</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-label ${securityHeaders.hasCSP ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {securityHeaders.hasCSP ? 'Present' : 'Missing'}
                </span>
              </div>

              {/* X-Frame-Options */}
              <div className="flex items-center justify-between p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10">
                <div className="flex items-center gap-3">
                  {securityHeaders.hasXFrameOptions ? (
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  )}
                  <span className="text-sm font-headline font-semibold text-[#2c2f31]">X-Frame-Options</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-label ${securityHeaders.hasXFrameOptions ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {securityHeaders.hasXFrameOptions ? securityHeaders.xFrameOptionsValue || 'Present' : 'Missing'}
                </span>
              </div>

              {/* X-Content-Type-Options */}
              <div className="flex items-center justify-between p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10">
                <div className="flex items-center gap-3">
                  {securityHeaders.hasXContentTypeOptions ? (
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  )}
                  <span className="text-sm font-headline font-semibold text-[#2c2f31]">X-Content-Type-Options</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-label ${securityHeaders.hasXContentTypeOptions ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {securityHeaders.hasXContentTypeOptions ? securityHeaders.xContentTypeOptionsValue || 'Present' : 'Missing'}
                </span>
              </div>

              {/* Referrer-Policy */}
              <div className="flex items-center justify-between p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10">
                <div className="flex items-center gap-3">
                  {securityHeaders.hasReferrerPolicy ? (
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                      </svg>
                    </span>
                  )}
                  <span className="text-sm font-headline font-semibold text-[#2c2f31]">Referrer-Policy</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-label ${securityHeaders.hasReferrerPolicy ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {securityHeaders.hasReferrerPolicy ? securityHeaders.referrerPolicyValue || 'Present' : 'Optional'}
                </span>
              </div>

              {/* Permissions-Policy */}
              <div className="flex items-center justify-between p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10">
                <div className="flex items-center gap-3">
                  {securityHeaders.hasPermissionsPolicy ? (
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                      </svg>
                    </span>
                  )}
                  <span className="text-sm font-headline font-semibold text-[#2c2f31]">Permissions-Policy</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-label ${securityHeaders.hasPermissionsPolicy ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {securityHeaders.hasPermissionsPolicy ? 'Present' : 'Optional'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Flags */}
        {accessibilityFlags.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Accessibility Flags</h3>
            <div className="space-y-3">
              {accessibilityFlags.map((flag, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg flex items-center justify-center text-sm font-headline font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#2c2f31] font-body leading-relaxed">{flag}</p>
                </div>
              ))}
            </div>
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
