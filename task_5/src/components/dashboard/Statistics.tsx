export interface DashboardStats {
  totalCount: number;
  avgPrice: number;
  totalStock: number;
  avgRating: number;
  totalInventoryValue: number;
}

export interface DashboardStatisticsProps {
  stats: DashboardStats;
  selectedCategory: string;
}

export const DashboardStatistics = ({ stats, selectedCategory }: DashboardStatisticsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-200 p-4">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          Total Products
        </div>
        <div className="text-2xl font-bold text-gray-900 mt-1">
          {stats.totalCount}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {selectedCategory === "all"
            ? "All catalog"
            : `Filtered by ${selectedCategory}`}
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          Average Price
        </div>
        <div className="text-2xl font-bold text-gray-900 mt-1">
          ${stats.avgPrice.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500 mt-1">Per product unit</div>
      </div>

      <div className="bg-white border border-gray-200 p-4">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          Total Stock Units
        </div>
        <div className="text-2xl font-bold text-gray-900 mt-1">
          {stats.totalStock.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Available in warehouses
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          Average Rating
        </div>
        <div className="text-2xl font-bold text-yellow-600 mt-1">
          {stats.avgRating.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500 mt-1">Out of 5.0</div>
      </div>
    </div>
  );
};
