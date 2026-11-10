import { ProductCard } from "../ProductCard";
import type { PaginatedProductsResult } from "@/services/service";

export interface ProductsGridProps {
  data: PaginatedProductsResult;
  updateParams: (newEntries: Record<string, string | null>) => void;
}

export const ProductsGrid = ({ data, updateParams }: ProductsGridProps) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {data.totalPages > 1 && (
        <div className="flex justify-end">
          <div className="flex items-center gap-1">
            <button
              disabled={data.currentPage <= 1}
              onClick={() =>
                updateParams({ page: String(data.currentPage - 1) })
              }
              className="px-3 py-1.5 border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: data.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === data.totalPages ||
                  Math.abs(p - data.currentPage) <= 1,
              )
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                  <span key={p} className="flex items-center">
                    {showEllipsis && (
                      <span className="px-1 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => updateParams({ page: String(p) })}
                      className={`px-3 py-1.5 border text-sm cursor-pointer ${
                        p === data.currentPage
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}

            <button
              disabled={data.currentPage >= data.totalPages}
              onClick={() =>
                updateParams({ page: String(data.currentPage + 1) })
              }
              className="px-3 py-1.5 border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};
