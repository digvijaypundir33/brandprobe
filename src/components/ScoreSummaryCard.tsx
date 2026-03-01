'use client';

import { getScoreInterpretation } from '@/lib/utils';

interface ScoreSummaryCardProps {
  overallScore: number;
  previousScore?: number | null;
  scoreChange?: number | null;
}

export default function ScoreSummaryCard({
  overallScore,
  previousScore,
  scoreChange,
}: ScoreSummaryCardProps) {
  const interpretation = getScoreInterpretation(overallScore);

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
    </div>
  );
}
