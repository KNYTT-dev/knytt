-- Boards Schema Migration
-- Adds Pinterest-style board functionality for users to organize products into collections

-- Boards table: stores user-created collections/boards
CREATE TABLE IF NOT EXISTS boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Board metadata
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,

    -- Settings
    is_public BOOLEAN NOT NULL DEFAULT false,
    is_default BOOLEAN NOT NULL DEFAULT false,  -- One default board per user (e.g., "Favorites")

    -- Ordering
    position INTEGER DEFAULT 0,  -- For custom ordering of boards

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_user_board_name UNIQUE(user_id, name)
);

-- Indexes for boards
CREATE INDEX idx_boards_user_id ON boards(user_id);
CREATE INDEX idx_boards_is_public ON boards(is_public) WHERE is_public = true;
CREATE INDEX idx_boards_user_position ON boards(user_id, position);

-- Board items table: many-to-many relationship between boards and products
CREATE TABLE IF NOT EXISTS board_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Item metadata
    note TEXT,  -- Optional note about why this product was saved
    position INTEGER DEFAULT 0,  -- For custom ordering within board

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Constraints: one product per board (but same product can be in multiple boards)
    CONSTRAINT unique_board_product UNIQUE(board_id, product_id)
);

-- Indexes for board_items
CREATE INDEX idx_board_items_board_id ON board_items(board_id);
CREATE INDEX idx_board_items_user_id ON board_items(user_id);
CREATE INDEX idx_board_items_product_id ON board_items(product_id);
CREATE INDEX idx_board_items_board_position ON board_items(board_id, position);
CREATE INDEX idx_board_items_created ON board_items(created_at DESC);

-- Create update trigger for boards.updated_at
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create default "Favorites" board for all existing users
INSERT INTO boards (user_id, name, description, is_public, is_default, position)
SELECT
    id,
    'Favorites',
    'My favorite items',
    false,
    true,
    0
FROM users
WHERE NOT EXISTS (
    SELECT 1 FROM boards WHERE boards.user_id = users.id AND boards.is_default = true
);

-- Note: We do NOT automatically migrate user_favorites to board_items
-- Users will manually organize their favorites into boards
-- The existing user_favorites table remains as a special "quick favorites" feature
