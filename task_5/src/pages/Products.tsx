import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useProducts } from "@/hooks/useProducts";
import { fetchCategories } from "@/services/service";
import type { CategoryItem } from "@/types/product";
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

  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const { data, loading, error } = useProducts({
    search,
    category,
    stockStatus,
    priceRange,
    sort,
    page,
    limit: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    fetchCategories()
      .then((items) => {
        setCategories(items);
      })
      .catch((err) => console.error("Could not load categories:", err));
  }, []);

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

  const hasActiveFilters = Boolean(
    search ||
    category ||
    stockStatus !== "all" ||
    priceRange !== "all" ||
    sort !== "default",
  );

  return (
    <div className="space-y-4">
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

      {!loading && !error && data && data.products.length === 0 && (
        <div className="bg-white border border-gray-200 p-10 text-center space-y-3">
          <p className="text-gray-500">
            No items matched your current search and filter combination.
          </p>
        </div>
      )}

      {!loading && !error && data && data.products.length > 0 && (
        <ProductsGrid data={data} updateParams={updateParams} />
      )}
    </div>
  );
};

export default Products;
