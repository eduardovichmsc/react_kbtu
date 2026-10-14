import type {
  Product,
  PricingPackage,
  ProductsQueryParams,
  PaginatedProductsResponse,
  CategorySummary,
  ContactRequestPayload,
  CreateProductPayload,
} from "@/shared/types";

export type {
  ProductsQueryParams,
  PaginatedProductsResponse,
  CategorySummary,
  ContactRequestPayload,
  CreateProductPayload,
};

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function getProducts(
  params: ProductsQueryParams = {},
): Promise<PaginatedProductsResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.category && params.category !== "Все")
    searchParams.set("category", params.category);
  if (params.inStock !== undefined)
    searchParams.set("inStock", String(params.inStock));
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit !== undefined)
    searchParams.set("limit", String(params.limit));

  const res = await fetch(
    `${API_BASE_URL}/products?${searchParams.toString()}`,
  );
  if (!res.ok) {
    throw new Error(
      `Ошибка загрузки каталога (${res.status} ${res.statusText})`,
    );
  }
  return await res.json();
}

export async function getProductById(id: number): Promise<Product | null> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(
      `Не удалось загрузить товар (${res.status} ${res.statusText})`,
    );
  }
  return await res.json();
}

export async function getCategories(): Promise<CategorySummary[]> {
  const res = await fetch(`${API_BASE_URL}/products/categories`);
  if (!res.ok) {
    throw new Error(
      `Не удалось загрузить категории (${res.status} ${res.statusText})`,
    );
  }
  return await res.json();
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products/featured`);
  if (!res.ok) {
    throw new Error(
      `Не удалось загрузить избранные товары (${res.status} ${res.statusText})`,
    );
  }
  return await res.json();
}

export async function getPricingPackages(): Promise<PricingPackage[]> {
  const res = await fetch(`${API_BASE_URL}/pricing`);
  if (!res.ok) {
    throw new Error(
      `Не удалось загрузить тарифы (${res.status} ${res.statusText})`,
    );
  }
  return await res.json();
}

export async function sendContactRequest(payload: ContactRequestPayload) {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(
      `Не удалось отправить заявку (${res.status} ${res.statusText})`,
    );
  }
  return await res.json();
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message =
      errorBody?.message ||
      `Не удалось создать товар (${res.status} ${res.statusText})`;
    throw new Error(
      Array.isArray(message) ? message.join(", ") : String(message),
    );
  }
  return await res.json();
}

export const api = {
  getProducts,
  getProductById,
  getCategories,
  getFeaturedProducts,
  getPricingPackages,
  sendContactRequest,
  createProduct,
};

export default api;
