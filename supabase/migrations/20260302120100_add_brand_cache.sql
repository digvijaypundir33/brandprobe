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
