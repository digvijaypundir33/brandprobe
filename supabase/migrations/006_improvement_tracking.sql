-- Migration: 006_improvement_tracking.sql
-- Feature: Track score improvements across rescans
--
-- This migration adds support for:
-- 1. Section-level score tracking (Phase 1)
-- 2. Issue comparison results (Phase 2)
-- 3. Scan numbering for history (Phase 3)

-- ===========================================
-- Phase 1: Section-Level Score Tracking
-- ===========================================

-- Store previous section scores from the last scan
ALTER TABLE reports ADD COLUMN IF NOT EXISTS previous_section_scores JSONB;
COMMENT ON COLUMN reports.previous_section_scores IS 'Section scores from the previous scan of the same site. Format: {"messaging": 45, "seo": 62, ...}';

-- Store the delta/change for each section
ALTER TABLE reports ADD COLUMN IF NOT EXISTS section_score_changes JSONB;
COMMENT ON COLUMN reports.section_score_changes IS 'Score change per section from previous scan. Format: {"messaging": 5, "seo": -3, ...}';

-- Index for querying reports with improvements
CREATE INDEX IF NOT EXISTS idx_reports_section_changes ON reports USING GIN (section_score_changes) WHERE section_score_changes IS NOT NULL;

-- ===========================================
-- Phase 2: Issue Comparison Results
-- ===========================================

-- Store AI-computed issue comparison results
ALTER TABLE reports ADD COLUMN IF NOT EXISTS issue_comparison JSONB;
COMMENT ON COLUMN reports.issue_comparison IS 'AI-compared issues between scans. Format: {"resolved": [...], "new": [...], "persisting": [...]}';

-- ===========================================
-- Phase 3: Scan History Support
-- ===========================================

-- Add scan number (auto-incremented per site)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS scan_number INT DEFAULT 1;
COMMENT ON COLUMN reports.scan_number IS 'Sequential scan number for this site (1 = first scan, 2 = first rescan, etc.)';

-- Function to auto-assign scan number based on site_id
CREATE OR REPLACE FUNCTION set_report_scan_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set if not already set (allows manual override)
  IF NEW.scan_number IS NULL OR NEW.scan_number = 1 THEN
    SELECT COALESCE(MAX(scan_number), 0) + 1 INTO NEW.scan_number
    FROM reports
    WHERE site_id = NEW.site_id AND id != NEW.id;

    -- Ensure at least 1
    IF NEW.scan_number IS NULL THEN
      NEW.scan_number := 1;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-set scan_number on insert
DROP TRIGGER IF EXISTS auto_scan_number ON reports;
CREATE TRIGGER auto_scan_number
  BEFORE INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION set_report_scan_number();

-- Index for efficient history queries (all reports for a site, ordered by date)
CREATE INDEX IF NOT EXISTS idx_reports_site_created ON reports(site_id, created_at DESC) WHERE site_id IS NOT NULL;

-- Index for scan number ordering
CREATE INDEX IF NOT EXISTS idx_reports_site_scan_number ON reports(site_id, scan_number) WHERE site_id IS NOT NULL;

-- ===========================================
-- Update existing reports with scan numbers
-- ===========================================

-- For existing reports, assign scan numbers based on creation order within each site
WITH numbered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY site_id ORDER BY created_at ASC) as calc_scan_number
  FROM reports
  WHERE site_id IS NOT NULL
)
UPDATE reports r
SET scan_number = n.calc_scan_number
FROM numbered n
WHERE r.id = n.id AND r.site_id IS NOT NULL;

-- Set scan_number = 1 for reports without site_id
UPDATE reports SET scan_number = 1 WHERE scan_number IS NULL;
