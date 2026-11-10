import { useQuery } from "@tanstack/react-query";
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

  const queryKey = [
    "products",
    { search, category, stockStatus, priceRange, sort, page, limit },
  ] as const;

  const { data, isLoading, isFetching, error, refetch } = useQuery<
    PaginatedProductsResult,
    Error
  >({
    queryKey,
    queryFn: ({ signal }) =>
      fetchProducts({
        search,
        category,
        stockStatus,
        priceRange,
        sort,
        page,
        limit,
        signal,
      }),
  });

  return {
    data: data || null,
    loading: isLoading,
    isFetching,
    error: error ? error.message : null,
    refetch,
  };
}
