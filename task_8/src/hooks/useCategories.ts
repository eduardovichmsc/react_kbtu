import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchCategories,
  selectCategories,
  selectCategoriesError,
  selectCategoriesStatus,
} from "@/features/categories/categoriesSlice";

export function useCategories() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const status = useAppSelector(selectCategoriesStatus);
  const error = useAppSelector(selectCategoriesError);

  useEffect(() => {
    if (status === "idle") dispatch(fetchCategories());
  }, [dispatch, status]);

  return {
    categories,
    loading: status === "idle" || status === "loading",
    error: status === "failed" ? error : null,
    retry: () => dispatch(fetchCategories({ force: true })),
  };
}
