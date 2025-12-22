/**
 * Outfit Builder type definitions
 * Designed for extensibility: supports current builder + future saved outfits
 */

import { ProductResult } from "./product";

/**
 * Available outfit slot types
 * Extensible enum - can add slots like 'bag', 'jewelry', 'watch' later
 */
export type OutfitSlotType =
  | "top"
  | "bottom"
  | "shoes"
  | "outerwear"
  | "accessory";

/**
 * Product simplified for outfit slots
 * Lightweight version of ProductResult to avoid bloating localStorage
 */
export interface OutfitItem {
  product_id: string;
  title: string;
  brand?: string;
  price: number;
  currency: string;
  image_url: string;
  category_name?: string;
  fashion_category?: string;
  colour?: string;

  // Track when added for analytics
  added_at?: string; // ISO timestamp

  // Optional: preserve full product for future features
  _full_product?: ProductResult;
}

/**
 * Single slot in the outfit builder
 */
export interface OutfitSlot {
  type: OutfitSlotType;
  label: string; // Display name: "Top", "Bottom", etc.
  item: OutfitItem | null; // null = empty slot
  category_filter?: string[]; // Categories allowed in this slot
}

/**
 * Current working outfit in the builder
 * This is what Zustand manages
 */
export interface CurrentOutfit {
  slots: Record<OutfitSlotType, OutfitSlot>;
  created_at: string; // When builder session started
  updated_at: string; // Last modification
}

/**
 * Saved outfit (stored in localStorage)
 */
export interface SavedOutfit {
  outfit_id: string; // UUID
  name: string; // User-given name
  slots: Record<OutfitSlotType, OutfitSlot>;
  created_at: string;
  updated_at: string;

  // Future features
  is_public?: boolean;
  thumbnail_url?: string;
  tags?: string[];
}

/**
 * Configuration for outfit slots
 * Centralized definition of available slots
 */
export const OUTFIT_SLOT_CONFIG: Record<OutfitSlotType, {
  label: string;
  order: number; // Display order
  required: boolean; // For validation
  category_filter: string[]; // Which product categories can go here
  placeholder: string; // Empty state text
}> = {
  top: {
    label: "Top",
    order: 1,
    required: false,
    category_filter: ["Fashion"],
    placeholder: "Add a top",
  },
  bottom: {
    label: "Bottom",
    order: 2,
    required: false,
    category_filter: ["Fashion"],
    placeholder: "Add bottoms",
  },
  shoes: {
    label: "Shoes",
    order: 3,
    required: false,
    category_filter: ["Footwear"],
    placeholder: "Add shoes",
  },
  outerwear: {
    label: "Outerwear",
    order: 4,
    required: false,
    category_filter: ["Fashion"],
    placeholder: "Add a jacket or coat",
  },
  accessory: {
    label: "Accessory",
    order: 5,
    required: false,
    category_filter: ["Accessories", "Jewelry"],
    placeholder: "Add an accessory",
  },
};
