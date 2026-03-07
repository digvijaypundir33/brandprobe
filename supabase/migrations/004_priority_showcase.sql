-- Add isPriority field to showcase_profiles table
ALTER TABLE showcase_profiles
ADD COLUMN is_priority BOOLEAN DEFAULT FALSE;

-- Create index for efficient querying of priority showcases
CREATE INDEX idx_showcase_profiles_priority ON showcase_profiles(is_priority) WHERE is_priority = TRUE;

-- Add comment explaining the field
COMMENT ON COLUMN showcase_profiles.is_priority IS 'Whether this showcase has priority/featured status (for Starter/Pro users)';
