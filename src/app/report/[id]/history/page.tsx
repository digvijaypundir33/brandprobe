'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AuthenticatedHeader from '@/components/AuthenticatedHeader';
import ScanTimeline from '@/components/ScanTimeline';
import ScoreTrendChart from '@/components/ScoreTrendChart';
import ReportComparisonView from '@/components/ReportComparisonView';

interface ScanHistoryItem {
  id: string;
  scanNumber: number;
  createdAt: string;
  overallScore: number;
  scoreChange: number | null;
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

interface ComparisonData {
  report1: { id: string; scanNumber: number; createdAt: string; overallScore: number };
  report2: { id: string; scanNumber: number; createdAt: string; overallScore: number };
  overallChange: number;
  sectionComparisons: Array<{
    section: string;
    report1Score: number;
    report2Score: number;
    change: number;
    status: 'improved' | 'declined' | 'unchanged';
  }>;
  summary: { improved: number; declined: number; unchanged: number };
}

export default function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScan1, setSelectedScan1] = useState<string | null>(null);
  const [selectedScan2, setSelectedScan2] = useState<string | null>(null);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [comparingLoading, setComparingLoading] = useState(false);
  const [showSectionLines, setShowSectionLines] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('free');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // First check auth
        const authResponse = await fetch('/api/auth/session');
        const authData = await authResponse.json();

        if (!authData.authenticated) {
          router.push('/login');
          return;
        }

        setUserEmail(authData.email || '');

        // Check subscription
        if (authData.subscriptionStatus !== 'active') {
          setError('History view is available for Pro users only');
          setLoading(false);
          return;
        }

        setSubscriptionStatus(authData.subscriptionStatus);

        // Fetch history
        const response = await fetch(`/api/reports/history?reportId=${id}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch history');
        }

        setHistory(data.history);

        // Default: select latest and previous for comparison
        if (data.history.length >= 2) {
          setSelectedScan1(data.history[1].id); // Previous
          setSelectedScan2(data.history[0].id); // Latest
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id, router]);

  // Fetch comparison when selections change
  useEffect(() => {
    if (!selectedScan1 || !selectedScan2 || selectedScan1 === selectedScan2) {
      setComparison(null);
      return;
    }

    const fetchComparison = async () => {
      setComparingLoading(true);
      try {
        const response = await fetch(
          `/api/reports/compare?report1=${selectedScan1}&report2=${selectedScan2}`
        );
        const data = await response.json();

        if (data.success) {
          setComparison(data.comparison);
        }
      } catch (err) {
        console.error('Failed to fetch comparison:', err);
      } finally {
        setComparingLoading(false);
      }
    };

    fetchComparison();
  }, [selectedScan1, selectedScan2]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="w-32 h-8 bg-gray-200 rounded" />
            <div className="w-24 h-8 bg-gray-200 rounded" />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-96 bg-white rounded-xl border border-gray-200" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push(`/report/${id}`)}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Back to Report
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AuthenticatedHeader
        email={userEmail}
        subscriptionStatus={subscriptionStatus}
        pageTitle="Scan History"
        showUpgradeButton={false}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/report/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Report
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Scan Timeline
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {history.length} total scan{history.length !== 1 ? 's' : ''}
              </p>

              <ScanTimeline scans={history} currentScanId={id} />
            </motion.div>
          </div>

          {/* Chart and Comparison Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Score Trend
                </h2>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showSectionLines}
                    onChange={(e) => setShowSectionLines(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Show sections
                </label>
              </div>

              <ScoreTrendChart data={history} showSections={showSectionLines} />
            </motion.div>

            {/* Comparison Selection */}
            {history.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Compare Scans
                </h2>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From
                    </label>
                    <select
                      value={selectedScan1 || ''}
                      onChange={(e) => setSelectedScan1(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select scan...</option>
                      {history.map((scan) => (
                        <option key={scan.id} value={scan.id}>
                          Scan #{scan.scanNumber} ({new Date(scan.createdAt).toLocaleDateString()}) - Score: {scan.overallScore}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-shrink-0 pt-6">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To
                    </label>
                    <select
                      value={selectedScan2 || ''}
                      onChange={(e) => setSelectedScan2(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select scan...</option>
                      {history.map((scan) => (
                        <option key={scan.id} value={scan.id}>
                          Scan #{scan.scanNumber} ({new Date(scan.createdAt).toLocaleDateString()}) - Score: {scan.overallScore}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Comparison Results */}
                {comparingLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                  </div>
                ) : comparison ? (
                  <ReportComparisonView comparison={comparison} />
                ) : selectedScan1 && selectedScan2 && selectedScan1 === selectedScan2 ? (
                  <p className="text-center text-gray-500 py-8">
                    Select different scans to compare
                  </p>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Select two scans to compare
                  </p>
                )}
              </motion.div>
            )}

            {history.length < 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center"
              >
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Track Your Progress
                </h3>
                <p className="text-blue-700 mb-4">
                  Rescan your website after making improvements to see your progress over time.
                </p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
