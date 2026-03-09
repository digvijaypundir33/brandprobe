import { createClient } from '@supabase/supabase-js';
import type { Report, User, Site } from '@/types/report';

// Determine environment and get appropriate Supabase credentials
// Default to production unless explicitly set to 'local'
const isLocal = process.env.NEXT_PUBLIC_SUPABASE_ENV === 'local';

const supabaseUrl = isLocal
  ? process.env.NEXT_PUBLIC_SUPABASE_LOCAL_URL!
  : (process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!;

const supabaseAnonKey = isLocal
  ? process.env.NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY!
  : (process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

const supabaseServiceRoleKey = isLocal
  ? process.env.SUPABASE_LOCAL_SERVICE_ROLE_KEY!
  : (process.env.SUPABASE_PROD_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!

// Client for browser (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client (uses service role key for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// User operations
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return transformUser(data);
}

export async function createUser(email: string): Promise<User> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({ email })
    .select()
    .single();

  if (error) throw new Error(`Failed to create user: ${error.message}`);
  return transformUser(data);
}

export async function getOrCreateUser(email: string): Promise<User> {
  const existing = await getUserByEmail(email);
  if (existing) return existing;
  return createUser(email);
}

export async function updateUser(
  userId: string,
  updates: Partial<{
    stripeCustomerId: string;
    subscriptionStatus: string;
    subscriptionId: string;
    reportsUsedThisMonth: number;
    reportsLimit: number;
    currentPeriodStart: string;
    oneTimePurchaseId: string;
  }>
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      stripe_customer_id: updates.stripeCustomerId,
      subscription_status: updates.subscriptionStatus,
      subscription_id: updates.subscriptionId,
      reports_used_this_month: updates.reportsUsedThisMonth,
      reports_limit: updates.reportsLimit,
      current_period_start: updates.currentPeriodStart,
      one_time_purchase_id: updates.oneTimePurchaseId,
    })
    .eq('id', userId);

  if (error) throw new Error(`Failed to update user: ${error.message}`);
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  profile: Partial<{
    displayName: string | null;
    company: string | null;
    avatarUrl: string | null;
    bio: string | null;
    websiteUrl: string | null;
    twitterHandle: string | null;
    linkedinUrl: string | null;
  }>
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      display_name: profile.displayName,
      company: profile.company,
      avatar_url: profile.avatarUrl,
      bio: profile.bio,
      website_url: profile.websiteUrl,
      twitter_handle: profile.twitterHandle,
      linkedin_url: profile.linkedinUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw new Error(`Failed to update user profile: ${error.message}`);
}

// Site operations
export async function getSiteByUrl(userId: string, url: string): Promise<Site | null> {
  const { data, error } = await supabaseAdmin
    .from('sites')
    .select('*')
    .eq('user_id', userId)
    .eq('url', url)
    .single();

  if (error) return null;
  return transformSite(data);
}

export async function createSite(
  userId: string,
  url: string,
  domain: string,
  isPrimary: boolean = false
): Promise<Site> {
  const { data, error } = await supabaseAdmin
    .from('sites')
    .insert({
      user_id: userId,
      url,
      domain,
      is_primary: isPrimary,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create site: ${error.message}`);
  return transformSite(data);
}

export async function getOrCreateSite(
  userId: string,
  url: string,
  domain: string
): Promise<Site> {
  const existing = await getSiteByUrl(userId, url);
  if (existing) return existing;

  // Check if user has any sites - if not, make this the primary
  const { count } = await supabaseAdmin
    .from('sites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const isPrimary = count === 0;
  return createSite(userId, url, domain, isPrimary);
}

export async function updateSiteLastScanned(siteId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('sites')
    .update({
      last_scanned_at: new Date().toISOString(),
      total_scans: supabaseAdmin.rpc('increment_total_scans', { site_id: siteId }),
    })
    .eq('id', siteId);

  if (error) {
    // Fallback if RPC doesn't exist
    await supabaseAdmin.rpc('increment', {
      table_name: 'sites',
      column_name: 'total_scans',
      row_id: siteId,
    });
  }
}

// Report operations
export async function createReport(
  userId: string,
  siteId: string,
  url: string
): Promise<Report> {
  const { data, error } = await supabaseAdmin
    .from('reports')
    .insert({
      user_id: userId,
      site_id: siteId,
      url,
      status: 'scanning',
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create report: ${error.message}`);
  return transformReport(data);
}

export async function getReportById(reportId: string): Promise<Report | null> {
  const { data, error } = await supabaseAdmin
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (error) return null;
  return transformReport(data);
}

export async function getLatestReportForSite(siteId: string): Promise<Report | null> {
  const { data, error } = await supabaseAdmin
    .from('reports')
    .select('*')
    .eq('site_id', siteId)
    .eq('status', 'ready')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return transformReport(data);
}

export async function getReportsByUserId(userId: string): Promise<Report[]> {
  const { data, error } = await supabaseAdmin
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to get reports by user ID:', error);
    return [];
  }
  return data.map(transformReport);
}

