"use client";

import { useState } from "react";
import { OutfitSlotType } from "@/types/outfit";
import { OutfitPreview } from "./OutfitPreview";
import { OutfitSummary } from "./OutfitSummary";
import { OutfitItemSelector } from "./OutfitItemSelector";
import { SaveOutfitModal } from "./SaveOutfitModal";
import { SavedOutfitsList } from "./SavedOutfitsList";

export function OutfitBuilder() {
  const [selectedSlot, setSelectedSlot] = useState<OutfitSlotType | null>(null);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"builder" | "saved">("builder");

  const handleSlotClick = (slotType: OutfitSlotType) => {
    setSelectedSlot(slotType);
    setShowItemSelector(true);
  };

  const handleCloseSelector = () => {
    setShowItemSelector(false);
    setSelectedSlot(null);
  };

  const handleSaveOutfit = () => {
    setShowSaveModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("builder")}
              className={`px-6 py-4 font-semibold text-sm transition-all relative ${
                activeTab === "builder"
                  ? "text-[#8a94ff]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Builder
              {activeTab === "builder" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8a94ff]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-6 py-4 font-semibold text-sm transition-all relative ${
                activeTab === "saved"
                  ? "text-[#8a94ff]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Saved Outfits
              {activeTab === "saved" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8a94ff]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "builder" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Outfit Preview - Left Side (2 columns on desktop) */}
            <div className="lg:col-span-2">
              <OutfitPreview
                onSlotClick={handleSlotClick}
                selectedSlot={selectedSlot}
              />
            </div>

            {/* Outfit Summary - Right Side (1 column on desktop) */}
            <div className="lg:col-span-1">
              <OutfitSummary onSave={handleSaveOutfit} />
            </div>
          </div>
        ) : (
          <SavedOutfitsList />
        )}
      </div>

      {/* Item Selector Slide-out Panel */}
      <OutfitItemSelector
        isOpen={showItemSelector}
        slotType={selectedSlot}
        onClose={handleCloseSelector}
      />

      {/* Save Outfit Modal */}
      <SaveOutfitModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
      />
    </div>
  );
}
