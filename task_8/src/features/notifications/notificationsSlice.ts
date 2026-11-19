import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/features/products/productsThunks";

export interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface NotificationsState {
  items: Notification[];
}

const initialState: NotificationsState = { items: [] };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notify: {
      reducer(state, action: PayloadAction<Notification>) {
        state.items.push(action.payload);
      },
      prepare(message: string, type: Notification["type"] = "info") {
        return { payload: { id: crypto.randomUUID(), message, type } };
      },
    },
    dismissNotification(state, action: PayloadAction<string>) {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push({
          id: action.meta.requestId,
          type: "success",
          message: `Created "${action.payload.title}" (#${action.payload.id}). Catalog refreshed.`,
        });
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.items.push({
          id: action.meta.requestId,
          type: "success",
          message: `Product #${action.payload.id} updated. Affected views refreshed.`,
        });
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items.push({
          id: action.meta.requestId,
          type: "success",
          message: `Product #${action.payload} deleted.`,
        });
      })
      .addMatcher(
        isAnyOf(createProduct.rejected, updateProduct.rejected, deleteProduct.rejected),
        (state, action) => {
          state.items.push({
            id: action.meta.requestId,
            type: "error",
            message: action.payload ?? "Operation failed.",
          });
        }
      );
  },
});

export const selectNotifications = (state: RootState) => state.notifications.items;

export const { notify, dismissNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
