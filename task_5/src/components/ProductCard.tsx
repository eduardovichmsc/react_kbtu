import { Link } from "react-router";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white border border-gray-200 overflow-hidden flex flex-col h-full"
    >
      <div className="h-48 bg-gray-100 flex items-center justify-center p-3 relative overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-base line-clamp-1">
            {product.title}
          </h3>
          <span className="text-yellow-600 font-semibold text-sm whitespace-nowrap">
            {product.rating.toFixed(1)}
          </span>
        </div>

        <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div>
            <div className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              {product.stock > 0 ? (
                <span className="text-emerald-600 font-medium">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-red-500 font-medium">Out of stock</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
