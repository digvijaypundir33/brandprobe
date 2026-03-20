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
    <section className="bg-slate-50/50 rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-[family-name:var(--font-space-grotesk)] font-bold text-gray-900">
            Quick Wins
          </h2>
          <p className="text-sm text-slate-500">
            High-impact actions you can implement this week
          </p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
          <span>Critical</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 ml-2"></span>
          <span>High Impact</span>
          <span className="w-2 h-2 rounded-full bg-slate-300 ml-2"></span>
          <span>Quick Fix</span>
        </div>
      </div>

      {/* Cards Grid */}
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
    </section>
  );
}