// Count completed reports (status = 'ready') for a user this month
export async function getCompletedReportsCountThisMonth(userId: string): Promise<number> {
  // Get the start of the current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const { count, error } = await supabaseAdmin
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'ready')
    .gte('created_at', monthStart.toISOString());

  if (error) {
    console.error('Failed to count completed reports:', error);
    return 0;
  }

  return count || 0;
}

export async function updateReport(
  reportId: string,
  updates: Partial<{
    status: string;
    scrapedData: unknown;
    messagingAnalysis: unknown;
    seoOpportunities: unknown;
    contentStrategy: unknown;
    adAngles: unknown;
    conversionOptimization: unknown;
    distributionStrategy: unknown;
    aiSearchVisibility: unknown;
    technicalPerformance: unknown;
    brandHealth: unknown;
    designAuthenticity: unknown;
    overallScore: number;
    messagingScore: number;
    seoScore: number;
    contentScore: number;
    adsScore: number;
    conversionScore: number;
    distributionScore: number;
    aiSearchScore: number;
    technicalScore: number;
    brandHealthScore: number;
    designAuthenticityScore: number;
    previousOverallScore: number | null;
    scoreChange: number | null;
    // Improvement tracking fields
    previousSectionScores: Record<string, number> | null;
    sectionScoreChanges: Record<string, number> | null;
    issueComparison: unknown | null;
    scanTimeMs: number;
    analysisType: 'quick' | 'full';
    pagesAnalyzed: number;
  }>
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('reports')
    .update({
      status: updates.status,
      scraped_data: updates.scrapedData,
      messaging_analysis: updates.messagingAnalysis,
      seo_opportunities: updates.seoOpportunities,
      content_strategy: updates.contentStrategy,
      ad_angles: updates.adAngles,
      conversion_optimization: updates.conversionOptimization,
      distribution_strategy: updates.distributionStrategy,
      ai_search_visibility: updates.aiSearchVisibility,
      technical_performance: updates.technicalPerformance,
      brand_health: updates.brandHealth,
      design_authenticity: updates.designAuthenticity,
      overall_score: updates.overallScore,
      messaging_score: updates.messagingScore,
      seo_score: updates.seoScore,
      content_score: updates.contentScore,
      ads_score: updates.adsScore,
      conversion_score: updates.conversionScore,
      distribution_score: updates.distributionScore,
      ai_search_score: updates.aiSearchScore,
      technical_score: updates.technicalScore,
      brand_health_score: updates.brandHealthScore,
      design_authenticity_score: updates.designAuthenticityScore,
      previous_overall_score: updates.previousOverallScore,
      score_change: updates.scoreChange,
      // Improvement tracking fields
      previous_section_scores: updates.previousSectionScores,
      section_score_changes: updates.sectionScoreChanges,
      issue_comparison: updates.issueComparison,
      scan_time_ms: updates.scanTimeMs,
      analysis_type: updates.analysisType,
      pages_analyzed: updates.pagesAnalyzed,
    })
    .eq('id', reportId);

  if (error) throw new Error(`Failed to update report: ${error.message}`);
}

