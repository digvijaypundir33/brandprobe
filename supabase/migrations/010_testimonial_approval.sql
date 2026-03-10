-- Add approval workflow columns to testimonials table
ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS submitted_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_by_admin_email VARCHAR(255);

-- Create index for pending testimonials (admin view)
CREATE INDEX IF NOT EXISTS idx_testimonials_pending ON testimonials(is_verified, created_at) WHERE is_active = true;

-- Update existing testimonials to be verified (since they were admin-created)
UPDATE testimonials SET is_verified = true WHERE is_verified = false;

COMMENT ON COLUMN testimonials.is_verified IS 'Whether the testimonial has been verified and approved by an admin';
COMMENT ON COLUMN testimonials.submitted_by_user_id IS 'User who submitted this testimonial (NULL for admin-created)';
COMMENT ON COLUMN testimonials.verified_at IS 'Timestamp when the testimonial was verified by admin';
COMMENT ON COLUMN testimonials.verified_by_admin_email IS 'Email of admin who verified the testimonial';
