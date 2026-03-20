'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { SeoOpportunities, SiteQualityScore } from '@/types/report';
import IssuesAndQuickWins from './IssuesAndQuickWins';

interface SeoAnalysisCardProps {
  seo: SeoOpportunities;
  siteQuality?: SiteQualityScore;
}

// Icon components for Editorial Intelligence design
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  );
}

function CancelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  );
}

function ExpandMoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
    </svg>
  );
}

function ExpandLessIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
    </svg>
  );
}

function InsightsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.55 3.56c-.3-.09-.74-.09-1.04 0l-2.55-2.55C12.27 10.45 11.46 9 10 9c-1.45 0-2.27 1.44-1.93 2.52l-4.56 4.55C2.44 15.74 1 16.55 1 18c0 1.1.9 2 2 2 1.45 0 2.26-1.44 1.93-2.51l4.55-4.56c.3.09.74.09 1.04 0l2.55 2.55C12.73 16.55 13.54 18 15 18c1.45 0 2.27-1.44 1.93-2.52l3.56-3.55c1.07.33 2.51-.48 2.51-1.93 0-1.1-.9-2-2-2z"/>
      <path d="M15 9l.94-2.07L18 6l-2.06-.93L15 3l-.92 2.07L12 6l2.08.93zM3.5 11L4 9l2-.5L4 8l-.5-2L3 8l-2 .5L3 9z"/>
    </svg>
  );
}

function AutoAwesomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm0 6l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25zM9 18l-3-6.5L0 9l6-2.5L9 0l3 6.5L18 9l-6 2.5z"/>
    </svg>
  );
}

function TitleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 4v3h5.5v12h3V7H19V4z"/>
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>
    </svg>
  );
}

function MonitoringIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-4-4 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
    </svg>
  );
}

// Get score status for styling
function getScoreStatus(score: number, max: number): 'success' | 'warning' | 'error' {
  const percentage = (score / max) * 100;
  // Only show success (green check) when 100% complete
  if (percentage === 100) return 'success';
  // Show warning (yellow) for partial completion
  if (percentage >= 50) return 'warning';
  // Show error (red) for low completion
  return 'error';
}


