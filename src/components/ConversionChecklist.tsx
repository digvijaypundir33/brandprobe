'use client';

import { motion } from 'framer-motion';
import type { ConversionOptimization } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';
import { getScoreColorClass } from '@/lib/utils';

interface ConversionChecklistProps {
  conversion: ConversionOptimization;
}

// Helper to safely convert any value to string
function toDisplayString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const stringVals = Object.values(obj).filter(v => typeof v === 'string');
    if (stringVals.length > 0) return stringVals.join(' - ');
    return JSON.stringify(value);
  }
  return String(value);
}

export default function ConversionChecklist({ conversion }: ConversionChecklistProps) {
  const analysis = conversion.detailedAnalysis || {};
  const frictionPoints = analysis.frictionPoints || [];
  const trustAudit = analysis.trustSignalAudit || '';
  const ctaOpt = analysis.ctaOptimization || '';
  const pageStructure = analysis.pageStructureAnalysis || '';
  const socialProof = analysis.socialProofAssessment || '';
  const aboveFold = analysis.aboveFoldEffectiveness || '';

  const analysisItems = [
    { title: 'Trust Signals', content: trustAudit, icon: 'shield' },
    { title: 'CTA Optimization', content: ctaOpt, icon: 'cursor' },
    { title: 'Page Structure', content: pageStructure, icon: 'layout' },
    { title: 'Social Proof', content: socialProof, icon: 'users' },
    { title: 'Above-Fold', content: aboveFold, icon: 'eye' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'shield':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />;
      case 'cursor':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />;
      case 'layout':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />;
      case 'users':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />;
      case 'eye':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />;
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Conversion Optimization</h2>
              <p className="text-gray-400 text-sm">Turn visitors into customers</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColorClass(conversion.score)}`}>{conversion.score}</div>
            <div className="text-gray-400 text-sm">/100</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <p className="text-gray-700 text-sm">{conversion.summary}</p>
        </div>

        {/* Friction Points */}
        {frictionPoints.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Friction Points to Fix
            </h4>
            <div className="space-y-2">
              {frictionPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700">{toDisplayString(point)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Analysis Grid */}
        <div className="grid md:grid-cols-2 gap-3">
          {analysisItems.map((item) => {
            if (!item.content) return null;
            return (
              <div
                key={item.title}
                className="bg-gray-50 rounded-lg p-4 border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getIcon(item.icon)}
                  </svg>
                  <h5 className="font-medium text-gray-800 text-sm">{item.title}</h5>
                </div>
                <p className="text-xs text-gray-600">{item.content}</p>
              </div>
            );
          })}
        </div>

        {/* Key Issues & Quick Wins */}
        <IssuesAndQuickWins
          keyIssues={conversion.keyIssues}
          quickWins={conversion.quickWins}
          issuesTitle="Conversion Issues"
        />
      </div>
    </motion.div>
  );
}
