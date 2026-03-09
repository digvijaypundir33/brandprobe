'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface AuthenticatedHeaderProps {
  email: string;
  subscriptionStatus?: string;
  reportsUsed?: number;
  reportsLimit?: number;
  pageTitle?: string;
  showUpgradeButton?: boolean;
  reportId?: string;
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

  const isPro = subscriptionStatus === 'active';

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

  return (
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
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white/80">{email}</p>
              {isPro && reportsUsed !== undefined && reportsLimit !== undefined && (
                <p className="text-xs text-white/60">
                  {reportsUsed} of {reportsLimit} reports this month
                </p>
              )}
            </div>
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
  );
}
