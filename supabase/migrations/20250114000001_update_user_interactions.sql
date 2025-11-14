-- Update user_interactions table to match current model
-- Add missing columns and update references

-- 1. Add missing columns
ALTER TABLE user_interactions
  ADD COLUMN IF NOT EXISTS rating FLOAT CHECK (rating >= 0 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS query VARCHAR(500),
  ADD COLUMN IF NOT EXISTS position INTEGER,
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS processed_for_embedding BOOLEAN DEFAULT FALSE;

-- 2. Update the user_id foreign key reference to use the custom users table
-- First, drop the existing foreign key constraint
ALTER TABLE user_interactions
  DROP CONSTRAINT IF EXISTS user_interactions_user_id_fkey;

-- Add new foreign key constraint referencing the custom users table
ALTER TABLE user_interactions
  ADD CONSTRAINT user_interactions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 3. Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_interactions_rating ON user_interactions(rating) WHERE rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_interactions_query ON user_interactions(query) WHERE query IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_interactions_position ON user_interactions(position) WHERE position IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_interactions_processed ON user_interactions(processed_for_embedding);

-- 4. Add comments for documentation
COMMENT ON COLUMN user_interactions.rating IS 'Rating value (0-5) for rating interactions';
COMMENT ON COLUMN user_interactions.metadata IS 'Additional metadata: page, referrer, device, etc.';
COMMENT ON COLUMN user_interactions.query IS 'Search query that led to this interaction';
COMMENT ON COLUMN user_interactions.position IS 'Position of product in results (for CTR analysis)';
COMMENT ON COLUMN user_interactions.processed_at IS 'Timestamp when interaction was processed for embeddings';
COMMENT ON COLUMN user_interactions.processed_for_embedding IS 'Whether this interaction has been processed for user embedding';
