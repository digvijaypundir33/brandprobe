// Report Types

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

  // Meta
  scanTimeMs: number | null;
  isAutoRescan: boolean;
  createdAt: string;
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
  reportsUsedThisMonth: number;
  reportsLimit: number;
  currentPeriodStart: string | null;
  createdAt: string;
  updatedAt: string;
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
