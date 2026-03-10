'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import UserProfileModal from './UserProfileModal';

interface AuthenticatedHeaderProps {
  email: string;
  subscriptionStatus?: string;
  reportsUsed?: number;
  reportsLimit?: number;
  pageTitle?: string;
  showUpgradeButton?: boolean;
  reportId?: string;
}

interface UserProfile {
  displayName: string | null;
  company: string | null;
  avatarUrl: string | null;
  bio: string | null;
  websiteUrl: string | null;
  twitterHandle: string | null;
  linkedinUrl: string | null;
}

export default function AuthenticatedHeader({
  email,
  subscriptionStatus = 'free',
  reportsUsed,
  reportsLimit,
  pageTitle = 'Dashboard',
  showUpgradeButton = true,
  reportId,
}: AuthenticatedHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    displayName: null,
    company: null,
    avatarUrl: null,
    bio: null,
    websiteUrl: null,
    twitterHandle: null,
    linkedinUrl: null,
  });

  const isPro = subscriptionStatus === 'active';

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        if (data.success && data.profile) {
          setUserProfile({
            displayName: data.profile.displayName,
            company: data.profile.company,
            avatarUrl: data.profile.avatarUrl,
            bio: data.profile.bio,
            websiteUrl: data.profile.websiteUrl,
            twitterHandle: data.profile.twitterHandle,
            linkedinUrl: data.profile.linkedinUrl,
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  // Build upgrade URL with return path
  const upgradeUrl = reportId
    ? `/pricing?reportId=${reportId}&returnTo=${encodeURIComponent(pathname || '/dashboard')}`
    : `/pricing?returnTo=${encodeURIComponent(pathname || '/dashboard')}`;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const handleProfileUpdate = async () => {
    // Refetch profile after update
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      if (data.success && data.profile) {
        setUserProfile({
          displayName: data.profile.displayName,
          company: data.profile.company,
          avatarUrl: data.profile.avatarUrl,
          bio: data.profile.bio,
          websiteUrl: data.profile.websiteUrl,
          twitterHandle: data.profile.twitterHandle,
          linkedinUrl: data.profile.linkedinUrl,
        });
      }
    } catch (error) {
      console.error('Failed to refetch profile:', error);
    }
  };

  // Display name to show (fallback to email username if no display name)
  const displayName = userProfile.displayName || email.split('@')[0];

  return (
    <>
      <header className="text-white py-4 sm:py-6 px-4 sticky top-0 z-50 safe-top" style={{ backgroundColor: 'var(--brand-primary)' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0 flex-shrink">
              <Link href="/" className="text-lg sm:text-2xl font-bold hover:opacity-90 transition-opacity block truncate">
                BrandProbe
              </Link>
              <p className="text-white/80 text-xs sm:text-sm truncate">{pageTitle}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Desktop Navigation */}
              <Link
                href="/dashboard"
                className="px-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs sm:text-sm font-medium transition-colors hidden md:block"
              >
                Dashboard
              </Link>
              {showUpgradeButton && (
                <Link
                  href={upgradeUrl}
                  className="px-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs sm:text-sm font-medium transition-colors hidden md:block"
                >
                  Plans
                </Link>
              )}
              {/* Clickable profile section - desktop */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="text-right hidden md:block hover:bg-white/10 rounded-lg px-3 py-2 transition-colors cursor-pointer group"
                title="Click to edit profile"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold relative">
                    {displayName.charAt(0).toUpperCase()}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-2 h-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-white">{displayName}</p>
                      <svg className="w-3.5 h-3.5 text-white/60 group-hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    {isPro && reportsUsed !== undefined && reportsLimit !== undefined && (
                      <p className="text-xs text-white/60">
                        {reportsUsed} of {reportsLimit} reports
                      </p>
                    )}
                  </div>
                </div>
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 hidden md:block"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="touch-target p-2 text-white hover:bg-white/10 rounded-lg no-select md:!hidden"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="px-4 py-4 sm:py-6 border-b border-gray-200 flex-shrink-0 safe-top" style={{ backgroundColor: 'var(--brand-primary)' }}>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white hover:bg-white/10 rounded-lg -mr-2"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Profile Section */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-white">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowProfileModal(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white relative" style={{ backgroundColor: 'var(--brand-primary)' }}>
                    {displayName.charAt(0).toUpperCase()}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <svg className="w-2 h-2" style={{ color: 'var(--brand-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                      <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{email}</p>
                    {isPro && reportsUsed !== undefined && reportsLimit !== undefined && (
                      <p className="text-xs text-gray-500">
                        {reportsUsed} of {reportsLimit} reports
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">Tap to edit profile</p>
                  </div>
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4 bg-white">
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      pathname === '/dashboard'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/showcase"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      pathname === '/dashboard/showcase'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Showcase
                    </div>
                  </Link>

                  {showUpgradeButton && (
                    <Link
                      href={upgradeUrl}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-base font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Plans
                      </div>
                    </Link>
                  )}

                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Home
                    </div>
                  </Link>
                </div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        email={email}
        currentProfile={userProfile}
        subscriptionStatus={subscriptionStatus}
        reportsUsed={reportsUsed || 0}
        reportsLimit={reportsLimit || 1}
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  );
}
