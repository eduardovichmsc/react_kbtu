// store/favorites.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  ids: number[];
  count: number;
  isOpen: boolean; // Состояние панели
  toggleFavorite: (id: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      count: 0,
      isOpen: false, // По умолчанию закрыто

      toggleFavorite: (id) =>
        set((state) => {
          const exists = state.ids.includes(id);
          const newIds = exists
            ? state.ids.filter((i) => i !== id)
            : [...state.ids, id];
          return { ids: newIds, count: newIds.length };
        }),

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
    }),
    {
      name: "aura-favorites",
      // Важно: не сохраняем isOpen в localStorage, иначе при обновлении страницы панель может остаться открытой
      partialize: (state) => ({ ids: state.ids, count: state.count }),
    },
  ),
);

export default useFavoritesStore;
