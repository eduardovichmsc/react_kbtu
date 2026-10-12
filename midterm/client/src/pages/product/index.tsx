import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Truck,
  Layers,
  ArrowRight,
  PackageOpen,
} from "lucide-react";
import { allProducts } from "@/shared/data/products";
import useFavoritesStore from "@/shared/store/favorites";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { PATHS } from "@/shared/config/paths";
import { useLenis } from "lenis/react";

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const lenis = useLenis();
  const { ids, toggleFavorite } = useFavoritesStore();

  const product = useMemo(() => {
    const numericId = Number(id);
    return allProducts.find((p) => p.id === numericId);
  }, [id]);

  const [userSelectedImage, setUserSelectedImage] = useState<{ productId: number; url: string } | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  const activeImage =
    userSelectedImage && userSelectedImage.productId === product?.id
      ? userSelectedImage.url
      : (product?.img ?? "");

  // Скролл наверх при смене id
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [id, lenis]);

  // Похожие товары из той же категории
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.id !== product.id)
      .slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0e0d0c] text-[#e3e1dc] pt-40 pb-32 px-4 md:px-12 flex flex-col items-center justify-center text-center">
        <PackageOpen className="w-16 h-16 stroke-[1] text-neutral-600 mb-6" />
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Предмет не найден</h1>
        <p className="text-sm font-mono text-neutral-400 max-w-md mb-8">
          Возможно, этот предмет был снят с производства или ссылка устарела.
        </p>
        <Link
          to={PATHS.catalog}
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#bfb3a0] text-black text-xs font-mono uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const isFav = ids.includes(product.id);
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.img];

  const handleRequestQuote = () => {
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0e0d0c] text-[#e3e1dc] pt-28 md:pt-36 pb-32 px-4 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* BREADCRUMBS & BACK BUTTON */}
        <Breadcrumbs
          items={[
            { label: "Каталог", href: PATHS.catalog },
            { label: product.name },
          ]}
          showBack
        />

        {/* MAIN PRODUCT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: GALLERY */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] bg-neutral-900 border border-white/10 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover contrast-125 grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0c]/60 via-transparent to-transparent pointer-events-none" />

              {/* Status Badges */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/15 text-neutral-300">
                  {product.category}
                </span>
                {product.inStock ? (
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-emerald-950/80 border border-emerald-600/30 text-emerald-300 flex items-center gap-1.5 w-fit">
                    <CheckCircle2 className="w-3 h-3" />
                    В наличии
                  </span>
                ) : (
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-neutral-800/80 border border-white/15 text-neutral-400 w-fit">
                    Под заказ
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails (if gallery has > 1 item) */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {gallery.map((imgUrl, idx) => {
                  const isSelected = activeImage === imgUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setUserSelectedImage({ productId: product.id, url: imgUrl })
                      }
                      className={`relative aspect-[4/5] overflow-hidden border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#bfb3a0] ring-1 ring-[#bfb3a0]"
                          : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT DETAILS & ACTIONS */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="w-8 h-px bg-[#bfb3a0]" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#bfb3a0]">
                  {product.specs}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif leading-[1.05] text-[#e3e1dc] mb-4">
                {product.name}
              </h1>

              <div className="py-6 border-y border-white/10 mb-8 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                    Стоимость за единицу
                  </span>
                  <p className="text-3xl md:text-4xl font-mono text-white">
                    {product.price}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 border text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    isFav
                      ? "border-rose-400/50 bg-rose-950/30 text-rose-300"
                      : "border-white/10 hover:border-white/30 text-neutral-300 hover:text-white"
                  }`}
                  aria-label={isFav ? "Удалить из избранного" : "Сохранить в избранное"}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFav ? "fill-rose-400 text-rose-400" : "text-neutral-400"
                    }`}
                  />
                  {isFav ? "В избранном" : "В избранное"}
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
                    Описание концепта
                  </h4>
                  <p className="text-sm text-neutral-300 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Specifications Matrix */}
              <div className="bg-[#141312] border border-white/10 p-6 space-y-4 mb-8">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#bfb3a0] mb-4 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  Спецификация предмета
                </h4>

                {product.dimensions && (
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2.5">
                    <span className="font-mono text-neutral-500 uppercase tracking-wider">
                      Габариты
                    </span>
                    <span className="text-neutral-200 text-right font-light">
                      {product.dimensions}
                    </span>
                  </div>
                )}

                {product.materials && (
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2.5">
                    <span className="font-mono text-neutral-500 uppercase tracking-wider">
                      Материалы
                    </span>
                    <span className="text-neutral-200 text-right font-light">
                      {product.materials}
                    </span>
                  </div>
                )}

                {product.origin && (
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2.5">
                    <span className="font-mono text-neutral-500 uppercase tracking-wider">
                      Происхождение
                    </span>
                    <span className="text-neutral-200 text-right font-light">
                      {product.origin}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="font-mono text-neutral-500 uppercase tracking-wider">
                    Складской артикул
                  </span>
                  <span className="font-mono text-[#bfb3a0]">
                    AUR-{(product.id * 142).toString().padStart(5, "0")}
                  </span>
                </div>
              </div>

              {/* Key Features Bullet points */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                    Ключевые преимущества
                  </h4>
                  <ul className="space-y-2.5">
                    {product.features.map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs text-neutral-300 font-light"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#bfb3a0] mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleRequestQuote}
                  className={`w-full py-4 text-xs font-mono uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    requestSent
                      ? "bg-emerald-600 text-white"
                      : "bg-[#bfb3a0] text-black hover:bg-white"
                  }`}
                >
                  {requestSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Запрос оформлен! Менеджер свяжется с вами
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Запросить коммерческое предложение
                    </>
                  )}
                </button>

                <a
                  href={`${PATHS.home}#${PATHS.anchors.contacts}`}
                  className="w-full py-3.5 border border-white/20 text-xs font-mono uppercase tracking-[0.2em] text-neutral-300 hover:text-white hover:border-[#bfb3a0] transition-colors flex items-center justify-center gap-2"
                >
                  Связаться с декоратором
                </a>
              </div>

              {/* SERVICE TRUST BADGES */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10 text-xs text-neutral-400 font-mono">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#bfb3a0] shrink-0" />
                  <span>Доставка и бережный подъем на объект</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#bfb3a0] shrink-0" />
                  <span>Гарантия качества и сертификаты</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-20 border-t border-white/10">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="w-8 h-px bg-[#bfb3a0]" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#bfb3a0]">
                    Рекомендации
                  </span>
                </div>
                <h3 className="text-3xl md:text-5xl font-serif">
                  Сопутствующие предметы
                </h3>
              </div>
              <Link
                to={PATHS.catalog}
                className="hidden md:inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#bfb3a0] hover:text-white transition-colors"
              >
                Все предметы
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  to={PATHS.product.slug(relProduct.id)}
                  className="group block border border-white/10 bg-[#121110] overflow-hidden"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                    <img
                      src={relProduct.img}
                      alt={relProduct.name}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-neutral-300">
                        {relProduct.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-serif text-[#e3e1dc] group-hover:text-[#bfb3a0] transition-colors">
                        {relProduct.name}
                      </h4>
                      <span className="text-xs font-mono text-[#bfb3a0]">
                        {relProduct.price}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                      {relProduct.specs}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductPage;
