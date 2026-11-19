import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchAllProducts } from "@/features/products/productsThunks";
import { selectAllEntry } from "@/features/products/productsSelectors";
import { needsFetch } from "@/features/products/types";

export function useAllProducts() {
  const dispatch = useAppDispatch();
  const entry = useAppSelector(selectAllEntry);
  const shouldRequest = needsFetch(entry);

  useEffect(() => {
    if (shouldRequest) dispatch(fetchAllProducts());
  }, [dispatch, shouldRequest]);

  const refetch = useCallback(() => {
    dispatch(fetchAllProducts({ force: true }));
  }, [dispatch]);

  const failed = entry.status === "failed";
  return {
    loading: !entry.fetchedAt && !failed,
    isFetching: entry.status === "loading",
    error: failed ? entry.error : null,
    fetchedAt: entry.fetchedAt,
    refetch,
  };
}
