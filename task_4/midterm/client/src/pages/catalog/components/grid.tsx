import { AnimatePresence } from "motion/react";
import { PackageX } from "lucide-react";
import { ProductCard } from "@/shared/components/product-card";
import type { Product } from "@/shared/types";

export interface CatalogGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  searchQuery?: string;
  onResetFilters: () => void;
}

export const CatalogGrid = ({
  products,
  isLoading,
  error,
  searchQuery = "",
  onResetFilters,
}: CatalogGridProps) => {
  if (error) {
    return (
      <div className="border border-white/10 py-20 px-6 text-center flex flex-col items-center justify-center">
        <h3 className="text-2xl font-serif text-white mb-2">Ошибка загрузки</h3>
        <p className="text-sm text-neutral-400 max-w-md">
          Не удалось загрузить товары с сервера.
        </p>
      </div>
    );
  }

  if (isLoading && products.length === 0) {
    return (
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
    );
  }

  if (products.length === 0) {
    return (
      <div className="border border-white/10 bg-[#121110] py-24 px-6 text-center flex flex-col items-center justify-center">
        <PackageX className="w-16 h-16 stroke-[1] text-neutral-600 mb-6" />
        <h3 className="text-2xl font-serif text-white mb-2">
          Ничего не найдено
        </h3>
        <p className="text-sm text-neutral-400 max-w-md mb-8">
          {searchQuery
            ? `По вашему запросу «${searchQuery}» не найдено подходящих предметов.`
            : "В выбранной категории пока нет доступных позиций."}{" "}
          Попробуйте изменить параметры или сбросить фильтры.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="py-3 px-8 bg-[#bfb3a0] text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors cursor-pointer"
        >
          Сбросить фильтры
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} type="catalog" />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CatalogGrid;
