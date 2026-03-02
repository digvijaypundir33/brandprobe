-- Add Design Authenticity columns to reports table
-- This adds AI design pattern detection similar to detectsiteai.com

ALTER TABLE reports ADD COLUMN design_authenticity JSONB;
ALTER TABLE reports ADD COLUMN design_authenticity_score INT;

-- Add comment for documentation
COMMENT ON COLUMN reports.design_authenticity IS 'AI design pattern detection analysis (free tier)';
COMMENT ON COLUMN reports.design_authenticity_score IS 'Design authenticity score 0-100';
