import { motion, AnimatePresence } from "motion/react";
import type { Product } from "@/shared/types";

export interface ProductGalleryProps {
  product: Product;
  activeImage: string;
  onSelectImage: (imgUrl: string) => void;
}

export const ProductGallery = ({
  product,
  activeImage,
  onSelectImage,
}: ProductGalleryProps) => {
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.img];

  return (
    <div className="lg:col-span-7 flex flex-col gap-6">
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
      </div>

      {/* dop kartinki */}
      {gallery.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {gallery.map((imgUrl, idx) => {
            const isSelected = activeImage === imgUrl;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectImage(imgUrl)}
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
  );
};

export default ProductGallery;