export async function recordReportView(
  reportId: string,
  source: 'direct' | 'shared' | 'email'
): Promise<void> {
  await supabaseAdmin.from('report_views').insert({
    report_id: reportId,
    source,
  });
}

// Check for cached report (same URL within 24 hours)
export async function getCachedReport(url: string): Promise<Report | null> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from('reports')
    .select('*')
    .eq('url', url)
    .eq('status', 'ready')
    .gte('created_at', twentyFourHoursAgo)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return transformReport(data);
}

// Get all reports for a site (for history feature)
export async function getReportsBySiteId(siteId: string): Promise<Report[]> {
  const { data, error } = await supabaseAdmin
    .from('reports')
    .select('*')
    .eq('site_id', siteId)
    .eq('status', 'ready')
    .order('scan_number', { ascending: false });

  if (error) return [];
  return data.map(transformReport);
}

// Get report history summary for a site (lightweight version for timeline)
export async function getReportHistorySummary(siteId: string): Promise<Array<{
  id: string;
  scanNumber: number;
  overallScore: number | null;
  scoreChange: number | null;
  createdAt: string;
}>> {
  const { data, error } = await supabaseAdmin
    .from('reports')
    .select('id, scan_number, overall_score, score_change, created_at')
    .eq('site_id', siteId)
    .eq('status', 'ready')
    .order('scan_number', { ascending: false });

  if (error) return [];
  return data.map(row => ({
    id: row.id,
    scanNumber: row.scan_number || 1,
    overallScore: row.overall_score,
    scoreChange: row.score_change,
    createdAt: row.created_at,
  }));
}

// Get users with active subscriptions for re-scanning
export async function getActiveSubscribers(): Promise<User[]> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('subscription_status', 'active');

  if (error) return [];
  return data.map(transformUser);
}

// Get primary site for user
export async function getPrimarySite(userId: string): Promise<Site | null> {
  const { data, error } = await supabaseAdmin
    .from('sites')
    .select('*')
    .eq('user_id', userId)
    .eq('is_primary', true)
    .single();

  if (error) return null;
  return transformSite(data);
}

// Transform database rows to TypeScript types
function transformUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    stripeCustomerId: row.stripe_customer_id as string | null,
    subscriptionStatus: row.subscription_status as User['subscriptionStatus'],
    subscriptionId: row.subscription_id as string | null,
    oneTimePurchaseId: row.one_time_purchase_id as string | null,
    reportsUsedThisMonth: row.reports_used_this_month as number,
    reportsLimit: row.reports_limit as number,
    currentPeriodStart: row.current_period_start as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    // Profile fields
    displayName: row.display_name as string | null,
    company: row.company as string | null,
    avatarUrl: row.avatar_url as string | null,
    bio: row.bio as string | null,
    websiteUrl: row.website_url as string | null,
    twitterHandle: row.twitter_handle as string | null,
    linkedinUrl: row.linkedin_url as string | null,
  };
}

function transformSite(row: Record<string, unknown>): Site {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    url: row.url as string,
    domain: row.domain as string,
    isPrimary: row.is_primary as boolean,
    firstScannedAt: row.first_scanned_at as string,
    lastScannedAt: row.last_scanned_at as string | null,
    totalScans: row.total_scans as number,
    createdAt: row.created_at as string,
  };
}

