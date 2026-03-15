// Report Types

// ===========================================
// Improvement Tracking Types (Rescan Feature)
// ===========================================

export interface SectionScores {
  messaging: number;
  seo: number;
  content: number;
  ads: number;
  conversion: number;
  distribution: number;
  aiSearch: number;
  technical: number;
  brandHealth: number;
  designAuth: number;
}

export interface ResolvedIssue {
  category: string;
  issue: string;
  resolvedInScan: number;
}

export interface NewIssue {
  category: string;
  issue: string;
  priority: 'high' | 'medium' | 'low';
}

export interface PersistingIssue {
  category: string;
  issue: string;
  firstSeenScan: number;
  scanCount: number;
}

export interface IssueComparison {
  resolved: ResolvedIssue[];
  new: NewIssue[];
  persisting: PersistingIssue[];
  summary: {
    resolvedCount: number;
    newCount: number;
    persistingCount: number;
    overallProgress: 'improving' | 'stable' | 'declining';
  };
}

// ===========================================
// Core Report Types
// ===========================================

export interface Issue {
  problem: string;
  solution: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface QuickWin {
  action: string;
  impact: string;
  effort?: 'easy' | 'medium' | 'hard';
}

export interface ReportSection {
  score: number;
  summary: string;
  keyIssues: Issue[];
  quickWins: QuickWin[];
  detailedAnalysis: Record<string, unknown>;
}

export interface MessagingAnalysis extends ReportSection {
  detailedAnalysis: {
    headlineAnalysis: string;
    valuePropositionClarity: string;
    differentiationSignals: string;
    ctaAnalysis: string;
    brandVoice: string;
  };
}

export interface SeoOpportunities extends ReportSection {
  detailedAnalysis: {
    keywordGapAnalysis: string;
    metaTagReview: string;
    contentGapIdentification: string;
    competitorKeywordInference: string;
    technicalSeoFlags: string[];
  };
}

export interface ContentStrategy extends ReportSection {
  detailedAnalysis: {
    contentPillars: string[];
    formatRecommendations: string[];
    topicClusters: string[];
    differentiationAngles: string[];
    publishingCadence: string;
    platformGuidance: Record<string, string>;
  };
}

export interface AdAngles extends ReportSection {
  detailedAnalysis: {
    adHooks: string[];
    psychologicalTriggers: string[];
    audienceAngleVariations: string[];
    headlineSuggestions: string[];
    copySuggestions: string[];
    platformCreativeDirection: Record<string, string>;
  };
}

export interface ConversionOptimization extends ReportSection {
  detailedAnalysis: {
    trustSignalAudit: string;
    ctaOptimization: string;
    pageStructureAnalysis: string;
    frictionPoints: string[];
    socialProofAssessment: string;
    aboveFoldEffectiveness: string;
  };
}

export interface DistributionStrategy extends ReportSection {
  detailedAnalysis: {
    channelRecommendations: Array<{ channel: string; fit: number; rationale: string }>;
    contentChannelMapping: Record<string, string[]>;
    tonePerPlatform: Record<string, string>;
    partnershipSuggestions: string[];
  };
}

// NEW SECTIONS

export interface AISearchVisibility extends ReportSection {
  detailedAnalysis: {
    aeoScore: number;
    entityClarity: string;
    citationReadiness: string;
    aiSearchAppearance: string[];
    contentStructureForAI: string;
    schemaMarkupAnalysis: string;
    faqOpportunities: string[];
    recommendations: string[];
  };
}

export interface TechnicalPerformance extends ReportSection {
  detailedAnalysis: {
    pageSpeedEstimate: 'Fast' | 'Medium' | 'Slow';
    mobileReadiness: string;
    securityIndicators: string[];
    accessibilityFlags: string[];
    coreWebVitalsEstimate: string;
    structuredDataPresence: string;
    imageOptimization: string;
    recommendations: string[];

    // PageSpeed Insights data (null if API disabled or unavailable)
    pageSpeedInsights?: {
      lcp: { value: number; displayValue: string; score: number; rating: string };
      fcp: { value: number; displayValue: string; score: number; rating: string };
      tbt: { value: number; displayValue: string; score: number; rating: string };
      cls: { value: number; displayValue: string; score: number; rating: string };
      speedIndex: { value: number; displayValue: string; score: number; rating: string };
      performanceScore: number;
      seoScore: number;
      bestPracticesScore: number;
      accessibilityScore: number;
      strategy: 'mobile' | 'desktop';
      fetchTime: string;
      lighthouseVersion: string;
      hasFieldData: boolean;
    } | null;

    // Indicates source of technical analysis data
    dataSource?: 'pagespeed-api' | 'heuristic-fallback';
  };
}

export interface BrandHealth extends ReportSection {
  detailedAnalysis: {
    brandConsistency: string;
    voiceToneAnalysis: string;
    visualIdentityNotes: string;
    competitorDifferentiation: string;
    memorabilityScore: string;
    brandPersonality: string;
    trustPerception: string;
    recommendations: string[];
  };
}

export interface DesignAuthenticity extends ReportSection {
  detailedAnalysis: {
    // Cliché Phrases Detection
    clichePhrasesDetected: string[];
    clicheCount: number;
    clicheSeverity: 'high' | 'medium' | 'low' | 'none';

    // Layout Pattern Analysis
    layoutPattern: string;
    layoutAuthenticity: 'unique' | 'common' | 'generic';
    layoutDescription: string;

    // Icon Library Detection
    iconLibrariesFound: string[];
    usesCustomIcons: boolean;
    iconAnalysis: string;

    // Overall Assessment
    authenticityRating: 'Authentic' | 'Somewhat Generic' | 'AI-Generated Pattern';
    strengthsSummary: string;
    recommendations: string[];

    // Screenshot
    screenshotUrl?: string;
  };
}

export interface Report {
  id: string;
  userId: string;
  siteId: string;
  url: string;
  status: 'scanning' | 'ready' | 'failed';

