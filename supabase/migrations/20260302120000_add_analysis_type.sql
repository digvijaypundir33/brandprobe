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
