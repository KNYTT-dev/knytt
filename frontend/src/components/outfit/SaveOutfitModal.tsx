"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useOutfitStore } from "@/lib/stores/outfitStore";
import { useToast } from "@/components/ui/Toast";

interface SaveOutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveOutfitModal({ isOpen, onClose }: SaveOutfitModalProps) {
  const [outfitName, setOutfitName] = useState("");
  const [error, setError] = useState("");
  const saveOutfit = useOutfitStore((state) => state.saveOutfit);
  const toast = useToast();

  const handleSave = () => {
    // Validation
    if (!outfitName.trim()) {
      setError("Outfit name is required");
      return;
    }

    if (outfitName.length > 50) {
      setError("Name must be 50 characters or less");
      return;
    }

    // Save outfit
    saveOutfit(outfitName.trim());

    // Show success message
    toast.success("Outfit saved", `"${outfitName.trim()}" has been saved to your collection`);

    // Reset and close
    setOutfitName("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setOutfitName("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Save Outfit"
      description="Give your outfit a name to save it to your collection"
      size="sm"
    >
      <div className="space-y-6">
        {/* Outfit Name Input */}
        <div>
          <Input
            label="Outfit Name"
            value={outfitName}
            onChange={(e) => {
              setOutfitName(e.target.value);
              setError(""); // Clear error on change
            }}
            error={error}
            placeholder="e.g., Summer Casual, Date Night, Work Outfit"
            maxLength={50}
            autoFocus
            floatingLabel={false}
          />
          <p className="text-xs text-gray-500 mt-2">
            {outfitName.length}/50 characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!outfitName.trim()}
          >
            Save Outfit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
