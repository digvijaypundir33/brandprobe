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
      className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(44,47,49,0.06)] overflow-hidden"
    >
      <div className="p-8 border-b border-[#abadaf]/15">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#5B5BD5]">
            description
          </span>
          <h2 className="text-2xl font-headline font-bold text-[#2c2f31]">Executive Summary</h2>
        </div>
      </div>

      <div className="p-8">

        {/* Overall Assessment */}
        <div className="bg-[#eef1f3]/30 rounded-xl p-6 mb-8">
          <p className="text-[#595c5e] leading-relaxed font-body">
            {overallScore >= 70
              ? 'Your website demonstrates strong marketing fundamentals with several standout sections. Focus on the priority improvements below to maximize your conversion potential.'
              : overallScore >= 50
              ? 'Your website shows solid potential but needs targeted improvements in key areas. The analysis reveals specific opportunities to enhance your marketing effectiveness.'
              : 'Your website requires significant optimization to effectively convert visitors. The areas below need immediate attention to improve your marketing performance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="p-6 bg-[#6bff8f]/10 border border-[#005f28]/10 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#005f28]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h4 className="font-headline font-bold text-sm uppercase tracking-wider text-[#005f28]">Top Strengths</h4>
            </div>
            {topStrengths.length > 0 ? (
              <ul className="space-y-3">
                {topStrengths.map((section) => (
                  <li key={section.name} className="text-sm font-body text-[#2c2f31] flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#005f28] shrink-0" />
                    <span>
                      <strong className="font-headline font-semibold">{section.name}</strong> ({section.score}/100) — {section.summary?.split('.')[0]}.
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#005f28] text-sm font-body">No areas scoring above 70 yet. Keep optimizing!</p>
            )}
          </div>

          {/* Weaknesses */}
          <div className="p-6 bg-[#f74b6d]/10 border border-[#510017]/10 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#510017]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h4 className="font-headline font-bold text-sm uppercase tracking-wider text-[#510017]">Priority Improvements</h4>
            </div>
            {topWeaknesses.length > 0 ? (
              <ul className="space-y-3">
                {topWeaknesses.map((section) => (
                  <li key={section.name} className="text-sm font-body text-[#2c2f31] flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#510017] shrink-0" />
                    <span>
                      <strong className="font-headline font-semibold">{section.name}</strong> ({section.score}/100) — {section.summary?.split('.')[0]}.
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#510017] text-sm font-body">No critical areas needing immediate attention.</p>
            )}
          </div>
        </div>

        {/* Technical Quick Checks */}
        <div className="mb-8">
          <h3 className="font-headline font-bold text-[#2c2f31] text-xl mb-4">Technical Quick Checks</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Schema Markup */}
            <div className="bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                {report.scrapedData?.technicalData?.hasStructuredData ? (
                  <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                )}
                <span className="text-xs font-headline font-semibold text-[#2c2f31]">Schema Markup</span>
              </div>
              <p className="text-[10px] text-[#595c5e] font-body">JSON-LD structured data</p>
            </div>

            {/* SSL/HTTPS */}
            <div className="bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                {report.scrapedData?.technicalData?.hasSSL ? (
                  <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                )}
                <span className="text-xs font-headline font-semibold text-[#2c2f31]">SSL/HTTPS</span>
              </div>
              <p className="text-[10px] text-[#595c5e] font-body">Secure connection</p>
            </div>

            {/* Mobile Friendly */}
            <div className="bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                {report.scrapedData?.technicalData?.hasViewportMeta ? (
                  <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                )}
                <span className="text-xs font-headline font-semibold text-[#2c2f31]">Mobile Ready</span>
              </div>
              <p className="text-[10px] text-[#595c5e] font-body">Viewport meta tag</p>
            </div>

            {/* Meta Description */}
            <div className="bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                {report.scrapedData?.metaDescription && report.scrapedData.metaDescription.length > 50 ? (
                  <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                    </svg>
                  </span>
                )}
                <span className="text-xs font-headline font-semibold text-[#2c2f31]">Meta Description</span>
              </div>
              <p className="text-[10px] text-[#595c5e] font-body">SEO description</p>
            </div>
          </div>
        </div>

        {/* Section Summaries */}
        <div>
          <h3 className="font-headline font-bold text-[#2c2f31] text-xl mb-4">Section Summaries</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map((section) => {
              const isLocked = !section.free && !hasFullAccess;
              return (
                <div
                  key={section.name}
                  className={`bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-4 relative ${
                    isLocked ? 'overflow-hidden' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-headline font-semibold text-[#2c2f31] text-sm flex items-center gap-1">
                      {section.name}
                      {isLocked && (
                        <svg className="w-3 h-3 text-[#595c5e]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-sm font-headline font-bold text-[#2c2f31] ${isLocked ? 'blur-sm' : ''}`}>
                      {section.score}
                    </span>
                  </div>
                  <p className={`text-xs text-[#595c5e] font-body line-clamp-2 ${isLocked ? 'blur-sm select-none' : ''}`}>
                    {section.summary || 'Analysis pending...'}
                  </p>
                  {isLocked && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-4 h-4 text-[#595c5e] mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] text-[#595c5e] font-label font-medium">Upgrade</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
