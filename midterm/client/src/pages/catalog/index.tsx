import { useState, useMemo, useRef } from "react";
import { AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  PackageX,
} from "lucide-react";
import { allProducts } from "@/shared/data/products";
import { ProductCard } from "@/shared/components/product-card";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { useLenis } from "lenis/react";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

const ITEMS_PER_PAGE = 6;

export const CatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const catalogTopRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const categories = useMemo(() => {
    const unique = Array.from(new Set(allProducts.map((p) => p.category)));
    return ["Все", ...unique];
  }, []);

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

  const handleStockToggle = (val: boolean) => {
    setOnlyInStock(val);
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

    // 3. Только в наличии
    if (onlyInStock) {
      result = result.filter((p) => p.inStock);
    }

    // 4. Сортировка
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
  }, [searchQuery, selectedCategory, sortOption, onlyInStock]);

  // Пагинация
  const totalPages =
    Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredAndSortedProducts, currentPage]);

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
    setOnlyInStock(false);
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
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              Показано{" "}
              <span className="text-[#bfb3a0] font-semibold">
                {filteredAndSortedProducts.length}
              </span>{" "}
              из {allProducts.length} позиций
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH & FILTERS */}
        <div className="bg-[#141312] border border-white/10 p-6 md:p-8 mb-12 flex flex-col gap-6">
          {/* Top row: Search input & Sorting */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="lg:col-span-7 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Поиск по названию, материалу, характеристикам..."
                className="w-full bg-[#0e0d0c] border border-white/10 pl-11 pr-10 py-3.5 text-sm font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#bfb3a0] transition-colors"
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
            <div className="lg:col-span-3 relative">
              <div className="flex items-center gap-2 bg-[#0e0d0c] border border-white/10 px-4 py-3.5">
                <ArrowUpDown className="w-4 h-4 text-[#bfb3a0] shrink-0" />
                <select
                  value={sortOption}
                  onChange={(e) =>
                    handleSortChange(e.target.value as SortOption)
                  }
                  className="w-full bg-transparent text-xs font-mono uppercase tracking-wider text-[#e3e1dc] focus:outline-none cursor-pointer"
                >
                  <option value="default" className="bg-[#141312]">
                    По умолчанию (Кураторские)
                  </option>
                  <option value="price-asc" className="bg-[#141312]">
                    Цена: по возрастанию
                  </option>
                  <option value="price-desc" className="bg-[#141312]">
                    Цена: по убыванию
                  </option>
                  <option value="name-asc" className="bg-[#141312]">
                    По названию (А — Я)
                  </option>
                </select>
              </div>
            </div>

            {/* In stock toggle */}
            <div className="lg:col-span-2 flex items-center justify-start lg:justify-end">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => handleStockToggle(e.target.checked)}
                  className="w-4 h-4 accent-[#bfb3a0] cursor-pointer"
                />
                В наличии
              </label>
            </div>
          </div>

          {/* Bottom row: Categories & Active count */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest mr-2 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#bfb3a0]" />
                Категория:
              </span>
              {categories.map((category) => {
                const count =
                  category === "Все"
                    ? allProducts.length
                    : allProducts.filter((p) => p.category === category).length;
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                      isActive
                        ? "bg-[#bfb3a0] text-black border-[#bfb3a0] font-medium"
                        : "bg-transparent text-neutral-400 border-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>

            {/* Clear Filters Button if any filter active */}
            {(searchQuery ||
              selectedCategory !== "Все" ||
              sortOption !== "default" ||
              onlyInStock) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-[#bfb3a0] transition-colors underline underline-offset-4 cursor-pointer"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {paginatedProducts.length === 0 ? (
          <div className="border border-white/10 bg-[#121110] py-24 px-6 text-center flex flex-col items-center justify-center">
            <PackageX className="w-16 h-16 stroke-[1] text-neutral-600 mb-6" />
            <h3 className="text-2xl font-serif text-white mb-2">
              Ничего не найдено
            </h3>
            <p className="text-sm font-mono text-neutral-400 max-w-md mb-8">
              По вашему запросу &laquo;{searchQuery}&raquo; не найдено
              подходящих предметов. Попробуйте изменить поисковые слова или
              сбросить фильтры.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="py-3 px-8 bg-[#bfb3a0] text-black text-xs font-mono uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors cursor-pointer"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
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
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Страница {currentPage} из {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 border border-white/10 text-neutral-300 hover:text-white hover:border-[#bfb3a0] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
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
                      className={`w-9 h-9 text-xs font-mono transition-all border cursor-pointer ${
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
                className="p-3 border border-white/10 text-neutral-300 hover:text-white hover:border-[#bfb3a0] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
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
