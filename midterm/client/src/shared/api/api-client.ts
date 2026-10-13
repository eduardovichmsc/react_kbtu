import type { Product, PricingPackage } from '../types/index.js';
import { allProducts as fallbackProducts } from '../data/products.js';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface ProductsQueryParams {
  search?: string;
  category?: string;
  inStock?: boolean;
  sort?: 'default' | 'price-asc' | 'price-desc' | 'name-asc';
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
  type: 'QUOTE' | 'CONSULTATION' | 'ORDER';
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  productId?: number;
  productName?: string;
  packageName?: string;
}

export const api = {
  async getProducts(params: ProductsQueryParams = {}): Promise<PaginatedProductsResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set('search', params.search);
      if (params.category && params.category !== 'Все') searchParams.set('category', params.category);
      if (params.inStock !== undefined) searchParams.set('inStock', String(params.inStock));
      if (params.sort) searchParams.set('sort', params.sort);
      if (params.page) searchParams.set('page', String(params.page));
      if (params.limit !== undefined) searchParams.set('limit', String(params.limit));

      const res = await fetch(`${API_BASE_URL}/products?${searchParams.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      // Graceful fallback to local dataset
      let filtered = [...fallbackProducts];
      if (params.search?.trim()) {
        const q = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.specs.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q)),
        );
      }
      if (params.category && params.category !== 'Все') {
        filtered = filtered.filter((p) => p.category === params.category);
      }
      if (params.inStock) {
        filtered = filtered.filter((p) => p.inStock);
      }
      if (params.sort === 'price-asc') {
        filtered.sort((a, b) => a.priceValue - b.priceValue);
      } else if (params.sort === 'price-desc') {
        filtered.sort((a, b) => b.priceValue - a.priceValue);
      } else if (params.sort === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
      }
      const total = filtered.length;
      const limit = params.limit ?? 6;
      const page = params.page ?? 1;
      const items = limit > 0 ? filtered.slice((page - 1) * limit, page * limit) : filtered;
      return {
        items,
        total,
        page,
        limit,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      };
    }
  },

  async getProductById(id: number): Promise<Product | undefined> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return fallbackProducts.find((p) => p.id === id);
    }
  },

  async getCategories(): Promise<CategorySummary[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/categories`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      const map = new Map<string, number>();
      for (const p of fallbackProducts) {
        map.set(p.category, (map.get(p.category) || 0) + 1);
      }
      return [
        { name: 'Все', count: fallbackProducts.length },
        ...Array.from(map.entries()).map(([name, count]) => ({ name, count })),
      ];
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/featured`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return fallbackProducts.filter((p) => p.featured);
    }
  },

  async getPricingPackages(): Promise<PricingPackage[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/pricing`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return [];
    }
  },

  async sendContactRequest(payload: ContactRequestPayload) {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API submission offline, recorded locally', payload, err);
      return { success: true, localOnly: true, ...payload };
    }
  },
};
