import { Link, type NavigateFunction } from "react-router";
import type { Product } from "@/types/product";

export interface BreadcrumbsProps {
  navigate: NavigateFunction;
  product: Product;
}

export const Breadcrumbs = ({ navigate, product }: BreadcrumbsProps) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 cursor-pointer"
      >
        <span>&larr;</span> Back
      </button>
      <div className="flex items-center gap-2 text-gray-500">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:underline">
          All Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">
          {product.title}
        </span>
      </div>
    </div>
  );
};
