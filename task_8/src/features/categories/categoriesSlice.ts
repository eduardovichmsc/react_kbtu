import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { fetchCategories as fetchCategoriesApi } from "@/services/productsApi";
import type { CategoryItem } from "@/types/product";
import type { RequestStatus } from "@/features/products/types";

interface CategoriesState {
  items: CategoryItem[];
  status: RequestStatus;
  error: string | null;
}

const initialState: CategoriesState = { items: [], status: "idle", error: null };

export const fetchCategories = createAsyncThunk<
  CategoryItem[],
  { force?: boolean } | undefined,
  { state: RootState; rejectValue: string }
>(
  "categories/fetch",
  async (_, { signal, rejectWithValue }) => {
    try {
      return await fetchCategoriesApi(signal);
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Failed to load categories.");
    }
  },
  {
    condition: (arg, { getState }) => {
      const { status } = getState().categories;
      if (status === "loading") return false;
      return arg?.force || status !== "succeeded";
    },
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = action.meta.aborted ? "idle" : "failed";
        state.error = action.payload ?? action.error.message ?? "Request failed";
      });
  },
});

export const selectCategories = (state: RootState) => state.categories.items;
export const selectCategoriesStatus = (state: RootState) => state.categories.status;
export const selectCategoriesError = (state: RootState) => state.categories.error;

export default categoriesSlice.reducer;
