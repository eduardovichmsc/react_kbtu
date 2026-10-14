import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import CustomLink from "@/shared/components/custom-link";
import { ProductCard } from "@/shared/components/product-card";
import { PATHS } from "@/shared/config/paths";
import { api, type CategorySummary } from "@/shared/api";
import type { Product } from "@/shared/types";

const ITEMS_PER_PAGE = 3;

export const HomeShop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>(
    [],
  );
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // categories
  useEffect(() => {
    let isMounted = true;
    api
      .getCategories()
      .then((data) => {
        if (isMounted && data.length > 0) {
          setCategorySummaries(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    if (categorySummaries.length > 0) {
      return categorySummaries.map((c) => c.name);
    }
    return ["Все"];
  }, [categorySummaries]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsLoading(true);
  };

  useEffect(() => {
    let isMounted = true;

    api
      .getProducts({ category: selectedCategory, limit: ITEMS_PER_PAGE })
      .then((res) => {
        if (!isMounted) return;
        setItems(res.items);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить товары с сервера",
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  return (
    <section
      id={PATHS.anchors.shop}
      className="relative py-32 px-4 md:px-12 bg-[#0e0d0c] text-[#e3e1dc] border-t border-white/5"
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col justify-between gap-8 mb-16">
          <div>
            <h2 className="flex flex-row gap-4 text-5xl md:text-7xl font-serif leading-[0.9]">
              <span>Коллекция</span>
              <span className="text-neutral-500 italic">предметов</span>
            </h2>
          </div>

          {!isLoading && !error && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={`px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
                      isActive
                        ? "bg-[#bfb3a0] text-black border-[#bfb3a0]"
                        : "bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {error ? (
          <div className="border border-white/10 py-16 px-6 text-center flex flex-col items-center justify-center">
            <h3 className="text-xl font-serif text-white mb-2">
              Ошибка загрузки
            </h3>
            <p className="text-xs text-neutral-400 max-w-md">
              Не удалось загрузить товары с сервера.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading && items.length === 0 ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-[#121110] border border-white/10 aspect-[4/5] animate-pulse"
                />
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} type="home" />
                ))}
              </AnimatePresence>
            )}
          </div>
        )}

        <div className="mt-16 text-end">
          <CustomLink
            to={PATHS.catalog}
            className="inline-flex gap-3 px-8 py-4 bg-transparent border border-white/20 text-xs uppercase tracking-[0.25em] hover:bg-[#bfb3a0] hover:text-black hover:border-[#bfb3a0] transition-all duration-300 group"
          >
            Смотреть весь каталог{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </CustomLink>
        </div>
      </div>
    </section>
  );
};
