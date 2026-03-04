'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ScoreBarChartProps {
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

function getScoreColor(score: number, locked: boolean): string {
  if (locked) return '#9ca3af'; // gray for locked sections
  if (score <= 25) return '#ef4444'; // red
  if (score <= 50) return '#f97316'; // orange
  if (score <= 70) return '#eab308'; // yellow
  if (score <= 85) return '#22c55e'; // green
  return '#10b981'; // emerald
}

export default function ScoreBarChart({ scores, hasFullAccess = false }: ScoreBarChartProps) {
  // Show all scores for all users (including free users)
  const data = [
    { name: 'Messaging', score: scores.messaging, locked: false },
    { name: 'SEO', score: scores.seo, locked: false },
    { name: 'Content', score: scores.content, locked: false },
    { name: 'Ads', score: scores.ads, locked: false },
    { name: 'Conversion', score: scores.conversion, locked: !hasFullAccess },
    { name: 'Distribution', score: scores.distribution, locked: !hasFullAccess },
    { name: 'AI Search', score: scores.aiSearch, locked: !hasFullAccess },
    { name: 'Technical', score: scores.technical, locked: !hasFullAccess },
    { name: 'Brand Health', score: scores.brandHealth, locked: !hasFullAccess },
    { name: 'Design Auth', score: scores.designAuth, locked: !hasFullAccess },
  ];

  return (
    <div className="w-full h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#374151' }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => [`${value}/100`, 'Score']}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getScoreColor(entry.score, entry.locked)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
