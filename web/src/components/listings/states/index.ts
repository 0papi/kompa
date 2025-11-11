export { useListingsLayoutStore } from "./listings-layout.store";
import type { Listing } from "@/lib/api/listings";
import { create } from "zustand";

export const showSetPriceModalState = create<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  listing: Listing | null;
  setListing: (listing: Listing | null) => void;
}>((set) => ({
  listing: null,
  setListing: (listing: Listing | null) => set({ listing }),
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
