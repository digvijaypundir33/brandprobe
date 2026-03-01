'use client';

import { motion } from 'framer-motion';
import type { ScrapedData } from '@/types/report';

interface WebsiteInfoCardProps {
  data: ScrapedData;
}

export default function WebsiteInfoCard({ data }: WebsiteInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gray-900 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Website Overview</h2>
            <p className="text-gray-400 text-sm">What we found on your site</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Title and Meta */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Page Title</label>
          <p className="text-gray-900 font-medium mt-1">{data.title || 'No title found'}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Meta Description</label>
          <p className="text-gray-700 text-sm mt-1">{data.metaDescription || 'No meta description found'}</p>
        </div>

        {/* Headlines */}
        {data.h1.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <span className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">H1</span>
              Primary Headlines
            </label>
            <ul className="mt-2 space-y-1">
              {data.h1.slice(0, 3).map((h, i) => (
                <li key={i} className="text-gray-800 text-sm flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{data.ctas.length}</p>
            <p className="text-xs text-gray-600 font-medium">CTAs Found</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{data.testimonials.length}</p>
            <p className="text-xs text-gray-600 font-medium">Testimonials</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{data.trustSignals.length}</p>
            <p className="text-xs text-gray-600 font-medium">Trust Signals</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{data.subPages.length}</p>
            <p className="text-xs text-gray-600 font-medium">Pages Scanned</p>
          </div>
        </div>

        {/* CTAs Found */}
        {data.ctas.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Calls-to-Action Found
            </label>
            <div className="flex flex-wrap gap-2">
              {data.ctas.slice(0, 6).map((cta, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-200"
                >
                  {cta}
                </span>
              ))}
              {data.ctas.length > 6 && (
                <span className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-md text-sm border border-gray-100">
                  +{data.ctas.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        {data.navLinks.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Navigation Structure
            </label>
            <div className="flex flex-wrap gap-2">
              {data.navLinks.slice(0, 8).map((link, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-sm border border-gray-200"
                >
                  {link}
                </span>
              ))}
              {data.navLinks.length > 8 && (
                <span className="px-3 py-1.5 bg-gray-50 text-gray-400 rounded-md text-sm border border-gray-100">
                  +{data.navLinks.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
