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
