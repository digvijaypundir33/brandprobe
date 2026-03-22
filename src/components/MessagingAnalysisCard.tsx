'use client';

import { motion } from 'framer-motion';
import type { MessagingAnalysis } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';

interface MessagingAnalysisCardProps {
  messaging: MessagingAnalysis;
}

function getScoreBadgeColor(score: number) {
  if (score >= 75) return { bg: 'bg-[#6bff8f]', text: 'text-[#005f28]', label: 'Excellent' };
  if (score >= 50) return { bg: 'bg-[#fed01b]', text: 'text-[#594700]', label: 'Average' };
  return { bg: 'bg-[#f74b6d]', text: 'text-[#510017]', label: 'Needs Work' };
}

export default function MessagingAnalysisCard({ messaging }: MessagingAnalysisCardProps) {
  const analysis = messaging.detailedAnalysis;
  const badgeColor = getScoreBadgeColor(messaging.score);

  const sections = [
    { title: 'Headline Analysis', content: analysis.headlineAnalysis, icon: 'article' },
    { title: 'Value Proposition', content: analysis.valuePropositionClarity, icon: 'stars' },
    { title: 'Differentiation', content: analysis.differentiationSignals, icon: 'bolt' },
    { title: 'CTA Analysis', content: analysis.ctaAnalysis, icon: 'ads_click' },
    { title: 'Brand Voice', content: analysis.brandVoice, icon: 'chat_bubble' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(44,47,49,0.06)] overflow-hidden"
    >
      {/* Header */}
      <div className="p-8 flex justify-between items-start border-b border-[#abadaf]/15">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-[#2c2f31] tracking-tight">
            Messaging & Positioning
          </h1>
          <p className="text-[#595c5e] font-body text-lg">Clear & Compelling Communication</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 ${badgeColor.bg} ${badgeColor.text} rounded-full text-xs font-label font-bold uppercase tracking-wider mb-2`}>
              {badgeColor.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-headline font-bold text-[#2c2f31]">{messaging.score}</span>
              <span className="text-xl text-[#595c5e] font-light">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {messaging.summary && (
          <div className="bg-[#eef1f3]/30 rounded-xl p-6 mb-8">
            <p className="text-[#595c5e] leading-relaxed font-body">{messaging.summary}</p>
          </div>
        )}

        {/* Analysis Sections */}
        <div className="mb-8 space-y-6">
          <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Message Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {sections.map((section, idx) => {
              const isFirstItem = idx === 0;
              return (
                <div
                  key={section.title}
                  className={`flex items-start gap-4 p-4 rounded-xl border ${
                    isFirstItem
                      ? 'bg-[#f8f9ff] border-[#5B5BD5]/10'
                      : 'bg-[#eef1f3]/20 border-[#abadaf]/10'
                  }`}
                >
                  <span className={`material-symbols-outlined mt-0.5 ${
                    isFirstItem ? 'text-[#5B5BD5]' : 'text-[#595c5e]'
                  }`}>
                    {section.icon}
                  </span>
                  <div className="flex-1">
                    <h4 className={`font-headline font-semibold text-sm mb-2 ${
                      isFirstItem ? 'text-[#5B5BD5]' : 'text-[#2c2f31]'
                    }`}>
                      {section.title}
                    </h4>
                    <p className="text-sm text-[#595c5e] leading-relaxed">{section.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Issues & Quick Wins */}
        <IssuesAndQuickWins
          keyIssues={messaging.keyIssues}
          quickWins={messaging.quickWins}
          issuesTitle="Messaging Issues"
        />
      </div>
    </motion.div>
  );
}
