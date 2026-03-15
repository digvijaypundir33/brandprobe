-- Add error handling fields to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS error_timestamp TIMESTAMPTZ;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for finding stuck reports
CREATE INDEX IF NOT EXISTS idx_reports_stuck ON reports(status, last_activity_at)
WHERE status = 'scanning';

-- Function to automatically mark stuck reports as failed
-- A report is considered stuck if it's been in 'scanning' status for more than 10 minutes
CREATE OR REPLACE FUNCTION mark_stuck_reports_as_failed()
RETURNS TABLE(report_id UUID, report_url TEXT, stuck_duration INTERVAL) AS $$
BEGIN
  RETURN QUERY
  UPDATE reports
  SET
    status = 'failed',
    error_message = 'Report generation timed out. The scan took too long to complete. Please try again.',
    error_timestamp = NOW()
  WHERE
    status = 'scanning'
    AND (last_activity_at IS NULL OR NOW() - last_activity_at > INTERVAL '10 minutes')
  RETURNING id, url, NOW() - COALESCE(last_activity_at, created_at);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_activity_at when report is updated
CREATE OR REPLACE FUNCTION update_report_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER report_activity_trigger
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_report_activity();

-- Fix the current stuck wrexer.com report
UPDATE reports
SET
  status = 'failed',
  error_message = 'Report generation timed out. Please try scanning again.',
  error_timestamp = NOW()
WHERE id = 'd1b8413b-caee-470a-8267-341e8a02f48a'
  AND status = 'scanning';

-- Comment: You can manually run mark_stuck_reports_as_failed() anytime to clean up stuck reports
-- Or set up a pg_cron job to run it periodically (requires pg_cron extension)
