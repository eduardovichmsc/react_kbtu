import type { CategoryItem, Product, ProductsResponse } from "@/types/product";

const BASE_URL = "https://dummyjson.com/products";

export type StockStatus = "all" | "inStock" | "lowStock" | string;
export type PriceRange = "all" | "under50" | "50to200" | "over200" | string;
export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "title-asc"
  | string;

export interface FetchProductsParams {
  search?: string;
  category?: string;
  stockStatus?: StockStatus;
  priceRange?: PriceRange;
  sort?: SortOption;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

export interface PaginatedProductsResult {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface CreateProductInput {
  title: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  brand?: string;
}

export interface UpdateProductInput {
  title?: string;
  price?: number;
  category?: string;
  stock?: number;
  description?: string;
  brand?: string;
}

export async function fetchProducts(
  params: FetchProductsParams = {}
): Promise<PaginatedProductsResult> {
  const {
    search = "",
    category = "",
    stockStatus = "all",
    priceRange = "all",
    sort = "default",
    page = 1,
    limit = 8,
    signal,
  } = params;

  let url = `${BASE_URL}?limit=0`;
  if (category) {
    url = `${BASE_URL}/category/${encodeURIComponent(category)}?limit=0`;
  } else if (search.trim()) {
    url = `${BASE_URL}/search?q=${encodeURIComponent(search.trim())}&limit=0`;
  }

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.statusText} (${response.status})`
    );
  }

  const data: ProductsResponse = await response.json();
  let list = data.products || [];

  if (category && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q))
    );
  }

  if (stockStatus === "inStock") {
    list = list.filter((p) => p.stock > 10);
  } else if (stockStatus === "lowStock") {
    list = list.filter((p) => p.stock <= 10);
  }

  if (priceRange === "under50") {
    list = list.filter((p) => p.price < 50);
  } else if (priceRange === "50to200") {
    list = list.filter((p) => p.price >= 50 && p.price <= 200);
  } else if (priceRange === "over200") {
    list = list.filter((p) => p.price > 200);
  }

  if (sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === "rating-desc") {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sort === "title-asc") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = (safePage - 1) * limit;
  const paginated = list.slice(skip, skip + limit);

  return {
    products: paginated,
    total,
    totalPages,
    currentPage: safePage,
    limit,
  };
}

export async function fetchProductById(
  id: string | number,
  signal?: AbortSignal
): Promise<Product> {
  const numericId = Number(id);
  if (!id || Number.isNaN(numericId) || numericId <= 0) {
    throw new Error(`Invalid product ID "${id}".`);
  }

  const response = await fetch(`${BASE_URL}/${numericId}`, { signal });
  if (response.status === 404) {
    throw new Error(`Product #${id} was not found.`);
  }
  if (!response.ok) {
    throw new Error(`Error loading product #${id} (${response.status})`);
  }

  return response.json();
}

export async function fetchCategories(
  signal?: AbortSignal
): Promise<CategoryItem[]> {
  const response = await fetch(`${BASE_URL}/categories`, { signal });
  if (!response.ok) {
    throw new Error("Failed to load categories.");
  }
  const rawData: unknown = await response.json();

  if (Array.isArray(rawData) && rawData.length > 0) {
    if (typeof rawData[0] === "string") {
      return (rawData as string[]).map((c) => ({
        slug: c,
        name: c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " "),
      }));
    }
    return rawData as CategoryItem[];
  }
  return [];
}

export async function fetchAllProducts(
  signal?: AbortSignal
): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}?limit=0`, { signal });
  if (!response.ok) {
    throw new Error("Failed to load dashboard product data.");
  }
  const data: ProductsResponse = await response.json();
  return data.products || [];
}

export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const response = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to create product (${response.status})`);
  }

  return response.json();
}

export async function updateProduct(
  id: string | number,
  input: UpdateProductInput
): Promise<Product> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to update product #${id} (${response.status})`);
  }

  return response.json();
}

export async function deleteProduct(
  id: string | number
): Promise<{ id: number; isDeleted: boolean }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete product #${id} (${response.status})`);
  }

  return response.json();
}
