import {
  createEntityAdapter,
  createSlice,
  isAnyOf,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Product } from "@/types/product";
import { queryKey, type LocalChanges } from "./query";
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from "./productsThunks";
import { emptyMeta, type AllEntry, type ListEntry, type RequestMeta } from "./types";

export const productsAdapter = createEntityAdapter<Product>();

export interface ProductsState extends EntityState<Product, number> {
  lists: Record<string, ListEntry>;
  all: AllEntry;
  details: Record<number, RequestMeta>;
  local: LocalChanges;
  mutation: { status: "idle" | "pending" | "failed"; error: string | null };
}

export const emptyLocalChanges = (): LocalChanges => ({
  created: [],
  updated: {},
  deleted: [],
});

export const createProductsInitialState = (
  local: LocalChanges = emptyLocalChanges()
): ProductsState =>
  productsAdapter.getInitialState({
    lists: {},
    all: { ...emptyMeta(), ids: [] },
    details: {},
    local,
    mutation: { status: "idle", error: null },
  });

const emptyList = (): ListEntry => ({
  ...emptyMeta(),
  ids: [],
  total: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 8,
});

function startRequest(meta: RequestMeta, requestId: string) {
  meta.status = "loading";
  meta.error = null;
  meta.requestId = requestId;
}

function finishRequest(meta: RequestMeta) {
  meta.status = "succeeded";
  meta.error = null;
  meta.fetchedAt = Date.now();
  meta.stale = false;
}

function failRequest(
  meta: RequestMeta,
  action: { payload?: string; error: { message?: string }; meta: { aborted: boolean } }
) {
  if (action.meta.aborted) {
    meta.status = meta.fetchedAt ? "succeeded" : "idle";
    return;
  }
  meta.status = "failed";
  meta.error = action.payload ?? action.error.message ?? "Request failed";
}

function invalidateAll(state: ProductsState) {
  Object.values(state.lists).forEach((l) => (l.stale = true));
  state.all.stale = true;
}

const productsSlice = createSlice({
  name: "products",
  initialState: () => createProductsInitialState(),
  reducers: {
    invalidateProducts(state) {
      invalidateAll(state);
    },
    clearMutationError(state) {
      state.mutation = { status: "idle", error: null };
    },
    resetLocalChanges(state) {
      state.local = emptyLocalChanges();
      state.details = {};
      invalidateAll(state);
    },
    hydrateLocalChanges(state, action: PayloadAction<LocalChanges>) {
      state.local = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        const key = queryKey(action.meta.arg.query);
        state.lists[key] ??= emptyList();
        startRequest(state.lists[key], action.meta.requestId);
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const entry = state.lists[queryKey(action.meta.arg.query)];
        if (!entry || entry.requestId !== action.meta.requestId) return;
        const { products, ids, total, totalPages, currentPage, limit } = action.payload;
        productsAdapter.upsertMany(state, products);
        Object.assign(entry, { ids, total, totalPages, currentPage, limit });
        finishRequest(entry);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        const entry = state.lists[queryKey(action.meta.arg.query)];
        if (!entry || entry.requestId !== action.meta.requestId) return;
        failRequest(entry, action);
      })

      .addCase(fetchAllProducts.pending, (state, action) => {
        startRequest(state.all, action.meta.requestId);
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        if (state.all.requestId !== action.meta.requestId) return;
        productsAdapter.upsertMany(state, action.payload);
        state.all.ids = action.payload.map((p) => p.id);
        finishRequest(state.all);
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        if (state.all.requestId !== action.meta.requestId) return;
        failRequest(state.all, action);
      })

      .addCase(fetchProductById.pending, (state, action) => {
        const { id } = action.meta.arg;
        state.details[id] ??= emptyMeta();
        startRequest(state.details[id], action.meta.requestId);
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const meta = state.details[action.meta.arg.id];
        if (!meta || meta.requestId !== action.meta.requestId) return;
        productsAdapter.upsertOne(state, action.payload);
        finishRequest(meta);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        const meta = state.details[action.meta.arg.id];
        if (!meta || meta.requestId !== action.meta.requestId) return;
        failRequest(meta, action);
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.local.created.unshift(action.payload);
        productsAdapter.addOne(state, action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        state.local.updated[id] = { ...state.local.updated[id], ...changes };
        productsAdapter.updateOne(state, { id, changes });
        if (state.details[id]) state.details[id].stale = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const id = action.payload;
        if (state.local.created.some((p) => p.id === id)) {
          state.local.created = state.local.created.filter((p) => p.id !== id);
        } else if (!state.local.deleted.includes(id)) {
          state.local.deleted.push(id);
        }
        delete state.local.updated[id];
        productsAdapter.removeOne(state, id);
        delete state.details[id];
        Object.values(state.lists).forEach((l) => {
          l.ids = l.ids.filter((x) => x !== id);
        });
        state.all.ids = state.all.ids.filter((x) => x !== id);
      })
      .addMatcher(
        isAnyOf(createProduct.fulfilled, updateProduct.fulfilled, deleteProduct.fulfilled),
        (state) => {
          state.mutation = { status: "idle", error: null };
          invalidateAll(state);
        }
      )
      .addMatcher(
        isAnyOf(createProduct.pending, updateProduct.pending, deleteProduct.pending),
        (state) => {
          state.mutation = { status: "pending", error: null };
        }
      )
      .addMatcher(
        isAnyOf(createProduct.rejected, updateProduct.rejected, deleteProduct.rejected),
        (state, action) => {
          state.mutation = {
            status: "failed",
            error: action.payload ?? action.error.message ?? "Operation failed",
          };
        }
      );
  },
});

export const {
  invalidateProducts,
  clearMutationError,
  resetLocalChanges,
  hydrateLocalChanges,
} = productsSlice.actions;
export default productsSlice.reducer;
