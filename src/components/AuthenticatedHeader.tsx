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
      <header className="text-white py-6 px-4 sticky top-0 z-50" style={{ backgroundColor: 'var(--brand-primary)' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-2xl font-bold mb-1 hover:opacity-90 transition-opacity">
                BrandProbe
              </Link>
              <p className="text-white/80 text-sm">{pageTitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              {!isPro && showUpgradeButton && (
                <Link
                  href={upgradeUrl}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                >
                  Upgrade
                </Link>
              )}
              {/* Clickable profile section */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="text-right hidden sm:block hover:bg-white/10 rounded-lg px-3 py-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {/* Avatar or initial */}
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{displayName}</p>
                    {isPro && reportsUsed !== undefined && reportsLimit !== undefined && (
                      <p className="text-xs text-white/60">
                        {reportsUsed} of {reportsLimit} reports this month
                      </p>
                    )}
                  </div>
                </div>
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

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
