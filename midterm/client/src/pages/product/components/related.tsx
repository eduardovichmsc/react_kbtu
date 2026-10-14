import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/shared/components/product-card";
import { PATHS } from "@/shared/config/paths";
import type { Product } from "@/shared/types";

export interface ProductRelatedProps {
  products: Product[];
}

export const ProductRelated = ({ products }: ProductRelatedProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-32 pt-20 border-t border-white/10">
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <span className="w-8 h-px bg-[#bfb3a0]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#bfb3a0]">
              Рекомендации
            </span>
          </div>
          <h3 className="text-3xl md:text-5xl font-serif">
            Сопутствующие предметы
          </h3>
        </div>
        <Link
          to={PATHS.catalog}
          className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#bfb3a0] hover:text-white transition-colors"
        >
          Все предметы
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((relProduct) => (
          <ProductCard key={relProduct.id} product={relProduct} type="home" />
        ))}
      </div>
    </div>
  );
};

export default ProductRelated;