  // Scraped data
  scrapedData: ScrapedData | null;

  // Report sections
  messagingAnalysis: MessagingAnalysis | null;
  seoOpportunities: SeoOpportunities | null;
  contentStrategy: ContentStrategy | null;
  adAngles: AdAngles | null;
  conversionOptimization: ConversionOptimization | null;
  distributionStrategy: DistributionStrategy | null;

  // NEW sections
  aiSearchVisibility: AISearchVisibility | null;
  technicalPerformance: TechnicalPerformance | null;
  brandHealth: BrandHealth | null;
  designAuthenticity: DesignAuthenticity | null;

  // Scores
  overallScore: number | null;
  messagingScore: number | null;
  seoScore: number | null;
  contentScore: number | null;
  adsScore: number | null;
  conversionScore: number | null;
  distributionScore: number | null;

  // NEW scores
  aiSearchScore: number | null;
  technicalScore: number | null;
  brandHealthScore: number | null;
  designAuthenticityScore: number | null;

  // Progress tracking
  previousOverallScore: number | null;
  scoreChange: number | null;

  // Section-level improvement tracking (Phase 1)
  previousSectionScores: SectionScores | null;
  sectionScoreChanges: SectionScores | null;

  // Issue comparison from AI (Phase 2)
  issueComparison: IssueComparison | null;

  // Scan history tracking (Phase 3)
  scanNumber: number;

  // Meta
  scanTimeMs: number | null;
  isAutoRescan: boolean;
  isPublic: boolean;
  createdAt: string;

  // Error handling
  errorMessage?: string | null;
  errorTimestamp?: string | null;
  lastActivityAt?: string | null;

  // Showcase fields
  showcaseEnabled: boolean;
  showcaseRank: number;
  showcaseViews: number;
  showcaseClicks: number;
  showcaseUpvotes: number;
  isPriority?: boolean;

  // Share tracking
  shareImageUrl?: string | null;
  shareCount?: number;
  lastSharedAt?: string | null;
}

export interface SitemapMetadata {
  totalPages: number;
  blogCount: number;
  productCount: number;
  recentlyUpdated: number;
  staleContent: number;
  urlQuality: 'good' | 'needs-improvement';
  averageDepth: number;
}

export interface ScrapedData {
  url: string;
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  heroText: string;
  ctas: string[];
  navLinks: string[];
  testimonials: string[];
  trustSignals: string[];
  pricingInfo: string | null;
  socialProof: string[];
  subPages: SubPageData[];

