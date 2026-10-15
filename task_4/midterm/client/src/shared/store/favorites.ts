import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/shared/types";

interface FavoritesState {
  items: Product[];
  ids: number[];
  count: number;
  isOpen: boolean;
  toggleFavorite: (product: Product) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      items: [],
      ids: [],
      count: 0,
      isOpen: false,

      toggleFavorite: (product) =>
        set((state) => {
          const exists = state.ids.includes(product.id);
          const newItems = exists
            ? state.items.filter((i) => i.id !== product.id)
            : [...state.items, product];
          const newIds = newItems.map((i) => i.id);

          return {
            items: newItems,
            ids: newIds,
            count: newIds.length,
          };
        }),

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
    }),
    {
      name: "aura-favorites",
      partialize: (state) => ({
        items: state.items,
        ids: state.ids,
        count: state.count,
      }),
    },
  ),
);

export default useFavoritesStore;
