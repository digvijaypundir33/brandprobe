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
  };
}

function getScoreColor(score: number): string {
  if (score <= 25) return '#ef4444'; // red
  if (score <= 50) return '#f97316'; // orange
  if (score <= 70) return '#eab308'; // yellow
  if (score <= 85) return '#22c55e'; // green
  return '#10b981'; // emerald
}

export default function ScoreBarChart({ scores }: ScoreBarChartProps) {
  const data = [
    { name: 'Messaging', score: scores.messaging },
    { name: 'SEO', score: scores.seo },
    { name: 'Content', score: scores.content },
    { name: 'Ads', score: scores.ads },
    { name: 'Conversion', score: scores.conversion },
    { name: 'Distribution', score: scores.distribution },
  ];

  return (
    <div className="w-full h-[250px]">
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
              <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
