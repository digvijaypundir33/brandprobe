'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ReportPreviewModalProps {
  reportId: string;
  websiteUrl: string;
  displayName: string;
  overallScore: number | null;
  onClose: () => void;
}

export default function ReportPreviewModal({
  reportId,
  websiteUrl,
  displayName,
  overallScore,
  onClose,
}: ReportPreviewModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShareImage();
  }, [reportId]);

  const fetchShareImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/report/${reportId}/share-image`);
      const data = await response.json();

      if (data.success) {
        setImageUrl(data.imageUrl);
      } else {
        setError(data.error || 'Failed to load image');
      }
    } catch (err) {
      console.error('Failed to fetch share image:', err);
      setError('Failed to load image');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    if (score >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number | null) => {
    if (!score) return 'Analyzing';
    if (score >= 70) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 30) return 'Needs Work';
    return 'Critical';
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-space-grotesk)]">
              {displayName}
            </h2>
            <p className="text-sm text-gray-500 truncate max-w-md">
              {websiteUrl}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Score Badge */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`text-3xl font-bold ${getScoreColor(overallScore)} font-[family-name:var(--font-space-grotesk)]`}>
                {overallScore ?? '--'}/100
              </div>
              <div className="text-sm text-gray-600">
                <span className={`font-semibold ${getScoreColor(overallScore)}`}>
                  {getScoreLabel(overallScore)}
                </span>
                <span className="text-gray-400 ml-1">• BrandProbe Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Preview */}
        <div className="p-5">
          <div className="rounded-xl overflow-hidden bg-gray-900 border border-gray-200">
            {isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5B5BD5] mb-3" />
                <p className="text-gray-500 text-sm">Loading preview...</p>
              </div>
            ) : error ? (
              <div className="h-64 flex flex-col items-center justify-center bg-gray-100">
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-sm">Preview not available</p>
              </div>
            ) : imageUrl ? (
              <>
                {imageUrl.includes('127.0.0.1') || imageUrl.startsWith('data:') ? (
                  <img
                    src={imageUrl}
                    alt={`${displayName} BrandProbe Score`}
                    className="w-full"
                  />
                ) : (
                  <Image
                    src={imageUrl}
                    alt={`${displayName} BrandProbe Score`}
                    width={1200}
                    height={630}
                    className="w-full"
                  />
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#5B5BD5] text-white rounded-xl font-semibold hover:bg-[#4a4ac4] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit Site
          </a>
        </div>
      </div>
    </div>
  );
}
