import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useProductMutations } from "@/hooks/useProductMutations";
import { ProductsFilter } from "@/components/products/Filter";
import { ProductsGrid } from "@/components/products/Grid";
import { ProductsSearch } from "@/components/products/Search";

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

  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const { categories } = useCategories();

  const { data, loading, isFetching, error, refetch } = useProducts({
    search,
    category,
    stockStatus,
    priceRange,
    sort,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const { createProduct, isCreating } = useProductMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cacheNotification, setCacheNotification] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("groceries");
  const [newStock, setNewStock] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const updateParams = (newEntries: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(newEntries)) {
      if (
        value === null ||
        value === "" ||
        value === "all" ||
        value === "default"
      ) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }
    if (!("page" in newEntries)) {
      next.delete("page");
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;

    try {
      const created = await createProduct({
        title: newTitle.trim(),
        price: parseFloat(newPrice) || 0,
        category: newCategory,
        stock: parseInt(newStock, 10) || 15,
        description: newDescription.trim() || "Item added to catalog.",
      });

      setIsModalOpen(false);
      setNewTitle("");
      setNewPrice("");
      setNewStock("");
      setNewDescription("");

      setCacheNotification(
        `Created "${created.title}". Cache invalidated and resource queries revalidated.`
      );
      setTimeout(() => setCacheNotification(null), 5000);
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  const hasActiveFilters = Boolean(
    search ||
      category ||
      stockStatus !== "all" ||
      priceRange !== "all" ||
      sort !== "default"
  );

  return (
    <div className="space-y-4">
      {cacheNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{cacheNotification}</span>
          <button
            type="button"
            onClick={() => setCacheNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-200 p-4 space-y-4">
        <ProductsSearch
          handleSearchSubmit={handleSearchSubmit}
          search={search}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          updateParams={updateParams}
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
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="font-medium text-gray-900">Cache Strategy:</span>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 border border-gray-200">
            staleTime: 5m
          </span>
          {isFetching ? (
            <span className="text-blue-600 animate-pulse font-medium">
              Updating cache...
            </span>
          ) : (
            <span className="text-emerald-700">Ready</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isFetching ? "Revalidating..." : "Revalidate Cache"}
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-2">
        {data && !loading && (
          <div className="text-sm text-gray-600 font-medium">
            {data.total > 0 ? (data.currentPage - 1) * data.limit + 1 : 0} -{" "}
            {Math.min(data.currentPage * data.limit, data.total)} of{" "}
            {data.total}
          </div>
        )}
      </div>

      {loading && <LoadingSpinner message="Loading catalog..." />}

      {error && !loading && (
        <ErrorMessage
          title="Catalog Error"
          message={error || "Failed to load products"}
        />
      )}

      {!loading && !error && data && data.products.length === 0 && (
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

      {!loading && !error && data && data.products.length > 0 && (
        <ProductsGrid data={data} updateParams={updateParams} />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-200 max-w-md w-full p-6 shadow-lg">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">
                Add New Product
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Ergonomic Office Chair"
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="99.99"
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="25"
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-hidden focus:border-blue-600 capitalize"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                  {categories.length === 0 && (
                    <option value="groceries">Groceries</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief product description..."
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-hidden focus:border-blue-600 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? "Saving & Invalidating..." : "Create & Invalidate Cache"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
