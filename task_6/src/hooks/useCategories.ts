import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/service";
import type { CategoryItem } from "@/types/product";

export function useCategories() {
  const { data, isLoading, error } = useQuery<CategoryItem[], Error>({
    queryKey: ["categories"],
    queryFn: ({ signal }) => fetchCategories(signal),
  });

  return {
    categories: data || [],
    loading: isLoading,
    error: error ? error.message : null,
  };
}

