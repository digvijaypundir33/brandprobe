'use client';

interface ProgressTrackerProps {
  previousScore: number | null;
  currentScore: number;
  scoreChange: number | null;
}

export default function ProgressTracker({
  previousScore,
  currentScore,
  scoreChange,
}: ProgressTrackerProps) {
  if (previousScore === null || scoreChange === null) {
    return null;
  }

  const isImproved = scoreChange > 0;
  const isDeclined = scoreChange < 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
        Progress Since Last Scan
      </h3>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Previous</p>
          <p className="text-2xl font-bold text-gray-400">{previousScore}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-12 h-0.5 bg-gray-200" />
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
              isImproved
                ? 'bg-green-100 text-green-700'
                : isDeclined
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isImproved && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {isDeclined && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>
              {isImproved ? '+' : ''}
              {scoreChange}
            </span>
          </div>
          <div className="w-12 h-0.5 bg-gray-200" />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Current</p>
          <p className="text-2xl font-bold text-gray-900">{currentScore}</p>
        </div>
      </div>

      {isImproved && (
        <p className="mt-3 text-sm text-green-600 text-center">
          Great progress! Your marketing is improving.
        </p>
      )}
      {isDeclined && (
        <p className="mt-3 text-sm text-red-600 text-center">
          Score decreased. Review the issues below.
        </p>
      )}
    </div>
  );
}
