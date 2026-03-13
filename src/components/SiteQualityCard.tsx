'use client';

import { motion } from 'framer-motion';
import type { SiteQualityScore } from '@/types/report';

interface SiteQualityCardProps {
  siteQuality: SiteQualityScore;
}

// Status badge component
function StatusBadge({ present, label }: { present: boolean; label?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
      present
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700'
    }`}>
      {present ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
      {label || (present ? 'present' : 'missing')}
    </span>
  );
}

// Score item row
function ScoreItem({
  label,
  score,
  max,
  detail,
  status
}: {
  label: string;
  score: number;
  max: number;
  detail?: string;
  status?: 'good' | 'warning' | 'error';
}) {
  const percentage = (score / max) * 100;
  const statusColor = status === 'good'
    ? 'bg-green-500'
    : status === 'warning'
    ? 'bg-yellow-500'
    : status === 'error'
    ? 'bg-red-500'
    : percentage >= 75
    ? 'bg-green-500'
    : percentage >= 50
    ? 'bg-yellow-500'
    : 'bg-red-500';

  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{score}/{max}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${statusColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {detail && (
          <span className="text-xs text-gray-500 truncate max-w-[200px]" title={detail}>
            {detail}
          </span>
        )}
      </div>
    </div>
  );
}

// Collapsible section
function Section({
  title,
  score,
  max,
  children,
  defaultOpen = false
}: {
  title: string;
  score: number;
  max: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const percentage = (score / max) * 100;
  const statusColor = percentage >= 75 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex items-center justify-between cursor-pointer py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <span className="font-semibold text-gray-900">{title}</span>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold ${statusColor}`}>{score}/{max}</span>
          <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </summary>
      <div className="pt-2 px-1">
        {children}
      </div>
    </details>
  );
}

