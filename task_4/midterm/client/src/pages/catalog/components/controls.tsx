import { Search, X, ArrowUpDown, SlidersHorizontal } from "lucide-react";

export type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

export interface SortOptionItem {
  label: string;
  value: SortOption;
}

const SORT_OPTIONS: SortOptionItem[] = [
  { label: "По дате добавления", value: "default" },
  { label: "Цена: по возрастанию", value: "price-asc" },
  { label: "Цена: по убыванию", value: "price-desc" },
  { label: "Название (A-Z)", value: "name-asc" },
];

export interface CatalogControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onResetFilters: () => void;
}

export const CatalogControls = ({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onResetFilters,
}: CatalogControlsProps) => {
  const isFiltered =
    Boolean(searchQuery) ||
    selectedCategory !== "Все" ||
    sortOption !== "default";

  return (
    <div className="bg-[#141312] border border-white/10 p-6 md:p-8 mb-12 flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* search input */}
        <div className="lg:col-span-8 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по названию, материалу, характеристикам..."
            className="w-full bg-[#0e0d0c] border border-white/10 pl-11 pr-10 py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#bfb3a0] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 cursor-pointer"
              aria-label="Очистить поиск"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* sorting */}
        <div className="lg:col-span-4 relative">
          <div className="flex items-center gap-2 bg-[#0e0d0c] border border-white/10 px-4 py-3.5">
            <ArrowUpDown className="w-4 h-4 text-[#bfb3a0] shrink-0" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full bg-transparent text-xs uppercase tracking-wider text-[#e3e1dc] focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-[#141312]"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* categories & active count */}
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
                onClick={() => onCategoryChange(category)}
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

        {/* reset */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs uppercase tracking-wider text-neutral-400 hover:text-[#bfb3a0] transition-colors underline underline-offset-4 cursor-pointer"
          >
            Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );
};

export default CatalogControls;
