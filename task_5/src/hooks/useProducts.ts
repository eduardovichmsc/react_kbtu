import { useEffect, useState } from "react";
import {
  fetchProducts,
  type FetchProductsParams,
  type PaginatedProductsResult,
} from "@/services/service";

export function useProducts(params: FetchProductsParams) {
  const {
    search = "",
    category = "",
    stockStatus = "all",
    priceRange = "all",
    sort = "default",
    page = 1,
    limit = 8,
  } = params;

  const queryKey = `${search}|${category}|${stockStatus}|${priceRange}|${sort}|${page}|${limit}`;

  const [state, setState] = useState<{
    key: string;
    loading: boolean;
    error: string | null;
    data: PaginatedProductsResult | null;
  }>({
    key: queryKey,
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts({
      search,
      category,
      stockStatus,
      priceRange,
      sort,
      page,
      limit,
      signal: controller.signal,
    })
      .then((data) => {
        setState({
          key: queryKey,
          loading: false,
          error: null,
          data,
        });
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setState({
            key: queryKey,
            loading: false,
            error: err.message || "Failed to load products",
            data: null,
          });
        }
      });

    return () => {
      controller.abort();
    };
  }, [search, category, stockStatus, priceRange, sort, page, limit, queryKey]);

  const isCurrent = state.key === queryKey;

  return {
    loading: !isCurrent || state.loading,
    error: isCurrent ? state.error : null,
    data: isCurrent ? state.data : null,
  };
}
