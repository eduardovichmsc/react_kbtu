import { useProducts } from "@/hooks/useProducts";
import { HomeHero } from "@/components/home/Hero";
import { HomeFeatured } from "@/components/home/Featured";
import { ErrorMessage } from "@/components/ErrorMessage";

const FEATURED_QUERY = { limit: 4, sort: "rating-desc" };

export const Home = () => {
  const { products, loading, error, refetch } = useProducts(FEATURED_QUERY);

  return (
    <div className="space-y-8">
      <HomeHero />
      {error ? (
        <ErrorMessage title="Featured products unavailable" message={error} onRetry={refetch} />
      ) : (
        <HomeFeatured featured={products} loading={loading} />
      )}
    </div>
  );
};

export default Home;
