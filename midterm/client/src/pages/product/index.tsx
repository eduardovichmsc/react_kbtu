import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  ArrowLeft,
  Layers,
  ArrowRight,
  PackageOpen,
} from "lucide-react";
import { allProducts } from "@/shared/data/products";
import useFavoritesStore from "@/shared/store/favorites";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { CustomLink } from "@/shared/components/custom-link";
import { PATHS } from "@/shared/config/paths";
import { useLenis } from "lenis/react";

import { api } from "@/shared/api/api-client";
import type { Product } from "@/shared/types";

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const lenis = useLenis();
  const { ids, toggleFavorite } = useFavoritesStore();

  const [product, setProduct] = useState<Product | null>(() => {
    const numericId = Number(id);
    return allProducts.find((p) => p.id === numericId) ?? null;
  });

  useEffect(() => {
    const numericId = Number(id);
    if (!numericId) return;

    let isMounted = true;
    api.getProductById(numericId).then((data) => {
      if (isMounted && data) {
        setProduct(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const [userSelectedImage, setUserSelectedImage] = useState<{
    productId: number;
    url: string;
  } | null>(null);

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
    return allProducts.filter((p) => p.id !== product.id).slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0e0d0c] text-[#e3e1dc] pt-40 pb-32 px-4 md:px-12 flex flex-col items-center justify-center text-center">
        <PackageOpen className="w-16 h-16 stroke-[1] text-neutral-600 mb-6" />
        <h1 className="text-4xl md:text-5xl font-serif mb-4">
          Предмет не найден
        </h1>
        <p className="text-sm text-neutral-400 max-w-md mb-8">
          Возможно, этот предмет был снят с производства или ссылка устарела.
        </p>
        <Link
          to={PATHS.catalog}
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#bfb3a0] text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const isFav = ids.includes(product.id);
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.img];

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
                <span className="text-[11px] uppercase tracking-widest px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/15 text-neutral-300">
                  {product.category}
                </span>
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
                        setUserSelectedImage({
                          productId: product.id,
                          url: imgUrl,
                        })
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
                <span className="text-xs uppercase tracking-[0.2em] text-[#bfb3a0]">
                  {product.specs}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif leading-[1.05] text-[#e3e1dc] mb-4">
                {product.name}
              </h1>

              <div className="py-6 border-y border-white/10 mb-8 flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">
                    Стоимость за единицу
                  </span>
                  <p className="text-3xl md:text-4xl text-white">
                    {product.price}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 border text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isFav
                      ? "border-rose-400/50 bg-rose-950/30 text-rose-300"
                      : "border-white/10 hover:border-white/30 text-neutral-300 hover:text-white"
                  }`}
                  aria-label={
                    isFav ? "Удалить из избранного" : "Сохранить в избранное"
                  }
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFav ? "fill-rose-400 text-rose-400" : "text-neutral-400"
                    }`}
                  />
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h4 className="text-xs uppercase tracking-widest text-[#bfb3a0] mb-3 flex items-center gap-2">
                    Описание концепта
                  </h4>
                  <p className="text-[15px] md:text-base text-[#e8e6e3] leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Specifications Matrix */}
              <div className="bg-[#151413] border border-white/15 p-6 md:p-7 space-y-4 mb-8">
                <h4 className="text-xs uppercase tracking-widest text-[#bfb3a0] mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#bfb3a0]" />
                  Спецификация предмета
                </h4>

                {product.dimensions && (
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                    <span className="text-neutral-400 uppercase tracking-wider text-xs font-medium">
                      Габариты
                    </span>
                    <span className="text-[#f2f0ec] text-right font-normal">
                      {product.dimensions}
                    </span>
                  </div>
                )}

                {product.materials && (
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                    <span className="text-neutral-400 uppercase tracking-wider text-xs font-medium">
                      Материалы
                    </span>
                    <span className="text-[#f2f0ec] text-right font-normal">
                      {product.materials}
                    </span>
                  </div>
                )}

                {product.origin && (
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                    <span className="text-neutral-400 uppercase tracking-wider text-xs font-medium">
                      Происхождение
                    </span>
                    <span className="text-[#f2f0ec] text-right font-normal">
                      {product.origin}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-neutral-400 uppercase tracking-wider text-xs font-medium">
                    Складской артикул
                  </span>
                  <span className="text-[#bfb3a0] font-medium">
                    AUR-{(product.id * 142).toString().padStart(5, "0")}
                  </span>
                </div>
              </div>

              {/* Key Features Bullet points */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xs uppercase tracking-widest text-[#bfb3a0] mb-3.5 flex items-center gap-2">
                    Ключевые преимущества
                  </h4>
                  <ul className="space-y-3">
                    {product.features.map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm md:text-[15px] text-[#e8e6e3] font-normal leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#bfb3a0] mt-2 shrink-0 ring-4 ring-[#bfb3a0]/15" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="pt-4">
                <CustomLink
                  to={`${PATHS.home}#${PATHS.anchors.contacts}`}
                  className="w-full py-4 bg-[#bfb3a0] text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-black/40"
                >
                  <span>Связаться с декоратором</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </CustomLink>
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
                      <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-neutral-300">
                        {relProduct.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-serif text-[#e3e1dc] group-hover:text-[#bfb3a0] transition-colors">
                        {relProduct.name}
                      </h4>
                      <span className="text-xs text-[#bfb3a0]">
                        {relProduct.price}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">
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
