import { Link } from "react-router";
import type { Product } from "@/types/product";
import type { DashboardStats } from "./Statistics";

export interface CategoryBreakdownItem {
  name: string;
  count: number;
  avgPrice: number;
}

export interface StockBreakdownItem {
  label: string;
  count: number;
  pct: number;
  color: string;
}

export interface DashboardGridProps {
  categoryBreakdown: CategoryBreakdownItem[];
  stockBreakdown: StockBreakdownItem[];
  stats: DashboardStats;
  topRated: Product[];
}

export const DashboardGrid = ({
  categoryBreakdown,
  stockBreakdown,
  stats,
  topRated,
}: DashboardGridProps) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Breakdown by Category ({categoryBreakdown.length})
            </h2>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold sticky top-0">
                <tr>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Count</th>
                  <th className="py-2 px-3">Avg. Price</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categoryBreakdown.map((cat) => (
                  <tr key={cat.name} className="hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium text-gray-900 capitalize">
                      {cat.name.replace(/-/g, " ")}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {cat.count} items
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      ${cat.avgPrice.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Link
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Browse
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 shadow-sm space-y-4 flex flex-col">
          <h2 className="text-base font-semibold text-gray-900">
            Breakdown by Stock Status
          </h2>

          <div className="space-y-4 my-auto">
            {stockBreakdown.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className="text-gray-500">
                    {item.count} items ({item.pct.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all`}
                    style={{ width: `${Math.max(item.pct, 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
            Total inventory value:{" "}
            <strong className="text-gray-900 font-semibold">
              $
              {stats.totalInventoryValue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </strong>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Top Rated Products in Selected
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            All Products
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {topRated.map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-8 h-8 object-contain bg-gray-50 border border-gray-200"
                />
                <div>
                  <Link
                    to={`/products/${item.id}`}
                    className="font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {item.title}
                  </Link>
                  <span className="text-gray-400 ml-2">({item.category})</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-yellow-600 font-semibold">
                  {item.rating}
                </span>
                <span className="font-bold text-gray-900">
                  ${item.price.toFixed(2)}
                </span>
                <Link
                  to={`/products/${item.id}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-2.5 py-1"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
