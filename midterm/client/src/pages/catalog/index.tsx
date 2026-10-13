import { useState, useMemo, useRef, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  PackageX,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { allProducts } from "@/shared/data/products";
import { ProductCard } from "@/shared/components/product-card";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { useLenis } from "lenis/react";
import { api, type CategorySummary } from "@/shared/api/api-client";
import type { Product } from "@/shared/types";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

const ITEMS_PER_PAGE = 6;

const selectOptions = [
  {
    label: "По дате добавления",
    value: "default",
  },
  {
    label: "Цена: по возрастанию",
    value: "price-asc",
  },
  {
    label: "Цена: по убыванию",
    value: "price-desc",
  },
  {
    label: "Название (A-Z)",
    value: "name-asc",
  },
];

export const CatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [serverProducts, setServerProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(allProducts.length);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const catalogTopRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Загрузка категорий с сервера
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

  // Загрузка каталога с сервера (с fallback)
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    api
      .getProducts({
        search: searchQuery,
        category: selectedCategory,
        sort: sortOption,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      })
      .then((res) => {
        if (isMounted) {
          setServerProducts(res.items);
          setTotalCount(res.total);
          setServerTotalPages(res.totalPages);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "Ошибка загрузки данных каталога";
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory, sortOption, currentPage]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    api
      .getProducts({
        search: searchQuery,
        category: selectedCategory,
        sort: sortOption,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      })
      .then((res) => {
        setServerProducts(res.items);
        setTotalCount(res.total);
        setServerTotalPages(res.totalPages);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Ошибка загрузки каталога",
        );
        setIsLoading(false);
      });
  };

  const categories = useMemo(() => {
    if (categorySummaries.length > 0) {
      return categorySummaries.map((c) => c.name);
    }
    const unique = Array.from(new Set(allProducts.map((p) => p.category)));
    return ["Все", ...unique];
  }, [categorySummaries]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (opt: SortOption) => {
    setSortOption(opt);
    setCurrentPage(1);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Поиск
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.specs.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)),
      );
    }

    // 2. Фильтр категории
    if (selectedCategory !== "Все") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 3. Сортировка
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.priceValue - a.priceValue);
    } else if (sortOption === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    } else if (sortOption === "default") {
      // По умолчанию: сначала featured, потом id
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.id - b.id;
      });
    }

    return result;
  }, [searchQuery, selectedCategory, sortOption]);

  // Пагинация
  const totalPages =
    serverTotalPages ||
    Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE) ||
    1;
  const paginatedProducts = useMemo(() => {
    if (serverProducts.length > 0) return serverProducts;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [serverProducts, filteredAndSortedProducts, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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

  return (
    <div className="min-h-screen bg-[#0e0d0c] text-[#e3e1dc] pt-28 md:pt-36 pb-32 px-4 md:px-12">
      <div ref={catalogTopRef} className="max-w-[1600px] mx-auto">
        {/* BREADCRUMBS */}
        <Breadcrumbs items={[{ label: "Каталог" }]} />

        {/* HEADER SECTION */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#e3e1dc]">
                Каталог
              </h1>
            </div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider flex items-center gap-2">
              {isLoading && (
                <span className="w-2 h-2 rounded-full bg-[#bfb3a0] animate-pulse" />
              )}
              <span>
                Показано{" "}
                <span className="text-[#bfb3a0] font-semibold">
                  {totalCount}
                </span>{" "}
                из{" "}
                {categorySummaries.find((c) => c.name === "Все")?.count ??
                  allProducts.length}{" "}
                позиций
              </span>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH & FILTERS */}
        <div className="bg-[#141312] border border-white/10 p-6 md:p-8 mb-12 flex flex-col gap-6">
          {/* Top row: Search input & Sorting */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="lg:col-span-8 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Поиск по названию, материалу, характеристикам..."
                className="w-full bg-[#0e0d0c] border border-white/10 pl-11 pr-10 py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#bfb3a0] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 cursor-pointer"
                  aria-label="Очистить поиск"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting Select */}
            <div className="lg:col-span-4 relative">
              <div className="flex items-center gap-2 bg-[#0e0d0c] border border-white/10 px-4 py-3.5">
                <ArrowUpDown className="w-4 h-4 text-[#bfb3a0] shrink-0" />
                <select
                  value={sortOption}
                  onChange={(e) =>
                    handleSortChange(e.target.value as SortOption)
                  }
                  className="w-full bg-transparent text-xs uppercase tracking-wider text-[#e3e1dc] focus:outline-none cursor-pointer"
                >
                  {selectOptions.map((option) => (
                    <option value={option.value} className="bg-[#141312]">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bottom row: Categories & Active count */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-500 uppercase tracking-widest mr-2 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#bfb3a0]" />
                Категория:
              </span>
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                      isActive
                        ? "bg-[#bfb3a0] text-black border-[#bfb3a0] font-medium"
                        : "bg-transparent text-neutral-400 border-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Clear Filters Button if any filter active */}
            {(searchQuery ||
              selectedCategory !== "Все" ||
              sortOption !== "default") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs uppercase tracking-wider text-neutral-400 hover:text-[#bfb3a0] transition-colors underline underline-offset-4 cursor-pointer"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        </div>

        {/* ERROR STATE */}
        {error ? (
          <div className="border border-red-500/30 bg-red-950/20 py-16 px-6 text-center flex flex-col items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-2xl font-serif text-white mb-2">
              Ошибка соединения с сервером
            </h3>
            <p className="text-sm text-red-200/80 max-w-md mb-6">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="py-3 px-8 bg-[#bfb3a0] text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Повторить попытку
            </button>
          </div>
        ) : isLoading && paginatedProducts.length === 0 ? (
          /* SKELETON LOADING STATE */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[#141312] border border-white/5 p-4 flex flex-col space-y-4 animate-pulse"
              >
                <div className="w-full aspect-[4/5] bg-white/5 rounded-none" />
                <div className="space-y-2 pt-2">
                  <div className="h-4 bg-white/10 w-2/3" />
                  <div className="h-3 bg-white/5 w-1/3" />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="h-4 bg-white/10 w-1/4" />
                  <div className="h-4 bg-white/5 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          /* EMPTY STATE */
          <div className="border border-white/10 bg-[#121110] py-24 px-6 text-center flex flex-col items-center justify-center">
            <PackageX className="w-16 h-16 stroke-[1] text-neutral-600 mb-6" />
            <h3 className="text-2xl font-serif text-white mb-2">
              Ничего не найдено
            </h3>
            <p className="text-sm text-neutral-400 max-w-md mb-8">
              По вашему запросу &laquo;{searchQuery}&raquo; не найдено
              подходящих предметов. Попробуйте изменить поисковые слова или
              сбросить фильтры.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="py-3 px-8 bg-[#bfb3a0] text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors cursor-pointer"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          /* PRODUCTS GRID WITH ANIMATION */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  type="catalog"
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* PAGINATION SECTION */}
        {totalPages > 1 && (
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-end gap-6 border-t border-white/10 pt-8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex justify-center items-center border border-white/10 text-neutral-300 hover:text-white hover:border-[#bfb3a0] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Предыдущая страница"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 text-xs transition-all border cursor-pointer ${
                        isActive
                          ? "bg-[#bfb3a0] text-black border-[#bfb3a0] font-bold"
                          : "bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex justify-center items-center border border-white/10 text-neutral-300 hover:text-white hover:border-[#bfb3a0] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Следующая страница"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CatalogPage;
