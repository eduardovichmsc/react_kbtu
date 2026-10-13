import { Link } from "react-router";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import type { Product } from "@/shared/types";
import useFavoritesStore from "@/shared/store/favorites";
import { PATHS } from "@/shared/config/paths";

export type ProductCardVariant = "home" | "catalog";

export interface ProductCardProps {
  product: Product;
  variant?: ProductCardVariant;
  type?: ProductCardVariant; // Поддержка как prop `type`, так и `variant`
}

export const ProductCard = ({
  product,
  variant,
  type = "catalog",
}: ProductCardProps) => {
  const cardType = variant || type;
  const { ids, toggleFavorite } = useFavoritesStore();
  const isFav = ids.includes(product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative border border-white/10 bg-[#121110] flex flex-col justify-between overflow-hidden"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
        <Link
          to={PATHS.product.slug(product.id)}
          className="block w-full h-full"
        >
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent opacity-80" />
        </Link>

        {/* FAVORITE BUTTON */}
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-rose-400 hover:border-white/30 transition-all cursor-pointer"
          aria-label={isFav ? "Удалить из избранного" : "Добавить в избранное"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? "text-rose-400 fill-rose-400" : "text-white"
            }`}
          />
        </button>

        {/* BADGES */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-neutral-300">
            {product.category}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className={`flex flex-col justify-between flex-1 ${
          cardType === "catalog" ? "p-6 md:p-8" : "p-6"
        }`}
      >
        <div>
          <div className="flex justify-between items-baseline mb-2 gap-4">
            <Link to={PATHS.product.slug(product.id)}>
              <h3
                className={`font-serif text-[#e3e1dc] group-hover:text-[#bfb3a0] transition-colors ${
                  cardType === "catalog" ? "text-2xl" : "text-xl"
                }`}
              >
                {product.name}
              </h3>
            </Link>
            <span
              className={`text-[#bfb3a0] shrink-0 font-medium ${
                cardType === "catalog" ? "text-base" : "text-sm"
              }`}
            >
              {product.price}
            </span>
          </div>

          <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">
            {product.specs}
          </p>

          {/* Описание только для catalog типа */}
          {cardType === "catalog" && product.description && (
            <p className="text-xs text-neutral-400 leading-relaxed font-light line-clamp-2 mb-6">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