function transformReport(row: Record<string, unknown>): Report {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    siteId: row.site_id as string,
    url: row.url as string,
    status: row.status as Report['status'],
    scrapedData: row.scraped_data as Report['scrapedData'],
    messagingAnalysis: row.messaging_analysis as Report['messagingAnalysis'],
    seoOpportunities: row.seo_opportunities as Report['seoOpportunities'],
    contentStrategy: row.content_strategy as Report['contentStrategy'],
    adAngles: row.ad_angles as Report['adAngles'],
    conversionOptimization: row.conversion_optimization as Report['conversionOptimization'],
    distributionStrategy: row.distribution_strategy as Report['distributionStrategy'],
    aiSearchVisibility: row.ai_search_visibility as Report['aiSearchVisibility'],
    technicalPerformance: row.technical_performance as Report['technicalPerformance'],
    brandHealth: row.brand_health as Report['brandHealth'],
    designAuthenticity: row.design_authenticity as Report['designAuthenticity'],
    overallScore: row.overall_score as number | null,
    messagingScore: row.messaging_score as number | null,
    seoScore: row.seo_score as number | null,
    contentScore: row.content_score as number | null,
    adsScore: row.ads_score as number | null,
    conversionScore: row.conversion_score as number | null,
    distributionScore: row.distribution_score as number | null,
    aiSearchScore: row.ai_search_score as number | null,
    technicalScore: row.technical_score as number | null,
    brandHealthScore: row.brand_health_score as number | null,
    designAuthenticityScore: row.design_authenticity_score as number | null,
    previousOverallScore: row.previous_overall_score as number | null,
    scoreChange: row.score_change as number | null,
    // Improvement tracking fields
    previousSectionScores: row.previous_section_scores as Report['previousSectionScores'],
    sectionScoreChanges: row.section_score_changes as Report['sectionScoreChanges'],
    issueComparison: row.issue_comparison as Report['issueComparison'],
    scanNumber: (row.scan_number as number) || 1,
    scanTimeMs: row.scan_time_ms as number | null,
    isAutoRescan: row.is_auto_rescan as boolean,
    isPublic: row.is_public !== false, // Default to true (public) if not set
    createdAt: row.created_at as string,
    // Showcase fields
    showcaseEnabled: row.showcase_enabled as boolean || false,
    showcaseRank: row.showcase_rank as number || 0,
    showcaseViews: row.showcase_views as number || 0,
    showcaseClicks: row.showcase_clicks as number || 0,
    showcaseUpvotes: row.showcase_upvotes as number || 0,
    isPriority: row.is_priority as boolean || false,
  };
}

// Magic link operations
export interface MagicLink {
  id: string;
  email: string;
  token: string;
  reportId: string | null;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
}

