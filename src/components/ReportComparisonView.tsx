'use client';

import { motion } from 'framer-motion';

interface ComparisonReport {
  id: string;
  scanNumber: number;
  createdAt: string;
  overallScore: number;
}

interface SectionComparison {
  section: string;
  report1Score: number;
  report2Score: number;
  change: number;
  status: 'improved' | 'declined' | 'unchanged';
}

interface ComparisonData {
  report1: ComparisonReport;
  report2: ComparisonReport;
  overallChange: number;
  sectionComparisons: SectionComparison[];
  summary: {
    improved: number;
    declined: number;
    unchanged: number;
  };
}

interface ReportComparisonViewProps {
  comparison: ComparisonData;
}

const SECTION_LABELS: Record<string, string> = {
  messaging: 'Messaging',
  seo: 'SEO',
  content: 'Content',
  ads: 'Ads',
  conversion: 'Conversion',
  distribution: 'Distribution',
  aiSearch: 'AI Search',
  technical: 'Technical',
  brandHealth: 'Brand Health',
  designAuth: 'Design',
};

function getScoreBarColor(score: number): string {
  if (score <= 25) return 'bg-red-500';
  if (score <= 50) return 'bg-orange-500';
  if (score <= 70) return 'bg-yellow-500';
  if (score <= 85) return 'bg-green-500';
  return 'bg-emerald-500';
}

export default function ReportComparisonView({
  comparison,
}: ReportComparisonViewProps) {
  const { report1, report2, overallChange, sectionComparisons, summary } = comparison;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Comparison</h3>

        <div className="grid grid-cols-3 gap-6">
          {/* Report 1 */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Scan #{report1.scanNumber}
              <br />
              <span className="text-xs">{formatDate(report1.createdAt)}</span>
            </p>
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold ${getScoreBarColor(report1.overallScore)}`}>
              {report1.overallScore}
            </div>
          </div>

          {/* Change Arrow */}
          <div className="flex flex-col items-center justify-center">
            <div className={`flex items-center justify-center w-16 h-16 rounded-full ${
              overallChange > 0
                ? 'bg-green-100'
                : overallChange < 0
                ? 'bg-red-100'
                : 'bg-gray-100'
            }`}>
              {overallChange > 0 ? (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : overallChange < 0 ? (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                </svg>
              )}
            </div>
            <p className={`mt-2 text-lg font-bold ${
              overallChange > 0
                ? 'text-green-600'
                : overallChange < 0
                ? 'text-red-600'
                : 'text-gray-500'
            }`}>
              {overallChange > 0 ? '+' : ''}{overallChange}
            </p>
          </div>

          {/* Report 2 */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Scan #{report2.scanNumber}
              <br />
              <span className="text-xs">{formatDate(report2.createdAt)}</span>
            </p>
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold ${getScoreBarColor(report2.overallScore)}`}>
              {report2.overallScore}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.improved}</p>
            <p className="text-xs text-green-700">Improved</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{summary.declined}</p>
            <p className="text-xs text-red-700">Declined</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-600">{summary.unchanged}</p>
            <p className="text-xs text-gray-700">Unchanged</p>
          </div>
        </div>
      </motion.div>

      {/* Section-by-Section Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Breakdown</h3>

        <div className="space-y-4">
          {sectionComparisons.map((section, idx) => (
            <motion.div
              key={section.section}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-4"
            >
              {/* Section name */}
              <div className="w-28 flex-shrink-0">
                <p className="text-sm font-medium text-gray-700">
                  {SECTION_LABELS[section.section] || section.section}
                </p>
              </div>

              {/* Progress bars */}
              <div className="flex-1 flex items-center gap-2">
                {/* Report 1 score */}
                <div className="w-10 text-right text-sm text-gray-500">
                  {section.report1Score}
                </div>

                {/* Visual comparison */}
                <div className="flex-1 relative h-6">
                  {/* Background */}
                  <div className="absolute inset-0 bg-gray-100 rounded-full" />

                  {/* Report 1 bar */}
                  <div
                    className="absolute left-0 top-0 h-full bg-gray-400 rounded-l-full opacity-50"
                    style={{ width: `${section.report1Score}%` }}
                  />

                  {/* Report 2 bar (overlaid) */}
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full ${
                      section.status === 'improved'
                        ? 'bg-green-500'
                        : section.status === 'declined'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                    style={{ width: `${section.report2Score}%` }}
                  />
                </div>

                {/* Report 2 score */}
                <div className="w-10 text-sm font-medium text-gray-700">
                  {section.report2Score}
                </div>

                {/* Change indicator */}
                <div className={`w-12 text-right text-sm font-semibold ${
                  section.change > 0
                    ? 'text-green-600'
                    : section.change < 0
                    ? 'text-red-600'
                    : 'text-gray-400'
                }`}>
                  {section.change > 0 ? '+' : ''}{section.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
