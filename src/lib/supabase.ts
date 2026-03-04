import { createClient } from '@supabase/supabase-js';
import type { Report, User, Site } from '@/types/report';

// Determine environment and get appropriate Supabase credentials
const isLocal = process.env.NEXT_PUBLIC_SUPABASE_ENV === 'local';

const supabaseUrl = isLocal
  ? process.env.NEXT_PUBLIC_SUPABASE_LOCAL_URL!
  : process.env.NEXT_PUBLIC_SUPABASE_PROD_URL!;

const supabaseAnonKey = isLocal
  ? process.env.NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY!
  : process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY!;

const supabaseServiceRoleKey = isLocal
  ? process.env.SUPABASE_LOCAL_SERVICE_ROLE_KEY!
  : process.env.SUPABASE_PROD_SERVICE_ROLE_KEY!;

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
    scanTimeMs: row.scan_time_ms as number | null,
    isAutoRescan: row.is_auto_rescan as boolean,
    isPublic: row.is_public !== false, // Default to true (public) if not set
    createdAt: row.created_at as string,
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
