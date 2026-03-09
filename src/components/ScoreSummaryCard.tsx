'use client';

import { getScoreInterpretation } from '@/lib/utils';
import { SectionScores } from '@/types/report';

const SECTION_LABELS: Record<keyof SectionScores, string> = {
  messaging: 'Messaging',
  seo: 'SEO',
  content: 'Content',
  ads: 'Ads',
  conversion: 'Conversion',
  distribution: 'Distribution',
  aiSearch: 'AI Search',
  technical: 'Technical',
  brandHealth: 'Brand Health',
  designAuth: 'Design Auth',
};

interface ScoreSummaryCardProps {
  overallScore: number;
  previousScore?: number | null;
  scoreChange?: number | null;
  sectionScoreChanges?: SectionScores | null;
}

export default function ScoreSummaryCard({
  overallScore,
  previousScore,
  scoreChange,
  sectionScoreChanges,
}: ScoreSummaryCardProps) {
  const interpretation = getScoreInterpretation(overallScore);
  const ENABLE_IMPROVEMENT_TRACKING = process.env.NEXT_PUBLIC_ENABLE_IMPROVEMENT_TRACKING === 'true';

  // Calculate improved and declined sections
  const improvedSections: { name: string; change: number }[] = [];
  const declinedSections: { name: string; change: number }[] = [];

  if (ENABLE_IMPROVEMENT_TRACKING && sectionScoreChanges) {
    (Object.keys(sectionScoreChanges) as (keyof SectionScores)[]).forEach((key) => {
      const change = sectionScoreChanges[key];
      if (change > 0) {
        improvedSections.push({ name: SECTION_LABELS[key], change });
      } else if (change < 0) {
        declinedSections.push({ name: SECTION_LABELS[key], change });
      }
    });
    // Sort by absolute change (biggest improvements/declines first)
    improvedSections.sort((a, b) => b.change - a.change);
    declinedSections.sort((a, b) => a.change - b.change);
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Overall Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{overallScore}</span>
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-1 bg-white/10 rounded-md text-sm font-medium">
              {interpretation.label}
            </span>
            {scoreChange !== null && scoreChange !== undefined && (
              <span
                className={`flex items-center gap-1 text-sm ${
                  scoreChange > 0 ? 'text-gray-300' : scoreChange < 0 ? 'text-gray-400' : ''
                }`}
              >
                {scoreChange > 0 ? '↑' : scoreChange < 0 ? '↓' : ''}
                {scoreChange > 0 ? '+' : ''}
                {scoreChange} from last scan
              </span>
            )}
          </div>
        </div>
        <div className="relative">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeDasharray={`${(overallScore / 100) * 301.6} 301.6`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{overallScore}%</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-400 text-sm">{interpretation.description}</p>

      {/* Section-level improvements summary */}
      {ENABLE_IMPROVEMENT_TRACKING && (improvedSections.length > 0 || declinedSections.length > 0) && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wide">
            Section Changes
          </p>
          <div className="flex flex-wrap gap-2">
            {improvedSections.slice(0, 3).map((section) => (
              <span
                key={section.name}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs font-medium"
              >
                <span>↑</span>
                {section.name}
                <span className="text-green-300">+{section.change}</span>
              </span>
            ))}
            {declinedSections.slice(0, 3).map((section) => (
              <span
                key={section.name}
                className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-md text-xs font-medium"
              >
                <span>↓</span>
                {section.name}
                <span className="text-red-300">{section.change}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
