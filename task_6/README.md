# Catalog & Inventory Management System

A minimalist, high-performance web application featuring server-state caching, persistent authentication, protected routes, and interactive catalog analytics.

---

## Overview

This project extends the catalog management application with robust server-data caching, environment-configured authentication, and secure session management.

### Key Capabilities
- **Authentication**: Email/Password and Google sign-in with persistent sessions across refreshes.
- **Protected Routing**: Secure `/profile` route with automatic redirect for unauthenticated visitors and destination restoration upon sign-in.
- **Conditional Navigation**: Dynamic navigation header displaying Sign In/Sign Up or user profile badge and Sign Out button based on authentication state.
- **Server Data Caching**: Intelligent query caching with configurable freshness (`staleTime`), garbage collection (`gcTime`), and automated invalidation upon write mutations.
- **Outdated Request Protection**: Request lifecycle management with native abort signals preventing stale responses from overwriting newer query states.
- **Zero UI-Layer Side Effects**: Strict architectural separation where UI components never access storage or invoke external APIs directly.

---

## Environment Variables & Setup

### Configuration Files
- `.env.example` contains template configuration keys with documentation.
- `.env.local` contains machine-specific credentials and is ignored by version control (`.gitignore`).

### Environment Variables Reference
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Quick Start
1. Copy the example configuration to a local environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Populate the keys in `.env.local` with your credentials.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

> **Note**: If credentials are not yet populated, the system automatically runs with a built-in local session provider so all functionality, forms, and routes remain testable immediately.

---

## Server Data Caching Strategy

### 1. Cache Storage & Architecture
Data fetching, caching, and state synchronization are managed using a central query client configured in `src/services/queryClient.ts`. The client provides in-memory caching with precise cache keys.

### 2. Query Key Hierarchy
Queries use structured, deterministic keys to isolate data sets:
- **Product Catalog**: `['products', { search, category, stockStatus, priceRange, sort, page, limit }]`
  - Each combination of search parameters, category filters, stock filters, price boundaries, and pagination indices maintains its own isolated cache slice.
- **Individual Product Details**: `['product', id]`
  - Caches specific item attributes, imagery, and specifications.
- **Category Taxonomy**: `['categories']`
  - Long-lived cache for catalog classification categories.
- **Dashboard Aggregate Dataset**: `['dashboard-products']`
  - Complete inventory dataset used for metrics, distributions, and rating analysis.

### 3. Expiration and Revalidation
- **Stale Time (`staleTime: 5 minutes`)**: Cached data remains fresh for 5 minutes. During this period, navigating between routes or remounting components serves results instantly from memory with zero network overhead.
- **Garbage Collection (`gcTime: 30 minutes`)**: Inactive cache entries are retained for 30 minutes before eviction.
- **Outdated Request Protection**: Every query function receives an `AbortSignal`. When query parameters change quickly (such as typing into search or switching pagination pages), in-flight requests are automatically aborted and cannot overwrite newer results.

### 4. Cache Invalidation Strategy
Cached data is invalidated automatically upon relevant create, update, and delete operations via `useProductMutations`:

| Operation | Invalidation Target | Rationale |
| :--- | :--- | :--- |
| **Create Product** | `['products']`, `['dashboard-products']` | Invalidate all paginated list caches and dashboard statistics to reflect newly inserted inventory. |
| **Update Product** | `['products']`, `['product', id]`, `['dashboard-products']` | Synchronizes the detailed product view, list views, and statistical aggregates immediately. |
| **Delete Product** | `['products']`, `['product', id]`, `['dashboard-products']` | Purges the deleted item and refreshes listings and inventory counts. |
| **Manual Revalidate** | Active Query Key | Users can trigger explicit revalidation via the "Revalidate Cache" action button. |

---

## Authentication & Routing Structure

### Authentication Flow
- **Session Tracking**: Tracked via `subscribeToAuthChanges` wrapping `onAuthStateChanged`.
- **Session Persistence**: Sessions persist across page reloads and browser restarts.
- **Context API**: `AuthProvider` and `useAuth` hook expose `user`, `loading`, `error`, `login`, `signup`, `loginWithGoogle`, and `logout`.

### Routes
| Route | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Homepage featuring hero banner and highest-rated catalog items. |
| `/products` | Public | Paginated product catalog with live search, stock filter, price filter, sorting, and creation modal with cache invalidation. |
| `/products/:id` | Public | Product specifications, gallery, live cache status, quick edit, and item deletion. |
| `/dashboard` | Public | Inventory breakdown, distribution metrics, category summaries, and cache revalidation. |
| `/about` | Public | Application background and architectural overview. |
| `/login` | Public | Email/Password login and Google sign-in. Redirects to `/profile` or previously requested page. |
| `/signup` | Public | Account registration with validation for email format, password strength, and confirmation match. |
| `/profile` | Protected | Displays authenticated user email, UID, session metadata, and sign-out control. Unauthenticated requests redirect to `/login`. |

---

## Architectural Principles

1. **Separation of Concerns**:
   - `src/services/` — API network requests, Firebase initialization, query client setup.
   - `src/hooks/` — Custom hooks encapsulating queries, mutations, and cache invalidation.
   - `src/context/` — State providers for authentication.
   - `src/pages/` & `src/components/` — UI components focusing exclusively on presentation.
2. **No Direct Storage or Network Access in Components**:
   - UI components consume data exclusively through custom hooks. Direct `fetch` calls and direct storage operations are strictly forbidden in UI components.
3. **Graceful Fallbacks**:
   - Every view handles loading, error, and empty result states cleanly without layout shift or UI flickering.
