'use client';

import { motion } from 'framer-motion';
import type { Report } from '@/types/report';

interface ExecutiveSummaryProps {
  report: Report;
  hasFullAccess?: boolean;
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Improvement';
  return 'Critical';
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
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Executive Summary</h2>
          <p className="text-sm text-gray-500">Key findings at a glance</p>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${
            overallScore >= 70 ? 'bg-gray-900' : overallScore >= 50 ? 'bg-gray-600' : 'bg-gray-400'
          }`}>
            {overallScore}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Overall: {getScoreLabel(overallScore)}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {overallScore >= 70
                ? 'Your website has a solid marketing foundation with room for targeted improvements.'
                : overallScore >= 50
                ? 'Your website has potential but needs work in several key areas to maximize conversions.'
                : 'Your website needs significant improvements to effectively convert visitors into customers.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Top Strengths
          </h4>
          {topStrengths.length > 0 ? (
            <div className="space-y-2">
              {topStrengths.map((section) => (
                <div
                  key={section.name}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800 text-sm">{section.name}</span>
                    <span className="text-gray-900 font-semibold text-sm">{section.score}/100</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{section.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No areas scoring above 70 yet.</p>
          )}
        </div>

        {/* Weaknesses */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Priority Improvements
          </h4>
          {topWeaknesses.length > 0 ? (
            <div className="space-y-2">
              {topWeaknesses.map((section) => (
                <div
                  key={section.name}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800 text-sm">{section.name}</span>
                    <span className="text-gray-900 font-semibold text-sm">{section.score}/100</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{section.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No critical areas needing immediate attention.</p>
          )}
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
