'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ScoreSummaryCard from '@/components/ScoreSummaryCard';
import ScoreRadarChart from '@/components/ScoreRadarChart';
import ScoreBarChart from '@/components/ScoreBarChart';
import ScanningAnimation from '@/components/ScanningAnimation';
import QuickWinsSection from '@/components/QuickWinsSection';
import IssuesList from '@/components/IssuesList';
import ExecutiveSummary from '@/components/ExecutiveSummary';
import WebsiteInfoCard from '@/components/WebsiteInfoCard';
import MessagingAnalysisCard from '@/components/MessagingAnalysisCard';
import SeoAnalysisCard from '@/components/SeoAnalysisCard';
import ContentPillarsCard from '@/components/ContentPillarsCard';
import AdHooksCarousel from '@/components/AdHooksCarousel';
import ConversionChecklist from '@/components/ConversionChecklist';
import ChannelFitChart from '@/components/ChannelFitChart';
import AISearchVisibilityCard from '@/components/AISearchVisibilityCard';
import TechnicalPerformanceCard from '@/components/TechnicalPerformanceCard';
import BrandHealthCard from '@/components/BrandHealthCard';
import DesignAuthenticityCard from '@/components/DesignAuthenticityCard';
import type { Report } from '@/types/report';

type TabType = 'overview' | 'messaging' | 'seo' | 'content' | 'ads' | 'conversion' | 'distribution' | 'aiSearch' | 'technical' | 'brandHealth' | 'designAuth';

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Set to true for local development to see all sections unlocked
  const [isPaid, setIsPaid] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/report/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch report');
        }

        setReport(data.report);

        // If still scanning, poll for updates
        if (data.report.status === 'scanning') {
          const pollInterval = setInterval(async () => {
            const pollResponse = await fetch(`/api/report/${id}`);
            const pollData = await pollResponse.json();

            if (pollData.report.status !== 'scanning') {
              setReport(pollData.report);
              clearInterval(pollInterval);
            }
          }, 3000);

          return () => clearInterval(pollInterval);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      }
    };

    fetchReport();
  }, [id]);

  const handleUnlock = () => {
    router.push('/api/stripe/checkout?reportId=' + id);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Go Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (!report || report.status === 'scanning') {
    return <ScanningAnimation />;
  }

  if (report.status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan Failed</h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t analyze this website. This can happen if the site is down,
            blocks automated access, or uses heavy JavaScript.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Try Another Website
          </button>
        </motion.div>
      </div>
    );
  }

  const scores = {
    messaging: report.messagingScore || 0,
    seo: report.seoScore || 0,
    content: report.contentScore || 0,
    ads: report.adsScore || 0,
    conversion: report.conversionScore || 0,
    distribution: report.distributionScore || 0,
    aiSearch: report.aiSearchScore || 0,
    technical: report.technicalScore || 0,
    brandHealth: report.brandHealthScore || 0,
    designAuth: report.designAuthenticityScore || 0,
  };

  const tabs: { id: TabType; label: string; score?: number; locked?: boolean }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'messaging', label: 'Messaging', score: scores.messaging },
    { id: 'seo', label: 'SEO', score: scores.seo },
    { id: 'aiSearch', label: 'AI', score: scores.aiSearch },
    { id: 'technical', label: 'Tech', score: scores.technical },
    { id: 'brandHealth', label: 'Brand', score: scores.brandHealth },
    { id: 'designAuth', label: 'Design', score: scores.designAuth },
    { id: 'content', label: 'Content', score: scores.content, locked: !isPaid },
    { id: 'ads', label: 'Ads', score: scores.ads, locked: !isPaid },
    { id: 'conversion', label: 'CRO', score: scores.conversion, locked: !isPaid },
    { id: 'distribution', label: 'Channels', score: scores.distribution, locked: !isPaid },
  ];

  const totalQuickWins =
    (report.messagingAnalysis?.quickWins?.length || 0) +
    (report.seoOpportunities?.quickWins?.length || 0) +
    (report.contentStrategy?.quickWins?.length || 0) +
    (report.adAngles?.quickWins?.length || 0) +
    (report.conversionOptimization?.quickWins?.length || 0) +
    (report.distributionStrategy?.quickWins?.length || 0) +
    (report.aiSearchVisibility?.quickWins?.length || 0) +
    (report.technicalPerformance?.quickWins?.length || 0) +
    (report.brandHealth?.quickWins?.length || 0) +
    (report.designAuthenticity?.quickWins?.length || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">
              BrandProbe
            </span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden md:block">
              Report generated {new Date(report.createdAt).toLocaleDateString()}
            </span>
            {!isPaid && (
              <button
                onClick={handleUnlock}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Unlock Full Report
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section with Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Score Summary Card */}
            <div className="lg:col-span-1">
              <ScoreSummaryCard
                overallScore={report.overallScore || 0}
                previousScore={report.previousOverallScore}
                scoreChange={report.scoreChange}
              />
            </div>

            {/* URL and Details */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Marketing Analysis Report
                  </h1>
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {report.url}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Share Report">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <a
                    href={`/report/${id}/print`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Print / Download PDF"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                  <p className="text-3xl font-bold text-gray-900">{Object.values(scores).filter(s => s >= 70).length}</p>
                  <p className="text-sm text-gray-600 font-medium">Strong</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                  <p className="text-3xl font-bold text-gray-900">{Object.values(scores).filter(s => s >= 50 && s < 70).length}</p>
                  <p className="text-sm text-gray-600 font-medium">Average</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                  <p className="text-3xl font-bold text-gray-900">{Object.values(scores).filter(s => s < 50).length}</p>
                  <p className="text-sm text-gray-600 font-medium">Needs Work</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                  <p className="text-3xl font-bold text-gray-900">{totalQuickWins}</p>
                  <p className="text-sm text-gray-600 font-medium">Quick Wins</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="grid grid-cols-5 lg:grid-cols-10 gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.locked && setActiveTab(tab.id)}
                className={`px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : tab.locked
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="truncate">{tab.label}</span>
                <span className="flex items-center gap-1">
                  {tab.score !== undefined && (
                    <span className={`text-xs px-1 py-0.5 rounded ${
                      activeTab === tab.id
                        ? 'bg-white/20'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {tab.score}
                    </span>
                  )}
                  {tab.locked && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Executive Summary */}
              <ExecutiveSummary report={report} />

              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Score Overview</h2>
                      <p className="text-sm text-gray-500">Performance across all areas</p>
                    </div>
                  </div>
                  <ScoreRadarChart scores={scores} />
                </div>

                {/* Bar Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Section Breakdown</h2>
                      <p className="text-sm text-gray-500">Score comparison by category</p>
                    </div>
                  </div>
                  <ScoreBarChart scores={scores} />
                </div>
              </div>

              {/* Website Info */}
              {report.scrapedData && (
                <WebsiteInfoCard data={report.scrapedData} />
              )}

              {/* Issues List */}
              <IssuesList report={report} />

              {/* Quick Wins */}
              <QuickWinsSection report={report} />
            </div>
          )}

          {activeTab === 'messaging' && report.messagingAnalysis && (
            <MessagingAnalysisCard messaging={report.messagingAnalysis} />
          )}

          {activeTab === 'seo' && report.seoOpportunities && (
            <SeoAnalysisCard seo={report.seoOpportunities} />
          )}

          {activeTab === 'content' && report.contentStrategy && (
            <ContentPillarsCard content={report.contentStrategy} />
          )}

          {activeTab === 'ads' && report.adAngles && (
            <AdHooksCarousel adAngles={report.adAngles} />
          )}

          {activeTab === 'conversion' && report.conversionOptimization && (
            <ConversionChecklist conversion={report.conversionOptimization} />
          )}

          {activeTab === 'distribution' && report.distributionStrategy && (
            <ChannelFitChart distribution={report.distributionStrategy} />
          )}

          {activeTab === 'aiSearch' && report.aiSearchVisibility && (
            <AISearchVisibilityCard aiSearch={report.aiSearchVisibility} />
          )}

          {activeTab === 'technical' && report.technicalPerformance && (
            <TechnicalPerformanceCard technical={report.technicalPerformance} />
          )}

          {activeTab === 'brandHealth' && report.brandHealth && (
            <BrandHealthCard brandHealth={report.brandHealth} />
          )}

          {activeTab === 'designAuth' && report.designAuthenticity && (
            <DesignAuthenticityCard designAuth={report.designAuthenticity} />
          )}
        </motion.div>

        {/* CTA at bottom for free users */}
        {!isPaid && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-gray-900 rounded-xl p-8 text-center text-white"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-md px-4 py-1.5 text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              {tabs.filter(t => t.locked).length} Sections Locked
            </div>
            <h2 className="text-3xl font-bold mb-3">
              Unlock the Full Report
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Get access to all 9 sections with detailed analysis, specific recommendations,
              and monthly re-scans to track your progress.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleUnlock}
                className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all"
              >
                Unlock Full Report - $29/mo
              </button>
              <p className="text-gray-500 text-sm">
                Cancel anytime
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">BrandProbe</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BrandProbe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700">Privacy</a>
            <a href="#" className="hover:text-gray-700">Terms</a>
            <a href="#" className="hover:text-gray-700">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
