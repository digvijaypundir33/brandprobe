'use client';

import React from 'react';
import Image from 'next/image';
import type { ShowcaseEntry } from '@/types/report';

interface AnalysisCardProps {
  entry: ShowcaseEntry;
}

interface CategoryScore {
  name: string;
  label: string;
  score: number;
}

// Circular score ring component
function ScoreRing({ score, size = 60 }: { score: number; size?: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#16a34a'; // green-600
    if (score >= 50) return '#ca8a04'; // yellow-600
    if (score >= 30) return '#ea580c'; // orange-600
    return '#dc2626'; // red-600
  };

  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth="4"
          opacity="0.2"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-900">{score}%</span>
      </div>
    </div>
  );
}

export default function AnalysisCard({ entry }: AnalysisCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    if (score >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const score = entry.overallScore ?? 0;

  // Get initials from display name for placeholder
  const getInitials = (name: string) => {
    return name
      .split(/[\s.-]+/)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Get all category scores
  const categoryScores: CategoryScore[] = [
    { name: 'messaging', label: 'Messaging', score: entry.messagingScore ?? 0 },
    { name: 'seo', label: 'SEO', score: entry.seoScore ?? 0 },
    { name: 'aiSearch', label: 'AI Search', score: entry.aiSearchScore ?? 0 },
    { name: 'technical', label: 'Technical', score: entry.technicalScore ?? 0 },
    { name: 'brandHealth', label: 'Brand', score: entry.brandHealthScore ?? 0 },
    { name: 'design', label: 'Design', score: entry.designAuthenticityScore ?? 0 },
  ].filter(cat => cat.score > 0); // Only include scores that exist

  // Sort by score and get top 2 and bottom 3
  const sortedScores = [...categoryScores].sort((a, b) => b.score - a.score);
  const topScores = sortedScores.slice(0, 2);
  const bottomScores = sortedScores.slice(-3).reverse();
  const displayScores = [...topScores, ...bottomScores];

  return (
    <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:z-10">
      {/* Screenshot or Initials Placeholder */}
      <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-3">
        {entry.screenshotUrl ? (
          <Image
            src={entry.screenshotUrl}
            alt={entry.displayName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
            <span className="text-6xl font-bold text-white opacity-90">
              {getInitials(entry.displayName)}
            </span>
          </div>
        )}
      </div>

      {/* Website info */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {entry.displayName}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            {entry.tagline}
          </p>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 mt-1"
          >
            Visit site
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Score ring */}
        <div className="flex-shrink-0 ml-3">
          <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-xs text-gray-500 text-center">Score</div>
        </div>
      </div>

      {/* Category Score Rings */}
      {displayScores.length > 0 && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 justify-between">
          {displayScores.map((cat) => (
            <div key={cat.name} className="flex flex-col items-center gap-1">
              <ScoreRing score={cat.score} size={40} />
              <div className="text-[10px] text-gray-600 font-medium">{cat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
