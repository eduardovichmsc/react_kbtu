import type { Dispatch, SetStateAction } from "react";

export interface DashboardFilterProps {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  selectedStockStatus: string;
  setSelectedStockStatus: Dispatch<SetStateAction<string>>;
  categories: string[];
}

export const DashboardFilter = ({
  selectedCategory,
  setSelectedCategory,
  selectedStockStatus,
  setSelectedStockStatus,
  categories,
}: DashboardFilterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-3 py-1.5 border border-gray-300 text-xs bg-white text-gray-800 focus:outline-none focus:border-blue-500"
      >
        <option value="all">All Categories ({categories.length})</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>

      <select
        value={selectedStockStatus}
        onChange={(e) => setSelectedStockStatus(e.target.value)}
        className="px-3 py-1.5 border border-gray-300 text-xs bg-white text-gray-800 focus:outline-none focus:border-blue-500"
      >
        <option value="all">All Stock Levels</option>
        <option value="inStock">Healthy Stock (&gt; 10)</option>
        <option value="lowStock">Low Stock (&le; 10)</option>
      </select>

      {(selectedCategory !== "all" || selectedStockStatus !== "all") && (
        <button
          onClick={() => {
            setSelectedCategory("all");
            setSelectedStockStatus("all");
          }}
          className="text-xs text-blue-600 hover:underline px-2 py-1"
        >
          Reset
        </button>
      )}
    </div>
  );
};
