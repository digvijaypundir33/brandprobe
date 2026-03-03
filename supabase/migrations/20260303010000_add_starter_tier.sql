-- Add starter tier support to users table
-- This allows tracking of one-time $9 purchases

-- Update subscription_status to support 'starter' tier
-- Note: This is a data-level change, no schema change needed since we use TEXT type
-- The TypeScript type has been updated to include 'starter'

-- Migration to add comment for documentation
COMMENT ON COLUMN users.subscription_status IS 'Subscription status: free | starter | active | cancelled | past_due. Starter = one-time $9 purchase.';

-- Add index for faster filtering by subscription status
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- Optional: Add a one_time_purchase_id column to track Stripe payment intent
ALTER TABLE users ADD COLUMN IF NOT EXISTS one_time_purchase_id TEXT;
COMMENT ON COLUMN users.one_time_purchase_id IS 'Stripe Payment Intent ID for one-time $9 purchase (starter tier)';
