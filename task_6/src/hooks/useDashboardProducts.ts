import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/services/service";
import type { Product } from "@/types/product";

export function useDashboardProducts() {
  const { data, isLoading, isFetching, error, refetch } = useQuery<
    Product[],
    Error
  >({
    queryKey: ["dashboard-products"],
    queryFn: ({ signal }) => fetchAllProducts(signal),
  });

  return {
    products: data || [],
    loading: isLoading,
    isFetching,
    error: error ? error.message : null,
    refetch,
  };
}