  // Technical indicators
  technicalData?: TechnicalData;

  // Sitemap data (NEW)
  sitemapMetadata?: SitemapMetadata;
  html?: string; // Raw HTML for technical analysis
}

export interface TechnicalData {
  hasSSL: boolean;
  hasFavicon: boolean;
  hasOpenGraph: boolean;
  hasTwitterCards: boolean;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  hasCanonicalTag: boolean;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  hasLlmsTxt: boolean;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  formCount: number;
  videoCount: number;
  externalLinkCount: number;
  internalLinkCount: number;
  hasViewportMeta: boolean;
  hasCharsetMeta: boolean;
  hasFAQSchema: boolean;
  loadTimeEstimate: 'fast' | 'medium' | 'slow';
  pageSize: string;
  htmlLang: string | null;

  // Title & Meta
  titleLength: number;
  metaDescriptionLength: number;

  // Open Graph details
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogUrl: string | null;
  ogType: string | null;

  // Twitter Card details
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;

  // Canonical
  canonicalUrl: string | null;

  // Favicon URL
  faviconUrl: string | null;

  // Viewport content
  viewportContent: string | null;

  // Charset
  charset: string | null;

  // Headings hierarchy
  headingsHierarchy: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h4Count: number;
    h5Count: number;
    h6Count: number;
    hasProperHierarchy: boolean;
    hierarchyIssues: string[];
  };

  // Robots.txt content preview
  robotsTxtContent: string | null;

  // Security Headers
  securityHeaders: {
    hasHSTS: boolean;
    hstsValue: string | null;
    hasCSP: boolean;
    cspValue: string | null;
    hasXFrameOptions: boolean;
    xFrameOptionsValue: string | null;
    hasXContentTypeOptions: boolean;
    xContentTypeOptionsValue: string | null;
    hasReferrerPolicy: boolean;
    referrerPolicyValue: string | null;
    hasPermissionsPolicy: boolean;
    permissionsPolicyValue: string | null;
  };
}

// Site Quality Score breakdown (like YourWebsiteScore)
export interface SiteQualityScore {
  totalScore: number;
  maxScore: number;

  // Individual scores
  title: { score: number; max: number; value: string; length: number; status: 'good' | 'warning' | 'error' };
  metaDescription: { score: number; max: number; value: string; length: number; status: 'good' | 'warning' | 'error' };
  favicon: { score: number; max: number; present: boolean; url: string | null };
  viewport: { score: number; max: number; present: boolean; content: string | null; status: 'good' | 'warning' | 'error' };
  robotsTxt: { score: number; max: number; present: boolean; content: string | null; status: 'good' | 'warning' | 'error' };
  sitemap: { score: number; max: number; present: boolean };
  llmsTxt: { score: number; max: number; present: boolean };
  headings: { score: number; max: number; hasProperHierarchy: boolean; issues: string[] };
  schemaOrg: { score: number; max: number; present: boolean; types: string[] };
  canonical: { score: number; max: number; present: boolean; url: string | null };
  htmlLang: { score: number; max: number; present: boolean; value: string | null };
  charset: { score: number; max: number; present: boolean; value: string | null };

  // Open Graph
  openGraph: {
    score: number;
    max: number;
    title: { present: boolean; value: string | null };
    description: { present: boolean; value: string | null };
    image: { present: boolean; url: string | null };
    url: { present: boolean; value: string | null };
    type: { present: boolean; value: string | null };
  };

  // Twitter Cards
  twitterCards: {
    score: number;
    max: number;
    cardType: { present: boolean; value: string | null };
    title: { present: boolean; value: string | null };
    description: { present: boolean; value: string | null };
    image: { present: boolean; url: string | null };
  };
}

export interface SubPageData {
  url: string;
  title: string;
  h1: string[];
  h2: string[];
  mainContent: string;
}

