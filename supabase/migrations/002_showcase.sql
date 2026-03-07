-- BrandProbe Showcase Feature Migration
-- Allows users to showcase their analyzed websites on a public directory

-- ============================================
-- 1. Add showcase columns to reports table
-- ============================================

-- Enable showcase for this report
ALTER TABLE reports ADD COLUMN IF NOT EXISTS showcase_enabled BOOLEAN DEFAULT false;

-- Ranking score for sorting (higher = better placement)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS showcase_rank INT DEFAULT 0;

-- Track showcase-specific analytics
ALTER TABLE reports ADD COLUMN IF NOT EXISTS showcase_views INT DEFAULT 0;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS showcase_clicks INT DEFAULT 0;

-- ============================================
-- 2. Create showcase_profiles table
-- ============================================

CREATE TABLE IF NOT EXISTS showcase_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id         UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Display Information (user-editable)
  display_name      TEXT,                    -- App/Company name (default: extracted from site)
  tagline           TEXT,                    -- Short description (max 120 chars)
  description       TEXT,                    -- Longer description (max 500 chars)
  icon_url          TEXT,                    -- App icon URL (default: favicon)
  screenshot_url    TEXT,                    -- Hero screenshot (default: scraped screenshot)
  category          TEXT,                    -- Business category (SaaS, E-commerce, Agency, etc.)

  -- Auto-extracted defaults (populated from report's scraped data)
  default_name      TEXT,                    -- Auto-extracted from scraped_data.title
  default_tagline   TEXT,                    -- Auto-extracted from meta description
  default_icon_url  TEXT,                    -- Favicon URL from site

  -- The analyzed website URL
  website_url       TEXT NOT NULL,

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),

  -- One profile per report
  UNIQUE(report_id)
);

-- ============================================
-- 3. Create indexes for showcase queries
-- ============================================

-- Index for listing showcased reports (sorted by rank)
CREATE INDEX IF NOT EXISTS idx_reports_showcase_enabled
  ON reports(showcase_enabled, showcase_rank DESC)
  WHERE showcase_enabled = true AND is_public = true AND status = 'ready';

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_showcase_profiles_category
  ON showcase_profiles(category);

-- Index for user's showcase profiles
CREATE INDEX IF NOT EXISTS idx_showcase_profiles_user
  ON showcase_profiles(user_id);

-- Index for report lookup
CREATE INDEX IF NOT EXISTS idx_showcase_profiles_report
  ON showcase_profiles(report_id);

-- ============================================
-- 4. Enable RLS on showcase_profiles
-- ============================================

ALTER TABLE showcase_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view showcase profiles (they're public)
CREATE POLICY "Anyone can view showcase profiles" ON showcase_profiles
  FOR SELECT USING (true);

-- Users can insert their own showcase profiles
CREATE POLICY "Users can insert own showcase profiles" ON showcase_profiles
  FOR INSERT WITH CHECK (true);

-- Users can update their own showcase profiles
CREATE POLICY "Users can update own showcase profiles" ON showcase_profiles
  FOR UPDATE USING (true);

-- Users can delete their own showcase profiles
CREATE POLICY "Users can delete own showcase profiles" ON showcase_profiles
  FOR DELETE USING (true);

-- ============================================
-- 5. Trigger to update updated_at
-- ============================================

CREATE TRIGGER update_showcase_profiles_updated_at
  BEFORE UPDATE ON showcase_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. Comments for documentation
-- ============================================

COMMENT ON TABLE showcase_profiles IS 'User-customizable profiles for showcasing analyzed websites';
COMMENT ON COLUMN showcase_profiles.display_name IS 'Custom display name (overrides default_name)';
COMMENT ON COLUMN showcase_profiles.tagline IS 'Short tagline, max 120 chars';
COMMENT ON COLUMN showcase_profiles.description IS 'Longer description, max 500 chars';
COMMENT ON COLUMN showcase_profiles.category IS 'Business category: SaaS, E-commerce, Agency, Portfolio, Startup, Blog/Media, Non-profit, Local Business, Other';
COMMENT ON COLUMN reports.showcase_enabled IS 'Whether this report is visible on the showcase directory';
COMMENT ON COLUMN reports.showcase_rank IS 'Ranking score for sorting (based on overall_score, recency, engagement)';
COMMENT ON COLUMN reports.showcase_views IS 'Number of times this listing was viewed on showcase';
COMMENT ON COLUMN reports.showcase_clicks IS 'Number of click-throughs to the full report';
