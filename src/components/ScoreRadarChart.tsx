'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ScoreRadarChartProps {
  scores: {
    messaging: number;
    seo: number;
    content: number;
    ads: number;
    conversion: number;
    distribution: number;
    aiSearch: number;
    technical: number;
    brandHealth: number;
    designAuth: number;
  };
  hasFullAccess?: boolean;
}

export default function ScoreRadarChart({ scores, hasFullAccess = false }: ScoreRadarChartProps) {
  // Show all scores for all users (including free users)
  const data = [
    { subject: 'Messaging', score: scores.messaging, fullMark: 100, locked: false },
    { subject: 'SEO', score: scores.seo, fullMark: 100, locked: false },
    { subject: 'Content', score: scores.content, fullMark: 100, locked: false },
    { subject: 'Ads', score: scores.ads, fullMark: 100, locked: false },
    { subject: 'Conversion', score: scores.conversion, fullMark: 100, locked: !hasFullAccess },
    { subject: 'Distribution', score: scores.distribution, fullMark: 100, locked: !hasFullAccess },
    { subject: 'AI Search', score: scores.aiSearch, fullMark: 100, locked: !hasFullAccess },
    { subject: 'Technical', score: scores.technical, fullMark: 100, locked: !hasFullAccess },
    { subject: 'Brand', score: scores.brandHealth, fullMark: 100, locked: !hasFullAccess },
    { subject: 'Design', score: scores.designAuth, fullMark: 100, locked: !hasFullAccess },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            formatter={(value) => [`${value}/100`, 'Score']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
