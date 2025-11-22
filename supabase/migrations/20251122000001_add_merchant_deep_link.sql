-- Add merchant_deep_link column to products table
-- This column stores the product link from merchant feeds

ALTER TABLE products
ADD COLUMN IF NOT EXISTS merchant_deep_link TEXT;
