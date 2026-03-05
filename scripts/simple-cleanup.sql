-- ============================================
-- SIMPLE DATABASE CLEANUP
-- ============================================
-- Copy and paste into Supabase SQL Editor
-- ============================================


-- ============================================
-- 1. SELECT ALL DATA (View everything first)
-- ============================================

-- All users
SELECT * FROM users;

-- All reports with user email
SELECT
  r.id,
  r.url,
  r.status,
  r.created_at,
  u.email
FROM reports r
LEFT JOIN users u ON r.user_id = u.id;

-- All magic links
SELECT * FROM magic_links;

-- All sites
SELECT * FROM sites;

-- All report views
SELECT * FROM report_views;

-- All brand cache
SELECT * FROM brand_recognition_cache;


-- ============================================
-- 2. COUNT ALL DATA
-- ============================================

SELECT
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM reports) as reports,
  (SELECT COUNT(*) FROM magic_links) as magic_links,
  (SELECT COUNT(*) FROM sites) as sites,
  (SELECT COUNT(*) FROM report_views) as report_views,
  (SELECT COUNT(*) FROM brand_recognition_cache) as brand_cache;


-- ============================================
-- 3. DELETE ALL DATA (Uncomment to run)
-- ============================================

-- Delete in order (respects foreign keys)

-- DELETE FROM report_views;
-- DELETE FROM magic_links;
-- DELETE FROM reports;
-- DELETE FROM sites;
-- DELETE FROM users;
-- DELETE FROM brand_recognition_cache;


-- ============================================
-- 4. VERIFY EMPTY (Run after delete)
-- ============================================

SELECT
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM reports) as reports,
  (SELECT COUNT(*) FROM magic_links) as magic_links,
  (SELECT COUNT(*) FROM sites) as sites,
  (SELECT COUNT(*) FROM report_views) as report_views,
  (SELECT COUNT(*) FROM brand_recognition_cache) as brand_cache;

-- All should show 0