export async function createMagicLink(
  email: string,
  reportId?: string
): Promise<MagicLink> {
  // Generate cryptographically secure random token
  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  const { data, error } = await supabaseAdmin
    .from('magic_links')
    .insert({
      email,
      token,
      report_id: reportId || null,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create magic link: ${error.message}`);
  return transformMagicLink(data);
}

export async function getMagicLinkByToken(token: string): Promise<MagicLink | null> {
  const { data, error } = await supabaseAdmin
    .from('magic_links')
    .select('*')
    .eq('token', token)
    .is('used_at', null)
    .single();

  if (error) return null;
  return transformMagicLink(data);
}

export async function markMagicLinkAsUsed(token: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('magic_links')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token);

  if (error) throw new Error(`Failed to mark magic link as used: ${error.message}`);
}

export async function updateUserLastLogin(userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      last_login_at: new Date().toISOString(),
      email_verified: true,
    })
    .eq('id', userId);

  if (error) throw new Error(`Failed to update user login: ${error.message}`);
}

function transformMagicLink(row: Record<string, unknown>): MagicLink {
  return {
    id: row.id as string,
    email: row.email as string,
    token: row.token as string,
    reportId: row.report_id as string | null,
    expiresAt: row.expires_at as string,
    usedAt: row.used_at as string | null,
    createdAt: row.created_at as string,
  };
}

// Generate cryptographically secure token
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// ============================================
// Showcase Operations
// ============================================

import type { ShowcaseProfile, ShowcaseEntry, ShowcaseFilters, ShowcaseCategory } from '@/types/report';

function transformShowcaseProfile(row: Record<string, unknown>): ShowcaseProfile {
  return {
    id: row.id as string,
    reportId: row.report_id as string,
    userId: row.user_id as string,
    displayName: row.display_name as string | null,
    tagline: row.tagline as string | null,
    description: row.description as string | null,
    iconUrl: row.icon_url as string | null,
    screenshotUrl: row.screenshot_url as string | null,
    category: row.category as ShowcaseCategory | null,
    defaultName: row.default_name as string | null,
    defaultTagline: row.default_tagline as string | null,
    defaultIconUrl: row.default_icon_url as string | null,
    websiteUrl: row.website_url as string,
    isPriority: row.is_priority as boolean || false,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// Get showcase profile by report ID
export async function getShowcaseProfileByReportId(reportId: string): Promise<ShowcaseProfile | null> {
  const { data, error } = await supabaseAdmin
    .from('showcase_profiles')
    .select('*')
    .eq('report_id', reportId)
    .single();

  if (error) return null;
  return transformShowcaseProfile(data);
}

// Create showcase profile
export async function createShowcaseProfile(
  reportId: string,
  userId: string,
  websiteUrl: string,
  defaults: {
    defaultName: string;
    defaultTagline: string;
    defaultIconUrl?: string;
  },
  overrides?: {
    displayName?: string;
    tagline?: string;
    description?: string;
    iconUrl?: string;
    screenshotUrl?: string;
    category?: ShowcaseCategory;
  }
): Promise<ShowcaseProfile> {
  const { data, error } = await supabaseAdmin
    .from('showcase_profiles')
    .insert({
      report_id: reportId,
      user_id: userId,
      website_url: websiteUrl,
      default_name: defaults.defaultName,
      default_tagline: defaults.defaultTagline,
      default_icon_url: defaults.defaultIconUrl || null,
      display_name: overrides?.displayName || null,
      tagline: overrides?.tagline || null,
      description: overrides?.description || null,
      icon_url: overrides?.iconUrl || null,
      screenshot_url: overrides?.screenshotUrl || null,
      category: overrides?.category || null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create showcase profile: ${error.message}`);
  return transformShowcaseProfile(data);
}

// Update showcase profile
export async function updateShowcaseProfile(
  reportId: string,
  updates: {
    displayName?: string | null;
    tagline?: string | null;
    description?: string | null;
    iconUrl?: string | null;
    screenshotUrl?: string | null;
    category?: ShowcaseCategory | null;
    isPriority?: boolean;
  }
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('showcase_profiles')
    .update({
      display_name: updates.displayName,
      tagline: updates.tagline,
      description: updates.description,
      icon_url: updates.iconUrl,
      screenshot_url: updates.screenshotUrl,
      category: updates.category,
      is_priority: updates.isPriority,
      updated_at: new Date().toISOString(),
    })
    .eq('report_id', reportId);

  if (error) throw new Error(`Failed to update showcase profile: ${error.message}`);
}

// Delete showcase profile
export async function deleteShowcaseProfile(reportId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('showcase_profiles')
    .delete()
    .eq('report_id', reportId);

  if (error) throw new Error(`Failed to delete showcase profile: ${error.message}`);
}

// Enable/disable showcase for a report
export async function setShowcaseEnabled(reportId: string, enabled: boolean): Promise<void> {
  const { error } = await supabaseAdmin
    .from('reports')
    .update({ showcase_enabled: enabled })
    .eq('id', reportId);

  if (error) throw new Error(`Failed to update showcase status: ${error.message}`);
}

// Update showcase rank for a report
export async function updateShowcaseRank(reportId: string, rank: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from('reports')
    .update({ showcase_rank: rank })
    .eq('id', reportId);

  if (error) throw new Error(`Failed to update showcase rank: ${error.message}`);
}

// Increment showcase views
export async function incrementShowcaseViews(reportId: string): Promise<void> {
  const { error } = await supabaseAdmin.rpc('increment_showcase_views', { report_id: reportId });

  // Fallback if RPC doesn't exist
  if (error) {
    await supabaseAdmin
      .from('reports')
      .update({ showcase_views: supabaseAdmin.rpc('increment', { row_id: reportId, column_name: 'showcase_views' }) })
      .eq('id', reportId);
  }
}

// Increment showcase clicks
export async function incrementShowcaseClicks(reportId: string): Promise<void> {
  const { error } = await supabaseAdmin.rpc('increment_showcase_clicks', { report_id: reportId });

  // Fallback if RPC doesn't exist
  if (error) {
    await supabaseAdmin
      .from('reports')
      .update({ showcase_clicks: supabaseAdmin.rpc('increment', { row_id: reportId, column_name: 'showcase_clicks' }) })
      .eq('id', reportId);
  }
}

// Get showcased reports with profiles (for gallery)
export async function getShowcaseEntries(filters: ShowcaseFilters = {}): Promise<ShowcaseEntry[]> {
  const {
    category,
    minScore,
    maxScore,
    search,
    sortBy = 'rank',
    limit = 20,
    offset = 0,
  } = filters;

  // Build query for reports with showcase enabled
  let query = supabaseAdmin
    .from('reports')
    .select(`
      id,
      url,
      overall_score,
      showcase_views,
      showcase_clicks,
      showcase_upvotes,
      showcase_rank,
      created_at,
      showcase_profiles!inner (
        display_name,
        tagline,
        description,
        icon_url,
        screenshot_url,
        category,
        website_url,
        default_name,
        default_tagline,
        default_icon_url,
        is_priority
      )
    `)
    .eq('showcase_enabled', true)
    .eq('is_public', true)
    .eq('status', 'ready');

  // Apply filters
  if (category) {
    query = query.eq('showcase_profiles.category', category);
  }
  if (minScore !== undefined) {
    query = query.gte('overall_score', minScore);
  }
  if (maxScore !== undefined) {
    query = query.lte('overall_score', maxScore);
  }

  // Apply sorting (we'll handle priority sorting after fetch)
  switch (sortBy) {
    case 'score':
      query = query.order('overall_score', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'views':
      query = query.order('showcase_views', { ascending: false });
      break;
    case 'upvotes':
      query = query.order('showcase_upvotes', { ascending: false });
      break;
    case 'rank':
    default:
      query = query.order('showcase_rank', { ascending: false });
      break;
  }

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error('Failed to get showcase entries:', error);
    return [];
  }

  // Transform results into ShowcaseEntry format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries = (data || []).map((row: any) => {
    const profile = row.showcase_profiles;
    console.log('[SUPABASE] Raw profile data:', {
      display_name: profile.display_name,
      is_priority: profile.is_priority
    });
    return {
      reportId: row.id,
      url: row.url,
      overallScore: row.overall_score,
      showcaseViews: row.showcase_views || 0,
      showcaseClicks: row.showcase_clicks || 0,
      showcaseUpvotes: row.showcase_upvotes || 0,
      showcaseRank: row.showcase_rank || 0,
      createdAt: row.created_at,
      // Apply fallbacks for display values
      displayName: profile.display_name || profile.default_name || extractDomainFromUrl(row.url),
      tagline: profile.tagline || profile.default_tagline || 'Analyzed by BrandProbe',
      description: profile.description || null,
      iconUrl: profile.icon_url || profile.default_icon_url || null,
      screenshotUrl: profile.screenshot_url || null,
      category: profile.category,
      websiteUrl: profile.website_url,
      isPriority: profile.is_priority || false,
    };
  }).filter((entry: ShowcaseEntry) => {
    // Apply search filter client-side (for simplicity)
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        entry.displayName.toLowerCase().includes(searchLower) ||
        entry.tagline.toLowerCase().includes(searchLower) ||
        entry.websiteUrl.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Sort with priority showcases first, then by the selected sort order
  return entries.sort((a, b) => {
    // Priority showcases always come first
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    // If both have same priority status, maintain the original sort order from query
    return 0;
  });
}

// Get featured showcase entries (top ranked for homepage)
export async function getFeaturedShowcaseEntries(limit: number = 4): Promise<ShowcaseEntry[]> {
  return getShowcaseEntries({ sortBy: 'rank', limit });
}

// Calculate showcase rank based on various factors
export function calculateShowcaseRank(
  overallScore: number | null,
  createdAt: string,
  showcaseViews: number,
  showcaseClicks: number,
  hasCustomProfile: boolean
): number {
  let rank = 0;

  // Base score (0-100 points)
  rank += overallScore || 0;

  // Profile completeness bonus (+20 points)
  if (hasCustomProfile) {
    rank += 20;
  }

  // Engagement bonus (+20 points max)
  rank += Math.min(showcaseViews / 100, 10);
  rank += Math.min(showcaseClicks / 50, 10);

  // Recency bonus (+20 points, decays over 30 days)
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  rank += Math.max(0, 20 - daysSinceCreated * 0.67);

  return Math.round(rank);
}

// Helper to extract domain from URL
function extractDomainFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

// ============================================
// Showcase Upvotes
// ============================================

// Check if user has upvoted a showcase entry
export async function hasUserUpvoted(reportId: string, email: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('showcase_upvotes')
    .select('id')
    .eq('report_id', reportId)
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to check upvote status:', error);
  }

  return !!data;
}

