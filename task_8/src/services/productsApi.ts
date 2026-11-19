import type { CategoryItem, Product, ProductsResponse } from "@/types/product";

const BASE_URL = "https://dummyjson.com/products";

export interface CreateProductInput {
  title: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  brand?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ApiError(
      navigator.onLine
        ? "Network error. The server could not be reached."
        : "You are offline and this data is not cached yet.",
      0
    );
  }
  if (!response.ok) {
    throw new ApiError(
      `Request failed: ${response.statusText || "error"} (${response.status})`,
      response.status
    );
  }
  return response.json() as Promise<T>;
}

export async function fetchProductsSource(
  { category, search }: { category?: string; search?: string },
  signal?: AbortSignal
): Promise<Product[]> {
  let url = `${BASE_URL}?limit=0`;
  if (category) {
    url = `${BASE_URL}/category/${encodeURIComponent(category)}?limit=0`;
  } else if (search?.trim()) {
    url = `${BASE_URL}/search?q=${encodeURIComponent(search.trim())}&limit=0`;
  }
  const data = await request<ProductsResponse>(url, { signal });
  return data.products ?? [];
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal
): Promise<Product> {
  try {
    return await request<Product>(`${BASE_URL}/${id}`, { signal });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError(`Product #${id} was not found.`, 404);
    }
    throw error;
  }
}

export async function fetchCategories(
  signal?: AbortSignal
): Promise<CategoryItem[]> {
  const raw = await request<unknown>(`${BASE_URL}/categories`, { signal });
  if (!Array.isArray(raw)) return [];
  if (typeof raw[0] === "string") {
    return (raw as string[]).map((c) => ({
      slug: c,
      name: c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " "),
    }));
  }
  return raw as CategoryItem[];
}

export function createProduct(input: CreateProductInput): Promise<Product> {
  return request<Product>(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateProduct(
  id: number,
  input: UpdateProductInput
): Promise<Product> {
  return request<Product>(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteProduct(
  id: number
): Promise<Product & { isDeleted: boolean }> {
  return request(`${BASE_URL}/${id}`, { method: "DELETE" });
}
