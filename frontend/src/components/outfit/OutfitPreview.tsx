"use client";

import { OutfitSlotCard } from "./OutfitSlotCard";
import { OutfitSlotType, OUTFIT_SLOT_CONFIG } from "@/types/outfit";
import { useOutfitStore } from "@/lib/stores/outfitStore";

interface OutfitPreviewProps {
  onSlotClick: (slotType: OutfitSlotType) => void;
  selectedSlot?: OutfitSlotType | null;
}

export function OutfitPreview({
  onSlotClick,
  selectedSlot,
}: OutfitPreviewProps) {
  const currentOutfit = useOutfitStore((state) => state.currentOutfit);
  const removeItemFromSlot = useOutfitStore((state) => state.removeItemFromSlot);

  // Sort slots by order defined in config
  const sortedSlots = Object.values(currentOutfit.slots).sort(
    (a, b) =>
      OUTFIT_SLOT_CONFIG[a.type].order - OUTFIT_SLOT_CONFIG[b.type].order
  );

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-charcoal mb-2">
          Build Your Outfit
        </h2>
        <p className="text-sm text-gray-600">
          Click a slot to add or change items
        </p>
      </div>

      {/* Outfit Slots - Vertical Stack */}
      <div className="space-y-4">
        {sortedSlots.map((slot) => (
          <OutfitSlotCard
            key={slot.type}
            slot={slot}
            onAddItem={() => onSlotClick(slot.type)}
            onRemoveItem={() => removeItemFromSlot(slot.type)}
            isSelected={selectedSlot === slot.type}
          />
        ))}
      </div>
    </div>
  );
}
