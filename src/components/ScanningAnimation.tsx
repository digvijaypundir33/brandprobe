'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  'Connecting to website...',
  'Scraping homepage content...',
  'Analyzing navigation structure...',
  'Extracting headlines and CTAs...',
  'Identifying trust signals...',
  'Analyzing messaging clarity...',
  'Evaluating SEO opportunities...',
  'Generating content recommendations...',
  'Crafting ad angles...',
  'Auditing conversion elements...',
  'Building distribution strategy...',
  'Calculating scores...',
  'Finalizing report...',
];

export default function ScanningAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 5000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md mx-auto px-6 py-12">
        <div className="text-center">
          {/* Animated logo/icon */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-600 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-blue-200 animate-ping opacity-20" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Probing Your Brand{dots}
          </h2>

          <p className="text-gray-600 mb-8">
            {STEPS[currentStep]}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-500">
            This usually takes 60-90 seconds
          </p>

          {/* Step indicators */}
          <div className="mt-8 flex justify-center gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
