import { useEffect, useState } from "react";
import { fetchProductById } from "@/services/service";
import type { Product } from "@/types/product";

export function useProduct(id?: string) {
  const [state, setState] = useState<{
    id?: string;
    loading: boolean;
    error: string | null;
    product: Product | null;
  }>({
    id,
    loading: Boolean(id),
    error: id ? null : "No product ID was provided.",
    product: null,
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    let ignore = false;
    const controller = new AbortController();

    fetchProductById(id, controller.signal)
      .then((product) => {
        if (!ignore) {
          setState({
            id,
            loading: false,
            error: null,
            product,
          });
        }
      })
      .catch((err) => {
        if (!ignore && err.name !== "AbortError") {
          setState({
            id,
            loading: false,
            error: err.message || "Failed to load product",
            product: null,
          });
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id]);

  const isCurrent = state.id === id;

  return {
    loading: !isCurrent || state.loading,
    error: isCurrent ? state.error : null,
    product: isCurrent ? state.product : null,
  };
}
