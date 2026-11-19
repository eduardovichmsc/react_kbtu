import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchProductById } from "@/features/products/productsThunks";
import {
  selectProductById,
  selectProductDetailsMeta,
} from "@/features/products/productsSelectors";
import { needsFetch } from "@/features/products/types";

export function useProduct(rawId?: string) {
  const dispatch = useAppDispatch();
  const id = Number(rawId);

  const product = useAppSelector((s) => selectProductById(s, id));
  const meta = useAppSelector((s) => selectProductDetailsMeta(s, id));
  const shouldRequest = needsFetch(meta);
  const pending = useRef<{ id: number; abort: () => void } | null>(null);

  useEffect(() => {
    if (pending.current && pending.current.id !== id) {
      pending.current.abort();
      pending.current = null;
    }
    if (!shouldRequest) return;
    const promise = dispatch(fetchProductById({ id }));
    pending.current = { id, abort: () => promise.abort() };
  }, [dispatch, id, shouldRequest]);

  const refetch = useCallback(() => {
    dispatch(fetchProductById({ id, force: true }));
  }, [dispatch, id]);

  const failed = meta?.status === "failed";
  return {
    product: failed ? null : (product ?? null),
    loading: !product && !failed,
    isFetching: meta?.status === "loading",
    error: failed ? meta.error : null,
    refetch,
  };
}