export interface User {
  id: string;
  email: string;
  stripeCustomerId: string | null;
  subscriptionStatus: 'free' | 'starter' | 'active' | 'cancelled' | 'past_due';
  subscriptionId: string | null;
  oneTimePurchaseId: string | null;
  reportsUsedThisMonth: number;
  reportsLimit: number;
  currentPeriodStart: string | null;
  createdAt: string;
  updatedAt: string;
  // Profile fields
  displayName: string | null;
  company: string | null;
  avatarUrl: string | null;
  bio: string | null;
  websiteUrl: string | null;
  twitterHandle: string | null;
  linkedinUrl: string | null;
}

export interface Site {
  id: string;
  userId: string;
  url: string;
  domain: string;
  isPrimary: boolean;
  firstScannedAt: string;
  lastScannedAt: string | null;
  totalScans: number;
  createdAt: string;
}

// ============================================
// Showcase Types
// ============================================

export const SHOWCASE_CATEGORIES = [
  'SaaS',
  'E-commerce',
  'Agency',
  'Portfolio',
  'Startup',
  'Blog/Media',
  'Non-profit',
  'Local Business',
  'Other',
] as const;

export type ShowcaseCategory = typeof SHOWCASE_CATEGORIES[number];

export interface ShowcaseProfile {
  id: string;
  reportId: string;
  userId: string;

  // User-editable display info
  displayName: string | null;
  tagline: string | null;
  description: string | null;
  iconUrl: string | null;
  screenshotUrl: string | null;
  category: ShowcaseCategory | null;

  // Auto-extracted defaults from scraped data
  defaultName: string | null;
  defaultTagline: string | null;
  defaultIconUrl: string | null;

  // The analyzed website URL
  websiteUrl: string;

  // Priority/Featured status (for Starter/Pro users)
  isPriority: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Combined showcase entry for display (report + profile)
export interface ShowcaseEntry {
  // Report data
  reportId: string;
  url: string;
  overallScore: number | null;
  messagingScore?: number | null;
  seoScore?: number | null;
  aiSearchScore?: number | null;
  technicalScore?: number | null;
  brandHealthScore?: number | null;
  designAuthenticityScore?: number | null;
  technicalPerformance?: any; // JSON field with SEO checklist data
  showcaseViews: number;
  showcaseClicks: number;
  showcaseUpvotes: number;
  showcaseRank: number;
  createdAt: string;

  // Profile data (display values with fallbacks applied)
  displayName: string;
  tagline: string;
  description: string | null;
  iconUrl: string | null;
  screenshotUrl: string | null;
  category: ShowcaseCategory | null;
  websiteUrl: string;
  isPriority: boolean;

  // Owner info
  ownerEmail?: string;
  ownerName?: string;
  ownerCompany?: string | null;
  ownerBio?: string | null;
  ownerWebsiteUrl?: string | null;
  ownerTwitterHandle?: string | null;
  ownerLinkedinUrl?: string | null;
}

// Input for creating/updating showcase profile
export interface ShowcaseProfileInput {
  reportId: string;
  displayName?: string;
  tagline?: string;
  description?: string;
  iconUrl?: string;
  screenshotUrl?: string;
  category?: ShowcaseCategory;
}

// Filters for showcase listing
export interface ShowcaseFilters {
  category?: ShowcaseCategory;
  minScore?: number;
  maxScore?: number;
  search?: string;
  sortBy?: 'rank' | 'score' | 'newest' | 'views' | 'upvotes';
  limit?: number;
  offset?: number;
}

// Showcase comment
export interface ShowcaseComment {
  id: string;
  reportId: string;
  userId: string | null;
  authorName: string;
  authorEmail: string;
  authorAvatarUrl: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Input for creating a comment
export interface ShowcaseCommentInput {
  reportId: string;
  authorName: string;
  authorEmail: string;
  content: string;
}

// Showcase detail (full entry with additional data)
export interface ShowcaseDetail extends ShowcaseEntry {
  // Comments
  comments: ShowcaseComment[];
  commentCount: number;

  // User-specific
  hasUpvoted?: boolean;
}
