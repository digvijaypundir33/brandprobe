-- BrandProbe Initial Database Schema
-- Run this in your Supabase SQL editor or via Supabase CLI

-- Users (simple email-based)
CREATE TABLE users (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                   TEXT UNIQUE NOT NULL,
  stripe_customer_id      TEXT,
  subscription_status     TEXT DEFAULT 'free',  -- free | active | cancelled | past_due
  subscription_id         TEXT,
  reports_used_this_month INT DEFAULT 0,
  reports_limit           INT DEFAULT 1,        -- 1 for free, 10 for paid
  current_period_start    TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Sites (tracks URLs for re-scanning)
CREATE TABLE sites (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  url               TEXT NOT NULL,
  domain            TEXT NOT NULL,
  is_primary        BOOLEAN DEFAULT false,      -- Primary site for auto re-scan
  first_scanned_at  TIMESTAMPTZ DEFAULT NOW(),
  last_scanned_at   TIMESTAMPTZ,
  total_scans       INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, url)
);

-- Reports (linked to sites for history tracking)
CREATE TABLE reports (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID REFERENCES users(id) ON DELETE CASCADE,
  site_id                   UUID REFERENCES sites(id) ON DELETE CASCADE,
  url                       TEXT NOT NULL,
  status                    TEXT DEFAULT 'scanning',  -- scanning | ready | failed

  -- Scraped data
  scraped_data              JSONB,

  -- Report sections (ALL generated, visibility controlled in frontend)
  messaging_analysis        JSONB,        -- Section 1 (FREE)
  seo_opportunities         JSONB,        -- Section 2 (FREE)
  content_strategy          JSONB,        -- Section 3 (PAID)
  ad_angles                 JSONB,        -- Section 4 (PAID)
  conversion_optimization   JSONB,        -- Section 5 (PAID)
  distribution_strategy     JSONB,        -- Section 6 (PAID)
  ai_search_visibility      JSONB,        -- Section 7 (FREE) - AEO Score
  technical_performance     JSONB,        -- Section 8 (FREE) - Technical SEO
  brand_health              JSONB,        -- Section 9 (FREE) - Brand Health

  -- Scores (ALL visible to free users)
  overall_score             INT,
  messaging_score           INT,
  seo_score                 INT,
  content_score             INT,
  ads_score                 INT,
  conversion_score          INT,
  distribution_score        INT,
  ai_search_score           INT,
  technical_score           INT,
  brand_health_score        INT,

  -- Progress tracking
  previous_overall_score    INT,          -- Score from last scan of same site
  score_change              INT,          -- Delta from previous

  -- Meta
  scan_time_ms              INT,
  is_auto_rescan            BOOLEAN DEFAULT false,
  created_at                TIMESTAMPTZ DEFAULT NOW()
);

-- Report views (simple analytics)
CREATE TABLE report_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id   UUID REFERENCES reports(id) ON DELETE CASCADE,
  viewed_at   TIMESTAMPTZ DEFAULT NOW(),
  source      TEXT  -- direct | shared | email
);

-- Indexes for performance
CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_site ON reports(site_id);
CREATE INDEX idx_reports_url ON reports(url);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_sites_user ON sites(user_id);
CREATE INDEX idx_sites_primary ON sites(user_id, is_primary) WHERE is_primary = true;
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe ON users(stripe_customer_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies (permissive for now, tighten as needed)

-- Users can read/update their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- Sites policies
CREATE POLICY "Users can view own sites" ON sites
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own sites" ON sites
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own sites" ON sites
  FOR UPDATE USING (true);

-- Reports policies
CREATE POLICY "Anyone can view reports" ON reports
  FOR SELECT USING (true);

CREATE POLICY "Users can insert reports" ON reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own reports" ON reports
  FOR UPDATE USING (true);

-- Report views policies
CREATE POLICY "Anyone can insert report views" ON report_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view report views" ON report_views
  FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
-- Add Design Authenticity columns to reports table
-- This adds AI design pattern detection similar to detectsiteai.com

ALTER TABLE reports ADD COLUMN design_authenticity JSONB;
ALTER TABLE reports ADD COLUMN design_authenticity_score INT;

-- Add comment for documentation
COMMENT ON COLUMN reports.design_authenticity IS 'AI design pattern detection analysis (free tier)';
COMMENT ON COLUMN reports.design_authenticity_score IS 'Design authenticity score 0-100';
-- Add analysis_type and pages_analyzed columns to reports table
-- This supports Quick (1 page) vs Full (4 pages) analysis modes

-- Add analysis_type column (default to 'full' for backward compatibility)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS analysis_type TEXT DEFAULT 'full';

-- Add pages_analyzed column to track actual pages scraped
ALTER TABLE reports ADD COLUMN IF NOT EXISTS pages_analyzed INT;

-- Add comments for documentation
COMMENT ON COLUMN reports.analysis_type IS 'Analysis mode: quick (1 page) or full (4 pages)';
COMMENT ON COLUMN reports.pages_analyzed IS 'Actual number of pages scraped and analyzed';

-- Add check constraint to ensure valid analysis types
ALTER TABLE reports ADD CONSTRAINT valid_analysis_type
  CHECK (analysis_type IN ('quick', 'full'));

-- Create index for filtering by analysis type
CREATE INDEX IF NOT EXISTS idx_reports_analysis_type ON reports(analysis_type);
-- Create brand_recognition_cache table
-- Caches dynamic brand recognition results for 30 days to improve performance

CREATE TABLE IF NOT EXISTS brand_recognition_cache (
  -- Primary key: domain name
  domain TEXT PRIMARY KEY,

  -- Recognition results
  is_major_brand BOOLEAN NOT NULL,
  confidence TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'low')),

  -- Detection signals (domain-age-15y+, enterprise-cdn, wikipedia-page, etc.)
  signals JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Baseline scores for major brands
  baseline_scores JSONB,

  -- Suggested URLs for login-walled brands
  suggested_urls TEXT[],

  -- Cache metadata
  cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',

  -- Track cache hits for analytics
  hits INT DEFAULT 0,
  last_hit_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_brand_cache_expires ON brand_recognition_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_brand_cache_major_brands ON brand_recognition_cache(is_major_brand) WHERE is_major_brand = true;

