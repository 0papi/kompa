import { useStore } from "zustand";
import { showSetPriceModalState } from "../states";

export const useShowSetPriceModalStore = () => {
  const isOpen = useStore(showSetPriceModalState, (state) => state.isOpen);
  const listing = useStore(showSetPriceModalState, (state) => state.listing);
  const setListing = useStore(
    showSetPriceModalState,
    (state) => state.setListing,
  );
  const setIsOpen = useStore(
    showSetPriceModalState,
    (state) => state.setIsOpen,
  );

  return {
    isOpen,
    setIsOpen,
    setListing,
    listing,
  };
};
