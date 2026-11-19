import { useEffect, useEffectEvent, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductsFilter } from "@/components/products/Filter";
import { ProductsGrid } from "@/components/products/Grid";
import { ProductsSearch } from "@/components/products/Search";
import { CreateProductModal } from "@/components/products/CreateProductModal";

const ITEMS_PER_PAGE = 8;

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const stockStatus = searchParams.get("stock") || "all";
  const priceRange = searchParams.get("price") || "all";
  const sort = searchParams.get("sort") || "default";
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const updateParams = (newEntries: Record<string, string | null>) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      for (const [key, value] of Object.entries(newEntries)) {
        if (value === null || value === "" || value === "all" || value === "default") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      if (!("page" in newEntries) || newEntries.page === "1") next.delete("page");
      return next;
    });
  };

  const debouncedSearch = useDebounce(searchInput, 400);
  const syncSearchToUrl = useEffectEvent((value: string) => {
    if (value !== search) updateParams({ q: value || null });
  });
  useEffect(() => {
    syncSearchToUrl(debouncedSearch.trim());
  }, [debouncedSearch]);

  const { categories } = useCategories();
  const list = useProducts({
    search,
    category,
    stockStatus,
    priceRange,
    sort,
    page,
    limit: ITEMS_PER_PAGE,
  });
  const { createProduct, isMutating } = useProductMutations();

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    search || category || stockStatus !== "all" || priceRange !== "all" || sort !== "default"
  );

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 p-4 space-y-4">
        <ProductsSearch
          handleSearchSubmit={handleSearchSubmit}
          search={search}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          pending={searchInput.trim() !== search}
          onClear={() => {
            setSearchInput("");
            updateParams({ q: null });
          }}
        />

        <ProductsFilter
          categories={categories}
          category={category}
          priceRange={priceRange}
          sort={sort}
          stockStatus={stockStatus}
          updateParams={updateParams}
        />

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
            <button
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-800 cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
          <span className="font-medium text-gray-900">Redux cache:</span>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 border border-gray-200">
            TTL 5m · per query
          </span>
          {list.isFetching ? (
            <span className="text-blue-600 animate-pulse font-medium">Updating…</span>
          ) : (
            <span className="text-emerald-700">Ready</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={list.refetch}
            disabled={list.isFetching}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {list.isFetching ? "Refreshing..." : "Refresh"}
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium px-3.5 py-1.5 transition-colors cursor-pointer"
          >
            + Add Product
          </button>
        </div>
      </div>

      {!list.loading && !list.error && (
        <div className="text-sm text-gray-600 font-medium text-center">
          {list.total > 0 ? (list.currentPage - 1) * list.limit + 1 : 0} –{" "}
          {Math.min(list.currentPage * list.limit, list.total)} of {list.total}
        </div>
      )}

      {list.loading && <LoadingSpinner message="Loading catalog..." />}

      {list.error && (
        <ErrorMessage title="Catalog Error" message={list.error} onRetry={list.refetch} />
      )}

      {list.isEmpty && (
        <div className="bg-white border border-gray-200 p-10 text-center space-y-3">
          <p className="text-gray-500 text-sm">
            No items matched your current search and filter combination.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Clear applied filters
          </button>
        </div>
      )}

      {!list.loading && !list.error && list.products.length > 0 && (
        <ProductsGrid
          products={list.products}
          currentPage={list.currentPage}
          totalPages={list.totalPages}
          updateParams={updateParams}
        />
      )}

      {isModalOpen && (
        <CreateProductModal
          categories={categories}
          saving={isMutating}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (input) => {
            await createProduct(input);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Products;
