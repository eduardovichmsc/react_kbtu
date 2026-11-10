import { Link } from "react-router";
import { LoadingSpinner } from "../LoadingSpinner";
import { ProductCard } from "../ProductCard";
import type { Product } from "@/types/product";

export interface HomeFeaturedProps {
  loading: boolean;
  featured: Product[];
}

export const HomeFeatured = ({ loading, featured }: HomeFeaturedProps) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
        </div>
        <Link
          to="/products"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading featured items..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </section>
  );
};
