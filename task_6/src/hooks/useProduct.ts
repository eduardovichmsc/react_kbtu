import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/services/service";
import type { Product } from "@/types/product";

export function useProduct(id?: string | number) {
  const queryKey = ["product", String(id)] as const;

  const { data, isLoading, isFetching, error, refetch } = useQuery<
    Product,
    Error
  >({
    queryKey,
    queryFn: ({ signal }) => fetchProductById(id!, signal),
    enabled: Boolean(id),
  });

  return {
    product: data || null,
    loading: isLoading,
    isFetching,
    error: error ? error.message : null,
    refetch,
  };
}
