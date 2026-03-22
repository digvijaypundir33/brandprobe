'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AIPlatformVisibilityPreview from '@/components/AIPlatformVisibilityPreview';
import ScoreBarChart from '@/components/ScoreBarChart';
import ScanningAnimation from '@/components/ScanningAnimation';
import QuickWinsSection from '@/components/QuickWinsSection';
import IssuesList from '@/components/IssuesList';
import ExecutiveSummary from '@/components/ExecutiveSummary';
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
import AuthenticatedHeader from '@/components/AuthenticatedHeader';
import ImprovementsSummary from '@/components/ImprovementsSummary';
import AlertModal from '@/components/AlertModal';
import ShareButton from '@/components/ShareButton';
import ReportHeader from '@/components/ReportHeader';
import ReportTabNav from '@/components/ReportTabNav';
import { analyzeSiteQuality } from '@/lib/site-quality-analyzer';
import type { Report } from '@/types/report';

type TabType = 'overview' | 'messaging' | 'seo' | 'content' | 'ads' | 'conversion' | 'distribution' | 'aiSearch' | 'technical' | 'brandHealth' | 'designAuth';

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('free');
  const [userEmail, setUserEmail] = useState<string>(''); // Report owner's email
  const [visitorEmail, setVisitorEmail] = useState<string>(''); // Current visitor's email (if authenticated)
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingTier, setPendingTier] = useState<'starter' | 'pro' | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isTogglingPrivacy, setIsTogglingPrivacy] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'error' | 'warning' | 'info' | 'success';
  }>({ isOpen: false, title: '', message: '', variant: 'info' });

  const showAlert = (title: string, message: string, variant: 'error' | 'warning' | 'info' | 'success' = 'info') => {
    setAlertModal({ isOpen: true, title, message, variant });
  };

  useEffect(() => {
    // Check for payment cancelled query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'cancelled') {
      setPaymentCancelled(true);
    }

    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated && data.email) {
          setVisitorEmail(data.email);
        }
      } catch (error) {
        console.error('Failed to check auth:', error);
      }
    };
    checkAuth();

    const fetchReport = async () => {
      try {
        // Get share token from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const shareToken = urlParams.get('share');
        const apiUrl = shareToken ? `/api/report/${id}?share=${shareToken}` : `/api/report/${id}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch report');
        }

        setReport(data.report);
        setHasFullAccess(data.hasFullAccess || false);
        setSubscriptionStatus(data.subscriptionStatus || 'free');
        setUserEmail(data.userEmail || '');
        setIsPublic(data.report.isPublic !== false); // Default to public

        // If still scanning, poll for updates (but not if payment was cancelled)
        if (data.report.status === 'scanning' && !paymentCancelled) {
          const pollInterval = setInterval(async () => {
            const pollResponse = await fetch(apiUrl);
            const pollData = await pollResponse.json();

            if (pollData.report.status !== 'scanning') {
              setReport(pollData.report);
              setHasFullAccess(pollData.hasFullAccess || false);
              setSubscriptionStatus(pollData.subscriptionStatus || 'free');
              setUserEmail(pollData.userEmail || '');
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
  }, [id, paymentCancelled]);

  const handleUnlock = (tier: 'starter' | 'pro') => {
    // Debug: Log authentication state
    console.log('[Unlock] isAuthenticated:', isAuthenticated, 'visitorEmail:', visitorEmail, 'userEmail:', userEmail);

    // If visitor has no email, show email input modal first
    if (!visitorEmail && !emailInput) {
      console.log('[Unlock] No visitor email, showing email modal');
      setPendingTier(tier);
      setShowEmailModal(true);
      return;
    }

    // Redirect to checkout page with tier, reportId, and email
    const email = emailInput || visitorEmail || userEmail;
    console.log('[Unlock] Redirecting to checkout with email:', email);
    const checkoutUrl = `/checkout?tier=${tier}&reportId=${id}&email=${encodeURIComponent(email)}`;
    router.push(checkoutUrl);
  };

  const handleEmailSubmit = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      showAlert('Invalid Email', 'Please enter a valid email address', 'warning');
      return;
    }

    // Check if user already has access
    try {
      const response = await fetch(`/api/user/check?email=${encodeURIComponent(emailInput)}`);
      const data = await response.json();

      if (data.exists && (data.subscriptionStatus === 'active' || data.subscriptionStatus === 'starter')) {
        // User has active subscription
        showAlert(
          'Already Subscribed',
          `This email already has an ${data.subscriptionStatus === 'active' ? 'Pro' : 'Starter'} plan! Please log in to access your reports.`,
          'info'
        );
        setShowEmailModal(false);
        setPendingTier(null);
        setEmailInput('');
        return;
      }

      // Email is new or has no subscription - continue to checkout
      setShowEmailModal(false);
      if (pendingTier) {
        handleUnlock(pendingTier);
      }
    } catch (error) {
      console.error('Error checking email:', error);
      // On error, proceed anyway
      setShowEmailModal(false);
      if (pendingTier) {
        handleUnlock(pendingTier);
      }
    }
  };

  const handleTogglePrivacy = async () => {
    if (!visitorEmail || visitorEmail !== userEmail) {
      showAlert('Permission Denied', 'Only the report owner can change privacy settings', 'warning');
      return;
    }

    const newPrivacyState = !isPublic;
    setIsTogglingPrivacy(true);

    try {
      const response = await fetch(`/api/report/${id}/privacy`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: newPrivacyState }),
      });

      const data = await response.json();

      if (data.success) {
        setIsPublic(newPrivacyState);
      } else {
        showAlert('Error', data.error || 'Failed to update privacy setting', 'error');
      }
    } catch (error) {
      showAlert('Error', 'Failed to update privacy setting', 'error');
    } finally {
      setIsTogglingPrivacy(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(91, 91, 213, 0.1)' }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--brand-primary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Private Report</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Want your own BrandProbe report? Analyze any website in 60 seconds.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 text-white rounded-xl transition-all font-medium hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            Try BrandProbe
          </button>
        </motion.div>
      </div>
    );
  }

  // Show scanning animation only if report hasn't loaded yet OR if it's actively scanning
  if (!report) {
    // Skeleton loader matching report layout
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
        {/* Header Skeleton */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
              <div className="w-24 h-6 bg-gray-100 rounded"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-4 bg-gray-100 rounded"></div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section Skeleton */}
          <div className="mb-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Score Card Skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-4"></div>
                  <div className="w-24 h-8 bg-gray-100 rounded mx-auto mb-2"></div>
                  <div className="w-16 h-4 bg-gray-100 rounded mx-auto"></div>
                </div>
              </div>

              {/* URL and Details Skeleton */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                <div className="w-48 h-8 bg-gray-100 rounded mb-4"></div>
                <div className="w-64 h-6 bg-gray-100 rounded mb-6"></div>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="w-8 h-8 bg-gray-100 rounded mx-auto mb-2"></div>
                      <div className="w-12 h-4 bg-gray-100 rounded mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation Skeleton */}
          <div className="mb-6">
            <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-100">
              <div className="grid grid-cols-5 lg:grid-cols-10 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div key={i} className="h-10 bg-gray-50 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-48 h-6 bg-gray-100 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="w-full h-4 bg-gray-100 rounded"></div>
                <div className="w-full h-4 bg-gray-100 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-100 rounded"></div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="w-40 h-6 bg-gray-100 rounded mb-4"></div>
                <div className="w-full h-64 bg-gray-100 rounded"></div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="w-40 h-6 bg-gray-100 rounded mb-4"></div>
                <div className="w-full h-64 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (report.status === 'scanning' && !paymentCancelled) {
    return <ScanningAnimation websiteUrl={report.url} />;
  }

  // If payment was cancelled and report is still scanning, show a message instead of loading animation
  if (report && report.status === 'scanning' && paymentCancelled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Report is Being Prepared</h1>
          <p className="text-gray-600 mb-8">
            We're still analyzing your website in the background. This usually takes about 60 seconds.
            You can wait here or come back later - we'll email you when it's ready!
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">While you wait, unlock the full report:</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Starter Tier */}
              <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Starter - $9</h3>
                <p className="text-sm text-gray-600 mb-4">One-time payment for this report</p>
                <button
                  onClick={() => handleUnlock('starter')}
                  className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Unlock for $9
                </button>
              </div>

              {/* Pro Tier */}
              <div className="bg-white rounded-lg p-6 border-2 border-purple-600">
                <div className="inline-block bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                  BEST VALUE
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Pro - $29/month</h3>
                <p className="text-sm text-gray-600 mb-4">10 reports/month + progress tracking</p>
                <button
                  onClick={() => handleUnlock('pro')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setPaymentCancelled(false);
              window.location.reload();
            }}
            className="text-blue-600 hover:underline text-sm"
          >
            Refresh to check if report is ready
          </button>
        </motion.div>
      </div>
    );
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
          <p className="text-gray-600 mb-4">
            {report.errorMessage ||
              "We couldn't analyze this website. This can happen if the site is down, blocks automated access, or uses heavy JavaScript."}
          </p>

          {/* Don't worry message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Don&apos;t worry!</strong> Failed scans don&apos;t count against your report limit.
              Feel free to try again or scan a different website.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/?url=${encodeURIComponent(report.url)}`)}
              className="px-6 py-3 bg-[rgb(91,91,213)] text-white rounded-xl hover:bg-[rgb(71,71,193)] transition-colors font-medium"
            >
              Retry This Website
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Try Another Website
            </button>
          </div>
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

  // Compute siteQuality once for reuse
  const siteQuality = report.scrapedData?.technicalData
    ? analyzeSiteQuality(
        report.scrapedData.technicalData,
        report.scrapedData.title || '',
        report.scrapedData.metaDescription || ''
      )
    : undefined;

  // Print handler
  const handlePrint = () => {
    window.open(`/report/${id}/print`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9]">
      {/* Header */}
      {isAuthenticated ? (
        <AuthenticatedHeader
          email={userEmail}
          subscriptionStatus={subscriptionStatus}
          pageTitle={`Report for ${new URL(report.url).hostname}`}
          showUpgradeButton={!hasFullAccess}
          reportId={id}
        />
      ) : (
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#5B5BD5]">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-xl font-[family-name:var(--font-space-grotesk)] font-bold text-gray-900">BrandProbe</span>
            </Link>
            <div className="flex items-center gap-4">
              {hasFullAccess && (
                <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  subscriptionStatus === 'active'
                    ? 'bg-gradient-to-r from-[#5B5BD5] to-[#7B7BF5] text-white'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {subscriptionStatus === 'active' ? 'PRO' : 'PAID'}
                </span>
              )}
              {!hasFullAccess && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUnlock('starter')}
                    className="hidden sm:block px-4 py-2 border-2 border-slate-900 text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Unlock $9
                  </button>
                  <button
                    onClick={() => handleUnlock('pro')}
                    className="px-5 py-2.5 bg-[#5B5BD5] hover:bg-[#5B5BD5]/90 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-[#5B5BD5]/20"
                  >
                    Get Pro
                  </button>
                </div>
              )}
              <Link
                href="/access-reports"
                className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                My Reports
              </Link>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Report Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ReportHeader
            url={report.url}
            overallScore={report.overallScore || 0}
            createdAt={report.createdAt}
            reportId={id}
            isPublic={report.isPublic}
            onPrint={handlePrint}
          />
        </motion.div>

        {/* Tab Navigation */}
        <ReportTabNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          scores={scores}
          hasFullAccess={hasFullAccess}
        />

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Improvement Tracking (Phase 2) - Show if issue comparison data exists */}
              {report.issueComparison && (
                <ImprovementsSummary
                  issueComparison={report.issueComparison}
                  scanNumber={report.scanNumber}
                />
              )}

              {/* Executive Summary */}
              <ExecutiveSummary report={report} hasFullAccess={hasFullAccess} />

              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* AI Platform Visibility */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">AI Platform Visibility</h2>
                      <p className="text-sm text-gray-500">Your brand across AI assistants</p>
                    </div>
                  </div>
                  <AIPlatformVisibilityPreview
                    aeoScore={report.aiSearchVisibility?.detailedAnalysis?.aeoScore || 0}
                    hasFullAccess={hasFullAccess}
                  />
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
                  <ScoreBarChart scores={scores} sectionScoreChanges={report.sectionScoreChanges} hasFullAccess={hasFullAccess} />
                </div>
              </div>

              {/* Issues List */}
              <IssuesList report={report} hasFullAccess={hasFullAccess} />

              {/* Quick Wins */}
              <QuickWinsSection report={report} hasFullAccess={hasFullAccess} />
            </div>
          )}

          {activeTab === 'messaging' && report.messagingAnalysis && (
            <MessagingAnalysisCard messaging={report.messagingAnalysis} />
          )}

          {activeTab === 'seo' && report.seoOpportunities && (
            <SeoAnalysisCard seo={report.seoOpportunities} siteQuality={siteQuality} />
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
            <AISearchVisibilityCard
              aiSearch={report.aiSearchVisibility}
              technicalData={report.scrapedData?.technicalData}
            />
          )}

          {activeTab === 'technical' && report.technicalPerformance && (
            <TechnicalPerformanceCard
              technical={report.technicalPerformance}
              technicalData={report.scrapedData?.technicalData}
            />
          )}

          {activeTab === 'brandHealth' && report.brandHealth && (
            <BrandHealthCard brandHealth={report.brandHealth} />
          )}

          {activeTab === 'designAuth' && report.designAuthenticity && (
            <DesignAuthenticityCard designAuth={report.designAuthenticity} />
          )}
        </motion.div>

        {/* CTA at bottom for free users */}
        {!hasFullAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-[#5B5BD5] to-[#7B7BF5] rounded-2xl p-8 md:p-10 text-center text-white shadow-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              6 Sections Locked
            </div>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-space-grotesk)] font-bold mb-4">
              Unlock the Full Report
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto text-lg">
              Get access to all 10 sections with detailed analysis, specific recommendations,
              and actionable insights to grow your startup.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <div className="text-center">
                <button
                  onClick={() => handleUnlock('starter')}
                  className="px-8 py-4 bg-white text-[#5B5BD5] font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
                >
                  Unlock Report - $9
                </button>
                <p className="text-white/60 text-sm mt-2">
                  One-time payment
                </p>
              </div>
              <div className="text-white/60 font-medium">or</div>
              <div className="text-center">
                <button
                  onClick={() => handleUnlock('pro')}
                  className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                >
                  Get Pro - $29/mo
                </button>
                <p className="text-white/60 text-sm mt-2">
                  10 reports/month + auto re-scan
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#5B5BD5] rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-gray-900">BrandProbe</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} BrandProbe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            <Link href="/support" className="hover:text-slate-700">Support</Link>
          </div>
        </div>
      </footer>

      {/* Email Input Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Your Email</h3>
            <p className="text-gray-600 text-sm mb-6">
              We'll send your receipt and report access link to this email.
            </p>

            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setPendingTier(null);
                  setEmailInput('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSubmit}
                className="flex-1 px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
      />
    </div>
  );
}
