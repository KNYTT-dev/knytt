-- Migration: Create product_embeddings table
-- Date: 2025-11-15
-- Description: Create normalized table for storing product embeddings

-- Create product_embeddings table
CREATE TABLE IF NOT EXISTS product_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    -- Embedding type (text, image, or multimodal)
    embedding_type VARCHAR(50) NOT NULL,

    -- Legacy embedding (array format)
    embedding FLOAT[] NULL,

    -- pgvector embedding (512-dimensional)
    embedding_vector vector(512) NULL,

    -- Metadata
    model_version VARCHAR(50) NOT NULL DEFAULT 'ViT-B/32',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Unique constraint: one embedding per product per type
    CONSTRAINT unique_product_embedding UNIQUE (product_id, embedding_type)
);

-- Create index on product_id and embedding_type
CREATE INDEX IF NOT EXISTS idx_product_embeddings_product_type
ON product_embeddings(product_id, embedding_type);

-- Create index on embedding_type for filtering
CREATE INDEX IF NOT EXISTS idx_product_embeddings_type
ON product_embeddings(embedding_type);

-- Add comment
COMMENT ON TABLE product_embeddings IS 'Normalized table for storing product embeddings with version control';
COMMENT ON COLUMN product_embeddings.embedding_type IS 'Type of embedding: text, image, or multimodal';
COMMENT ON COLUMN product_embeddings.embedding IS 'Legacy embedding in array format';
COMMENT ON COLUMN product_embeddings.embedding_vector IS 'pgvector embedding (512-dimensional)';
