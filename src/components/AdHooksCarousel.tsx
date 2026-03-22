'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AdAngles } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';

interface AdHooksCarouselProps {
  adAngles: AdAngles;
}

function getScoreBadgeColor(score: number) {
  if (score >= 75) return { bg: 'bg-[#6bff8f]', text: 'text-[#005f28]', label: 'Excellent' };
  if (score >= 50) return { bg: 'bg-[#fed01b]', text: 'text-[#594700]', label: 'Average' };
  return { bg: 'bg-[#f74b6d]', text: 'text-[#510017]', label: 'Needs Work' };
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

  const analysis = adAngles.detailedAnalysis || {};
  const hooks = analysis.adHooks || [];
  const headlines = analysis.headlineSuggestions || [];
  const triggers = analysis.psychologicalTriggers || [];
  const platformDirection = analysis.platformCreativeDirection || {};
  const badgeColor = getScoreBadgeColor(adAngles.score);

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
      className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(44,47,49,0.06)] overflow-hidden"
    >
      {/* Header */}
      <div className="p-8 border-b border-[#abadaf]/15">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold text-[#2c2f31] tracking-tight">
              Ad Creative Ideas
            </h1>
            <p className="text-[#595c5e] font-body text-lg">Ready-to-use hooks, headlines & triggers</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 ${badgeColor.bg} ${badgeColor.text} rounded-full text-xs font-label font-bold uppercase tracking-wider mb-2`}>
              {badgeColor.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-headline font-bold text-[#2c2f31]">{adAngles.score}</span>
              <span className="text-xl text-[#595c5e] font-light">/100</span>
            </div>
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
              className={`px-4 py-2 rounded-xl text-sm font-label font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#4b4bc5] text-white'
                  : 'bg-[#eef1f3] text-[#595c5e] hover:bg-[#dfe3e6]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Carousel Content */}
      <div className="p-8">
        {currentItems.length > 0 ? (
          <>
            <div className="relative min-h-[100px] flex items-center">
              <button
                onClick={prevItem}
                className="absolute left-0 z-10 w-10 h-10 bg-[#eef1f3] hover:bg-[#dfe3e6] rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-[#2c2f31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="bg-[#eef1f3]/20 rounded-xl p-5 border border-[#abadaf]/10"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-7 h-7 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg flex items-center justify-center text-sm font-headline font-bold">
                        {currentIndex + 1}
                      </span>
                      <p className="text-[#2c2f31] leading-relaxed font-body">
                        &ldquo;{toDisplayString(currentItems[currentIndex])}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={nextItem}
                className="absolute right-0 z-10 w-10 h-10 bg-[#eef1f3] hover:bg-[#dfe3e6] rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-[#2c2f31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    i === currentIndex ? 'bg-[#4b4bc5] w-6' : 'bg-[#abadaf] w-2 hover:bg-[#595c5e]'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-[#595c5e] text-center py-8 font-body">No items available</p>
        )}

        {/* Platform Direction */}
        {Object.keys(platformDirection).length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Platform-Specific Direction</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {Object.entries(platformDirection).map(([platform, direction]) => (
                <div
                  key={platform}
                  className="bg-[#eef1f3]/20 rounded-xl p-4 border border-[#abadaf]/10"
                >
                  <span className="font-label font-semibold text-[#2c2f31] text-sm capitalize block mb-2">{platform}</span>
                  <p className="text-sm text-[#595c5e] font-body leading-relaxed">{String(direction)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audience Angles */}
        {analysis.audienceAngleVariations?.length > 0 && (
          <div className="mb-8 space-y-6">
            <h3 className="font-headline font-bold text-[#2c2f31] text-xl">Audience Angle Variations</h3>
            <div className="space-y-3">
              {analysis.audienceAngleVariations.map((angle, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-[#eef1f3]/20 rounded-xl border border-[#abadaf]/10"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-[#4b4bc5]/10 text-[#4b4bc5] rounded-lg flex items-center justify-center text-sm font-headline font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#2c2f31] font-body leading-relaxed">{toDisplayString(angle)}</p>
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
