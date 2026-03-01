'use client';

import { motion } from 'framer-motion';
import type { MessagingAnalysis } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';

interface MessagingAnalysisCardProps {
  messaging: MessagingAnalysis;
}

export default function MessagingAnalysisCard({ messaging }: MessagingAnalysisCardProps) {
  const analysis = messaging.detailedAnalysis;

  const sections = [
    { title: 'Headline Analysis', content: analysis.headlineAnalysis, icon: 'document' },
    { title: 'Value Proposition', content: analysis.valuePropositionClarity, icon: 'star' },
    { title: 'Differentiation', content: analysis.differentiationSignals, icon: 'lightning' },
    { title: 'CTA Analysis', content: analysis.ctaAnalysis, icon: 'cursor' },
    { title: 'Brand Voice', content: analysis.brandVoice, icon: 'chat' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />;
      case 'star':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />;
      case 'lightning':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />;
      case 'cursor':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />;
      case 'chat':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />;
      default:
        return null;
    }
  };

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Messaging & Positioning</h2>
              <p className="text-gray-400 text-sm">How clear and compelling is your message?</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{messaging.score}</div>
            <div className="text-gray-400 text-sm">/100</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <p className="text-gray-700 text-sm">{messaging.summary}</p>
        </div>

        {/* Analysis Sections */}
        <div className="space-y-4 mb-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getIcon(section.icon)}
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{section.title}</h4>
                  <p className="text-sm text-gray-600">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
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
