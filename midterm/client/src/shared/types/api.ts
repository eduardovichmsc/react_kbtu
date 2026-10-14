import type { Product } from "./product";

export interface ProductsQueryParams {
  search?: string;
  category?: string;
  inStock?: boolean;
  sort?: "default" | "price-asc" | "price-desc" | "name-asc";
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategorySummary {
  name: string;
  count: number;
}

export interface ContactRequestPayload {
  type: "QUOTE" | "CONSULTATION" | "ORDER";
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  productId?: number;
  productName?: string;
  packageName?: string;
}

export interface CreateProductPayload {
  name: string;
  price: string;
  priceValue: number;
  category: string;
  specs: string;
  img: string;
  gallery?: string[];
  description?: string;
  dimensions?: string;
  materials?: string;
  origin?: string;
  features?: string[];
  inStock?: boolean;
  featured?: boolean;
}
