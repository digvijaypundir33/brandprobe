'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Report, User } from '@/types/report';
import type { SessionData } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthenticatedHeader from './AuthenticatedHeader';
import ConfirmationModal from './ConfirmationModal';
import ShowcaseToggle from './ShowcaseToggle';

interface UpgradeOptions {
  starter?: { price: number; type: string; reports: number; description?: string };
  pro: { price: number; type: string; reports: number; description?: string };
}

interface ExistingReport {
  id: string;
  url: string;
  createdAt: string;
  overallScore: number | null;
}

interface DashboardClientProps {
  user: User;
  reports: Report[];
  session: SessionData;
}

export default function DashboardClient({ user, reports, session }: DashboardClientProps) {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [showNewReportForm, setShowNewReportForm] = useState(false);
  const [newReportUrl, setNewReportUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeOptions, setUpgradeOptions] = useState<UpgradeOptions | null>(null);
  const [showRescanModal, setShowRescanModal] = useState(false);
  const [existingReport, setExistingReport] = useState<ExistingReport | null>(null);
  const [canRescan, setCanRescan] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRescanWarning, setShowRescanWarning] = useState(false);
  const [urlToRescan, setUrlToRescan] = useState<string>('');

  const handleCreateReport = async (e: React.FormEvent, forceRescan = false) => {
    e.preventDefault();
    setCreateError(null);
    setIsCreating(true);

    // Client-side URL validation
    const trimmedUrl = newReportUrl.trim();
    if (!trimmedUrl) {
      setCreateError('Please enter a website URL');
      setIsCreating(false);
      return;
    }

    // Basic URL validation
    try {
      let testUrl = trimmedUrl;
      if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
        testUrl = `https://${testUrl}`;
      }
      const parsed = new URL(testUrl);

      // Check for valid hostname
      if (!parsed.hostname || parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        setCreateError('Please enter a valid public website URL');
        setIsCreating(false);
        return;
      }

      // Check for TLD (at least one dot in hostname)
      if (!parsed.hostname.includes('.')) {
        setCreateError('Please enter a valid website URL (e.g., example.com)');
        setIsCreating(false);
        return;
      }
    } catch (err) {
      setCreateError('Please enter a valid website URL (e.g., example.com)');
      setIsCreating(false);
      return;
    }

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: trimmedUrl,
          email: session.email,
          skipVerification: true, // User is already authenticated
          forceRescan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if this is an upgrade required error
        if (data.requiresUpgrade && data.upgradeOptions) {
          setUpgradeOptions(data.upgradeOptions);
          setShowUpgradeModal(true);
          setIsCreating(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to create report');
      }

      // Check if there's a cached report (and not forcing rescan)
      if (data.cached && data.existingReport && !forceRescan) {
        setExistingReport(data.existingReport);
        setCanRescan(data.canRescan);
        setShowRescanModal(true);
        setIsCreating(false);
        return;
      }

      // Redirect to the new report
      router.push(`/report/${data.reportId}`);
      router.refresh();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Something went wrong');
      setIsCreating(false);
    }
  };

  const handleRescan = async () => {
    setShowRescanModal(false);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleCreateReport(fakeEvent, true);
  };

  const handleViewExisting = () => {
    if (existingReport) {
      router.push(`/report/${existingReport.id}`);
      setShowRescanModal(false);
      setShowNewReportForm(false);
      setNewReportUrl('');
    }
  };

  // Calculate report usage for Pro users
  const isPro = user.subscriptionStatus === 'active';
  const isStarter = user.subscriptionStatus === 'starter';
  const reportsUsed = user.reportsUsedThisMonth || 0;
  const reportsLimit = user.reportsLimit || 10;

  // Filter reports by status
  const readyReports = reports.filter(r => r.status === 'ready');
  const scanningReports = reports.filter(r => r.status === 'scanning');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">Ready</span>;
      case 'scanning':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">Scanning...</span>;
      case 'error':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-medium">Error</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${month} ${day}, ${year} at ${hour12}:${minutes} ${ampm}`;
  };

  const handleDeleteReport = (reportId: string) => {
    setReportToDelete(reportId);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/report/${reportToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setReportToDelete(null);
        router.refresh();
      } else {
        alert('Failed to delete report. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete report. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setReportToDelete(null);
  };

  const handleRescanReport = async (url: string) => {
    setOpenMenuId(null);

    // Check if user can rescan (only Pro users can rescan for free)
    const isPro = user.subscriptionStatus === 'active';

    if (!isPro) {
      // Show warning modal for free/starter users
      setUrlToRescan(url);
      setShowRescanWarning(true);
      return;
    }

    // Pro users can proceed directly
    setNewReportUrl(url);
    setShowRescanModal(true);

    // Check if report exists
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          email: session.email,
          skipVerification: true,
        }),
      });

      const data = await response.json();

      if (data.cached && data.existingReport) {
        setExistingReport(data.existingReport);
        setCanRescan(data.canRescan);
      }
    } catch (error) {
      console.error('Check report error:', error);
    }
  };

  const confirmRescan = () => {
    setShowRescanWarning(false);
    // Redirect to pricing page for upgrade
    window.location.href = '/#pricing';
  };

  const cancelRescan = () => {
    setShowRescanWarning(false);
    setUrlToRescan('');
  };

  const handleDownloadPDF = (reportId: string) => {
    setOpenMenuId(null);
    window.open(`/report/${reportId}/print`, '_blank');
  };

  // Rescan Modal
  if (showRescanModal && existingReport) {
    const reportDate = new Date(existingReport.createdAt);
    const daysAgo = Math.floor((Date.now() - reportDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedHeader
          email={session.email}
          subscriptionStatus={user.subscriptionStatus}
          reportsUsed={reportsUsed}
          reportsLimit={reportsLimit}
          pageTitle="Dashboard"
          showUpgradeButton={!isPro}
          reportId={readyReports.length > 0 ? readyReports[0].id : undefined}
        />

        <main className="container mx-auto max-w-2xl px-4 py-12">
          <div className="p-8 bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Report Already Exists</h3>
              <p className="text-gray-600 mb-4">
                We found an existing report for this website created {daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`}
              </p>
              {existingReport.overallScore !== null && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm text-gray-600">Previous Score:</span>
                  <span className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                    {existingReport.overallScore}/100
                  </span>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* View Existing */}
              <button
                onClick={handleViewExisting}
                className="py-4 px-6 bg-white border-2 border-gray-300 text-gray-900 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <div className="font-semibold mb-1">View Existing Report</div>
                  <div className="text-xs text-gray-600">Free • See your previous analysis</div>
                </div>
              </button>

              {/* Re-analyze */}
              <button
                onClick={handleRescan}
                disabled={!canRescan || isCreating}
                className="py-4 px-6 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: canRescan ? 'var(--brand-primary)' : '#9ca3af' }}
              >
                <div className="text-left">
                  <div className="font-semibold mb-1">
                    {canRescan ? (isCreating ? 'Re-analyzing...' : 'Re-analyze Now') : 'Re-analyze (Pro Only)'}
                  </div>
                  <div className="text-xs text-white/80">
                    {canRescan ? 'Get fresh insights' : 'Upgrade to re-scan'}
                  </div>
                </div>
              </button>
            </div>

            {!canRescan && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <p className="text-sm text-gray-700 text-center">
                  <strong>Pro users</strong> can re-analyze websites anytime to track improvements. Free users get 1 report per website.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setShowRescanModal(false);
                setShowNewReportForm(false);
                setNewReportUrl('');
              }}
              className="text-sm text-gray-500 hover:text-gray-700 mx-auto block"
            >
              ← Try a different website
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedHeader
        email={session.email}
        subscriptionStatus={user.subscriptionStatus}
        reportsUsed={reportsUsed}
        reportsLimit={reportsLimit}
        pageTitle="Dashboard"
        showUpgradeButton={!isPro}
        reportId={readyReports.length > 0 ? readyReports[0].id : undefined}
      />

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {isStarter || isPro ? `${reportsUsed}/${reportsLimit}` : reports.length}
                </p>
                <p className="text-sm text-gray-600">
                  {isStarter ? 'Reports Used' : isPro ? 'This Month' : 'Total Reports'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{readyReports.length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPro ? 'bg-yellow-100' : isStarter ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <svg className={`w-5 h-5 ${isPro ? 'text-yellow-600' : isStarter ? 'text-blue-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{isPro ? 'Pro' : isStarter ? 'Starter' : 'Free'}</p>
                <p className="text-sm text-gray-600">Plan</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Showcase Banner */}
        {reports.some(r => r.showcaseEnabled) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    You have {reports.filter(r => r.showcaseEnabled).length} site{reports.filter(r => r.showcaseEnabled).length === 1 ? '' : 's'} in the showcase
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage your showcase profiles and track engagement
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/showcase"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors border border-blue-200"
              >
                Manage Showcase
              </Link>
            </div>
          </motion.div>
        )}

        {/* Reports List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Reports</h2>
            <p className="text-sm text-gray-600 mt-1">All your website analysis reports</p>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports yet</h3>
              <p className="text-gray-600 mb-6">Start by analyzing your first website</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 text-white rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Create Your First Report
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Access
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Showcase
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map((report, index) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      onClick={() => {
                        if (report.status === 'ready') {
                          router.push(`/report/${report.id}`);
                        }
                      }}
                      className={`transition-colors ${
                        report.status === 'ready' ? 'hover:bg-gray-50 cursor-pointer' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {report.url}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {report.overallScore !== null && report.overallScore !== undefined ? (
                          <span className="text-sm font-semibold text-gray-900">
                            {report.overallScore}/100
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {report.status === 'ready' ? (
                          isPro || isStarter ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              10/10 Sections
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                              4/10 Sections
                            </span>
                          )
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(report.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        {report.status === 'ready' && report.isPublic && (
                          <ShowcaseToggle
                            report={report}
                            isOwner={true}
                            onUpdate={() => router.refresh()}
                          />
                        )}
                        {report.status === 'ready' && !report.isPublic && (
                          <span className="text-xs text-gray-400" title="Make report public to showcase">
                            Private
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        {(report.status === 'ready' || report.status === 'failed') && (
                          <div className="relative">
                            <button
                              ref={openMenuId === report.id ? menuButtonRef : null}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newMenuId = openMenuId === report.id ? null : report.id;
                                setOpenMenuId(newMenuId);

                                if (newMenuId) {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setMenuPosition({
                                    top: rect.bottom + 8,
                                    right: window.innerWidth - rect.right,
                                  });
                                }
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              aria-label="More actions"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>

                            {openMenuId === report.id && menuPosition && (
                              <>
                                <div
                                  className="fixed inset-0 z-[100]"
                                  onClick={() => setOpenMenuId(null)}
                                />
                                <div
                                  className="fixed w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[101]"
                                  style={{
                                    top: `${menuPosition.top}px`,
                                    right: `${menuPosition.right}px`,
                                  }}
                                >
                                  {report.status === 'ready' && (
                                    <>
                                      <button
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          router.push(`/report/${report.id}`);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View Report
                                      </button>
                                      <button
                                        onClick={() => handleRescanReport(report.url)}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Re-scan
                                      </button>
                                      <button
                                        onClick={() => handleDownloadPDF(report.id)}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download PDF
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => handleDeleteReport(report.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Report
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Create New Report Form/CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          {showNewReportForm ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Create New Report</h3>
                <button
                  onClick={() => {
                    setShowNewReportForm(false);
                    setNewReportUrl('');
                    setCreateError(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateReport} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={newReportUrl}
                    onChange={(e) => setNewReportUrl(e.target.value)}
                    placeholder="yourwebsite.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    required
                    disabled={isCreating}
                  />
                </div>

                {createError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {createError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-3 px-4 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  {isCreating ? 'Creating Report...' : 'Create Report'}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setShowNewReportForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Report
              </button>
            </div>
          )}
        </motion.div>

        {/* Upgrade Modal */}
        {showUpgradeModal && upgradeOptions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Upgrade Required</h3>
                <p className="text-gray-600">
                  You've reached your plan limit. Choose an option below to continue:
                </p>
              </div>

              <div className={`grid ${upgradeOptions.starter ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4 mb-6`}>
                {upgradeOptions.starter && (
                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-gray-900">Starter</h4>
                      <p className="text-sm text-gray-600">{upgradeOptions.starter.description || 'One-time purchase'}</p>
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">${upgradeOptions.starter.price}</span>
                      <span className="text-gray-600 ml-2">one-time</span>
                    </div>
                    <Link
                      href="/#pricing"
                      className="block w-full py-3 px-4 bg-gray-900 text-white text-center rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      onClick={() => setShowUpgradeModal(false)}
                    >
                      Get Starter
                    </Link>
                  </div>
                )}

                <div className="border-2 rounded-xl p-6 relative overflow-hidden hover:border-blue-400 transition-colors"
                  style={{ borderColor: 'var(--brand-primary)' }}>
                  <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg"
                    style={{ backgroundColor: 'var(--brand-primary)' }}>
                    {upgradeOptions.starter ? 'POPULAR' : 'RECOMMENDED'}
                  </div>
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Pro</h4>
                    <p className="text-sm text-gray-600">{upgradeOptions.pro.description || 'Monthly subscription'}</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">${upgradeOptions.pro.price}</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <Link
                    href="/#pricing"
                    className="block w-full py-3 px-4 text-white text-center rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                    onClick={() => setShowUpgradeModal(false)}
                  >
                    Get Pro
                  </Link>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setShowNewReportForm(false);
                  setNewReportUrl('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 mx-auto block"
              >
                ← Cancel
              </button>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Report?"
          message={
            user.subscriptionStatus === 'free' || user.subscriptionStatus === null
              ? 'You have already used your free report quota. Deleting this report will NOT allow you to create a new one.\n\nTo create more reports, you need to upgrade to Starter ($9 for 2 reports) or Pro ($29/month for 10 reports/month).'
              : user.subscriptionStatus === 'starter'
              ? 'You have already used your Starter plan quota (2 reports). Deleting this report will NOT allow you to create a new one.\n\nTo create more reports, upgrade to Pro ($29/month for 10 reports/month).'
              : 'This action cannot be undone. Are you sure you want to delete this report?'
          }
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={isDeleting}
          variant="danger"
        />

        {/* Re-scan Warning Modal */}
        <ConfirmationModal
          isOpen={showRescanWarning}
          onClose={cancelRescan}
          onConfirm={confirmRescan}
          title="Re-scan Not Available"
          message={
            user.subscriptionStatus === 'free' || user.subscriptionStatus === null
              ? 'Re-scanning is only available for Pro users. Free users have already used their 1 report quota.\n\nUpgrade to Pro ($29/month) to re-scan existing reports and get 10 reports per month.'
              : 'Re-scanning is only available for Pro users. Starter users have already used their 2 report quota.\n\nUpgrade to Pro ($29/month) to re-scan existing reports and get 10 reports per month.'
          }
          confirmText="Upgrade to Pro"
          cancelText="Cancel"
          variant="warning"
        />
      </main>
    </div>
  );
}
