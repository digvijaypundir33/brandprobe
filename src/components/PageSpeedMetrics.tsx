'use client';

import { motion } from 'framer-motion';

interface CoreWebVitalProps {
  label: string;
  value: string;
  score: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  description: string;
}

function CoreWebVitalCard({
  label,
  value,
  score,
  rating,
  description,
}: CoreWebVitalProps) {
  const colors = {
    good: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      badge: 'bg-green-100',
    },
    'needs-improvement': {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100',
    },
    poor: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      badge: 'bg-red-100',
    },
  };

  const color = colors[rating];

  return (
    <div className={`${color.bg} ${color.border} border rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span
          className={`text-xs px-2 py-1 rounded ${color.badge} ${color.text} font-medium`}
        >
          {rating === 'good'
            ? 'Good'
            : rating === 'needs-improvement'
              ? 'Needs Work'
              : 'Poor'}
        </span>
      </div>
      <div className={`text-2xl font-bold ${color.text}`}>{value}</div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}

interface LighthouseScoreGaugeProps {
  score: number;
  label: string;
}

function LighthouseScoreGauge({ score, label }: LighthouseScoreGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 90) return { stroke: '#0cce6b', bg: 'bg-green-100' };
    if (score >= 50) return { stroke: '#ffa400', bg: 'bg-yellow-100' };
    return { stroke: '#ff4e42', bg: 'bg-red-100' };
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
          />
          <circle
            cx="48"
            cy="48"
            r="45"
            fill="none"
            stroke={color.stroke}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}

interface PageSpeedMetricsProps {
  pageSpeedInsights: {
    lcp: { value: number; displayValue: string; score: number; rating: string };
    fcp: { value: number; displayValue: string; score: number; rating: string };
    tbt: { value: number; displayValue: string; score: number; rating: string };
    cls: { value: number; displayValue: string; score: number; rating: string };
    speedIndex: {
      value: number;
      displayValue: string;
      score: number;
      rating: string;
    };
    performanceScore: number;
    seoScore: number;
    bestPracticesScore: number;
    accessibilityScore: number;
    strategy: 'mobile' | 'desktop';
    hasFieldData: boolean;
  };
}

export default function PageSpeedMetrics({
  pageSpeedInsights,
}: PageSpeedMetricsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Lighthouse Category Scores */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-orange-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
          </svg>
          Lighthouse Scores (
          {pageSpeedInsights.strategy === 'mobile' ? 'Mobile' : 'Desktop'})
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LighthouseScoreGauge
            score={pageSpeedInsights.performanceScore}
            label="Performance"
          />
          <LighthouseScoreGauge
            score={pageSpeedInsights.seoScore}
            label="SEO"
          />
          <LighthouseScoreGauge
            score={pageSpeedInsights.bestPracticesScore}
            label="Best Practices"
          />
          <LighthouseScoreGauge
            score={pageSpeedInsights.accessibilityScore}
            label="Accessibility"
          />
        </div>
      </div>

      {/* Core Web Vitals */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Core Web Vitals
          {pageSpeedInsights.hasFieldData && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
              Real User Data
            </span>
          )}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <CoreWebVitalCard
            label="LCP"
            value={pageSpeedInsights.lcp.displayValue}
            score={pageSpeedInsights.lcp.score}
            rating={
              pageSpeedInsights.lcp.rating as
                | 'good'
                | 'needs-improvement'
                | 'poor'
            }
            description="Largest Contentful Paint"
          />
          <CoreWebVitalCard
            label="FCP"
            value={pageSpeedInsights.fcp.displayValue}
            score={pageSpeedInsights.fcp.score}
            rating={
              pageSpeedInsights.fcp.rating as
                | 'good'
                | 'needs-improvement'
                | 'poor'
            }
            description="First Contentful Paint"
          />
          <CoreWebVitalCard
            label="TBT"
            value={pageSpeedInsights.tbt.displayValue}
            score={pageSpeedInsights.tbt.score}
            rating={
              pageSpeedInsights.tbt.rating as
                | 'good'
                | 'needs-improvement'
                | 'poor'
            }
            description="Total Blocking Time"
          />
          <CoreWebVitalCard
            label="CLS"
            value={pageSpeedInsights.cls.displayValue}
            score={pageSpeedInsights.cls.score}
            rating={
              pageSpeedInsights.cls.rating as
                | 'good'
                | 'needs-improvement'
                | 'poor'
            }
            description="Cumulative Layout Shift"
          />
          <CoreWebVitalCard
            label="Speed Index"
            value={pageSpeedInsights.speedIndex.displayValue}
            score={pageSpeedInsights.speedIndex.score}
            rating={
              pageSpeedInsights.speedIndex.rating as
                | 'good'
                | 'needs-improvement'
                | 'poor'
            }
            description="Visual Loading Speed"
          />
        </div>
      </div>
    </motion.div>
  );
}