export default function SiteQualityCard({ siteQuality }: SiteQualityCardProps) {
  const { totalScore, maxScore } = siteQuality;
  const percentage = Math.round((totalScore / maxScore) * 100);

  // Determine overall status color
  const scoreColor = percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600';
  const ringColor = percentage >= 80 ? 'stroke-green-500' : percentage >= 60 ? 'stroke-yellow-500' : 'stroke-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      {/* Header with Score Circle */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Site Quality</h2>
              <p className="text-gray-400 text-sm">Technical SEO checklist</p>
            </div>
          </div>

          {/* Score Circle */}
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                className={ringColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 226} 226`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{totalScore}</span>
              <span className="text-xs text-gray-400">/{maxScore}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Site Quality Section */}
        <Section title="Site Quality" score={
          siteQuality.title.score +
          siteQuality.metaDescription.score +
          siteQuality.favicon.score +
          siteQuality.viewport.score +
          siteQuality.robotsTxt.score +
          siteQuality.sitemap.score +
          siteQuality.llmsTxt.score +
          siteQuality.headings.score +
          siteQuality.schemaOrg.score +
          siteQuality.canonical.score +
          siteQuality.htmlLang.score +
          siteQuality.charset.score
        } max={
          siteQuality.title.max +
          siteQuality.metaDescription.max +
          siteQuality.favicon.max +
          siteQuality.viewport.max +
          siteQuality.robotsTxt.max +
          siteQuality.sitemap.max +
          siteQuality.llmsTxt.max +
          siteQuality.headings.max +
          siteQuality.schemaOrg.max +
          siteQuality.canonical.max +
          siteQuality.htmlLang.max +
          siteQuality.charset.max
        } defaultOpen>
          <ScoreItem
            label="Title"
            score={siteQuality.title.score}
            max={siteQuality.title.max}
            detail={`${siteQuality.title.length} chars (ideal 30-60)`}
            status={siteQuality.title.status}
          />
          <ScoreItem
            label="Meta Description"
            score={siteQuality.metaDescription.score}
            max={siteQuality.metaDescription.max}
            detail={`${siteQuality.metaDescription.length} chars (ideal 120-160)`}
            status={siteQuality.metaDescription.status}
          />
          <div className="py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Favicon</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{siteQuality.favicon.score}/{siteQuality.favicon.max}</span>
              <StatusBadge present={siteQuality.favicon.present} />
            </div>
          </div>
          <ScoreItem
            label="Viewport Meta"
            score={siteQuality.viewport.score}
            max={siteQuality.viewport.max}
            detail={siteQuality.viewport.content || 'missing'}
            status={siteQuality.viewport.status}
          />
          <ScoreItem
            label="robots.txt"
            score={siteQuality.robotsTxt.score}
            max={siteQuality.robotsTxt.max}
            detail={siteQuality.robotsTxt.present ? 'present' : 'missing'}
            status={siteQuality.robotsTxt.status}
          />
          <div className="py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Sitemap</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{siteQuality.sitemap.score}/{siteQuality.sitemap.max}</span>
              <StatusBadge present={siteQuality.sitemap.present} />
            </div>
          </div>
          <div className="py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">llms.txt</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{siteQuality.llmsTxt.score}/{siteQuality.llmsTxt.max}</span>
              <StatusBadge present={siteQuality.llmsTxt.present} />
            </div>
          </div>
          <ScoreItem
            label="Headings"
            score={siteQuality.headings.score}
            max={siteQuality.headings.max}
            detail={siteQuality.headings.hasProperHierarchy ? 'proper hierarchy' : siteQuality.headings.issues[0] || 'issues found'}
          />
          <div className="py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Schema.org JSON-LD</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{siteQuality.schemaOrg.score}/{siteQuality.schemaOrg.max}</span>
              {siteQuality.schemaOrg.present ? (
                <span className="text-xs text-gray-500">{siteQuality.schemaOrg.types.length} schema(s)</span>
              ) : (
                <StatusBadge present={false} />
              )}
            </div>
          </div>
          <div className="py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Canonical URL</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{siteQuality.canonical.score}/{siteQuality.canonical.max}</span>
              <StatusBadge present={siteQuality.canonical.present} />
            </div>
          </div>
          <div className="py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">HTML lang</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{siteQuality.htmlLang.score}/{siteQuality.htmlLang.max}</span>
              {siteQuality.htmlLang.present ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                  {siteQuality.htmlLang.value}
                </span>
              ) : (
                <StatusBadge present={false} />
              )}
            </div>
          </div>
          <div className="py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Character Encoding</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{siteQuality.charset.score}/{siteQuality.charset.max}</span>
              {siteQuality.charset.present ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                  {siteQuality.charset.value}
                </span>
              ) : (
                <StatusBadge present={false} />
              )}
            </div>
          </div>
        </Section>

        {/* Open Graph Section */}
        <Section title="Open Graph" score={siteQuality.openGraph.score} max={siteQuality.openGraph.max}>
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">og:title</span>
              <div className="flex items-center gap-2 max-w-[60%]">
                <StatusBadge present={siteQuality.openGraph.title.present} />
                {siteQuality.openGraph.title.value && (
                  <span className="text-xs text-gray-500 truncate" title={siteQuality.openGraph.title.value}>
                    {siteQuality.openGraph.title.value.slice(0, 30)}...
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">og:description</span>
              <StatusBadge present={siteQuality.openGraph.description.present} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">og:image</span>
              <StatusBadge present={siteQuality.openGraph.image.present} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">og:url</span>
              <StatusBadge present={siteQuality.openGraph.url.present} />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">og:type</span>
              <div className="flex items-center gap-2">
                <StatusBadge present={siteQuality.openGraph.type.present} />
                {siteQuality.openGraph.type.value && (
                  <span className="text-xs text-gray-500">{siteQuality.openGraph.type.value}</span>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* Twitter Cards Section */}
        <Section title="Twitter Cards" score={siteQuality.twitterCards.score} max={siteQuality.twitterCards.max}>
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">twitter:card</span>
              <div className="flex items-center gap-2">
                <StatusBadge present={siteQuality.twitterCards.cardType.present} />
                {siteQuality.twitterCards.cardType.value && (
                  <span className="text-xs text-gray-500">{siteQuality.twitterCards.cardType.value}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">twitter:title</span>
              <StatusBadge present={siteQuality.twitterCards.title.present} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">twitter:description</span>
              <StatusBadge present={siteQuality.twitterCards.description.present} />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">twitter:image</span>
              <StatusBadge present={siteQuality.twitterCards.image.present} />
            </div>
          </div>
        </Section>

        {/* Quick Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Summary</h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-lg font-bold text-green-600">
                {[
                  siteQuality.favicon.present,
                  siteQuality.viewport.present,
                  siteQuality.robotsTxt.present,
                  siteQuality.sitemap.present,
                  siteQuality.canonical.present,
                  siteQuality.schemaOrg.present,
                  siteQuality.htmlLang.present,
                  siteQuality.charset.present,
                ].filter(Boolean).length}
              </p>
              <p className="text-xs text-gray-500">Passing</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-lg font-bold text-yellow-600">
                {[
                  siteQuality.title.status === 'warning',
                  siteQuality.metaDescription.status === 'warning',
                  siteQuality.viewport.status === 'warning',
                  siteQuality.robotsTxt.status === 'warning',
                ].filter(Boolean).length}
              </p>
              <p className="text-xs text-gray-500">Warnings</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-lg font-bold text-red-600">
                {[
                  !siteQuality.favicon.present,
                  !siteQuality.sitemap.present,
                  !siteQuality.canonical.present,
                  !siteQuality.schemaOrg.present,
                  siteQuality.openGraph.score === 0,
                ].filter(Boolean).length}
              </p>
              <p className="text-xs text-gray-500">Issues</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
