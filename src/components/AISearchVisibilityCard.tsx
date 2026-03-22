'use client';

import { motion } from 'framer-motion';
import type { AISearchVisibility, TechnicalData } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';

interface AISearchVisibilityCardProps {
  aiSearch: AISearchVisibility;
  technicalData?: TechnicalData;
}

function getScoreBadgeColor(score: number) {
  if (score >= 75) return { bg: 'bg-[#6bff8f]', text: 'text-[#005f28]', label: 'Excellent' };
  if (score >= 50) return { bg: 'bg-[#fed01b]', text: 'text-[#594700]', label: 'Average' };
  return { bg: 'bg-[#f74b6d]', text: 'text-[#510017]', label: 'Needs Work' };
}

export default function AISearchVisibilityCard({ aiSearch, technicalData }: AISearchVisibilityCardProps) {
  const analysis = aiSearch.detailedAnalysis || {};
  const aiSearchAppearance = Array.isArray(analysis.aiSearchAppearance) ? analysis.aiSearchAppearance : [];
  const faqOpportunities = Array.isArray(analysis.faqOpportunities) ? analysis.faqOpportunities : [];
  const badgeColor = getScoreBadgeColor(aiSearch.score);

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
              AI Search Visibility
            </h1>
            <p className="text-[#595c5e] font-body text-lg">ChatGPT, Perplexity, AI Overviews readiness</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 ${badgeColor.bg} ${badgeColor.text} rounded-full text-xs font-label font-bold uppercase tracking-wider mb-2`}>
              {badgeColor.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-headline font-bold text-[#2c2f31]">{aiSearch.score}</span>
              <span className="text-xl text-[#595c5e] font-light">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {aiSearch.summary && (
          <div className="bg-[#eef1f3]/30 rounded-xl p-6 mb-8">
            <p className="text-[#595c5e] leading-relaxed font-body">{aiSearch.summary}</p>
          </div>
        )}

        {/* AEO Score - Sub-metric */}
        <div className="bg-[#f8f9ff] border border-[#5B5BD5]/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-headline font-semibold text-[#5B5BD5] text-sm">Answer Engine Optimization (AEO)</h4>
            <span className="text-2xl font-headline font-bold text-[#5B5BD5]">{analysis.aeoScore}/100</span>
          </div>
          <p className="text-sm text-[#595c5e] font-body leading-relaxed">
            Measures how likely your content is to be cited by AI assistants like ChatGPT and Perplexity.
          </p>
        </div>

        {/* GEO Readiness - AI Crawler Access */}
        {technicalData && (
          <div className="bg-[#eef1f3]/20 border border-[#abadaf]/10 rounded-xl p-6 mb-8">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl mb-4">GEO Readiness</h3>

            {/* llms.txt and robots.txt status */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#abadaf]/10">
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
                  <span className="text-xs font-headline font-semibold text-[#2c2f31]">llms.txt</span>
                  <p className="text-[10px] text-[#595c5e] font-body">{technicalData.hasLlmsTxt ? 'Present' : 'Not found'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#abadaf]/10">
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
                  <span className="text-xs font-headline font-semibold text-[#2c2f31]">robots.txt</span>
                  <p className="text-[10px] text-[#595c5e] font-body">{technicalData.hasRobotsTxt ? 'Present' : 'Not found'}</p>
                </div>
              </div>
            </div>

            {/* AI Bot Permissions */}
            {technicalData.aiBotPermissions && (
              <div>
                <p className="text-sm text-[#595c5e] font-body leading-relaxed mb-3">{technicalData.aiBotPermissions.summary}</p>
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
        <div className="mb-8 space-y-6">
          <h3 className="font-headline font-bold text-[#2c2f31] text-xl">AI Visibility Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Entity Clarity', content: analysis.entityClarity, icon: 'badge' },
              { title: 'Citation Readiness', content: analysis.citationReadiness, icon: 'description' },
              { title: 'Content Structure', content: analysis.contentStructureForAI, icon: 'view_module' },
              { title: 'Schema Markup', content: analysis.schemaMarkupAnalysis, icon: 'sell' },
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

        {/* AI Search Appearance */}
        {aiSearchAppearance.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Potential AI Search Queries</h3>
            <div className="flex flex-wrap gap-2">
              {aiSearchAppearance.map((query, i) => (
                <span
                  key={i}
                  className="px-3 py-2 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg text-sm font-label font-medium"
                >
                  {query}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Opportunities */}
        {faqOpportunities.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">FAQ Opportunities</h3>
            <div className="space-y-3">
              {faqOpportunities.map((faq, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg flex items-center justify-center text-sm font-headline font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#2c2f31] font-body leading-relaxed">{faq}</p>
                </div>
              ))}
            </div>
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
