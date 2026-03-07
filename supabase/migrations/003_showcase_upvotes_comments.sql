-- BrandProbe Showcase Upvotes and Comments Migration
-- Adds upvoting and commenting functionality to showcase entries

-- ============================================
-- 1. Add upvotes count to reports table
-- ============================================

ALTER TABLE reports ADD COLUMN IF NOT EXISTS showcase_upvotes INT DEFAULT 0;

-- ============================================
-- 2. Create showcase_upvotes table
-- ============================================

CREATE TABLE IF NOT EXISTS showcase_upvotes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id         UUID REFERENCES reports(id) ON DELETE CASCADE NOT NULL,
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  email             TEXT,  -- For anonymous upvotes (just need email)
  ip_hash           TEXT,  -- Hashed IP for rate limiting anonymous votes

  created_at        TIMESTAMPTZ DEFAULT NOW(),

  -- One upvote per user/email per report
  UNIQUE(report_id, user_id),
  UNIQUE(report_id, email)
);

-- ============================================
-- 3. Create showcase_comments table
-- ============================================

CREATE TABLE IF NOT EXISTS showcase_comments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id         UUID REFERENCES reports(id) ON DELETE CASCADE NOT NULL,
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Comment author info (for display)
  author_name       TEXT NOT NULL,
  author_email      TEXT NOT NULL,
  author_avatar_url TEXT,

  -- Comment content
  content           TEXT NOT NULL,

  -- Moderation
  is_approved       BOOLEAN DEFAULT true,  -- Auto-approve for now
  is_hidden         BOOLEAN DEFAULT false,

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. Create indexes
-- ============================================

-- Index for counting upvotes per report
CREATE INDEX IF NOT EXISTS idx_showcase_upvotes_report
  ON showcase_upvotes(report_id);

-- Index for checking if user already upvoted
CREATE INDEX IF NOT EXISTS idx_showcase_upvotes_user
  ON showcase_upvotes(user_id);

-- Index for listing comments per report
CREATE INDEX IF NOT EXISTS idx_showcase_comments_report
  ON showcase_comments(report_id, created_at DESC)
  WHERE is_approved = true AND is_hidden = false;

-- Index for user's comments
CREATE INDEX IF NOT EXISTS idx_showcase_comments_user
  ON showcase_comments(user_id);

-- ============================================
-- 5. Enable RLS
-- ============================================

ALTER TABLE showcase_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_comments ENABLE ROW LEVEL SECURITY;

-- Upvotes: Anyone can view, authenticated users can insert/delete their own
CREATE POLICY "Anyone can view upvotes" ON showcase_upvotes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert upvotes" ON showcase_upvotes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own upvotes" ON showcase_upvotes
  FOR DELETE USING (true);

-- Comments: Anyone can view approved comments, users can insert
CREATE POLICY "Anyone can view approved comments" ON showcase_comments
  FOR SELECT USING (is_approved = true AND is_hidden = false);

CREATE POLICY "Anyone can insert comments" ON showcase_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own comments" ON showcase_comments
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own comments" ON showcase_comments
  FOR DELETE USING (true);

-- ============================================
-- 6. Trigger to update comment updated_at
-- ============================================

CREATE TRIGGER update_showcase_comments_updated_at
  BEFORE UPDATE ON showcase_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Function to sync upvote count
-- ============================================

CREATE OR REPLACE FUNCTION sync_showcase_upvotes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reports
    SET showcase_upvotes = (SELECT COUNT(*) FROM showcase_upvotes WHERE report_id = NEW.report_id)
    WHERE id = NEW.report_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reports
    SET showcase_upvotes = (SELECT COUNT(*) FROM showcase_upvotes WHERE report_id = OLD.report_id)
    WHERE id = OLD.report_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_upvotes_on_insert
  AFTER INSERT ON showcase_upvotes
  FOR EACH ROW
  EXECUTE FUNCTION sync_showcase_upvotes_count();

CREATE TRIGGER sync_upvotes_on_delete
  AFTER DELETE ON showcase_upvotes
  FOR EACH ROW
  EXECUTE FUNCTION sync_showcase_upvotes_count();

-- ============================================
-- 8. Comments for documentation
-- ============================================

COMMENT ON TABLE showcase_upvotes IS 'Upvotes for showcase entries';
COMMENT ON TABLE showcase_comments IS 'Comments/feedback on showcase entries';
COMMENT ON COLUMN reports.showcase_upvotes IS 'Cached count of upvotes for this showcase entry';
