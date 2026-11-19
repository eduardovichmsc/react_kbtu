import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/features/products/productsThunks";
import { selectMutationState } from "@/features/products/productsSelectors";
import type { CreateProductInput, UpdateProductInput } from "@/services/productsApi";

export function useProductMutations() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(selectMutationState);

  return {
    createProduct: useCallback(
      (input: CreateProductInput) => dispatch(createProduct(input)).unwrap(),
      [dispatch]
    ),
    updateProduct: useCallback(
      (id: number, input: UpdateProductInput) =>
        dispatch(updateProduct({ id, input })).unwrap(),
      [dispatch]
    ),
    deleteProduct: useCallback(
      (id: number) => dispatch(deleteProduct(id)).unwrap(),
      [dispatch]
    ),
    isMutating: status === "pending",
    error,
  };
}
