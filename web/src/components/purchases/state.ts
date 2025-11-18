import type { Listing } from "@/lib/api/listings";
import { create, useStore } from "zustand";

export const ShowPurchasedListingState = create<{
  show:boolean;
  listing:Listing |  null,
  setListing: (val:Listing|null) => void,
  setShow: (val:boolean) => void
}>((set) => ({
  show: false,
  listing: null,
  setListing: (val) => {
    set({listing: val})
  },
  setShow: (val) => {
    set({show:val})
  }
}))


export const useShowPurchasedComparable = () => {
  const show = useStore(ShowPurchasedListingState, (state) => state.show)
  const setShow = useStore(ShowPurchasedListingState, (state) => state.setShow)
  const listing = useStore(ShowPurchasedListingState, (state) => state.listing)
  const setListing = useStore(ShowPurchasedListingState, (state) => state.setListing)

  return {
    show,
    setShow,
    listing,
    setListing
  }
}
