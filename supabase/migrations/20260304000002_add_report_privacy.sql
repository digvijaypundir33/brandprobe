-- Add is_public column to reports table
-- Default to true (public) for existing reports
ALTER TABLE reports ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Add index for faster filtering
CREATE INDEX IF NOT EXISTS idx_reports_is_public ON reports(is_public);

-- Add comment
COMMENT ON COLUMN reports.is_public IS 'Whether the report is publicly viewable (true) or private to owner only (false)';
