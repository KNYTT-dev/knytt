-- Create Users and Task Executions Tables
-- Minimal migration to add only missing tables without conflicting with existing schemas

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
COMMENT ON TABLE task_executions IS 'Celery task execution tracking for monitoring';

COMMENT ON COLUMN users.external_id IS 'External user ID from client system';
COMMENT ON COLUMN users.email IS 'User email address (required for authentication)';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.brand_affinities IS 'Brand preferences: {brand_id: affinity_score}';
COMMENT ON COLUMN users.preferred_categories IS 'List of preferred category IDs';
COMMENT ON COLUMN users.style_preferences IS 'Style tags and preferences';

COMMENT ON COLUMN task_executions.status IS 'Task status: PENDING, STARTED, PROGRESS, SUCCESS, FAILURE, REVOKED, RETRY';
