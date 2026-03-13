'use client';

interface AIPlatformVisibilityPreviewProps {
  aeoScore: number;
  hasFullAccess: boolean;
}

export default function AIPlatformVisibilityPreview({
  aeoScore,
  hasFullAccess,
}: AIPlatformVisibilityPreviewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreRating = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* AEO Score Display */}
      <div className={`rounded-lg p-6 border-2 ${getScoreBg(aeoScore)}`}>
        <div className="text-center">
          <div className="inline-flex flex-col items-center">
            <div className={`text-5xl font-bold ${getScoreColor(aeoScore)} mb-2`}>
              {aeoScore}
              <span className="text-3xl text-gray-400">/100</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1">
              {getScoreRating(aeoScore)}
            </p>
            <p className="text-sm text-gray-600">
              Answer Engine Optimization Score
            </p>
          </div>
        </div>
      </div>

      {/* What This Measures */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          What This Measures
        </h4>
        <ul className="space-y-2 text-xs text-gray-600">
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Content structure optimized for AI assistants (ChatGPT, Perplexity, etc.)</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Entity clarity and brand definition for AI understanding</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Citation readiness and schema markup implementation</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>FAQ opportunities and question-answering format</span>
          </li>
        </ul>
      </div>

      {/* Info / CTA */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-semibold text-gray-900 mb-1">
              Based on Content Analysis
            </h5>
            <p className="text-xs text-gray-600 leading-relaxed">
              This score reflects how well your content is optimized for AI search engines.
              For detailed recommendations, check the AI Search section in the {hasFullAccess ? 'AI tab' : 'full report'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
