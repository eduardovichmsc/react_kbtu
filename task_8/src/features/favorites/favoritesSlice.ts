import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { deleteProduct } from "@/features/products/productsThunks";
import { selectProductEntities } from "@/features/products/productsSelectors";
import type { Product } from "@/types/product";

export interface FavoritesState {
  byUser: Record<string, number[]>;
}

export const createFavoritesInitialState = (
  byUser: Record<string, number[]> = {}
): FavoritesState => ({ byUser });

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: () => createFavoritesInitialState(),
  reducers: {
    toggleFavorite(state, action: PayloadAction<{ uid: string; productId: number }>) {
      const { uid, productId } = action.payload;
      const list = (state.byUser[uid] ??= []);
      const idx = list.indexOf(productId);
      if (idx >= 0) list.splice(idx, 1);
      else list.unshift(productId);
    },
    clearFavorites(state, action: PayloadAction<string>) {
      delete state.byUser[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      for (const uid of Object.keys(state.byUser)) {
        state.byUser[uid] = state.byUser[uid].filter((id) => id !== action.payload);
      }
    });
  },
});

const EMPTY_IDS: number[] = [];

export const selectFavoriteIds = (state: RootState, uid: string | undefined) =>
  (uid && state.favorites.byUser[uid]) || EMPTY_IDS;

export const selectFavoriteProducts = createSelector(
  [selectProductEntities, selectFavoriteIds],
  (entities, ids): Product[] =>
    ids.map((id) => entities[id]).filter((p): p is Product => Boolean(p))
);

export const selectFavoriteIdSet = createSelector(
  [selectFavoriteIds],
  (ids) => new Set(ids)
);

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
