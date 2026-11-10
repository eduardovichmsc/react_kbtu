import { useProducts } from "@/hooks/useProducts";
import { HomeHero } from "@/components/home/Hero";
import { HomeFeatured } from "@/components/home/Featured";

export const Home = () => {
  const { data, loading } = useProducts({ limit: 4, sort: "rating-desc" });
  const featured = data?.products || [];

  return (
    <div className="space-y-8">
      <HomeHero />
      <HomeFeatured featured={featured} loading={loading} />
    </div>
  );
};

export default Home;
