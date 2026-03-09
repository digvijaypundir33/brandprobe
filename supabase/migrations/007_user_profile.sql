-- Add user profile fields for showcase and display purposes
-- This allows users to personalize their profile beyond just email

-- Add display name (shown on showcases instead of email)
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT;
COMMENT ON COLUMN users.display_name IS 'User display name shown on showcases and public profiles';

-- Add company name
ALTER TABLE users ADD COLUMN IF NOT EXISTS company TEXT;
COMMENT ON COLUMN users.company IS 'User company or organization name';

-- Add avatar URL (for profile picture)
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
COMMENT ON COLUMN users.avatar_url IS 'URL to user avatar/profile picture';

-- Add bio (short description)
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
COMMENT ON COLUMN users.bio IS 'Short user bio (max 200 chars recommended)';

-- Add website URL (personal/company website)
ALTER TABLE users ADD COLUMN IF NOT EXISTS website_url TEXT;
COMMENT ON COLUMN users.website_url IS 'User personal or company website URL';

-- Add Twitter/X handle
ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter_handle TEXT;
COMMENT ON COLUMN users.twitter_handle IS 'Twitter/X handle without @ symbol';

-- Add LinkedIn URL
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
COMMENT ON COLUMN users.linkedin_url IS 'LinkedIn profile URL';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_display_name ON users(display_name);
