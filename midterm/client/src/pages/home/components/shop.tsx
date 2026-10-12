import { useState, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { allProducts } from "@/shared/data/products";
import { ProductCard } from "@/shared/components/product-card";
import { PATHS } from "@/shared/config/paths";

export const HomeShop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allProducts.map((p) => p.category)));
    return ["Все", ...cats];
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Все") return allProducts.slice(0, 6);
    return allProducts.filter((p) => p.category === selectedCategory).slice(0, 6);
  }, [selectedCategory]);

  return (
    <section
      id={PATHS.anchors.shop}
      className="relative py-32 px-4 md:px-12 bg-[#0e0d0c] text-[#e3e1dc] border-t border-white/5"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="w-12 h-[1px] bg-[#bfb3a0]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#bfb3a0]">
                Каталог
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif leading-[0.9]">
              Коллекция <br />
              <span className="text-neutral-500 italic">предметов</span>
            </h2>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
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
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                type="home"
              />
            ))}
          </AnimatePresence>
        </div>

        {/* LINK TO FULL CATALOG */}
        <div className="mt-16 text-center">
          <Link
            to={PATHS.catalog}
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white/20 text-xs font-mono uppercase tracking-[0.25em] hover:bg-[#bfb3a0] hover:text-black hover:border-[#bfb3a0] transition-all duration-300 group"
          >
            Смотреть весь каталог ({allProducts.length})
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
