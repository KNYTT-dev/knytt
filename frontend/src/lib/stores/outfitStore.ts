/**
 * Outfit Builder Store (Zustand)
 * Manages current working outfit and saved outfits (localStorage-backed)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CurrentOutfit,
  OutfitSlot,
  OutfitSlotType,
  OutfitItem,
  SavedOutfit,
  OUTFIT_SLOT_CONFIG,
} from "@/types/outfit";
import { ProductResult } from "@/types/product";
import { useCartStore } from "./cartStore";

// Helper: Convert ProductResult to OutfitItem
function productToOutfitItem(product: ProductResult): OutfitItem {
  return {
    product_id: product.product_id,
    title: product.title,
    brand: product.brand,
    price: product.price,
    currency: product.currency || "USD",
    image_url: product.image_url || "",
    category_name: product.category_name,
    fashion_category: product.fashion_category,
    colour: product.colour,
    added_at: new Date().toISOString(),
    _full_product: product, // Preserve for future use
  };
}

// Helper: Initialize empty outfit
function createEmptyOutfit(): CurrentOutfit {
  const slots: Record<OutfitSlotType, OutfitSlot> = {} as any;

  Object.entries(OUTFIT_SLOT_CONFIG).forEach(([type, config]) => {
    slots[type as OutfitSlotType] = {
      type: type as OutfitSlotType,
      label: config.label,
      item: null,
      category_filter: config.category_filter,
    };
  });

  return {
    slots,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

interface OutfitStore {
  // State
  currentOutfit: CurrentOutfit;
  savedOutfits: SavedOutfit[];

  // Current outfit actions
  addItemToSlot: (slotType: OutfitSlotType, product: ProductResult) => void;
  removeItemFromSlot: (slotType: OutfitSlotType) => void;
  clearCurrentOutfit: () => void;

  // Saved outfits actions
  saveOutfit: (name: string) => void;
  deleteOutfit: (outfitId: string) => void;
  loadOutfit: (outfitId: string) => void;

  // Cart integration
  addAllToCart: () => void;

  // Computed getters
  getTotalPrice: () => number;
  getFilledCount: () => number;
  isComplete: () => boolean;
  canAddToCart: () => boolean;
}

export const useOutfitStore = create<OutfitStore>()(
  persist(
    (set, get) => ({
      currentOutfit: createEmptyOutfit(),
      savedOutfits: [],

      addItemToSlot: (slotType, product) => {
        set((state) => ({
          currentOutfit: {
            ...state.currentOutfit,
            slots: {
              ...state.currentOutfit.slots,
              [slotType]: {
                ...state.currentOutfit.slots[slotType],
                item: productToOutfitItem(product),
              },
            },
            updated_at: new Date().toISOString(),
          },
        }));
      },

      removeItemFromSlot: (slotType) => {
        set((state) => ({
          currentOutfit: {
            ...state.currentOutfit,
            slots: {
              ...state.currentOutfit.slots,
              [slotType]: {
                ...state.currentOutfit.slots[slotType],
                item: null,
              },
            },
            updated_at: new Date().toISOString(),
          },
        }));
      },

      clearCurrentOutfit: () => {
        set({ currentOutfit: createEmptyOutfit() });
      },

      saveOutfit: (name) => {
        const { currentOutfit, savedOutfits } = get();

        // Create new saved outfit
        const newOutfit: SavedOutfit = {
          outfit_id: crypto.randomUUID(),
          name,
          slots: currentOutfit.slots,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set({
          savedOutfits: [...savedOutfits, newOutfit],
          currentOutfit: createEmptyOutfit(), // Clear current after saving
        });
      },

      deleteOutfit: (outfitId) => {
        set((state) => ({
          savedOutfits: state.savedOutfits.filter(
            (outfit) => outfit.outfit_id !== outfitId
          ),
        }));
      },

      loadOutfit: (outfitId) => {
        const { savedOutfits } = get();
        const outfit = savedOutfits.find((o) => o.outfit_id === outfitId);

        if (outfit) {
          set({
            currentOutfit: {
              slots: outfit.slots,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          });
        }
      },

      addAllToCart: () => {
        const { currentOutfit } = get();
        const items = Object.values(currentOutfit.slots)
          .filter((slot) => slot.item !== null)
          .map((slot) => slot.item!);

        // Import cartStore and add each item
        const cartStore = useCartStore.getState();
        items.forEach((item) => {
          cartStore.addItem({
            productId: item.product_id,
            title: item.title,
            price: item.price,
            currency: item.currency,
            imageUrl: item.image_url,
          });
        });
      },

      getTotalPrice: () => {
        const { currentOutfit } = get();
        return Object.values(currentOutfit.slots)
          .filter((slot) => slot.item !== null)
          .reduce((sum, slot) => sum + (slot.item?.price || 0), 0);
      },

      getFilledCount: () => {
        const { currentOutfit } = get();
        return Object.values(currentOutfit.slots).filter(
          (slot) => slot.item !== null
        ).length;
      },

      isComplete: () => {
        return get().getFilledCount() === 5;
      },

      canAddToCart: () => {
        return get().getFilledCount() > 0;
      },
    }),
    {
      name: "knytt-outfits-storage", // localStorage key
      // Persist entire state
      partialize: (state) => ({
        currentOutfit: state.currentOutfit,
        savedOutfits: state.savedOutfits,
      }),
    }
  )
);
