'use client';

import { getScoreInterpretation } from '@/lib/utils';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ScoreGauge({
  score,
  size = 'md',
  showLabel = true,
}: ScoreGaugeProps) {
  const interpretation = getScoreInterpretation(score);

  const sizes = {
    sm: { width: 80, strokeWidth: 6, fontSize: 'text-lg' },
    md: { width: 120, strokeWidth: 8, fontSize: 'text-3xl' },
    lg: { width: 180, strokeWidth: 10, fontSize: 'text-5xl' },
  };

  const config = sizes[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const colorClasses = {
    red: 'stroke-red-500',
    orange: 'stroke-orange-500',
    yellow: 'stroke-yellow-500',
    green: 'stroke-green-500',
    emerald: 'stroke-emerald-500',
  };

  const bgColorClasses = {
    red: 'bg-red-50 text-red-700',
    orange: 'bg-orange-50 text-orange-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          className="transform -rotate-90"
          width={config.width}
          height={config.width}
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={config.strokeWidth}
          />
          {/* Score circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            className={colorClasses[interpretation.color as keyof typeof colorClasses]}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${config.fontSize}`}>{score}</span>
        </div>
      </div>

      {showLabel && (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            bgColorClasses[interpretation.color as keyof typeof bgColorClasses]
          }`}
        >
          {interpretation.label}
        </span>
      )}
    </div>
  );
}