// Collapsible section with Editorial Intelligence design
function QualitySection({
  title,
  score,
  max,
  icon,
  children,
  defaultOpen = false
}: {
  title: string;
  score: number;
  max: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const status = getScoreStatus(score, max);

  const statusColors = {
    success: { icon: 'text-[#006a2d]', badge: 'bg-[#6bff8f] text-[#005f28]', IconComponent: CheckCircleIcon },
    warning: { icon: 'text-[#6f5900]', badge: 'bg-[#fed01b] text-[#594700]', IconComponent: WarningIcon },
    error: { icon: 'text-[#b41340]', badge: 'bg-[#f74b6d]/10 text-[#b41340]', IconComponent: ErrorIcon }
  };

  const colors = statusColors[status];
  const StatusIcon = colors.IconComponent;

  return (
    <div className={`border border-[#abadaf]/15 rounded-xl overflow-hidden ${isOpen ? 'shadow-sm' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 ${
          isOpen ? 'bg-[#eef1f3]/40' : 'bg-white hover:bg-[#eef1f3]/20'
        } transition-colors`}
      >
        <div className="flex items-center gap-4">
          {icon || <StatusIcon className={`w-5 h-5 ${colors.icon}`} />}
          <span className="font-semibold text-[#2c2f31]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${colors.badge}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {score}/{max}
          </span>
          {isOpen ? (
            <ExpandLessIcon className="w-5 h-5 text-[#595c5e]" />
          ) : (
            <ExpandMoreIcon className="w-5 h-5 text-[#595c5e]" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="bg-white divide-y divide-[#abadaf]/10 px-6 py-2">
          {children}
        </div>
      )}
    </div>
  );
}

// Row item for checklist with Editorial Intelligence design
function ChecklistItem({
  label,
  present,
  priority,
  value,
  score,
  max,
  showProgress = false
}: {
  label: string;
  present: boolean;
  priority?: 'high' | 'medium' | 'low';
  value?: string;
  score?: number;
  max?: number;
  showProgress?: boolean;
}) {
  const hasScore = score !== undefined && max !== undefined;
  const percentage = hasScore ? (score / max) * 100 : 0;

  // Determine progress bar color
  const getProgressColor = () => {
    if (percentage >= 75) return 'bg-[#006a2d]'; // secondary (green)
    if (percentage >= 50) return 'bg-[#fed01b]'; // tertiary-container (yellow)
    return 'bg-[#f74b6d]'; // error-container (red)
  };

  // Show progress bar for items with scores that have meaningful progress
  const shouldShowProgress = showProgress && hasScore && max > 3;

  if (shouldShowProgress) {
    // Layout with progress bar
    return (
      <div className="py-5 space-y-2">
        <div className="flex justify-between items-baseline">
          <div className={value ? 'flex flex-col' : ''}>
            <span className="text-sm font-medium text-[#2c2f31]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {label}
            </span>
            {value && (
              <span className="text-[10px] text-[#595c5e]" style={{ fontFamily: value.includes('=') ? 'monospace' : "'Space Grotesk', sans-serif" }}>
                {value}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!value && <span className="text-[10px] text-[#595c5e]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</span>}
            <span className="text-xs font-bold text-[#2c2f31]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {score}/{max}
            </span>
          </div>
        </div>
        <div className="w-full bg-[#eef1f3] rounded-full h-1">
          <div className={`h-1 rounded-full ${getProgressColor()}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    );
  }

  // Layout without progress bar (simple row)
  return (
    <div className="py-5 flex justify-between items-center">
      <div className={value ? 'flex flex-col' : ''}>
        <span className="text-sm font-medium text-[#2c2f31]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {label}
        </span>
        {value && (
          <span className="text-[10px] text-[#595c5e] uppercase tracking-widest font-bold" style={{ fontFamily: value.includes('=') ? 'monospace' : "'Space Grotesk', sans-serif" }}>
            {value}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {hasScore && (
          <span className="text-xs font-bold text-[#2c2f31]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {score}/{max}
          </span>
        )}

        {/* Show appropriate icon or badge */}
        {present && score === max ? (
          <CheckCircleIcon className="w-5 h-5 text-[#006a2d]" />
        ) : !present && priority === 'high' ? (
          <span className="px-2 py-0.5 rounded bg-[#f74b6d]/10 text-[#510017] text-[10px] font-bold uppercase tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            WARNING
          </span>
        ) : !present ? (
          <CancelIcon className="w-5 h-5 text-[#b41340]" />
        ) : present && hasScore ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#6bff8f] text-[#005f28] text-[10px] font-bold uppercase tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <CheckCircleIcon className="w-3 h-3" /> PRESENT
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function SeoAnalysisCard({ seo, siteQuality }: SeoAnalysisCardProps) {
  const analysis = seo.detailedAnalysis;
  const technicalFlags = analysis.technicalSeoFlags || [];

  // Calculate score percentage for circle progress
  const scorePercentage = seo.score / 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (scorePercentage * circumference);

  // Get score status badge
  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: 'bg-[#6bff8f] text-[#005f28]' };
    if (score >= 60) return { text: 'Good', color: 'bg-[#fed01b] text-[#594700]' };
    return { text: 'Needs Work', color: 'bg-[#f74b6d]/20 text-[#b41340]' };
  };

  const badge = getScoreBadge(seo.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(44,47,49,0.06)] overflow-hidden"
    >
      {/* Sophisticated Header */}
      <div className="p-8 flex justify-between items-start border-b border-[#abadaf]/15">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#2c2f31] tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            SEO Performance Analysis
          </h1>
          <p className="text-[#595c5e] text-lg" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Comprehensive technical audit
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${badge.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {badge.text}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-[#2c2f31]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{seo.score}</span>
              <span className="text-xl text-[#595c5e] font-light">/100</span>
            </div>
          </div>
          <div className="w-24 h-24 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-[#e5e9eb]"
                cx="48"
                cy="48"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-[#4b4bc5]"
                cx="48"
                cy="48"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeWidth="8"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <InsightsIcon className="text-[#4b4bc5] w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        <div className="bg-[#eef1f3]/30 rounded-xl p-6 mb-8">
          <p className="text-[#595c5e] leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>{seo.summary}</p>
        </div>

        {/* Technical SEO Checklist */}
        {siteQuality && (
          <div className="mb-8 space-y-6">
            <h3 className="font-bold text-[#2c2f31] text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Technical SEO Checklist
            </h3>
            <div className="space-y-3">
              {/* Core SEO Fundamentals */}
              <QualitySection
                title="Core SEO Fundamentals"
                score={
                  siteQuality.title.score + siteQuality.metaDescription.score + siteQuality.favicon.score +
                  siteQuality.viewport.score + siteQuality.robotsTxt.score + siteQuality.sitemap.score +
                  siteQuality.llmsTxt.score + siteQuality.headings.score + siteQuality.schemaOrg.score +
                  siteQuality.canonical.score + siteQuality.htmlLang.score + siteQuality.charset.score
                }
                max={
                  siteQuality.title.max + siteQuality.metaDescription.max + siteQuality.favicon.max +
                  siteQuality.viewport.max + siteQuality.robotsTxt.max + siteQuality.sitemap.max +
                  siteQuality.llmsTxt.max + siteQuality.headings.max + siteQuality.schemaOrg.max +
                  siteQuality.canonical.max + siteQuality.htmlLang.max + siteQuality.charset.max
                }
                defaultOpen
              >
                <ChecklistItem
                  label="Title"
                  present={siteQuality.title.score === siteQuality.title.max}
                  priority={siteQuality.title.score === 0 ? 'high' : 'medium'}
                  score={siteQuality.title.score}
                  max={siteQuality.title.max}
                  value={`${siteQuality.title.length} chars`}
                  showProgress={true}
                />
                <ChecklistItem
                  label="Meta Description"
                  present={siteQuality.metaDescription.score === siteQuality.metaDescription.max}
                  priority={siteQuality.metaDescription.score === 0 ? 'high' : 'medium'}
                  score={siteQuality.metaDescription.score}
                  max={siteQuality.metaDescription.max}
                  value={`${siteQuality.metaDescription.length} chars`}
                  showProgress={true}
                />
                <ChecklistItem
                  label="Favicon"
                  present={siteQuality.favicon.present}
                  priority="high"
                  score={siteQuality.favicon.score}
                  max={siteQuality.favicon.max}
                />
                <ChecklistItem
                  label="Viewport Meta"
                  present={siteQuality.viewport.present}
                  priority="high"
                  score={siteQuality.viewport.score}
                  max={siteQuality.viewport.max}
                  value={siteQuality.viewport.present ? 'width=device-width, initial-scale=1' : undefined}
                  showProgress={true}
                />
                <ChecklistItem
                  label="robots.txt"
                  present={siteQuality.robotsTxt.present}
                  priority="high"
                  score={siteQuality.robotsTxt.score}
                  max={siteQuality.robotsTxt.max}
                  showProgress={true}
                />
                <ChecklistItem
                  label="Sitemap"
                  present={siteQuality.sitemap.present}
                  priority="high"
                  score={siteQuality.sitemap.score}
                  max={siteQuality.sitemap.max}
                  showProgress={true}
                />
                <ChecklistItem
                  label="llms.txt"
                  present={siteQuality.llmsTxt.present}
                  priority="high"
                  score={siteQuality.llmsTxt.score}
                  max={siteQuality.llmsTxt.max}
                />
                <ChecklistItem
                  label="Headings"
                  present={siteQuality.headings.score === siteQuality.headings.max}
                  priority="medium"
                  score={siteQuality.headings.score}
                  max={siteQuality.headings.max}
                  value={siteQuality.headings.hasProperHierarchy ? 'Proper hierarchy' : 'Issues found'}
                  showProgress={true}
                />
                <ChecklistItem
                  label="Schema.org JSON-LD"
                  present={siteQuality.schemaOrg.present}
                  priority="high"
                  score={siteQuality.schemaOrg.score}
                  max={siteQuality.schemaOrg.max}
                  value={siteQuality.schemaOrg.present ? `${siteQuality.schemaOrg.types.length} schema(s)` : undefined}
                />
                <ChecklistItem
                  label="Canonical URL"
                  present={siteQuality.canonical.present}
                  priority="high"
                  score={siteQuality.canonical.score}
                  max={siteQuality.canonical.max}
                  showProgress={true}
                />
                <ChecklistItem
                  label="HTML lang"
                  present={siteQuality.htmlLang.present}
                  priority="low"
                  score={siteQuality.htmlLang.score}
                  max={siteQuality.htmlLang.max}
                  value={siteQuality.htmlLang.value || undefined}
                />
                <ChecklistItem
                  label="Character Encoding"
                  present={siteQuality.charset.present}
                  priority="low"
                  score={siteQuality.charset.score}
                  max={siteQuality.charset.max}
                  value={siteQuality.charset.value || undefined}
                />
              </QualitySection>

              {/* Open Graph */}
              <QualitySection
                title="Open Graph"
                score={siteQuality.openGraph.score}
                max={siteQuality.openGraph.max}
              >
                <ChecklistItem
                  label="og:title"
                  present={siteQuality.openGraph.title.present}
                  priority="medium"
                />
                <ChecklistItem
                  label="og:description"
                  present={siteQuality.openGraph.description.present}
                  priority="medium"
                />
                <ChecklistItem
                  label="og:image"
                  present={siteQuality.openGraph.image.present}
                  priority="high"
                />
                <ChecklistItem
                  label="og:url"
                  present={siteQuality.openGraph.url.present}
                  priority="low"
                />
                <ChecklistItem
                  label="og:type"
                  present={siteQuality.openGraph.type.present}
                  priority="low"
                  value={siteQuality.openGraph.type.value || undefined}
                />
              </QualitySection>

              {/* Twitter Cards */}
              <QualitySection
                title="Twitter Cards"
                score={siteQuality.twitterCards.score}
                max={siteQuality.twitterCards.max}
              >
                <ChecklistItem
                  label="twitter:card"
                  present={siteQuality.twitterCards.cardType.present}
                  priority="medium"
                  value={siteQuality.twitterCards.cardType.value || undefined}
                />
                <ChecklistItem
                  label="twitter:title"
                  present={siteQuality.twitterCards.title.present}
                  priority="medium"
                />
                <ChecklistItem
                  label="twitter:description"
                  present={siteQuality.twitterCards.description.present}
                  priority="medium"
                />
                <ChecklistItem
                  label="twitter:image"
                  present={siteQuality.twitterCards.image.present}
                  priority="high"
                />
              </QualitySection>
            </div>
          </div>
        )}

        {/* Analysis Findings Grid */}
        <div className="mb-8 space-y-6">
          <h3 className="font-bold text-[#2c2f31] text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Analysis Findings
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#f8f9ff] p-6 rounded-xl border border-[#5B5BD5]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#5B5BD5]">
                <AutoAwesomeIcon className="w-5 h-5" />
                <h4 className="font-bold uppercase text-xs tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Keyword Opportunities
                </h4>
              </div>
              <p className="text-sm text-[#595c5e] leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {analysis.keywordGapAnalysis}
              </p>
            </div>

            <div className="bg-[#eef1f3]/20 p-6 rounded-xl border border-[#abadaf]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#2c2f31]">
                <TitleIcon className="w-5 h-5" />
                <h4 className="font-bold uppercase text-xs tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Meta Tag Review
                </h4>
              </div>
              <p className="text-sm text-[#595c5e] leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {analysis.metaTagReview}
              </p>
            </div>

            <div className="bg-[#eef1f3]/20 p-6 rounded-xl border border-[#abadaf]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#2c2f31]">
                <LayersIcon className="w-5 h-5" />
                <h4 className="font-bold uppercase text-xs tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Content Gaps
                </h4>
              </div>
              <p className="text-sm text-[#595c5e] leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {analysis.contentGapIdentification}
              </p>
            </div>

            <div className="bg-[#eef1f3]/20 p-6 rounded-xl border border-[#abadaf]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#2c2f31]">
                <MonitoringIcon className="w-5 h-5" />
                <h4 className="font-bold uppercase text-xs tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Competitor Analysis
                </h4>
              </div>
              <p className="text-sm text-[#595c5e] leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {analysis.competitorKeywordInference}
              </p>
            </div>
          </div>
        </div>

        {/* Technical SEO Flags */}
        {technicalFlags.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-[#2c2f31] mb-3 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <WarningIcon className="w-5 h-5 text-[#6f5900]" />
              Technical SEO Flags
            </h4>
            <div className="flex flex-wrap gap-2">
              {technicalFlags.map((flag, i) => (
                <span
                  key={i}
                  className="px-3 py-2 bg-[#fed01b]/10 text-[#594700] rounded-lg text-sm border border-[#fed01b]/20 font-medium"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key Issues & Quick Wins */}
        <div className="border-t border-[#abadaf]/15 pt-8">
          <IssuesAndQuickWins
            keyIssues={seo.keyIssues}
            quickWins={seo.quickWins}
            issuesTitle="SEO Issues"
          />
        </div>
      </div>
    </motion.div>
  );
}
