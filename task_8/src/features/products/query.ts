import type { Product } from "@/types/product";

export interface ProductsQuery {
  search: string;
  category: string;
  stockStatus: string;
  priceRange: string;
  sort: string;
  page: number;
  limit: number;
}

export const DEFAULT_QUERY: ProductsQuery = {
  search: "",
  category: "",
  stockStatus: "all",
  priceRange: "all",
  sort: "default",
  page: 1,
  limit: 8,
};

export function normalizeQuery(q: Partial<ProductsQuery>): ProductsQuery {
  return { ...DEFAULT_QUERY, ...q, search: (q.search ?? "").trim() };
}

export function queryKey(q: ProductsQuery): string {
  return [
    q.search.toLowerCase(),
    q.category,
    q.stockStatus,
    q.priceRange,
    q.sort,
    q.page,
    q.limit,
  ].join("|");
}

export interface LocalChanges {
  created: Product[];
  updated: Record<number, Partial<Product>>;
  deleted: number[];
}

export function applyLocalChanges(
  list: Product[],
  changes: LocalChanges,
  source: { category?: string; search?: string } = {}
): Product[] {
  const deleted = new Set(changes.deleted);
  const result = list
    .filter((p) => !deleted.has(p.id))
    .map((p) => (changes.updated[p.id] ? { ...p, ...changes.updated[p.id] } : p));

  const q = source.search?.trim().toLowerCase();
  const extra = changes.created
    .filter((p) => !deleted.has(p.id))
    .map((p) => (changes.updated[p.id] ? { ...p, ...changes.updated[p.id] } : p))
    .filter((p) => !source.category || p.category === source.category)
    .filter((p) => !q || matchesSearch(p, q));

  return [...extra, ...result];
}

function matchesSearch(p: Product, q: string) {
  return (
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    (p.brand?.toLowerCase().includes(q) ?? false)
  );
}

export interface PageResult {
  ids: number[];
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export function filterSortPaginate(
  source: Product[],
  q: ProductsQuery
): PageResult {
  let list = [...source];

  if (q.category && q.search) {
    const s = q.search.toLowerCase();
    list = list.filter((p) => matchesSearch(p, s));
  }

  if (q.stockStatus === "inStock") list = list.filter((p) => p.stock > 10);
  else if (q.stockStatus === "lowStock") list = list.filter((p) => p.stock <= 10);

  if (q.priceRange === "under50") list = list.filter((p) => p.price < 50);
  else if (q.priceRange === "50to200")
    list = list.filter((p) => p.price >= 50 && p.price <= 200);
  else if (q.priceRange === "over200") list = list.filter((p) => p.price > 200);

  if (q.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (q.sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (q.sort === "rating-desc") list.sort((a, b) => b.rating - a.rating);
  else if (q.sort === "title-asc") list.sort((a, b) => a.title.localeCompare(b.title));

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / q.limit));
  const currentPage = Math.min(Math.max(1, q.page), totalPages);
  const skip = (currentPage - 1) * q.limit;
  const products = list.slice(skip, skip + q.limit);

  return {
    ids: products.map((p) => p.id),
    products,
    total,
    totalPages,
    currentPage,
    limit: q.limit,
  };
}
