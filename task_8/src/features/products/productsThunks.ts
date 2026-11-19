import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import * as api from "@/services/productsApi";
import type { Product } from "@/types/product";
import {
  applyLocalChanges,
  filterSortPaginate,
  queryKey,
  type PageResult,
  type ProductsQuery,
} from "./query";
import { shouldFetch } from "./types";

interface ThunkConfig {
  state: RootState;
  rejectValue: string;
}

const message = (e: unknown, fallback: string) =>
  e instanceof Error && e.message ? e.message : fallback;


export interface FetchProductsArg {
  query: ProductsQuery;
  force?: boolean;
}

export const fetchProducts = createAsyncThunk<PageResult, FetchProductsArg, ThunkConfig>(
  "products/fetchList",
  async ({ query, force }, { getState, signal, rejectWithValue }) => {
    try {
      const { all, entities } = getState().products;
      if (!force && !query.category && !query.search && !shouldFetch(all)) {
        const cached = all.ids.map((id) => entities[id]).filter(Boolean);
        return filterSortPaginate(cached, query);
      }
      const source = await api.fetchProductsSource(
        { category: query.category, search: query.search },
        signal
      );
      const merged = applyLocalChanges(source, getState().products.local, {
        category: query.category,
        search: query.search,
      });
      return filterSortPaginate(merged, query);
    } catch (e) {
      return rejectWithValue(message(e, "Failed to load products."));
    }
  },
  {
    condition: ({ query, force }, { getState }) =>
      shouldFetch(getState().products.lists[queryKey(query)], force),
  }
);

export const fetchAllProducts = createAsyncThunk<
  Product[],
  { force?: boolean } | undefined,
  ThunkConfig
>(
  "products/fetchAll",
  async (_, { getState, signal, rejectWithValue }) => {
    try {
      const source = await api.fetchProductsSource({}, signal);
      return applyLocalChanges(source, getState().products.local);
    } catch (e) {
      return rejectWithValue(message(e, "Failed to load dashboard data."));
    }
  },
  {
    condition: (arg, { getState }) => shouldFetch(getState().products.all, arg?.force),
  }
);


export const fetchProductById = createAsyncThunk<
  Product,
  { id: number; force?: boolean },
  ThunkConfig
>(
  "products/fetchById",
  async ({ id }, { getState, signal, rejectWithValue }) => {
    if (!Number.isInteger(id) || id <= 0) {
      return rejectWithValue("Invalid product ID.");
    }
    const { local } = getState().products;
    if (local.deleted.includes(id)) {
      return rejectWithValue(`Product #${id} was deleted.`);
    }
    const created = local.created.find((p) => p.id === id);
    try {
      const product = created ?? (await api.fetchProductById(id, signal));
      return { ...product, ...local.updated[id] };
    } catch (e) {
      return rejectWithValue(message(e, `Error loading product #${id}.`));
    }
  },
  {
    condition: ({ id, force }, { getState }) =>
      shouldFetch(getState().products.details[id], force),
  }
);


const isLocalProduct = (state: RootState, id: number) =>
  state.products.local.created.some((p) => p.id === id);

export const createProduct = createAsyncThunk<Product, api.CreateProductInput, ThunkConfig>(
  "products/create",
  async (input, { getState, rejectWithValue }) => {
    try {
      const saved: Partial<Product> = await api.createProduct(input);
      const state = getState();
      const knownIds = [
        ...(state.products.ids as number[]),
        ...state.products.local.created.map((p) => p.id),
        194,
      ];
      const id = Math.max(...knownIds) + 1;
      return {
        discountPercentage: 0,
        rating: 0,
        thumbnail: "/favicon.svg",
        images: [],
        tags: ["new"],
        ...saved,
        ...input,
        id,
      } as Product;
    } catch (e) {
      return rejectWithValue(message(e, "Failed to create product."));
    }
  }
);

export const updateProduct = createAsyncThunk<
  { id: number; changes: Partial<Product> },
  { id: number; input: api.UpdateProductInput },
  ThunkConfig
>("products/update", async ({ id, input }, { getState, rejectWithValue }) => {
  try {
    if (!isLocalProduct(getState(), id)) await api.updateProduct(id, input);
    return { id, changes: input };
  } catch (e) {
    return rejectWithValue(message(e, `Failed to update product #${id}.`));
  }
});

export const deleteProduct = createAsyncThunk<number, number, ThunkConfig>(
  "products/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      if (!isLocalProduct(getState(), id)) await api.deleteProduct(id);
      return id;
    } catch (e) {
      return rejectWithValue(message(e, `Failed to delete product #${id}.`));
    }
  }
);