-- Comments for documentation
COMMENT ON TABLE brand_recognition_cache IS 'Caches dynamic brand recognition results to avoid repeated API calls';
COMMENT ON COLUMN brand_recognition_cache.domain IS 'Domain without www prefix (e.g., facebook.com)';
COMMENT ON COLUMN brand_recognition_cache.signals IS 'Array of detection signals like ["domain-age-15y+", "enterprise-cdn"]';
COMMENT ON COLUMN brand_recognition_cache.baseline_scores IS 'JSON object with technical, brandHealth, messaging, designAuth scores';
COMMENT ON COLUMN brand_recognition_cache.expires_at IS 'Cache entries expire after 30 days';

-- Function to automatically update last_hit_at on cache reads
CREATE OR REPLACE FUNCTION update_brand_cache_hit()
RETURNS TRIGGER AS $$
BEGIN
  NEW.hits := OLD.hits + 1;
  NEW.last_hit_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to track cache hits (optional - for analytics)
CREATE TRIGGER brand_cache_hit_trigger
  BEFORE UPDATE ON brand_recognition_cache
  FOR EACH ROW
  WHEN (OLD.hits IS DISTINCT FROM NEW.hits OR OLD.last_hit_at IS DISTINCT FROM NEW.last_hit_at)
  EXECUTE FUNCTION update_brand_cache_hit();
-- Magic link verification tokens
CREATE TABLE magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Indexes for fast lookup
CREATE INDEX idx_magic_links_token ON magic_links(token) WHERE used_at IS NULL;
CREATE INDEX idx_magic_links_email ON magic_links(email);
CREATE INDEX idx_magic_links_expires ON magic_links(expires_at) WHERE used_at IS NULL;
CREATE INDEX idx_magic_links_report ON magic_links(report_id);

-- Function to clean up expired tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_magic_links()
RETURNS void AS $$
BEGIN
  DELETE FROM magic_links
  WHERE expires_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Add email_verified flag to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
-- Add starter tier support to users table
-- This allows tracking of one-time $9 purchases

-- Update subscription_status to support 'starter' tier
-- Note: This is a data-level change, no schema change needed since we use TEXT type
-- The TypeScript type has been updated to include 'starter'

-- Migration to add comment for documentation
COMMENT ON COLUMN users.subscription_status IS 'Subscription status: free | starter | active | cancelled | past_due. Starter = one-time $9 purchase.';

-- Add index for faster filtering by subscription status
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- Optional: Add a one_time_purchase_id column to track Stripe payment intent
ALTER TABLE users ADD COLUMN IF NOT EXISTS one_time_purchase_id TEXT;
COMMENT ON COLUMN users.one_time_purchase_id IS 'Stripe Payment Intent ID for one-time $9 purchase (starter tier)';
-- Drop report_shares table and related objects
DROP TABLE IF EXISTS report_shares CASCADE;
-- Add is_public column to reports table
-- Default to true (public) for existing reports
ALTER TABLE reports ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Add index for faster filtering
CREATE INDEX IF NOT EXISTS idx_reports_is_public ON reports(is_public);

-- Add comment
COMMENT ON COLUMN reports.is_public IS 'Whether the report is publicly viewable (true) or private to owner only (false)';
