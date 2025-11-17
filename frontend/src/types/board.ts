/**
 * Board-related type definitions.
 * Pinterest-style collections for organizing products.
 */

/**
 * Minimal product data for display in board items.
 */
export interface ProductCardData {
  id: string;
  product_name: string;
  brand_name: string | null;
  search_price: number | null;
  currency: string;
  merchant_image_url: string | null;
  aw_image_url: string | null;
  large_image: string | null;
  in_stock: boolean;
  is_active: boolean;
}

/**
 * Board item (product saved to a board).
 */
export interface BoardItem {
  id: string;
  board_id: string;
  product_id: string;
  user_id: string;
  note: string | null;
  position: number;
  created_at: string;
  product: ProductCardData;
}

/**
 * Board metadata (without items).
 */
export interface Board {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  is_default: boolean;
  position: number;
  item_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Board with all its items.
 */
export interface BoardDetail extends Omit<Board, 'item_count'> {
  items: BoardItem[];
}

/**
 * Request payload for creating a board.
 */
export interface BoardCreateRequest {
  name: string;
  description?: string;
  is_public?: boolean;
}

/**
 * Request payload for updating a board.
 */
export interface BoardUpdateRequest {
  name?: string;
  description?: string;
  cover_image_url?: string;
  is_public?: boolean;
  position?: number;
}

/**
 * Request payload for adding an item to a board.
 */
export interface BoardItemCreateRequest {
  product_id: string;
  note?: string;
}

/**
 * Request payload for updating a board item.
 */
export interface BoardItemUpdateRequest {
  note?: string;
  position?: number;
}

/**
 * Response for listing boards.
 */
export interface BoardListResponse {
  boards: Board[];
  total: number;
}

/**
 * Request payload for moving/copying item between boards.
 */
export interface BoardItemMoveRequest {
  target_board_id: string;
  copy?: boolean;
}

/**
 * Request payload for reordering items in a board.
 */
export interface BoardReorderRequest {
  item_positions: Array<{
    item_id: string;
    position: number;
  }>;
}
