import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchProducts } from "@/features/products/productsThunks";
import {
  selectListEntry,
  selectListProducts,
} from "@/features/products/productsSelectors";
import { normalizeQuery, queryKey, type ProductsQuery } from "@/features/products/query";
import { needsFetch } from "@/features/products/types";

type Pending = { key: string; abort: () => void };

export function useProducts(params: Partial<ProductsQuery>) {
  const dispatch = useAppDispatch();
  const { search, category, stockStatus, priceRange, sort, page, limit } = params;
  const query = useMemo(
    () => normalizeQuery({ search, category, stockStatus, priceRange, sort, page, limit }),
    [search, category, stockStatus, priceRange, sort, page, limit]
  );
  const key = queryKey(query);

  const entry = useAppSelector((s) => selectListEntry(s, query));
  const products = useAppSelector((s) => selectListProducts(s, query));
  const shouldRequest = needsFetch(entry);
  const pending = useRef<Pending | null>(null);

  useEffect(() => {
    if (pending.current && pending.current.key !== key) {
      pending.current.abort();
      pending.current = null;
    }
    if (!shouldRequest) return;
    const promise = dispatch(fetchProducts({ query }));
    pending.current = { key, abort: () => promise.abort() };
  }, [dispatch, key, query, shouldRequest]);

  const refetch = useCallback(() => {
    const promise = dispatch(fetchProducts({ query, force: true }));
    pending.current = { key, abort: () => promise.abort() };
  }, [dispatch, key, query]);

  const hasData = Boolean(entry?.fetchedAt);
  const failed = entry?.status === "failed";
  return {
    products,
    total: entry?.total ?? 0,
    totalPages: entry?.totalPages ?? 1,
    currentPage: entry?.currentPage ?? query.page,
    limit: entry?.limit ?? query.limit,
    loading: !hasData && !failed,
    isFetching: entry?.status === "loading",
    error: failed ? entry.error : null,
    isEmpty: hasData && !failed && products.length === 0,
    refetch,
  };
}
