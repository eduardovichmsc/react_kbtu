import { useEffect, useMemo, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { fetchAllProducts } from "@/services/service";
import type { Product } from "@/types/product";
import { DashboardFilter } from "@/components/dashboard/Filter";
import { DashboardStatistics } from "@/components/dashboard/Statistics";
import { DashboardGrid } from "@/components/dashboard/Grid";

export const Dashboard = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>("all");

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    fetchAllProducts(controller.signal)
      .then((products) => {
        if (!ignore) {
          setAllProducts(products);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore && err.name !== "AbortError") {
          setError(err.message || "Failed to load dashboard data");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      if (selectedStockStatus === "inStock" && p.stock <= 10) {
        return false;
      }
      if (selectedStockStatus === "lowStock" && p.stock > 10) {
        return false;
      }
      return true;
    });
  }, [allProducts, selectedCategory, selectedStockStatus]);

  const stats = useMemo(() => {
    const totalCount = filteredProducts.length;
    if (totalCount === 0) {
      return {
        totalCount: 0,
        avgPrice: 0,
        totalStock: 0,
        avgRating: 0,
        totalInventoryValue: 0,
      };
    }

    const sumPrice = filteredProducts.reduce((acc, p) => acc + p.price, 0);
    const sumStock = filteredProducts.reduce((acc, p) => acc + p.stock, 0);
    const sumRating = filteredProducts.reduce((acc, p) => acc + p.rating, 0);
    const totalInventoryValue = filteredProducts.reduce(
      (acc, p) => acc + p.price * p.stock,
      0,
    );

    return {
      totalCount,
      avgPrice: sumPrice / totalCount,
      totalStock: sumStock,
      avgRating: sumRating / totalCount,
      totalInventoryValue,
    };
  }, [filteredProducts]);

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; sumPrice: number }>();
    filteredProducts.forEach((p) => {
      const current = map.get(p.category) || { count: 0, sumPrice: 0 };
      map.set(p.category, {
        count: current.count + 1,
        sumPrice: current.sumPrice + p.price,
      });
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        avgPrice: data.sumPrice / data.count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredProducts]);

  const stockBreakdown = useMemo(() => {
    let outOfStock = 0;
    let lowStock = 0; // 1 - 10
    let healthyStock = 0; // > 10

    filteredProducts.forEach((p) => {
      if (p.stock === 0) outOfStock++;
      else if (p.stock <= 10) lowStock++;
      else healthyStock++;
    });

    const total = filteredProducts.length || 1;
    return [
      {
        label: "Healthy Stock (> 10 units)",
        count: healthyStock,
        pct: (healthyStock / total) * 100,
        color: "bg-emerald-500",
      },
      {
        label: "Low Stock (1–10 units)",
        count: lowStock,
        pct: (lowStock / total) * 100,
        color: "bg-amber-500",
      },
      {
        label: "Out of Stock (0 units)",
        count: outOfStock,
        pct: (outOfStock / total) * 100,
        color: "bg-red-500",
      },
    ];
  }, [filteredProducts]);

  const topRated = useMemo(() => {
    return [...filteredProducts]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, [filteredProducts]);

  if (loading) {
    return <LoadingSpinner message="Calculating inventory statistics..." />;
  }

  if (error) {
    return <ErrorMessage title="Dashboard unavailable" message={error} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory Dashboard
          </h1>
        </div>

        <DashboardFilter
          categories={categories}
          selectedCategory={selectedCategory}
          selectedStockStatus={selectedStockStatus}
          setSelectedCategory={setSelectedCategory}
          setSelectedStockStatus={setSelectedStockStatus}
        />
      </div>

      <DashboardStatistics stats={stats} selectedCategory={selectedCategory} />

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
