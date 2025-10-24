import { create } from "zustand";
import { persist } from "zustand/middleware";

type LayoutType = "grid" | "list";

interface ListingsLayoutState {
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
}

export const useListingsLayoutStore = create<ListingsLayoutState>()(
  persist(
    (set) => ({
      layout: "grid",
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: "listings-layout-storage",
    }
  )
);