// Add upvote to showcase entry
export async function addShowcaseUpvote(
  reportId: string,
  email: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  // Check if already upvoted
  const alreadyUpvoted = await hasUserUpvoted(reportId, email);
  if (alreadyUpvoted) {
    return { success: false, error: 'Already upvoted' };
  }

  const { error } = await supabaseAdmin
    .from('showcase_upvotes')
    .insert({
      report_id: reportId,
      email: email,
      user_id: userId || null,
    });

  if (error) {
    console.error('Failed to add upvote:', error);
    return { success: false, error: 'Failed to add upvote' };
  }

  return { success: true };
}

// Remove upvote from showcase entry
export async function removeShowcaseUpvote(
  reportId: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('showcase_upvotes')
    .delete()
    .eq('report_id', reportId)
    .eq('email', email);

  if (error) {
    console.error('Failed to remove upvote:', error);
    return { success: false, error: 'Failed to remove upvote' };
  }

  return { success: true };
}

// Get upvote count for a report
export async function getShowcaseUpvoteCount(reportId: string): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('showcase_upvotes')
    .select('*', { count: 'exact', head: true })
    .eq('report_id', reportId);

  if (error) {
    console.error('Failed to get upvote count:', error);
    return 0;
  }

  return count || 0;
}

// ============================================
// Showcase Comments
// ============================================

