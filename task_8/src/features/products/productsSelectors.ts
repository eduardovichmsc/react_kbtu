import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Product } from "@/types/product";
import { productsAdapter } from "./productsSlice";
import { queryKey, type ProductsQuery } from "./query";


const adapterSelectors = productsAdapter.getSelectors<RootState>((s) => s.products);

export const selectProductEntities = adapterSelectors.selectEntities;
export const selectProductById = (state: RootState, id: number): Product | undefined =>
  adapterSelectors.selectById(state, id);

export const selectListEntry = (state: RootState, query: ProductsQuery) =>
  state.products.lists[queryKey(query)];

export const selectProductDetailsMeta = (state: RootState, id: number) =>
  state.products.details[id];

export const selectAllEntry = (state: RootState) => state.products.all;
export const selectMutationState = (state: RootState) => state.products.mutation;
export const selectIsMutating = (state: RootState) =>
  state.products.mutation.status === "pending";
export const selectLocalChangesCount = (state: RootState) =>
  state.products.local.created.length +
  Object.keys(state.products.local.updated).length +
  state.products.local.deleted.length;


const EMPTY: Product[] = [];

const resolve = (entities: Record<number, Product>, ids: number[]) =>
  ids.map((id) => entities[id]).filter((p): p is Product => Boolean(p));

export const selectListProducts = createSelector(
  [selectProductEntities, selectListEntry],
  (entities, entry): Product[] => (entry ? resolve(entities, entry.ids) : EMPTY)
);

export const selectAllProducts = createSelector(
  [selectProductEntities, (s: RootState) => s.products.all.ids],
  (entities, ids): Product[] => resolve(entities, ids)
);

export const selectDashboardCategories = createSelector([selectAllProducts], (products) =>
  Array.from(new Set(products.map((p) => p.category))).sort()
);

export const selectDashboardFiltered = createSelector(
  [
    selectAllProducts,
    (_: RootState, category: string) => category,
    (_: RootState, _category: string, stock: string) => stock,
  ],
  (products, category, stock) =>
    products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (stock === "inStock" && p.stock <= 10) return false;
      if (stock === "lowStock" && p.stock > 10) return false;
      return true;
    })
);

export const selectDashboardAnalytics = createSelector([selectDashboardFiltered], (list) => {
  const totalCount = list.length;
  const sum = (fn: (p: Product) => number) => list.reduce((acc, p) => acc + fn(p), 0);

  const stats = {
    totalCount,
    avgPrice: totalCount ? sum((p) => p.price) / totalCount : 0,
    totalStock: sum((p) => p.stock),
    avgRating: totalCount ? sum((p) => p.rating) / totalCount : 0,
    totalInventoryValue: sum((p) => p.price * p.stock),
  };

  const byCategory = new Map<string, { count: number; sumPrice: number }>();
  list.forEach((p) => {
    const cur = byCategory.get(p.category) ?? { count: 0, sumPrice: 0 };
    byCategory.set(p.category, { count: cur.count + 1, sumPrice: cur.sumPrice + p.price });
  });
  const categoryBreakdown = Array.from(byCategory, ([name, d]) => ({
    name,
    count: d.count,
    avgPrice: d.sumPrice / d.count,
  })).sort((a, b) => b.count - a.count);

  const out = list.filter((p) => p.stock === 0).length;
  const low = list.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const healthy = totalCount - out - low;
  const base = totalCount || 1;
  const stockBreakdown = [
    { label: "Healthy Stock (> 10 units)", count: healthy, pct: (healthy / base) * 100, color: "bg-emerald-500" },
    { label: "Low Stock (1–10 units)", count: low, pct: (low / base) * 100, color: "bg-amber-500" },
    { label: "Out of Stock (0 units)", count: out, pct: (out / base) * 100, color: "bg-red-500" },
  ];

  const topRated = [...list].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return { stats, categoryBreakdown, stockBreakdown, topRated };
});
