'use client';

import { motion } from 'framer-motion';
import type { Report } from '@/types/report';

interface ExecutiveSummaryProps {
  report: Report;
  hasFullAccess?: boolean;
}

export default function ExecutiveSummary({ report, hasFullAccess = false }: ExecutiveSummaryProps) {
  // Show all 10 sections for all users (blur locked ones for free users)
  const allSections = [
    { name: 'Messaging', score: report.messagingScore || 0, summary: report.messagingAnalysis?.summary, free: true },
    { name: 'SEO', score: report.seoScore || 0, summary: report.seoOpportunities?.summary, free: true },
    { name: 'Content', score: report.contentScore || 0, summary: report.contentStrategy?.summary, free: true },
    { name: 'Ads', score: report.adsScore || 0, summary: report.adAngles?.summary, free: true },
    { name: 'Conversion', score: report.conversionScore || 0, summary: hasFullAccess ? report.conversionOptimization?.summary : 'Unlock to see detailed conversion optimization insights and recommendations.', free: false },
    { name: 'Distribution', score: report.distributionScore || 0, summary: hasFullAccess ? report.distributionStrategy?.summary : 'Unlock to see detailed distribution strategy insights and recommendations.', free: false },
    { name: 'AI Search', score: report.aiSearchScore || 0, summary: hasFullAccess ? report.aiSearchVisibility?.summary : 'Unlock to see detailed AI search visibility insights and recommendations.', free: false },
    { name: 'Technical', score: report.technicalScore || 0, summary: hasFullAccess ? report.technicalPerformance?.summary : 'Unlock to see detailed technical performance insights and recommendations.', free: false },
    { name: 'Brand Health', score: report.brandHealthScore || 0, summary: hasFullAccess ? report.brandHealth?.summary : 'Unlock to see detailed brand health insights and recommendations.', free: false },
    { name: 'Design', score: report.designAuthenticityScore || 0, summary: hasFullAccess ? report.designAuthenticity?.summary : 'Unlock to see detailed design authenticity insights and recommendations.', free: false },
  ];

  const sections = allSections;

  const topStrengths = sections
    .filter(s => s.score >= 70)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const topWeaknesses = sections
    .filter(s => s.score < 50)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const overallScore = report.overallScore || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-soft"
    >
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 bg-[#E9E9FB] rounded-xl flex items-center justify-center text-[#5B5BD5]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-lg md:text-xl font-[family-name:var(--font-space-grotesk)] font-bold text-slate-900">Executive Summary</h2>
      </div>

      {/* Overall Assessment */}
      <p className="text-slate-600 leading-relaxed text-base md:text-lg mb-6 md:mb-8">
        {overallScore >= 70
          ? 'Your website demonstrates strong marketing fundamentals with several standout sections. Focus on the priority improvements below to maximize your conversion potential.'
          : overallScore >= 50
          ? 'Your website shows solid potential but needs targeted improvements in key areas. The analysis reveals specific opportunities to enhance your marketing effectiveness.'
          : 'Your website requires significant optimization to effectively convert visitors. The areas below need immediate attention to improve your marketing performance.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Strengths */}
        <div className="p-6 md:p-8 bg-green-50/50 border border-green-100 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 md:mb-6 text-green-800">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h4 className="font-bold text-sm md:text-base uppercase tracking-wide">Top Strengths</h4>
          </div>
          {topStrengths.length > 0 ? (
            <ul className="space-y-3 md:space-y-4">
              {topStrengths.map((section) => (
                <li key={section.name} className="text-sm font-medium text-green-900 flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  <span>
                    <strong>{section.name}</strong> ({section.score}/100) — {section.summary?.split('.')[0]}.
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-700 text-sm">No areas scoring above 70 yet. Keep optimizing!</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="p-6 md:p-8 bg-red-50/80 border border-red-100 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 md:mb-6 text-red-900">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h4 className="font-bold text-sm md:text-base uppercase tracking-wide">Priority Improvements</h4>
          </div>
          {topWeaknesses.length > 0 ? (
            <ul className="space-y-3 md:space-y-4">
              {topWeaknesses.map((section) => (
                <li key={section.name} className="text-sm font-medium text-red-900 flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>
                    <strong>{section.name}</strong> ({section.score}/100) — {section.summary?.split('.')[0]}.
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-700 text-sm">No critical areas needing immediate attention.</p>
          )}
        </div>
      </div>

      {/* Technical Quick Checks */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Technical Quick Checks
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {/* Schema Markup */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              {report.scrapedData?.technicalData?.hasStructuredData ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-xs font-medium text-gray-700">Schema Markup</span>
            </div>
            <p className="text-[10px] text-gray-500">JSON-LD structured data</p>
          </div>

          {/* SSL/HTTPS */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              {report.scrapedData?.technicalData?.hasSSL ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-xs font-medium text-gray-700">SSL/HTTPS</span>
            </div>
            <p className="text-[10px] text-gray-500">Secure connection</p>
          </div>

          {/* Mobile Friendly */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              {report.scrapedData?.technicalData?.hasViewportMeta ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-xs font-medium text-gray-700">Mobile Ready</span>
            </div>
            <p className="text-[10px] text-gray-500">Viewport meta tag</p>
          </div>

          {/* Meta Description */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              {report.scrapedData?.metaDescription && report.scrapedData.metaDescription.length > 50 ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-xs font-medium text-gray-700">Meta Description</span>
            </div>
            <p className="text-[10px] text-gray-500">SEO description</p>
          </div>
        </div>
      </div>

      {/* Section Summaries */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-4">
          Section Summaries
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((section) => {
            const isLocked = !section.free && !hasFullAccess;
            return (
              <div
                key={section.name}
                className={`bg-gray-50 rounded-lg p-3 border border-gray-100 relative ${
                  isLocked ? 'overflow-hidden' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 text-sm flex items-center gap-1">
                    {section.name}
                    {isLocked && (
                      <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-sm font-semibold text-gray-900 ${isLocked ? 'blur-sm' : ''}`}>
                    {section.score}
                  </span>
                </div>
                <p className={`text-xs text-gray-600 line-clamp-2 ${isLocked ? 'blur-sm select-none' : ''}`}>
                  {section.summary || 'Analysis pending...'}
                </p>
                {isLocked && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-4 h-4 text-gray-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[10px] text-gray-500 font-medium">Upgrade</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
