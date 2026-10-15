import { AnimatePresence, motion } from "motion/react";
import { X, Heart, Trash2 } from "lucide-react";
import { Link } from "react-router";
import useFavoritesStore from "@/shared/store/favorites";
import { PATHS } from "@/shared/config/paths";
import { CustomLink } from "@/shared/components/custom-link";

export function FavoritesDrawer() {
  const {
    items: favoriteProducts,
    isOpen,
    closeDrawer,
    toggleFavorite,
  } = useFavoritesStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#121110] border-l border-white/10 z-50 flex flex-col justify-between text-[#e3e1dc] shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-serif">Избранное</h3>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white cursor-pointer"
                aria-label="Закрыть избранное"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-white/5">
              {favoriteProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 text-neutral-400">
                  <Heart className="w-12 h-12 stroke-[1] mb-4 text-neutral-600" />
                  <p className="text-sm font-light">
                    В избранном пока ничего нет
                  </p>
                  <Link
                    to={PATHS.catalog}
                    onClick={closeDrawer}
                    className="mt-4 text-xs uppercase tracking-widest text-[#bfb3a0] underline underline-offset-4 hover:text-white transition-colors"
                  >
                    Перейти в каталог
                  </Link>
                </div>
              ) : (
                favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    className="pt-4 first:pt-0 flex gap-4 items-center group"
                  >
                    <Link
                      to={PATHS.product.slug(product.id)}
                      onClick={closeDrawer}
                      className="shrink-0"
                    >
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-16 h-20 object-cover bg-neutral-900 border border-white/10 hover:border-[#bfb3a0] transition-colors"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={PATHS.product.slug(product.id)}
                        onClick={closeDrawer}
                        className="block"
                      >
                        <h4 className="text-sm font-serif truncate text-white hover:text-[#bfb3a0] transition-colors">
                          {product.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-neutral-400">
                        {product.category}
                      </p>
                      <p className="text-xs text-[#bfb3a0] mt-1 font-medium">
                        {product.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(product)}
                      className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                      title="Удалить из избранного"
                      aria-label="Удалить из избранного"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer with action */}
            {favoriteProducts.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#0e0d0c]/50">
                <CustomLink
                  // to={`${PATHS.home}#${PATHS.anchors.contacts}`}
                  onClick={closeDrawer}
                  className="w-full py-4 bg-[#bfb3a0] text-black text-xs uppercase font-medium tracking-[0.2em] hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Заказать
                </CustomLink>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
export default FavoritesDrawer;
