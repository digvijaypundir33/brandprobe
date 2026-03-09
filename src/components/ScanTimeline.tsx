'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ScanNode {
  id: string;
  scanNumber: number;
  createdAt: string;
  overallScore: number;
  scoreChange: number | null;
}

interface ScanTimelineProps {
  scans: ScanNode[];
  currentScanId?: string;
  onSelectScan?: (scanId: string) => void;
}

function getScoreColor(score: number): string {
  if (score <= 25) return 'bg-red-500';
  if (score <= 50) return 'bg-orange-500';
  if (score <= 70) return 'bg-yellow-500';
  if (score <= 85) return 'bg-green-500';
  return 'bg-emerald-500';
}

function getChangeIndicator(change: number | null): React.ReactNode {
  if (change === null || change === 0) return null;

  if (change > 0) {
    return (
      <span className="inline-flex items-center text-xs font-medium text-green-600">
        +{change}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-xs font-medium text-red-600">
      {change}
    </span>
  );
}

export default function ScanTimeline({
  scans,
  currentScanId,
  onSelectScan,
}: ScanTimelineProps) {
  if (scans.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No scan history available
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

      {/* Scan nodes */}
      <div className="space-y-6">
        {scans.map((scan, index) => {
          const isSelected = scan.id === currentScanId;
          const isFirst = index === 0;
          const date = new Date(scan.createdAt);

          return (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-start gap-4 ${
                onSelectScan ? 'cursor-pointer' : ''
              }`}
              onClick={() => onSelectScan?.(scan.id)}
            >
              {/* Node circle */}
              <div
                className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                  isSelected ? 'ring-4 ring-blue-200' : ''
                } ${getScoreColor(scan.overallScore)}`}
              >
                {scan.overallScore}
              </div>

              {/* Content */}
              <div
                className={`flex-1 bg-white rounded-lg border p-4 ${
                  isSelected
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      Scan #{scan.scanNumber}
                    </span>
                    {isFirst && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        Latest
                      </span>
                    )}
                    {isSelected && (
                      <span className="px-2 py-0.5 bg-gray-900 text-white text-xs font-medium rounded-full">
                        Viewing
                      </span>
                    )}
                  </div>
                  {getChangeIndicator(scan.scoreChange)}
                </div>

                <p className="text-sm text-gray-500">
                  {date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  at{' '}
                  {date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>

                {!onSelectScan && (
                  <Link
                    href={`/report/${scan.id}`}
                    className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Report
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
