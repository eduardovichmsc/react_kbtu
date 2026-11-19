# Catalog & Inventory — Redux Toolkit refactor (Homework 8)

React 19 + TypeScript + Vite app (catalog, product details, CRUD, inventory dashboard,
Firebase auth, PWA). Global state and async operations are managed by **Redux Toolkit**
(React Query from the previous homework was removed; no other state library is used).

- **Deployed app:** _add URL here_
- **Repository:** _add GitHub link here_

```bash
npm install
cp .env.example .env.local   # optional: Firebase keys (otherwise local demo auth is used)
npm run dev                  # development
npm run build && npm run preview   # production build with Service Worker
```

## Project structure

```
src/
├── app/                 store.ts (configureStore), hooks.ts (typed useSelector/useDispatch), persist.ts
├── features/            Redux logic, grouped by feature
│   ├── products/        productsSlice.ts, productsThunks.ts, productsSelectors.ts, query.ts, types.ts
│   ├── categories/      categoriesSlice.ts (slice + thunk + selectors)
│   ├── favorites/       favoritesSlice.ts (personalized, per user)
│   └── notifications/   notificationsSlice.ts (global toasts)
├── services/            API layer only (fetch): productsApi.ts, auth.ts
├── hooks/               custom hooks that connect Redux to UI: useProducts, useProduct,
│                        useAllProducts, useCategories, useProductMutations, useFavorites,
│                        useDebounce, useOnlineStatus
├── context/             AuthContext (authentication stays in Context)
├── components/, pages/, layouts/   UI only
```

`<Provider store={store}>` wraps the app in `main.tsx`.

## Redux slices

| Slice | State | Purpose |
|---|---|---|
| `products` | `entities/ids` (createEntityAdapter), `lists` (cache per query key), `all`, `details`, `local`, `mutation` | Normalized products — each product is stored **once**; lists, dashboard and details hold only ids + request metadata (`status`, `error`, `requestId`, `fetchedAt`, `stale`). `local` keeps CRUD changes (DummyJSON does not persist writes) and re-applies them to every server response. |
| `categories` | `items`, `status`, `error` | Category list, fetched once per session. |
| `favorites` | `byUser: { [uid]: productId[] }` | Personalized favorites per signed-in user; cleared automatically when a product is deleted (cross-slice `extraReducers`). |
| `notifications` | `items[]` | Toasts created from mutation results in `extraReducers` (no per-page notice state). |

What stays **out** of Redux: authentication (`AuthContext` — Firebase/demo auth),
temporary UI state (form inputs, modals, selected image, dashboard filter dropdowns),
and search/filter/sort/page — the **URL search params** are the single source of truth for them.

`products.local` and `favorites` are persisted to `localStorage` (`app/persist.ts`)
so they survive reloads and offline sessions.

## Async thunks (`createAsyncThunk`)

| Thunk | Kind | Notes |
|---|---|---|
| `fetchProducts({ query, force })` | list fetching | Search/category from API, then filters, sorting, pagination (`query.ts`). Cached per query key. |
| `fetchAllProducts()` | list fetching | Whole catalog for the dashboard and favorites. |
| `fetchProductById({ id, force })` | details fetching | Uses local products / overrides; 404 & invalid id messages. |
| `fetchCategories()` | list fetching | Skipped when already loaded. |
| `createProduct(input)` | mutation | Generates a unique local id (DummyJSON always returns 195). |
| `updateProduct({ id, input })` | mutation | Saves override in `local.updated`. |
| `deleteProduct(id)` | mutation | Removes the entity and its id from all lists and favorites. |

Every thunk is handled in `extraReducers` with `pending` / `fulfilled` / `rejected`
(errors come through `rejectWithValue`).

- **Loading / errors / empty results:** hooks expose `loading` (nothing to show yet),
  `isFetching` (background refresh), `error`, `isEmpty`; pages render spinner, error box,
  or empty state.
- **Retries:** `ErrorMessage` has a *Try Again* button → thunk with `force: true`.
- **Stale requests:** each request stores its `requestId`; responses from outdated
  requests are ignored in reducers. When the query or product id changes, the previous
  request is aborted (`promise.abort()`, `signal` is passed to `fetch`); an aborted
  request resets its entry to `idle` so it can be loaded again later.
- **No unnecessary requests:** thunk `condition` skips a request when the same one is in flight
  or a fresh (< 5 min) cached copy exists. The unfiltered catalog list is computed from the
  already-loaded full catalog instead of a new request. Categories load once.
- **Refresh after mutations:** on `create/update/delete.fulfilled` the slice updates the entity
  immediately and marks all cached lists (and the edited details) as `stale`; mounted views
  see `stale` and refetch automatically, and the fresh data has local changes applied.

## Selectors

Plain: `selectProductById`, `selectListEntry`, `selectProductDetailsMeta`, `selectAllEntry`,
`selectMutationState`, `selectLocalChangesCount`, `selectCategories`, `selectFavoriteIds`,
`selectNotifications`.

Memoized (`createSelector`):

- `selectListProducts(state, query)` — page ids → product objects.
- `selectAllProducts` — full catalog from entities.
- `selectDashboardCategories` — unique sorted categories.
- `selectDashboardFiltered(state, category, stock)` — dashboard filter.
- `selectDashboardAnalytics(state, category, stock)` — stats, category & stock breakdowns, top rated.
- `selectFavoriteProducts(state, uid)` and `selectFavoriteIdSet(state, uid)`.

Components read state with `useAppSelector` (typed `useSelector`) and dispatch with
`useAppDispatch` (typed `useDispatch`), mostly through the custom hooks in `src/hooks`.

## Preserved features

- Routing with lazy pages, protected `/profile` route, sign in / sign up / Google (Firebase or local demo mode).
- URL search params for search, category, stock, price, sort, page; **debounced** search (400 ms).
- CRUD on products, dashboard analytics, personalized favorites.
- **PWA** (`vite-plugin-pwa`): web manifest + icons, install prompt, update prompt,
  precached app shell, `NetworkFirst` cache for the DummyJSON API, `CacheFirst` for product images,
  offline banner.
