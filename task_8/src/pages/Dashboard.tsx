import { useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useAppSelector } from "@/app/hooks";
import { useAllProducts } from "@/hooks/useAllProducts";
import {
  selectDashboardAnalytics,
  selectDashboardCategories,
} from "@/features/products/productsSelectors";
import { DashboardFilter } from "@/components/dashboard/Filter";
import { DashboardStatistics } from "@/components/dashboard/Statistics";
import { DashboardGrid } from "@/components/dashboard/Grid";

export const Dashboard = () => {
  const { loading, error, isFetching, refetch } = useAllProducts();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>("all");

  const categories = useAppSelector(selectDashboardCategories);
  const { stats, categoryBreakdown, stockBreakdown, topRated } = useAppSelector((s) =>
    selectDashboardAnalytics(s, selectedCategory, selectedStockStatus)
  );

  if (loading) {
    return <LoadingSpinner message="Calculating inventory statistics..." />;
  }

  if (error) {
    return <ErrorMessage title="Dashboard unavailable" message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Inventory Dashboard
            </h1>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 border border-gray-200">
              Redux cache (5m TTL)
            </span>
            {isFetching && (
              <span className="text-xs text-blue-600 animate-pulse">
                Revalidating...
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
          <DashboardFilter
            categories={categories}
            selectedCategory={selectedCategory}
            selectedStockStatus={selectedStockStatus}
            setSelectedCategory={setSelectedCategory}
            setSelectedStockStatus={setSelectedStockStatus}
          />
        </div>
      </div>

      <DashboardStatistics stats={stats} selectedCategory={selectedCategory} />

      {stats.totalCount === 0 && (
        <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-500">
          No products match the selected filters.
        </div>
      )}

      <DashboardGrid
        categoryBreakdown={categoryBreakdown}
        stats={stats}
        stockBreakdown={stockBreakdown}
        topRated={topRated}
      />
    </div>
  );
};

export default Dashboard;
