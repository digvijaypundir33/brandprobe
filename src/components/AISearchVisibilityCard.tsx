'use client';

import { motion } from 'framer-motion';
import type { AISearchVisibility } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';

interface AISearchVisibilityCardProps {
  aiSearch: AISearchVisibility;
}

export default function AISearchVisibilityCard({ aiSearch }: AISearchVisibilityCardProps) {
  const analysis = aiSearch.detailedAnalysis;

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
            <div className="text-2xl font-bold">{aiSearch.score}</div>
            <div className="text-gray-400 text-sm">/100</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <p className="text-gray-700 text-sm">{aiSearch.summary}</p>
        </div>

        {/* AEO Score Badge */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg px-4 py-3 text-white">
            <div className="text-xs text-gray-400 uppercase tracking-wide">AEO Score</div>
            <div className="text-2xl font-bold">{analysis.aeoScore}</div>
          </div>
          <div className="flex-1 text-sm text-gray-600">
            Answer Engine Optimization score measures how likely your content is to be cited by AI assistants.
          </div>
        </div>

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
        {analysis.aiSearchAppearance && analysis.aiSearchAppearance.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Potential AI Search Queries
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.aiSearchAppearance.map((query, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm border border-gray-200"
                >
                  {query}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Opportunities */}
        {analysis.faqOpportunities && analysis.faqOpportunities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              FAQ Opportunities
            </h4>
            <ul className="space-y-2">
              {analysis.faqOpportunities.map((faq, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <span className="text-gray-400 font-medium">Q:</span>
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
