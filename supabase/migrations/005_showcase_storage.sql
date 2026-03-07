-- BrandProbe Showcase Storage Migration
-- Sets up RLS policies for showcase images bucket

-- ============================================
-- IMPORTANT: Manual Setup Required First!
-- ============================================
-- Before running this migration, create the storage bucket manually:
--
-- 1. Go to Supabase Dashboard → Storage
-- 2. Click "New bucket"
-- 3. Configure:
--    - Name: showcase-images
--    - Public: YES (checked)
--    - File size limit: 5242880 (5MB)
--    - Allowed MIME types: image/png, image/jpeg, image/jpg, image/webp, image/gif
-- 4. Click "Create bucket"
-- 5. Then run this migration to set up RLS policies
--
-- Why? Direct INSERT into storage.buckets requires superuser permissions.
-- Creating via Dashboard/CLI is the recommended approach.
-- ============================================

-- ============================================
-- RLS Policies for showcase-images bucket
-- ============================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Anyone can view showcase images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload showcase images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own showcase images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own showcase images" ON storage.objects;

-- Allow anyone to read showcase images (public bucket)
CREATE POLICY "Anyone can view showcase images"
ON storage.objects FOR SELECT
USING (bucket_id = 'showcase-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload showcase images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'showcase-images'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own showcase images
CREATE POLICY "Users can update their own showcase images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'showcase-images'
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own showcase images
CREATE POLICY "Users can delete their own showcase images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'showcase-images'
  AND auth.role() = 'authenticated'
);

-- ============================================
-- Verification Query (run after migration)
-- ============================================
-- Verify bucket exists: SELECT * FROM storage.buckets WHERE id = 'showcase-images';
-- Verify policies: SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%showcase%';
