-- Migration: Update products and ingestion_logs table schema
-- Date: 2025-11-15
-- Description: Add missing columns to match SQLAlchemy models

-- =====================================================
-- PRODUCTS TABLE UPDATES
-- =====================================================

-- Add merchant columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS merchant_product_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS merchant_id INTEGER,
  ADD COLUMN IF NOT EXISTS merchant_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS aw_product_id VARCHAR(255);

-- Rename columns to match model (create new columns, migrate data later)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_name TEXT,
  ADD COLUMN IF NOT EXISTS brand_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS brand_id INTEGER;

-- Add category columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS category_id INTEGER,
  ADD COLUMN IF NOT EXISTS merchant_category VARCHAR(255);

-- Add pricing columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS search_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS store_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS rrp_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS delivery_cost NUMERIC(10,2);

-- Add image columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS merchant_image_url TEXT,
  ADD COLUMN IF NOT EXISTS aw_image_url TEXT,
  ADD COLUMN IF NOT EXISTS large_image TEXT,
  ADD COLUMN IF NOT EXISTS alternate_images JSONB DEFAULT '[]';

-- Add fashion attributes
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS fashion_suitable_for VARCHAR(100),
  ADD COLUMN IF NOT EXISTS fashion_category VARCHAR(100),
  ADD COLUMN IF NOT EXISTS fashion_size TEXT,
  ADD COLUMN IF NOT EXISTS fashion_material TEXT,
  ADD COLUMN IF NOT EXISTS fashion_pattern VARCHAR(100),
  ADD COLUMN IF NOT EXISTS colour VARCHAR(100);

-- Add stock columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS stock_status VARCHAR(50);

-- Add link columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS aw_deep_link TEXT,
  ADD COLUMN IF NOT EXISTS merchant_deep_link TEXT;

-- Add embedding columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_embedding vector(512),
  ADD COLUMN IF NOT EXISTS text_embedding vector(512),
  ADD COLUMN IF NOT EXISTS embedding_model_version VARCHAR(50),
  ADD COLUMN IF NOT EXISTS embedding_generated_at TIMESTAMPTZ;

-- Add metadata columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_short_description TEXT,
  ADD COLUMN IF NOT EXISTS last_updated TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ingested_at TIMESTAMPTZ DEFAULT NOW();

-- Add quality/active columns (CRITICAL for ingestion)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE NOT NULL,
  ADD COLUMN IF NOT EXISTS is_nsfw BOOLEAN DEFAULT FALSE NOT NULL;

-- Add deduplication columns (CRITICAL for ingestion)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_hash VARCHAR(64),
  ADD COLUMN IF NOT EXISTS canonical_product_id UUID REFERENCES products(id) ON DELETE SET NULL;

-- Update currency default if needed
ALTER TABLE products ALTER COLUMN currency SET DEFAULT 'GBP';

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_products_merchant_id ON products(merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_search_price ON products(search_price);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_product_hash ON products(product_hash);

-- Create unique constraint for merchant products
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_merchant_unique ON products(merchant_id, merchant_product_id);

-- =====================================================
-- INGESTION_LOGS TABLE UPDATES
-- =====================================================

-- Add merchant tracking columns
ALTER TABLE ingestion_logs
  ADD COLUMN IF NOT EXISTS feed_name TEXT,
  ADD COLUMN IF NOT EXISTS merchant_id INTEGER,
  ADD COLUMN IF NOT EXISTS merchant_name TEXT;

-- Add detailed statistics columns (CRITICAL for ingestion)
ALTER TABLE ingestion_logs
  ADD COLUMN IF NOT EXISTS new_products INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_products INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS failed_rows INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS duplicates_found INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS processing_time_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS rows_per_second NUMERIC(10,2);

-- Make file_name nullable to support both file_name and feed_name
ALTER TABLE ingestion_logs
  ALTER COLUMN file_name DROP NOT NULL;

-- Add comments explaining the columns
COMMENT ON COLUMN products.product_hash IS 'SHA-256 hash for deduplication';
COMMENT ON COLUMN products.is_active IS 'Whether product is active and should be shown';
COMMENT ON COLUMN products.canonical_product_id IS 'If duplicate, points to canonical product';

COMMENT ON COLUMN ingestion_logs.feed_name IS 'Name of the data feed/file being ingested (used by ingestion scripts)';
COMMENT ON COLUMN ingestion_logs.file_name IS 'Legacy column for file name (nullable for backward compatibility)';
COMMENT ON COLUMN ingestion_logs.merchant_id IS 'ID of the merchant whose products are being ingested';
COMMENT ON COLUMN ingestion_logs.merchant_name IS 'Name of the merchant whose products are being ingested';
COMMENT ON COLUMN ingestion_logs.new_products IS 'Number of new products inserted';
COMMENT ON COLUMN ingestion_logs.updated_products IS 'Number of existing products updated';
COMMENT ON COLUMN ingestion_logs.failed_rows IS 'Number of rows that failed to process';
COMMENT ON COLUMN ingestion_logs.duplicates_found IS 'Number of duplicate products found';
COMMENT ON COLUMN ingestion_logs.processing_time_seconds IS 'Total processing time in seconds';
COMMENT ON COLUMN ingestion_logs.rows_per_second IS 'Processing rate (rows/second)';
