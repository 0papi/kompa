import type { Listing } from "@/lib/api/listings";
import { create, useStore } from "zustand";

export const showConfirmPurchaseModal = create<{
  open: boolean;
  listing:Listing |  null;
  setListing: (val:Listing|null) => void;
  setOpen: (val: boolean) => void;
}>((set) => ({
  open: false,
  listing: null,
  setListing: (val) => {
    set({listing: val})
  },
  setOpen: (val) => {
    set({ open: val });
  },
}));


export const useConfirmPurchaseModalStore = () => {
  const open = useStore(showConfirmPurchaseModal, (state) => state.open)
  const setOpen = useStore(showConfirmPurchaseModal, (state) => state.setOpen)

  
  const listing = useStore(showConfirmPurchaseModal, (state) => state.listing)
  const setListing = useStore(showConfirmPurchaseModal, (state) => state.setListing)

  
  return {
    open,
    setOpen,
    listing,
    setListing
  }
}
