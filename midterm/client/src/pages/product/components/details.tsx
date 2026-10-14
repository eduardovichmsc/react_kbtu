import { Heart, Layers } from "lucide-react";
import { CustomLink } from "@/shared/components/custom-link";
import { PATHS } from "@/shared/config/paths";
import type { Product } from "@/shared/types";

export interface ProductDetailsProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProductDetails = ({
  product,
  isFavorite,
  onToggleFavorite,
}: ProductDetailsProps) => {
  return (
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
            <p className="text-3xl md:text-4xl text-white">{product.price}</p>
          </div>

          <button
            type="button"
            onClick={onToggleFavorite}
            className={`flex items-center gap-2 px-4 py-2.5 border text-xs uppercase tracking-wider transition-all cursor-pointer ${
              isFavorite
                ? "border-rose-400/50 bg-rose-950/30 text-rose-300"
                : "border-white/10 hover:border-white/30 text-neutral-300 hover:text-white"
            }`}
            aria-label={
              isFavorite ? "Удалить из избранного" : "Сохранить в избранное"
            }
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? "fill-rose-400 text-rose-400" : "text-neutral-400"
              }`}
            />
          </button>
        </div>

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

        <div className="pt-4">
          <CustomLink
            to={`${PATHS.home}#${PATHS.anchors.contacts}`}
            className="w-full py-4 border border-white/10 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer hover:text-black"
          >
            <span>Связаться</span>
          </CustomLink>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
