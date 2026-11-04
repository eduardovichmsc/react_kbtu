import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/service";
import type { Product } from "@/types/product";
import { HomeHero } from "@/components/home/Hero";
import { HomeFeatured } from "@/components/home/Featured";

export const Home = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ limit: 4, sort: "rating-desc" })
      .then((res) => {
        setFeatured(res.products);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <HomeHero />
      <HomeFeatured featured={featured} loading={loading} />
    </div>
  );
};

export default Home;
