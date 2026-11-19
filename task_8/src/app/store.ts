import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer, {
  createProductsInitialState,
} from "@/features/products/productsSlice";
import categoriesReducer from "@/features/categories/categoriesSlice";
import favoritesReducer, {
  createFavoritesInitialState,
} from "@/features/favorites/favoritesSlice";
import notificationsReducer from "@/features/notifications/notificationsSlice";
import { loadPersisted, savePersisted } from "./persist";

const rootReducer = combineReducers({
  products: productsReducer,
  categories: categoriesReducer,
  favorites: favoritesReducer,
  notifications: notificationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore() {
  const persisted = loadPersisted();

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      products: createProductsInitialState(persisted.local),
      favorites: createFavoritesInitialState(persisted.favorites),
    },
  });

  let prevLocal = store.getState().products.local;
  let prevFav = store.getState().favorites.byUser;
  store.subscribe(() => {
    const state = store.getState();
    if (state.products.local !== prevLocal || state.favorites.byUser !== prevFav) {
      prevLocal = state.products.local;
      prevFav = state.favorites.byUser;
      savePersisted({ local: prevLocal, favorites: prevFav });
    }
  });

  return store;
}

export const store = makeStore();

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
