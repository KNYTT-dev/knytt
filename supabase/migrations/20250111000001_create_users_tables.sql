-- Create Users Authentication Tables
-- Adds users, user_embeddings, user_interactions, and task_executions tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "vector";

-- =====================================================
-- USERS TABLE (Custom Authentication)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,

    -- Authentication fields
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    last_login TIMESTAMPTZ,
    onboarded BOOLEAN NOT NULL DEFAULT false,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Preferences (JSONB for flexible schema)
    brand_affinities JSONB NOT NULL DEFAULT '{}',
    price_band_min NUMERIC(10, 2),
    price_band_max NUMERIC(10, 2),
    preferred_categories JSONB NOT NULL DEFAULT '[]',
    style_preferences JSONB NOT NULL DEFAULT '{}',

    -- Stats
    total_interactions INTEGER NOT NULL DEFAULT 0
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_external_id ON users(external_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- USER EMBEDDINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Embedding type
    embedding_type VARCHAR(50) NOT NULL,

    -- Legacy embedding (ARRAY format for backward compatibility)
    embedding FLOAT[],

    -- pgvector embeddings (512-dimensional for CLIP ViT-B-32)
    long_term_embedding vector(512),
    session_embedding vector(512),

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_interaction_at TIMESTAMPTZ,

    -- Stats
    interaction_count INTEGER NOT NULL DEFAULT 0,
    confidence_score FLOAT NOT NULL DEFAULT 0.5,

    -- Unique constraint: one embedding per user per type
    CONSTRAINT unique_user_embedding_type UNIQUE (user_id, embedding_type)
);

-- Indexes for user_embeddings
CREATE INDEX IF NOT EXISTS idx_user_embeddings_user_id ON user_embeddings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_embeddings_type ON user_embeddings(embedding_type);
CREATE INDEX IF NOT EXISTS idx_user_embeddings_user_type ON user_embeddings(user_id, embedding_type);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_user_embeddings_updated_at BEFORE UPDATE ON user_embeddings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vector similarity indexes for user embeddings
CREATE INDEX IF NOT EXISTS idx_user_embeddings_long_term ON user_embeddings
    USING ivfflat (long_term_embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_user_embeddings_session ON user_embeddings
    USING ivfflat (session_embedding vector_cosine_ops) WITH (lists = 100);

-- =====================================================
-- USER INTERACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User and product
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    -- Interaction details
    interaction_type VARCHAR(50) NOT NULL,
    rating FLOAT,

    -- Session and context
    session_id VARCHAR(128),
    context VARCHAR(64),
    query VARCHAR(500),
    position INTEGER,

    -- Additional metadata
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Processing flags
    processed_for_embedding BOOLEAN NOT NULL DEFAULT false,
    processed_at TIMESTAMPTZ
);

-- Indexes for user_interactions
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_product_id ON user_interactions(product_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_session_id ON user_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_context ON user_interactions(context);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created_at ON user_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_created ON user_interactions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_user_interactions_session_created ON user_interactions(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type_created ON user_interactions(interaction_type, created_at);
CREATE INDEX IF NOT EXISTS idx_user_interactions_unprocessed ON user_interactions(processed_for_embedding)
    WHERE processed_for_embedding = false;

-- =====================================================
-- TASK EXECUTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS task_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id VARCHAR(255) NOT NULL UNIQUE,
    task_name VARCHAR(255) NOT NULL,
    task_type VARCHAR(100) NOT NULL,

    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    progress_percent INTEGER,
    progress_current INTEGER,
    progress_total INTEGER,
    progress_message TEXT,

    -- Task metadata
    args JSONB,
    kwargs JSONB,
    metadata JSONB,

    -- Execution details
    worker_name VARCHAR(255),
    queue_name VARCHAR(100),
    retries INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER,

    -- Timing
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    -- Results and errors
    result JSONB,
    error TEXT,
    traceback TEXT,

    -- User association (optional)
    user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for task_executions
CREATE INDEX IF NOT EXISTS idx_task_executions_task_id ON task_executions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_executions_task_name ON task_executions(task_name);
CREATE INDEX IF NOT EXISTS idx_task_executions_task_type ON task_executions(task_type);
CREATE INDEX IF NOT EXISTS idx_task_executions_status ON task_executions(status);
CREATE INDEX IF NOT EXISTS idx_task_executions_user_id ON task_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_executions_status_created ON task_executions(status, created_at);
CREATE INDEX IF NOT EXISTS idx_task_executions_type_status ON task_executions(task_type, status);
CREATE INDEX IF NOT EXISTS idx_task_executions_name_created ON task_executions(task_name, created_at);

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts and authentication';
COMMENT ON TABLE user_embeddings IS 'User taste profile embeddings for personalized recommendations';
COMMENT ON TABLE user_interactions IS 'User-product interactions for building embeddings and analytics';
COMMENT ON TABLE task_executions IS 'Celery task execution tracking for monitoring';

COMMENT ON COLUMN users.external_id IS 'External user ID from client system';
COMMENT ON COLUMN users.email IS 'User email address (required for authentication)';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.brand_affinities IS 'Brand preferences: {brand_id: affinity_score}';
COMMENT ON COLUMN users.preferred_categories IS 'List of preferred category IDs';
COMMENT ON COLUMN users.style_preferences IS 'Style tags and preferences';

COMMENT ON COLUMN user_embeddings.embedding_type IS 'Type: long_term, session, cold_start, etc.';
COMMENT ON COLUMN user_embeddings.long_term_embedding IS 'Long-term user taste profile (EWMA of interactions)';
COMMENT ON COLUMN user_embeddings.session_embedding IS 'Current session intent (rolling average)';

COMMENT ON COLUMN user_interactions.interaction_type IS 'Type: view, click, add_to_cart, purchase, like, share, rating';
COMMENT ON COLUMN user_interactions.context IS 'Context: search, feed, similar, recommendation, etc.';
COMMENT ON COLUMN user_interactions.metadata IS 'Additional metadata: page, referrer, device, etc.';

COMMENT ON COLUMN task_executions.status IS 'Task status: PENDING, STARTED, PROGRESS, SUCCESS, FAILURE, REVOKED, RETRY';
