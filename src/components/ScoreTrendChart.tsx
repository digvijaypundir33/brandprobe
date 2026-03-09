'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ScanDataPoint {
  scanNumber: number;
  createdAt: string;
  overallScore: number;
  sectionScores: {
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
}

interface ScoreTrendChartProps {
  data: ScanDataPoint[];
  showSections?: boolean;
}

const SECTION_COLORS: Record<string, string> = {
  overall: '#1f2937', // gray-800
  messaging: '#3b82f6', // blue-500
  seo: '#10b981', // emerald-500
  content: '#8b5cf6', // violet-500
  ads: '#f59e0b', // amber-500
  conversion: '#ef4444', // red-500
  distribution: '#06b6d4', // cyan-500
  aiSearch: '#ec4899', // pink-500
  technical: '#6366f1', // indigo-500
  brandHealth: '#14b8a6', // teal-500
  designAuth: '#f97316', // orange-500
};

const SECTION_LABELS: Record<string, string> = {
  overall: 'Overall',
  messaging: 'Messaging',
  seo: 'SEO',
  content: 'Content',
  ads: 'Ads',
  conversion: 'CRO',
  distribution: 'Distribution',
  aiSearch: 'AI Search',
  technical: 'Technical',
  brandHealth: 'Brand',
  designAuth: 'Design',
};

export default function ScoreTrendChart({
  data,
  showSections = false,
}: ScoreTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  // Transform data for chart
  const chartData = data.map((point) => ({
    name: `#${point.scanNumber}`,
    date: new Date(point.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    overall: point.overallScore,
    ...point.sectionScores,
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(value, name) => [
              `${value}/100`,
              SECTION_LABELS[name as string] || name,
            ]}
            labelFormatter={(label, payload) => {
              const payloadData = payload as Array<{ payload?: { date?: string } }>;
              if (payloadData?.[0]?.payload?.date) {
                return `${label} (${payloadData[0].payload.date})`;
              }
              return String(label);
            }}
          />
          {showSections && <Legend />}

          {/* Overall score line (always shown) */}
          <Line
            type="monotone"
            dataKey="overall"
            name="overall"
            stroke={SECTION_COLORS.overall}
            strokeWidth={3}
            dot={{ r: 6, fill: SECTION_COLORS.overall }}
            activeDot={{ r: 8 }}
          />

          {/* Section lines (optional) */}
          {showSections &&
            Object.keys(SECTION_COLORS)
              .filter((key) => key !== 'overall')
              .map((section) => (
                <Line
                  key={section}
                  type="monotone"
                  dataKey={section}
                  name={section}
                  stroke={SECTION_COLORS[section]}
                  strokeWidth={1.5}
                  dot={{ r: 3 }}
                  strokeDasharray={section === 'overall' ? undefined : '5 5'}
                />
              ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
