"use client";

import { Plus } from "lucide-react";
import { OutfitSlotType, OUTFIT_SLOT_CONFIG } from "@/types/outfit";

interface EmptySlotProps {
  slotType: OutfitSlotType;
  onClick: () => void;
}

export function EmptySlot({ slotType, onClick }: EmptySlotProps) {
  const config = OUTFIT_SLOT_CONFIG[slotType];

  return (
    <button
      onClick={onClick}
      className="group relative w-full aspect-[3/4] border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl overflow-hidden hover:border-[#8a94ff] hover:bg-[#8a94ff]/5 transition-all duration-300 active:scale-[0.98]"
      aria-label={`Add ${config.label.toLowerCase()}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        {/* Plus Icon */}
        <div className="mb-3 p-4 bg-white rounded-full shadow-sm group-hover:shadow-md group-hover:bg-[#8a94ff] group-hover:scale-110 transition-all duration-300">
          <Plus className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
        </div>

        {/* Slot Label */}
        <span className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-1">
          {config.label}
        </span>

        {/* Placeholder Text */}
        <span className="text-xs text-gray-400 group-hover:text-[#8a94ff] transition-colors">
          {config.placeholder}
        </span>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8a94ff]/0 to-[#8a94ff]/0 group-hover:from-[#8a94ff]/5 group-hover:to-[#8a94ff]/10 transition-all duration-300 pointer-events-none" />
    </button>
  );
}
