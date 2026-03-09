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
  LabelList,
} from 'recharts';
import { SectionScores } from '@/types/report';

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
  sectionScoreChanges?: SectionScores | null;
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

function formatChange(change: number | undefined): string {
  if (change === undefined || change === 0) return '';
  return change > 0 ? `+${change}` : `${change}`;
}

function getChangeColor(change: number | undefined): string {
  if (change === undefined || change === 0) return 'transparent';
  return change > 0 ? '#22c55e' : '#ef4444'; // green for positive, red for negative
}

export default function ScoreBarChart({ scores, sectionScoreChanges, hasFullAccess = false }: ScoreBarChartProps) {
  const ENABLE_IMPROVEMENT_TRACKING = process.env.NEXT_PUBLIC_ENABLE_IMPROVEMENT_TRACKING === 'true';

  // Show all scores for all users (including free users)
  const data = [
    { name: 'Messaging', score: scores.messaging, locked: false, change: sectionScoreChanges?.messaging },
    { name: 'SEO', score: scores.seo, locked: false, change: sectionScoreChanges?.seo },
    { name: 'Content', score: scores.content, locked: false, change: sectionScoreChanges?.content },
    { name: 'Ads', score: scores.ads, locked: false, change: sectionScoreChanges?.ads },
    { name: 'Conversion', score: scores.conversion, locked: !hasFullAccess, change: sectionScoreChanges?.conversion },
    { name: 'Distribution', score: scores.distribution, locked: !hasFullAccess, change: sectionScoreChanges?.distribution },
    { name: 'AI Search', score: scores.aiSearch, locked: !hasFullAccess, change: sectionScoreChanges?.aiSearch },
    { name: 'Technical', score: scores.technical, locked: !hasFullAccess, change: sectionScoreChanges?.technical },
    { name: 'Brand Health', score: scores.brandHealth, locked: !hasFullAccess, change: sectionScoreChanges?.brandHealth },
    { name: 'Design Auth', score: scores.designAuth, locked: !hasFullAccess, change: sectionScoreChanges?.designAuth },
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
            formatter={(value, name, props) => {
              const change = props.payload?.change;
              const changeText = ENABLE_IMPROVEMENT_TRACKING && change !== undefined && change !== 0
                ? ` (${change > 0 ? '+' : ''}${change})`
                : '';
              return [`${value}/100${changeText}`, 'Score'];
            }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getScoreColor(entry.score, entry.locked)} />
            ))}
            {ENABLE_IMPROVEMENT_TRACKING && sectionScoreChanges && (
              <LabelList
                dataKey="change"
                position="right"
                formatter={(value) => formatChange(value as number | undefined)}
                style={{ fontSize: 11, fontWeight: 600 }}
                fill="#6b7280"
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
