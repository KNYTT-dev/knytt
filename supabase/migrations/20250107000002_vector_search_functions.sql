-- Vector Search Functions for Knytt
-- Semantic product search and recommendation functions

-- =====================================================
-- FUNCTION: match_products
-- Semantic similarity search for products
-- =====================================================
CREATE OR REPLACE FUNCTION match_products(
    query_embedding vector(512),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 20,
    filter_category text DEFAULT NULL,
    filter_min_price decimal DEFAULT NULL,
    filter_max_price decimal DEFAULT NULL,
    filter_in_stock boolean DEFAULT NULL,
    min_quality_score float DEFAULT 0.5
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    price decimal,
    image_url text,
    category text,
    brand text,
    quality_score float,
    similarity float,
    in_stock boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.description,
        p.price,
        p.image_url,
        p.category,
        p.brand,
        p.quality_score,
        1 - (p.embedding <=> query_embedding) AS similarity,
        p.in_stock
    FROM products p
    WHERE
        p.embedding IS NOT NULL
        AND p.is_duplicate = false
        AND p.quality_score >= min_quality_score
        AND (filter_category IS NULL OR p.category = filter_category)
        AND (filter_min_price IS NULL OR p.price >= filter_min_price)
        AND (filter_max_price IS NULL OR p.price <= filter_max_price)
        AND (filter_in_stock IS NULL OR p.in_stock = filter_in_stock)
        AND (1 - (p.embedding <=> query_embedding)) > match_threshold
    ORDER BY p.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Index to optimize the function (already created in initial schema)
-- CREATE INDEX idx_products_embedding ON products USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

COMMENT ON FUNCTION match_products IS 'Semantic product search using CLIP embeddings with filters';

-- =====================================================
-- FUNCTION: get_personalized_recommendations
-- Get recommendations based on user embedding
-- =====================================================
CREATE OR REPLACE FUNCTION get_personalized_recommendations(
    user_uuid uuid,
    recommendation_count int DEFAULT 20,
    blend_weight float DEFAULT 0.7, -- Weight for long-term vs session (0-1)
    filter_category text DEFAULT NULL,
    exclude_viewed boolean DEFAULT true
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    price decimal,
    image_url text,
    category text,
    brand text,
    similarity float,
    recommendation_reason text
)
LANGUAGE plpgsql
AS $$
DECLARE
    user_long_term vector(512);
    user_session vector(512);
    user_embedding vector(512);
    has_long_term boolean;
    has_session boolean;
BEGIN
    -- Get user embeddings
    SELECT
        ue.long_term_embedding,
        ue.session_embedding,
        (ue.long_term_embedding IS NOT NULL),
        (ue.session_embedding IS NOT NULL)
    INTO
        user_long_term,
        user_session,
        has_long_term,
        has_session
    FROM user_embeddings ue
    WHERE ue.user_id = user_uuid;

    -- If no embeddings exist, return popular products
    IF NOT has_long_term AND NOT has_session THEN
        RETURN QUERY
        SELECT
            p.id,
            p.title,
            p.description,
            p.price,
            p.image_url,
            p.category,
            p.brand,
            0.5::float AS similarity,
            'popular'::text AS recommendation_reason
        FROM products p
        WHERE
            p.is_duplicate = false
            AND p.quality_score >= 0.6
            AND (filter_category IS NULL OR p.category = filter_category)
        ORDER BY p.quality_score DESC, p.created_at DESC
        LIMIT recommendation_count;
        RETURN;
    END IF;

    -- Blend embeddings based on weight
    IF has_long_term AND has_session THEN
        -- Weighted average of long-term and session embeddings
        -- Note: pgvector doesn't support vector arithmetic directly in SQL
        -- This will be handled in the application layer
        user_embedding := user_long_term; -- For now, use long-term
    ELSIF has_long_term THEN
        user_embedding := user_long_term;
    ELSE
        user_embedding := user_session;
    END IF;

    -- Get recommendations
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.description,
        p.price,
        p.image_url,
        p.category,
        p.brand,
        1 - (p.embedding <=> user_embedding) AS similarity,
        CASE
            WHEN has_long_term AND has_session THEN 'personalized_blended'
            WHEN has_long_term THEN 'personalized_long_term'
            ELSE 'personalized_session'
        END::text AS recommendation_reason
    FROM products p
    WHERE
        p.embedding IS NOT NULL
        AND p.is_duplicate = false
        AND p.quality_score >= 0.5
        AND (filter_category IS NULL OR p.category = filter_category)
        AND (
            NOT exclude_viewed
            OR p.id NOT IN (
                SELECT ui.product_id
                FROM user_interactions ui
                WHERE ui.user_id = user_uuid
                AND ui.created_at > NOW() - INTERVAL '7 days'
            )
        )
    ORDER BY p.embedding <=> user_embedding
    LIMIT recommendation_count;
END;
$$;

COMMENT ON FUNCTION get_personalized_recommendations IS 'Get personalized product recommendations for a user';

-- =====================================================
-- FUNCTION: get_similar_products
-- Find similar products to a given product
-- =====================================================
CREATE OR REPLACE FUNCTION get_similar_products(
    product_uuid uuid,
    match_count int DEFAULT 10,
    same_category boolean DEFAULT false
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    price decimal,
    image_url text,
    category text,
    brand text,
    similarity float
)
LANGUAGE plpgsql
AS $$
DECLARE
    source_embedding vector(512);
    source_category text;
BEGIN
    -- Get the source product's embedding and category
    SELECT p.embedding, p.category
    INTO source_embedding, source_category
    FROM products p
    WHERE p.id = product_uuid;

    -- If product not found or has no embedding, return empty
    IF source_embedding IS NULL THEN
        RETURN;
    END IF;

    -- Find similar products
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.description,
        p.price,
        p.image_url,
        p.category,
        p.brand,
        1 - (p.embedding <=> source_embedding) AS similarity
    FROM products p
    WHERE
        p.id != product_uuid  -- Exclude the source product
        AND p.embedding IS NOT NULL
        AND p.is_duplicate = false
        AND p.quality_score >= 0.5
        AND (NOT same_category OR p.category = source_category)
    ORDER BY p.embedding <=> source_embedding
    LIMIT match_count;
END;
$$;

COMMENT ON FUNCTION get_similar_products IS 'Find products similar to a given product';

-- =====================================================
-- FUNCTION: update_user_embedding_with_interaction
-- Update user embedding after an interaction
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_embedding_with_interaction(
    user_uuid uuid,
    product_uuid uuid,
    interaction_weight float DEFAULT 1.0,
    is_session boolean DEFAULT true
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    product_emb vector(512);
    current_long_term vector(512);
    current_session vector(512);
    long_term_w float;
    session_w float;
    alpha float := 0.1; -- Learning rate for EWMA
BEGIN
    -- Get product embedding
    SELECT embedding INTO product_emb
    FROM products
    WHERE id = product_uuid;

    IF product_emb IS NULL THEN
        RETURN;
    END IF;

    -- Get or create user embeddings
    SELECT long_term_embedding, session_embedding, long_term_weight, session_weight
    INTO current_long_term, current_session, long_term_w, session_w
    FROM user_embeddings
    WHERE user_id = user_uuid;

    -- If user embeddings don't exist, create them
    IF NOT FOUND THEN
        INSERT INTO user_embeddings (
            user_id,
            long_term_embedding,
            session_embedding,
            long_term_weight,
            session_weight,
            total_interactions,
            last_active_at,
            long_term_updated_at,
            session_started_at,
            session_updated_at
        ) VALUES (
            user_uuid,
            product_emb,
            product_emb,
            interaction_weight,
            interaction_weight,
            1,
            NOW(),
            NOW(),
            NOW(),
            NOW()
        );
        RETURN;
    END IF;

    -- Update embeddings using EWMA (Exponentially Weighted Moving Average)
    -- Note: pgvector doesn't support vector arithmetic in SQL
    -- This is a placeholder - actual implementation should be in application layer
    -- The application should:
    -- 1. Fetch current embeddings
    -- 2. Compute new_embedding = (1 - alpha) * current + alpha * product_embedding
    -- 3. Update via RPC call

    -- Update metadata
    UPDATE user_embeddings
    SET
        total_interactions = total_interactions + 1,
        last_active_at = NOW(),
        long_term_updated_at = CASE WHEN NOT is_session THEN NOW() ELSE long_term_updated_at END,
        session_updated_at = CASE WHEN is_session THEN NOW() ELSE session_updated_at END
    WHERE user_id = user_uuid;
END;
$$;

COMMENT ON FUNCTION update_user_embedding_with_interaction IS 'Update user embedding after product interaction (metadata only - embedding math done in app layer)';

-- =====================================================
-- FUNCTION: get_trending_products
-- Get trending products based on recent interactions
-- =====================================================
CREATE OR REPLACE FUNCTION get_trending_products(
    time_window interval DEFAULT '7 days',
    match_count int DEFAULT 20,
    filter_category text DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    price decimal,
    image_url text,
    category text,
    brand text,
    interaction_count bigint,
    trend_score float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.description,
        p.price,
        p.image_url,
        p.category,
        p.brand,
        COUNT(ui.id) AS interaction_count,
        (COUNT(ui.id)::float * p.quality_score) AS trend_score
    FROM products p
    INNER JOIN user_interactions ui ON p.id = ui.product_id
    WHERE
        ui.created_at > NOW() - time_window
        AND p.is_duplicate = false
        AND (filter_category IS NULL OR p.category = filter_category)
    GROUP BY p.id
    ORDER BY trend_score DESC, interaction_count DESC
    LIMIT match_count;
END;
$$;

COMMENT ON FUNCTION get_trending_products IS 'Get trending products based on recent user interactions';

-- =====================================================
-- FUNCTION: search_products_hybrid
-- Hybrid search: semantic + keyword (full-text)
-- =====================================================
CREATE OR REPLACE FUNCTION search_products_hybrid(
    query_text text,
    query_embedding vector(512) DEFAULT NULL,
    match_count int DEFAULT 20,
    semantic_weight float DEFAULT 0.7,
    filter_category text DEFAULT NULL,
    filter_min_price decimal DEFAULT NULL,
    filter_max_price decimal DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    price decimal,
    image_url text,
    category text,
    brand text,
    semantic_similarity float,
    text_similarity float,
    combined_score float
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- If no embedding provided, use keyword search only
    IF query_embedding IS NULL THEN
        RETURN QUERY
        SELECT
            p.id,
            p.title,
            p.description,
            p.price,
            p.image_url,
            p.category,
            p.brand,
            0::float AS semantic_similarity,
            similarity(p.title, query_text) AS text_similarity,
            similarity(p.title, query_text) AS combined_score
        FROM products p
        WHERE
            p.is_duplicate = false
            AND p.quality_score >= 0.5
            AND (filter_category IS NULL OR p.category = filter_category)
            AND (filter_min_price IS NULL OR p.price >= filter_min_price)
            AND (filter_max_price IS NULL OR p.price <= filter_max_price)
            AND (
                p.title ILIKE '%' || query_text || '%'
                OR p.description ILIKE '%' || query_text || '%'
                OR p.brand ILIKE '%' || query_text || '%'
            )
        ORDER BY combined_score DESC
        LIMIT match_count;
        RETURN;
    END IF;

    -- Hybrid search: combine semantic and text similarity
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.description,
        p.price,
        p.image_url,
        p.category,
        p.brand,
        (1 - (p.embedding <=> query_embedding)) AS semantic_similarity,
        similarity(p.title, query_text) AS text_similarity,
        (
            semantic_weight * (1 - (p.embedding <=> query_embedding)) +
            (1 - semantic_weight) * similarity(p.title, query_text)
        ) AS combined_score
    FROM products p
    WHERE
        p.embedding IS NOT NULL
        AND p.is_duplicate = false
        AND p.quality_score >= 0.5
        AND (filter_category IS NULL OR p.category = filter_category)
        AND (filter_min_price IS NULL OR p.price >= filter_min_price)
        AND (filter_max_price IS NULL OR p.price <= filter_max_price)
    ORDER BY combined_score DESC
    LIMIT match_count;
END;
$$;

COMMENT ON FUNCTION search_products_hybrid IS 'Hybrid search combining semantic similarity and keyword matching';

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION match_products TO authenticated;
GRANT EXECUTE ON FUNCTION get_personalized_recommendations TO authenticated;
GRANT EXECUTE ON FUNCTION get_similar_products TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_embedding_with_interaction TO authenticated;
GRANT EXECUTE ON FUNCTION get_trending_products TO authenticated;
GRANT EXECUTE ON FUNCTION search_products_hybrid TO authenticated;

-- Grant execute permissions to anon for public searches
GRANT EXECUTE ON FUNCTION match_products TO anon;
GRANT EXECUTE ON FUNCTION get_similar_products TO anon;
GRANT EXECUTE ON FUNCTION get_trending_products TO anon;
GRANT EXECUTE ON FUNCTION search_products_hybrid TO anon;