import type { ShowcaseComment, ShowcaseCommentInput, ShowcaseDetail } from '@/types/report';

// Get comments for a showcase entry
export async function getShowcaseComments(
  reportId: string,
  sortBy: 'newest' | 'oldest' = 'newest'
): Promise<ShowcaseComment[]> {
  const { data, error } = await supabaseAdmin
    .from('showcase_comments')
    .select('*')
    .eq('report_id', reportId)
    .eq('is_approved', true)
    .eq('is_hidden', false)
    .order('created_at', { ascending: sortBy === 'oldest' });

  if (error) {
    console.error('Failed to get comments:', error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    reportId: row.report_id,
    userId: row.user_id,
    authorName: row.author_name,
    authorEmail: row.author_email,
    authorAvatarUrl: row.author_avatar_url,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

// Add a comment to a showcase entry
export async function addShowcaseComment(
  input: ShowcaseCommentInput,
  userId?: string
): Promise<{ success: boolean; comment?: ShowcaseComment; error?: string }> {
  const { data, error } = await supabaseAdmin
    .from('showcase_comments')
    .insert({
      report_id: input.reportId,
      user_id: userId || null,
      author_name: input.authorName,
      author_email: input.authorEmail,
      content: input.content,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to add comment:', error);
    return { success: false, error: 'Failed to add comment' };
  }

  return {
    success: true,
    comment: {
      id: data.id,
      reportId: data.report_id,
      userId: data.user_id,
      authorName: data.author_name,
      authorEmail: data.author_email,
      authorAvatarUrl: data.author_avatar_url,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
  };
}

// Delete a comment
export async function deleteShowcaseComment(
  commentId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('showcase_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to delete comment:', error);
    return { success: false, error: 'Failed to delete comment' };
  }

  return { success: true };
}

// Get comment count for a report
export async function getShowcaseCommentCount(reportId: string): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('showcase_comments')
    .select('*', { count: 'exact', head: true })
    .eq('report_id', reportId)
    .eq('is_approved', true)
    .eq('is_hidden', false);

  if (error) {
    console.error('Failed to get comment count:', error);
    return 0;
  }

  return count || 0;
}

// ============================================
// Showcase Detail (combined data)
// ============================================

// Get full showcase detail for a single entry
export async function getShowcaseDetail(
  reportId: string,
  userEmail?: string
): Promise<ShowcaseDetail | null> {
  // Get the showcase entry
  const { data, error } = await supabaseAdmin
    .from('reports')
    .select(`
      id,
      url,
      overall_score,
      showcase_views,
      showcase_clicks,
      showcase_upvotes,
      showcase_rank,
      created_at,
      user_id,
      users!inner (
        email,
        display_name,
        company,
        bio,
        website_url,
        twitter_handle,
        linkedin_url
      ),
      showcase_profiles!inner (
        display_name,
        tagline,
        description,
        icon_url,
        screenshot_url,
        category,
        website_url,
        default_name,
        default_tagline,
        default_icon_url,
        is_priority
      )
    `)
    .eq('id', reportId)
    .eq('showcase_enabled', true)
    .eq('is_public', true)
    .eq('status', 'ready')
    .single();

  if (error || !data) {
    console.error('Failed to get showcase detail:', error);
    return null;
  }

  // Get comments
  const comments = await getShowcaseComments(reportId);
  const commentCount = comments.length;

  // Check if user has upvoted
  let hasUpvoted = false;
  if (userEmail) {
    hasUpvoted = await hasUserUpvoted(reportId, userEmail);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = (data as any).showcase_profiles;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (data as any).users;

  // Extract owner name - prefer display_name, fall back to email username
  const ownerEmail = user?.email || '';
  const ownerDisplayName = user?.display_name;
  const ownerName = ownerDisplayName || ownerEmail.split('@')[0] || 'Anonymous';

  // Owner profile info for display
  const ownerCompany = user?.company || null;
  const ownerBio = user?.bio || null;
  const ownerWebsiteUrl = user?.website_url || null;
  const ownerTwitterHandle = user?.twitter_handle || null;
  const ownerLinkedinUrl = user?.linkedin_url || null;

  return {
    reportId: data.id,
    url: data.url,
    overallScore: data.overall_score,
    showcaseViews: data.showcase_views || 0,
    showcaseClicks: data.showcase_clicks || 0,
    showcaseUpvotes: data.showcase_upvotes || 0,
    showcaseRank: data.showcase_rank || 0,
    createdAt: data.created_at,
    displayName: profile.display_name || profile.default_name || extractDomainFromUrl(data.url),
    tagline: profile.tagline || profile.default_tagline || 'Analyzed by BrandProbe',
    description: profile.description || null,
    iconUrl: profile.icon_url || profile.default_icon_url || null,
    screenshotUrl: profile.screenshot_url || null,
    category: profile.category,
    websiteUrl: profile.website_url,
    isPriority: profile.is_priority || false,
    ownerEmail: ownerEmail,
    ownerName: ownerName,
    ownerCompany: ownerCompany,
    ownerBio: ownerBio,
    ownerWebsiteUrl: ownerWebsiteUrl,
    ownerTwitterHandle: ownerTwitterHandle,
    ownerLinkedinUrl: ownerLinkedinUrl,
    comments,
    commentCount,
    hasUpvoted,
  };
}
