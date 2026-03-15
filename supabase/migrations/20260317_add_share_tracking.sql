-- Add share tracking columns to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS share_image_url TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS last_shared_at TIMESTAMP;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_reports_share_image_url ON reports(share_image_url);
CREATE INDEX IF NOT EXISTS idx_reports_share_count ON reports(share_count DESC);

-- Update existing reports to have share_count = 0
UPDATE reports SET share_count = 0 WHERE share_count IS NULL;
