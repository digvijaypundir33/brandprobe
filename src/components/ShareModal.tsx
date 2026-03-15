'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ShareModalProps {
  reportId: string;
  overallScore: number;
  websiteUrl: string;
  onClose: () => void;
  onShare: () => void;
}

export default function ShareModal({
  reportId,
  overallScore,
  websiteUrl,
  onClose,
  onShare,
}: ShareModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateShareImage();
  }, []);

  const generateShareImage = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/report/${reportId}/share-image`);
      const data = await response.json();

      if (data.success) {
        setImageUrl(data.imageUrl);
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (err) {
      console.error('Failed to generate share image:', err);
      setError('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const incrementShareCount = async () => {
    try {
      await fetch(`/api/report/${reportId}/share-count`, {
        method: 'POST',
      });
      onShare();
    } catch (err) {
      console.error('Failed to increment share count:', err);
    }
  };

  const shareToTwitter = () => {
    const websiteName = new URL(websiteUrl).hostname;
    const text = `I just analyzed ${websiteName} with BrandProbe.io and scored ${overallScore}/100! 🚀\n\nGet your free analysis:`;
    const url = `${window.location.origin}/report/${reportId}`;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );

    incrementShareCount();
  };

  const shareToLinkedIn = () => {
    const url = `${window.location.origin}/report/${reportId}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=600'
    );

    incrementShareCount();
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/report/${reportId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Share Your Results
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Image Preview */}
        <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          {isGenerating ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mb-4" />
              <p className="text-gray-600">Generating your share image...</p>
            </div>
          ) : error ? (
            <div className="h-64 flex flex-col items-center justify-center bg-red-50">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={generateShareImage}
                className="px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:opacity-90"
              >
                Try Again
              </button>
            </div>
          ) : imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt="Share preview"
                width={1200}
                height={630}
                className="w-full"
              />
            </>
          ) : null}
        </div>

        {/* Share Buttons */}
        <div className="space-y-3 mb-4">
          <div className="flex gap-3">
            <button
              onClick={shareToTwitter}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X/Twitter
            </button>

            <button
              onClick={shareToLinkedIn}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--brand-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Share on LinkedIn
            </button>
          </div>
        </div>

        {/* Copy Link */}
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or copy link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/report/${reportId}`}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <button
              onClick={copyLink}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
