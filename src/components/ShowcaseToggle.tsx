'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type Report } from '@/types/report';
import ConfirmationModal from './ConfirmationModal';

interface ShowcaseToggleProps {
  report: Report;
  isOwner: boolean;
  onUpdate?: () => void;
}

export default function ShowcaseToggle({ report, isOwner, onUpdate }: ShowcaseToggleProps) {
  const [isShowcased, setIsShowcased] = useState(report.showcaseEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleToggleClick = () => {
    if (!isOwner) return;

    if (isShowcased) {
      // Show confirmation modal before disabling
      setShowConfirmModal(true);
    }
  };

  const disableShowcase = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/showcase/${report.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to disable showcase');
        return;
      }

      setIsShowcased(false);
      onUpdate?.();
    } catch (err) {
      setError('Failed to disable showcase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOwner) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        {isShowcased ? (
          <>
            {/* Showcased - with edit/disable options */}
            <Link
              href={`/dashboard/showcase?reportId=${report.id}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Showcased
            </Link>

            <button
              onClick={handleToggleClick}
              disabled={isLoading}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              title="Remove from showcase"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </>
        ) : (
          <>
            {/* Not showcased - link to enable */}
            <Link
              href={`/dashboard/showcase?reportId=${report.id}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Showcase
            </Link>
          </>
        )}

        {/* Error Message */}
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={disableShowcase}
        title="Remove from Showcase?"
        message="This will remove your site from the public showcase directory. You can re-enable it anytime."
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={isLoading}
        variant="warning"
      />
    </>
  );
}
