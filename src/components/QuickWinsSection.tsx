'use client';

import ActionCard from './ActionCard';
import type { Report, QuickWin as ReportQuickWin } from '@/types/report';

interface QuickWinsSectionProps {
  report: Report;
  hasFullAccess?: boolean;
}

interface DisplayQuickWin {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: string;
  category: string;
  locked?: boolean;
}

// Helper to extract text from QuickWin objects or strings
function getQuickWinText(win: ReportQuickWin | string): string {
  if (typeof win === 'string') {
    return win;
  }
  return win.action;
}

function extractQuickWins(report: Report, hasFullAccess: boolean): DisplayQuickWin[] {
  const wins: DisplayQuickWin[] = [];

  // Extract from messaging (FREE)
  if (report.messagingAnalysis?.quickWins) {
    report.messagingAnalysis.quickWins.slice(0, 2).forEach((win, i) => {
      wins.push({
        title: `Messaging Fix ${i + 1}`,
        description: getQuickWinText(win),
        priority: report.messagingScore && report.messagingScore < 40 ? 'high' : 'medium',
        timeEstimate: '1-2 hours',
        category: 'Messaging',
      });
    });
  }

  // Extract from SEO (FREE)
  if (report.seoOpportunities?.quickWins) {
    report.seoOpportunities.quickWins.slice(0, 2).forEach((win, i) => {
      wins.push({
        title: `SEO Opportunity ${i + 1}`,
        description: getQuickWinText(win),
        priority: report.seoScore && report.seoScore < 40 ? 'high' : 'medium',
        timeEstimate: '2-4 hours',
        category: 'SEO',
      });
    });
  }

  // Extract from conversion (PAID) - Show for all users but blur for free users
  if (hasFullAccess && report.conversionOptimization?.quickWins) {
    report.conversionOptimization.quickWins.slice(0, 2).forEach((win, i) => {
      wins.push({
        title: `Conversion Boost ${i + 1}`,
        description: getQuickWinText(win),
        priority: report.conversionScore && report.conversionScore < 40 ? 'high' : 'medium',
        timeEstimate: '1-3 hours',
        category: 'Conversion',
        locked: false,
      });
    });
  } else if (!hasFullAccess && report.conversionScore) {
    // Add placeholder quick wins for locked sections (backend stripped the data)
    wins.push({
      title: 'Conversion Optimization',
      description: 'Upgrade to unlock actionable conversion optimization recommendations.',
      priority: 'medium',
      timeEstimate: '1-3 hours',
      category: 'Conversion',
      locked: true,
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  wins.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return wins.slice(0, 6);
}

export default function QuickWinsSection({ report, hasFullAccess = false }: QuickWinsSectionProps) {
  const quickWins = extractQuickWins(report, hasFullAccess);

  if (quickWins.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Quick Wins</h2>
            <p className="text-gray-400 text-sm">Actions you can take this week</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickWins.map((win, index) => (
            <ActionCard
              key={index}
              title={win.title}
              description={win.description}
              priority={win.priority}
              timeEstimate={win.timeEstimate}
              category={win.category}
              locked={win.locked}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
