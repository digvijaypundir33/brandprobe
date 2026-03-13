/**
 * Google PageSpeed Insights API Types
 *
 * API Documentation: https://developers.google.com/speed/docs/insights/v5/get-started
 */

// Core Web Vital metric structure
export interface CoreWebVitalMetric {
  value: number;
  displayValue: string;
  score: number; // 0-1
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Core Web Vitals from PageSpeed API
export interface CoreWebVitals {
  // Largest Contentful Paint (milliseconds)
  lcp: CoreWebVitalMetric;
  // First Contentful Paint (milliseconds)
  fcp: CoreWebVitalMetric;
  // Total Blocking Time (milliseconds)
  tbt: CoreWebVitalMetric;
  // Cumulative Layout Shift (unitless)
  cls: CoreWebVitalMetric;
  // Speed Index (milliseconds)
  speedIndex: CoreWebVitalMetric;
}

// Lighthouse audit summary
export interface LighthouseAuditSummary {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  scoreDisplayMode: 'binary' | 'numeric' | 'informative' | 'notApplicable';
}

// Lighthouse category with score and audits
export interface LighthouseCategory {
  score: number; // 0-100
  audits: LighthouseAuditSummary[];
}

// Lighthouse Category Scores
export interface LighthouseCategories {
  performance: LighthouseCategory;
  seo: LighthouseCategory;
  bestPractices: LighthouseCategory;
  accessibility: LighthouseCategory;
}

// Field data from Chrome UX Report (CrUX)
export interface FieldDataMetric {
  percentile: number;
  category: string;
}

export interface FieldData {
  available: boolean;
  origin?: string;
  lcp?: FieldDataMetric;
  fcp?: FieldDataMetric;
  cls?: FieldDataMetric;
  fid?: FieldDataMetric; // First Input Delay
}

// Full PageSpeed Analysis Result
export interface PageSpeedInsightsResult {
  url: string;
  strategy: 'mobile' | 'desktop';
  fetchTime: string;

  // Core Web Vitals (from lab data)
  coreWebVitals: CoreWebVitals;

  // Category scores (0-100)
  categories: LighthouseCategories;

  // Field data from CrUX (may be null for low-traffic sites)
  fieldData: FieldData | null;

  // Overall performance score (0-100)
  performanceScore: number;

  // API metadata
  lighthouseVersion: string;
  analysisTimeMs: number;
}

// PageSpeed Insights data stored in report
export interface PageSpeedInsightsData {
  lcp: CoreWebVitalMetric;
  fcp: CoreWebVitalMetric;
  tbt: CoreWebVitalMetric;
  cls: CoreWebVitalMetric;
  speedIndex: CoreWebVitalMetric;
  performanceScore: number;
  seoScore: number;
  bestPracticesScore: number;
  accessibilityScore: number;
  strategy: 'mobile' | 'desktop';
  fetchTime: string;
  lighthouseVersion: string;
  hasFieldData: boolean;
}
