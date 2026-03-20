'use client';

import { motion } from 'framer-motion';
import type { AISearchVisibility, TechnicalData } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';
import { getScoreColorClass } from '@/lib/utils';

interface AISearchVisibilityCardProps {
  aiSearch: AISearchVisibility;
  technicalData?: TechnicalData;
}

export default function AISearchVisibilityCard({ aiSearch, technicalData }: AISearchVisibilityCardProps) {
  const analysis = aiSearch.detailedAnalysis || {};
  const aiSearchAppearance = Array.isArray(analysis.aiSearchAppearance) ? analysis.aiSearchAppearance : [];
  const faqOpportunities = Array.isArray(analysis.faqOpportunities) ? analysis.faqOpportunities : [];

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI Search Visibility</h2>
              <p className="text-gray-400 text-sm">ChatGPT, Perplexity, AI Overviews readiness</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColorClass(aiSearch.score)}`}>{aiSearch.score}</div>
            <div className="text-gray-400 text-sm">/100</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <p className="text-gray-700 text-sm">{aiSearch.summary}</p>
        </div>

        {/* AEO Score - Sub-metric */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800 text-sm">Answer Engine Optimization (AEO)</h4>
            <span className="text-lg font-semibold text-gray-900">{analysis.aeoScore}/100</span>
          </div>
          <p className="text-xs text-gray-600">
            Measures how likely your content is to be cited by AI assistants like ChatGPT and Perplexity.
          </p>
        </div>

        {/* GEO Readiness - AI Crawler Access */}
        {technicalData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">GEO Readiness</h4>
            </div>

            {/* llms.txt and robots.txt status */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
                {technicalData.hasLlmsTxt ? (
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
                <div>
                  <span className="text-xs font-medium text-gray-700">llms.txt</span>
                  <p className="text-[10px] text-gray-500">{technicalData.hasLlmsTxt ? 'Present' : 'Not found'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
                {technicalData.hasRobotsTxt ? (
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
                <div>
                  <span className="text-xs font-medium text-gray-700">robots.txt</span>
                  <p className="text-[10px] text-gray-500">{technicalData.hasRobotsTxt ? 'Present' : 'Not found'}</p>
                </div>
              </div>
            </div>

            {/* AI Bot Permissions */}
            {technicalData.aiBotPermissions && (
              <div>
                <p className="text-xs text-gray-600 mb-2">{technicalData.aiBotPermissions.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'gptBot', name: 'GPTBot', status: technicalData.aiBotPermissions.gptBot },
                    { key: 'claudeBot', name: 'ClaudeBot', status: technicalData.aiBotPermissions.claudeBot },
                    { key: 'perplexityBot', name: 'PerplexityBot', status: technicalData.aiBotPermissions.perplexityBot },
                    { key: 'googleExtended', name: 'Google-Extended', status: technicalData.aiBotPermissions.googleExtended },
                  ].map((bot) => (
                    <span
                      key={bot.key}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        bot.status === 'allowed'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : bot.status === 'blocked'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {bot.status === 'allowed' && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {bot.status === 'blocked' && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {bot.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">Entity Clarity</h4>
            </div>
            <p className="text-xs text-gray-600">{analysis.entityClarity}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">Citation Readiness</h4>
            </div>
            <p className="text-xs text-gray-600">{analysis.citationReadiness}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">Content Structure</h4>
            </div>
            <p className="text-xs text-gray-600">{analysis.contentStructureForAI}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-sm">Schema Markup</h4>
            </div>
            <p className="text-xs text-gray-600">{analysis.schemaMarkupAnalysis}</p>
          </div>
        </div>

        {/* AI Search Appearance */}
        {aiSearchAppearance.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Potential AI Search Queries
            </h4>
            <div className="flex flex-wrap gap-2">
              {aiSearchAppearance.map((query, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-sm border border-gray-200"
                >
                  {query}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Opportunities */}
        {faqOpportunities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              FAQ Opportunities
            </h4>
            <ul className="space-y-2">
              {faqOpportunities.map((faq, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <span className="text-gray-500 font-medium">Q:</span>
                  {faq}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Issues & Quick Wins */}
        <IssuesAndQuickWins
          keyIssues={aiSearch.keyIssues}
          quickWins={aiSearch.quickWins}
          issuesTitle="AI Visibility Issues"
        />
      </div>
    </motion.div>
  );
}
