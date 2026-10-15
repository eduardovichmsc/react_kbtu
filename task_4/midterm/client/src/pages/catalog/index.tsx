import { useState, useMemo, useRef, useEffect } from "react";
import { useLenis } from "lenis/react";
import { api, type CategorySummary } from "@/shared/api";
import { useDebounce } from "@/shared/hooks/use-debounce";
import type { Product } from "@/shared/types";
import { CatalogHeader } from "./components/header";
import { CatalogControls, type SortOption } from "./components/controls";
import { CatalogGrid } from "./components/grid";
import { CatalogPagination } from "./components/pagination";

const ITEMS_PER_PAGE = 6;

export const CatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 350);

  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const catalogTopRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // categories
  useEffect(() => {
    let isMounted = true;
    api.getCategories().then((data) => {
      if (isMounted && data.length > 0) {
        setCategorySummaries(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // products
  useEffect(() => {
    let isMounted = true;

    api
      .getProducts({
        search: debouncedSearch,
        category: selectedCategory,
        sort: sortOption,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      })
      .then((res) => {
        if (!isMounted) return;
        setProducts(res.items);
        setTotalCount(res.total);
        setTotalPages(res.totalPages);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        const msg =
          err instanceof Error
            ? err.message
            : "Ошибка загрузки данных каталога";
        setError(msg);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, selectedCategory, sortOption, currentPage]);

  const categories = useMemo(() => {
    if (categorySummaries.length > 0) {
      return categorySummaries.map((c) => c.name);
    }
    return ["Все"];
  }, [categorySummaries]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handleSortChange = (opt: SortOption) => {
    setSortOption(opt);
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setIsLoading(true);
    if (catalogTopRef.current) {
      if (lenis) {
        lenis.scrollTo(catalogTopRef.current, { offset: -100, duration: 1.2 });
      } else {
        catalogTopRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Все");
    setSortOption("default");
    setCurrentPage(1);
  };

  const totalCatalogPositions =
    categorySummaries.find((c) => c.name === "Все")?.count ?? totalCount;

  return (
    <div className="min-h-screen bg-[#0e0d0c] text-[#e3e1dc] pt-28 md:pt-36 pb-32 px-4 md:px-12">
      <div ref={catalogTopRef} className="max-w-[1600px] mx-auto">
        <CatalogHeader
          isLoading={isLoading}
          totalCount={totalCount}
          totalCatalogPositions={totalCatalogPositions}
        />

        <CatalogControls
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onResetFilters={handleResetFilters}
        />

        <CatalogGrid
          products={products}
          isLoading={isLoading}
          error={error}
          searchQuery={searchQuery}
          onResetFilters={handleResetFilters}
        />

        <CatalogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CatalogPage;
