'use client';

import { motion } from 'framer-motion';
import type { Report } from '@/types/report';

interface ExecutiveSummaryProps {
  report: Report;
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Improvement';
  return 'Critical';
}

export default function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
  const sections = [
    { name: 'Messaging', score: report.messagingScore || 0, summary: report.messagingAnalysis?.summary },
    { name: 'SEO', score: report.seoScore || 0, summary: report.seoOpportunities?.summary },
    { name: 'Content', score: report.contentScore || 0, summary: report.contentStrategy?.summary },
    { name: 'Ads', score: report.adsScore || 0, summary: report.adAngles?.summary },
    { name: 'Conversion', score: report.conversionScore || 0, summary: report.conversionOptimization?.summary },
    { name: 'Distribution', score: report.distributionScore || 0, summary: report.distributionStrategy?.summary },
  ];

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
          {sections.map((section) => (
            <div
              key={section.name}
              className="bg-gray-50 rounded-lg p-3 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800 text-sm">{section.name}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {section.score}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{section.summary || 'Analysis pending...'}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
