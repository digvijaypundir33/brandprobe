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
  };
}

export default function ScoreRadarChart({ scores }: ScoreRadarChartProps) {
  const data = [
    { subject: 'Messaging', score: scores.messaging, fullMark: 100 },
    { subject: 'SEO', score: scores.seo, fullMark: 100 },
    { subject: 'Content', score: scores.content, fullMark: 100 },
    { subject: 'Ads', score: scores.ads, fullMark: 100 },
    { subject: 'Conversion', score: scores.conversion, fullMark: 100 },
    { subject: 'Distribution', score: scores.distribution, fullMark: 100 },
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
