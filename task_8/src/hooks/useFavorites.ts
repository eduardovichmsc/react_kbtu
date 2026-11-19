import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useAuth } from "@/context/useAuth";
import {
  selectFavoriteIdSet,
  selectFavoriteIds,
  selectFavoriteProducts,
  toggleFavorite,
} from "@/features/favorites/favoritesSlice";

export function useFavorites() {
  const { user } = useAuth();
  const uid = user?.uid;
  const dispatch = useAppDispatch();

  const ids = useAppSelector((s) => selectFavoriteIds(s, uid));
  const idSet = useAppSelector((s) => selectFavoriteIdSet(s, uid));
  const products = useAppSelector((s) => selectFavoriteProducts(s, uid));

  const toggle = useCallback(
    (productId: number) => {
      if (uid) dispatch(toggleFavorite({ uid, productId }));
    },
    [dispatch, uid]
  );

  return {
    enabled: Boolean(uid),
    ids,
    products,
    isFavorite: (id: number) => idSet.has(id),
    toggle,
  };
}
