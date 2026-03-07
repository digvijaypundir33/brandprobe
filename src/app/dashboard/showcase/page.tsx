'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthenticatedHeader from '@/components/AuthenticatedHeader';
import { SHOWCASE_CATEGORIES, type ShowcaseCategory, type Report } from '@/types/report';

interface ShowcaseProfile {
  displayName: string;
  tagline: string;
  description: string;
  iconUrl: string;
  screenshotUrl: string;
  category: ShowcaseCategory | '';
  isPriority?: boolean;
}

function ShowcaseDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // All user reports
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [showcasedReports, setShowcasedReports] = useState<Report[]>([]);

  // Report data (single report view)
  const [report, setReport] = useState<Report | null>(null);
  const [isShowcased, setIsShowcased] = useState(false);

  // Showcase stats
  const [showcaseStats, setShowcaseStats] = useState<{
    views: number;
    upvotes: number;
    comments: number;
  } | null>(null);

  // Form state
  const [profile, setProfile] = useState<ShowcaseProfile>({
    displayName: '',
    tagline: '',
    description: '',
    iconUrl: '',
    screenshotUrl: '',
    category: '',
    isPriority: false,
  });

  // Defaults from scraped data
  const [defaults, setDefaults] = useState({
    name: '',
    tagline: '',
    iconUrl: '',
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        if (!data.authenticated) {
          router.push('/access-reports');
          return;
        }
        setIsAuthenticated(true);
        setUserEmail(data.email || '');
        setSubscriptionStatus(data.subscriptionStatus || 'free');
      } catch (error) {
        console.error('Failed to check auth:', error);
        router.push('/access-reports');
      }
    };
    checkAuth();
  }, [router]);

  // Fetch all user reports
  const fetchAllReports = useCallback(async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();

      if (data.success && data.reports) {
        setAllReports(data.reports);
        const showcased = data.reports.filter((r: Report) => r.showcaseEnabled);
        setShowcasedReports(showcased);

        // Count priority showcases
        const priorityCount = showcased.filter((r: Report) => r.isPriority).length;
        console.log('[Dashboard] Priority showcases:', priorityCount);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch report and existing profile
  const fetchReportData = useCallback(async () => {
    if (!reportId) {
      // If no reportId, fetch all reports instead
      await fetchAllReports();
      return;
    }

    try {
      // Fetch report
      const reportRes = await fetch(`/api/report/${reportId}`);
      const reportData = await reportRes.json();

      if (!reportData.success || !reportData.report) {
        setError('Report not found');
        setIsLoading(false);
        return;
      }

      const reportInfo = reportData.report;
      setReport(reportInfo);
      setIsShowcased(reportInfo.showcaseEnabled || false);

      // Extract defaults from scraped data
      const scrapedData = reportInfo.scrapedData || {};
      const defaultName = scrapedData.title || extractDomainFromUrl(reportInfo.url);
      const defaultTagline = scrapedData.metaDescription?.slice(0, 120) ||
                            scrapedData.heroText?.slice(0, 120) ||
                            'Analyzed by BrandProbe';
      const defaultIconUrl = scrapedData.technicalData?.hasFavicon
        ? `${new URL(reportInfo.url).origin}/favicon.ico`
        : '';

      setDefaults({
        name: defaultName,
        tagline: defaultTagline,
        iconUrl: defaultIconUrl,
      });

      // Fetch existing profile if showcased
      if (reportInfo.showcaseEnabled) {
        const profileRes = await fetch(`/api/showcase/${reportId}`);
        const profileData = await profileRes.json();

        if (profileData.success && profileData.profile) {
          setProfile({
            displayName: profileData.profile.displayName || '',
            tagline: profileData.profile.tagline || '',
            description: profileData.profile.description || '',
            iconUrl: profileData.profile.iconUrl || '',
            screenshotUrl: profileData.profile.screenshotUrl || '',
            category: profileData.profile.category || '',
            isPriority: profileData.profile.isPriority || false,
          });
        }

        // Fetch showcase stats (detail includes upvotes and comments)
        const detailRes = await fetch(`/api/showcase/${reportId}/detail`);
        const detailData = await detailRes.json();

        if (detailData.success && detailData.detail) {
          setShowcaseStats({
            views: detailData.detail.showcaseViews || 0,
            upvotes: detailData.detail.showcaseUpvotes || 0,
            comments: detailData.detail.commentCount || 0,
          });
        }
      } else {
        // Pre-fill form with defaults for new showcase
        setProfile({
          displayName: defaultName,
          tagline: defaultTagline,
          description: scrapedData.metaDescription || scrapedData.heroText || '',
          iconUrl: defaultIconUrl,
          screenshotUrl: '',
          category: '',
          isPriority: false,
        });
      }
    } catch (err) {
      console.error('Failed to fetch report:', err);
      setError('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReportData();
    }
  }, [isAuthenticated, fetchReportData]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (isShowcased) {
        // Update existing profile
        const res = await fetch(`/api/showcase/${reportId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            displayName: profile.displayName || null,
            tagline: profile.tagline || null,
            description: profile.description || null,
            iconUrl: profile.iconUrl || null,
            screenshotUrl: profile.screenshotUrl || null,
            category: profile.category || null,
            isPriority: profile.isPriority || false,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          setError(data.error || 'Failed to update showcase');
          return;
        }

        setSuccess('Showcase profile updated successfully!');
      } else {
        // Enable showcase
        const res = await fetch('/api/showcase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reportId,
            displayName: profile.displayName || undefined,
            tagline: profile.tagline || undefined,
            description: profile.description || undefined,
            iconUrl: profile.iconUrl || undefined,
            category: profile.category || undefined,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          setError(data.error || 'Failed to enable showcase');
          return;
        }

        setIsShowcased(true);
        setSuccess('Your site is now showcased! It will appear in the showcase directory.');
      }
    } catch (err) {
      setError('Failed to save. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle disable showcase
  const handleDisable = async () => {
    if (!confirm('Remove this site from the showcase?')) return;

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/showcase/${reportId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Failed to disable showcase');
        return;
      }

      setIsShowcased(false);
      setSuccess('Site removed from showcase.');
    } catch (err) {
      setError('Failed to disable showcase.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }}></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no reportId, show list of all showcases
  if (!reportId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedHeader
          email={userEmail}
          subscriptionStatus={subscriptionStatus}
          pageTitle="Manage Showcase"
          showUpgradeButton={subscriptionStatus !== 'active'}
        />

        <main className="container mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Showcase Sites</h1>
            <p className="text-gray-600">
              Manage your showcased sites and track engagement stats
            </p>
          </div>

          {/* Priority Showcase Info Banner */}
          {(subscriptionStatus === 'pro' || subscriptionStatus === 'starter') && showcasedReports.length > 0 && (
            <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Priority Showcase Available
                  </h3>
                  <p className="text-sm text-gray-700">
                    {subscriptionStatus === 'starter' && 'As a Starter user, you can feature 1 showcase with a "Featured" badge and higher visibility.'}
                    {subscriptionStatus === 'pro' && 'As a Pro user, you can feature up to 2 showcases with "Featured" badges and higher visibility.'}
                    {' '}Click on any showcase to enable Priority.
                  </p>
                </div>
              </div>
            </div>
          )}

          {showcasedReports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Showcased Sites Yet</h3>
              <p className="text-gray-600 mb-6">
                Start showcasing your sites to get discovered by other founders and track engagement
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 text-white rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcasedReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/dashboard/showcase?reportId=${report.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {report.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Score: <span className="font-semibold">{report.overallScore ?? '--'}/100</span>
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.overallScore && report.overallScore >= 70
                          ? 'bg-green-100 text-green-700'
                          : report.overallScore && report.overallScore >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {report.overallScore && report.overallScore >= 70
                        ? 'Great'
                        : report.overallScore && report.overallScore >= 50
                        ? 'Good'
                        : 'Fair'}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>{report.showcaseViews || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span>{report.showcaseUpvotes || 0} upvotes</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Click to manage</span>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Add New Showcase CTA */}
          {allReports.length > showcasedReports.length && (
            <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    You have {allReports.length - showcasedReports.length} more {allReports.length - showcasedReports.length === 1 ? 'report' : 'reports'} to showcase
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Showcase more of your sites to increase visibility and get more feedback from the community
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Go to Dashboard
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'Please select a report to showcase.'}</p>
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--brand-primary)' }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedHeader
        email={userEmail}
        subscriptionStatus={subscriptionStatus}
        pageTitle="Showcase Your Site"
        showUpgradeButton={subscriptionStatus !== 'active'}
        reportId={reportId || undefined}
      />

      <main className="container mx-auto max-w-6xl px-4 py-8">

        {/* Status Banner */}
        {!report.isPublic && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Your report must be public to showcase it.</p>
                <p className="text-sm text-yellow-600">Please make your report public first from the report page.</p>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Showcase Profile</h2>
                <p className="text-sm text-gray-500">Customize how your site appears in the showcase directory.</p>
              </div>

              {/* Icon Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Image
                </label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {profile.iconUrl || defaults.iconUrl ? (
                      <img
                        src={profile.iconUrl || defaults.iconUrl}
                        alt="Icon preview"
                        className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '';
                        }}
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                      >
                        {(profile.displayName || defaults.name).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file && reportId) {
                          setIsSaving(true);
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('reportId', reportId);
                            formData.append('type', 'icon');

                            const res = await fetch('/api/showcase/upload-image', {
                              method: 'POST',
                              body: formData,
                            });

                            const data = await res.json();
                            if (data.success) {
                              setProfile({ ...profile, iconUrl: data.url });
                              setSuccess('Icon uploaded successfully!');
                            } else {
                              setError(data.error || 'Failed to upload icon');
                            }
                          } catch (err) {
                            setError('Failed to upload icon');
                          } finally {
                            setIsSaving(false);
                          }
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Upload PNG, JPEG, WebP, or GIF (max 5MB). Leave empty to use your site&apos;s favicon.
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value.slice(0, 100) })}
                  placeholder={defaults.name}
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-2 text-xs text-gray-400">
                  {profile.displayName.length}/100 characters
                </p>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value.slice(0, 120) })}
                  placeholder={defaults.tagline}
                  maxLength={120}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-2 text-xs text-gray-400">
                  {profile.tagline.length}/120 characters - A short description of your product
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value as ShowcaseCategory | '' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category...</option>
                  {SHOWCASE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-400">
                  Select the category that best fits your product
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value.slice(0, 500) })}
                  placeholder="Tell others what your product does, who it's for, and what makes it unique..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <p className="mt-2 text-xs text-gray-400">
                  {profile.description.length}/500 characters
                </p>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Screenshot <span className="text-gray-400">(optional)</span>
                </label>
                <div className="space-y-3">
                  {/* Preview */}
                  {profile.screenshotUrl && (
                    <div className="relative">
                      <img
                        src={profile.screenshotUrl}
                        alt="Screenshot preview"
                        className="w-full h-48 rounded-lg object-cover bg-gray-100 border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, screenshotUrl: '' })}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && reportId) {
                        setIsSaving(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('reportId', reportId);
                          formData.append('type', 'screenshot');

                          const res = await fetch('/api/showcase/upload-image', {
                            method: 'POST',
                            body: formData,
                          });

                          const data = await res.json();
                          if (data.success) {
                            setProfile({ ...profile, screenshotUrl: data.url });
                            setSuccess('Screenshot uploaded successfully!');
                          } else {
                            setError(data.error || 'Failed to upload screenshot');
                          }
                        } catch (err) {
                          setError('Failed to upload screenshot');
                        } finally {
                          setIsSaving(false);
                        }
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Upload a screenshot of your website (PNG, JPEG, WebP, or GIF, max 5MB). This will be displayed in your showcase listing.
                </p>
              </div>

              {/* Priority Showcase Toggle (Pro/Starter only) */}
              {(subscriptionStatus === 'pro' || subscriptionStatus === 'starter') && (
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <label htmlFor="priority-toggle" className="text-sm font-medium text-gray-900 cursor-pointer">
                          Priority Showcase
                        </label>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                          {subscriptionStatus === 'pro' ? 'PRO' : 'STARTER'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Get a "Featured" badge and appear higher in the showcase gallery
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {subscriptionStatus === 'starter' && 'Starter: 1 featured showcase'}
                        {subscriptionStatus === 'pro' && 'Pro: Up to 2 featured showcases'}
                      </p>
                    </div>
                    <button
                      type="button"
                      id="priority-toggle"
                      onClick={() => setProfile({ ...profile, isPriority: !profile.isPriority })}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        profile.isPriority ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          profile.isPriority ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {isShowcased ? (
                  <>
                    <button
                      type="button"
                      onClick={handleDisable}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove from Showcase
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || !report.isPublic}
                      className="px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSaving || !report.isPublic}
                      className="px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      {isSaving ? 'Enabling...' : 'Enable Showcase'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Preview</h3>

              {/* Full Showcase Card Preview */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                {/* Header: Icon + Name + Tagline */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {profile.iconUrl || defaults.iconUrl ? (
                      <img
                        src={profile.iconUrl || defaults.iconUrl}
                        alt="Icon"
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        onError={(e) => {
                          // Fallback to letter avatar on error
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            const fallback = parent.querySelector('.fallback-avatar');
                            if (fallback) {
                              (fallback as HTMLElement).classList.remove('hidden');
                            }
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-lg fallback-avatar ${
                        profile.iconUrl || defaults.iconUrl ? 'hidden' : ''
                      }`}
                      style={{ backgroundColor: 'var(--brand-primary, #2563eb)' }}
                    >
                      {(profile.displayName || defaults.name).charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Name + Tagline */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {profile.displayName || defaults.name}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {profile.tagline || defaults.tagline}
                    </p>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">BrandProbe Score</span>
                    <span className="text-sm font-bold text-gray-900">
                      {report.overallScore ?? '--'}/100
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        report.overallScore
                          ? report.overallScore >= 70
                            ? 'bg-green-500'
                            : report.overallScore >= 50
                            ? 'bg-yellow-500'
                            : report.overallScore >= 30
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                          : 'bg-gray-200'
                      }`}
                      style={{ width: `${report.overallScore ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* Footer: Category + Stats */}
                <div className="flex items-center justify-between text-sm">
                  {profile.category ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {profile.category}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">No category</span>
                  )}

                  <div className="flex items-center gap-3">
                    {/* Upvotes */}
                    <div className="flex items-center gap-1 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span className="text-xs">0</span>
                    </div>
                    {/* Views */}
                    <div className="flex items-center gap-1 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span className="text-xs">0</span>
                    </div>
                  </div>
                </div>

                {/* Website URL (subtle) */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 truncate">{report.url}</p>
                </div>
              </div>
            </div>

            {/* Analytics Card - Only show if showcased */}
            {isShowcased && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Engagement Stats</h3>
                  <Link
                    href={`/showcase/${reportId}`}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Live →
                  </Link>
                </div>

                <div className="space-y-4">
                  {/* Views */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">Total Views</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {showcaseStats?.views || 0}
                    </span>
                  </div>

                  {/* Upvotes */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">Upvotes</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {showcaseStats?.upvotes || 0}
                    </span>
                  </div>

                  {/* Comments */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">Comments</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {showcaseStats?.comments || 0}
                    </span>
                  </div>

                  {/* Engagement Rate */}
                  {showcaseStats && showcaseStats.views > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Engagement Rate</span>
                        <span className="text-xs font-semibold text-gray-700">
                          {Math.round((showcaseStats.upvotes / showcaseStats.views) * 100)}%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              (showcaseStats.upvotes / showcaseStats.views) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* What's Shown */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">What&apos;s shown publicly</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Your site name, tagline, and icon
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Your BrandProbe score ({report.overallScore ?? '--'}/100)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Category and website URL
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Link to view your full report
                </li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="text-sm font-medium text-blue-800 mb-3">Why Showcase?</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Get discovered by other founders</li>
                <li>• Show off your BrandProbe score</li>
                <li>• Receive feedback via comments</li>
                <li>• Earn upvotes from the community</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrap with Suspense to handle useSearchParams
export default function ShowcaseDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShowcaseDashboardContent />
    </Suspense>
  );
}

// Helper
function extractDomainFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
