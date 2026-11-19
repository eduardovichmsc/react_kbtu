import type { CategoryItem } from "@/types/product";

export interface ProductsFilterProps {
  category: string;
  categories: CategoryItem[];
  updateParams: (newEntries: Record<string, string | null>) => void;
  stockStatus: string;
  priceRange: string;
  sort: string;
}

export const ProductsFilter = ({
  category,
  categories,
  updateParams,
  stockStatus,
  priceRange,
  sort,
}: ProductsFilterProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Stock Status
        </label>
        <select
          value={stockStatus}
          onChange={(e) => updateParams({ stock: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Items</option>
          <option value="inStock">In Stock (&gt; 10)</option>
          <option value="lowStock">Low Stock (&le; 10)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Price Range
        </label>
        <select
          value={priceRange}
          onChange={(e) => updateParams({ price: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Prices</option>
          <option value="under50">Under $50</option>
          <option value="50to200">$50 to $200</option>
          <option value="over200">Over $200</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Highest Rated</option>
          <option value="title-asc">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
};
