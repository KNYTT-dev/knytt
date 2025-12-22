import { Metadata } from "next";
import { OutfitBuilder } from "@/components/outfit/OutfitBuilder";

export const metadata: Metadata = {
  title: "Outfit Builder | Knytt",
  description: "Build and save personalized outfits with items you love",
};

export default function OutfitBuilderPage() {
  return <OutfitBuilder />;
}
