'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AdAngles } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';

interface AdHooksCarouselProps {
  adAngles: AdAngles;
}

// Helper to safely convert any value to string
function toDisplayString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if ('text' in obj) return String(obj.text);
    if ('content' in obj) return String(obj.content);
    if ('hook' in obj) return String(obj.hook);
    if ('headline' in obj) return String(obj.headline);
    if ('trigger' in obj && 'description' in obj) return `${obj.trigger}: ${obj.description}`;
    const stringVals = Object.values(obj).filter(v => typeof v === 'string');
    if (stringVals.length > 0) return stringVals.join(' - ');
    return JSON.stringify(value);
  }
  return String(value);
}

export default function AdHooksCarousel({ adAngles }: AdHooksCarouselProps) {
  const [activeTab, setActiveTab] = useState<'hooks' | 'headlines' | 'triggers'>('hooks');
  const [currentIndex, setCurrentIndex] = useState(0);

  const hooks = adAngles.detailedAnalysis.adHooks || [];
  const headlines = adAngles.detailedAnalysis.headlineSuggestions || [];
  const triggers = adAngles.detailedAnalysis.psychologicalTriggers || [];
  const platformDirection = adAngles.detailedAnalysis.platformCreativeDirection || {};

  const currentItems = activeTab === 'hooks' ? hooks : activeTab === 'headlines' ? headlines : triggers;

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % currentItems.length);
  };

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + currentItems.length) % currentItems.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gray-900 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Ad Creative Ideas</h2>
              <p className="text-gray-400 text-sm">Ready-to-use hooks, headlines & triggers</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{adAngles.score}</div>
            <div className="text-gray-400 text-sm">/100</div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2">
          {[
            { id: 'hooks', label: 'Ad Hooks', count: hooks.length },
            { id: 'headlines', label: 'Headlines', count: headlines.length },
            { id: 'triggers', label: 'Triggers', count: triggers.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as typeof activeTab); setCurrentIndex(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Carousel Content */}
      <div className="p-6">
        {currentItems.length > 0 ? (
          <>
            <div className="relative min-h-[100px] flex items-center">
              <button
                onClick={prevItem}
                className="absolute left-0 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="mx-14 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-50 rounded-lg p-5 border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-gray-900 text-white rounded flex items-center justify-center text-sm font-medium">
                        {currentIndex + 1}
                      </span>
                      <p className="text-gray-800 leading-relaxed">
                        &ldquo;{toDisplayString(currentItems[currentIndex])}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={nextItem}
                className="absolute right-0 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-1.5 mt-4">
              {currentItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? 'bg-gray-900 w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-8">No items available</p>
        )}

        {/* Platform Direction */}
        {Object.keys(platformDirection).length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Platform-Specific Direction
            </h4>
            <div className="grid md:grid-cols-3 gap-3">
              {Object.entries(platformDirection).map(([platform, direction]) => (
                <div
                  key={platform}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                >
                  <span className="font-medium text-gray-800 text-sm capitalize block mb-1">{platform}</span>
                  <p className="text-xs text-gray-600">{String(direction)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audience Angles */}
        {adAngles.detailedAnalysis.audienceAngleVariations?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Audience Angle Variations
            </h4>
            <div className="space-y-2">
              {adAngles.detailedAnalysis.audienceAngleVariations.map((angle, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 rounded flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700">{toDisplayString(angle)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Issues & Quick Wins */}
        <IssuesAndQuickWins
          keyIssues={adAngles.keyIssues}
          quickWins={adAngles.quickWins}
          issuesTitle="Ad Creative Issues"
        />
      </div>
    </motion.div>
  );
}
