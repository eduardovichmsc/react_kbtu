import { useState, useEffect } from "react";
import { useParams } from "react-router";
import useFavoritesStore from "@/shared/store/favorites";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { PATHS } from "@/shared/config/paths";
import { useLenis } from "lenis/react";
import { api } from "@/shared/api";
import type { Product } from "@/shared/types";

import { ProductGallery } from "./components/gallery";
import { ProductDetails } from "./components/details";
import { ProductRelated } from "./components/related";
import {
  ProductSkeleton,
  ProductErrorState,
  ProductNotFoundState,
} from "./components/states";

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const lenis = useLenis();
  const { ids, toggleFavorite } = useFavoritesStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [userSelectedImage, setUserSelectedImage] = useState<string | null>(
    null,
  );

  const [prevId, setPrevId] = useState(numericId);
  if (numericId !== prevId) {
    setPrevId(numericId);
    setProduct(null);
    setUserSelectedImage(null);
    setIsLoading(true);
    setError(null);
  }

  useEffect(() => {
    if (!numericId || Number.isNaN(numericId)) return;

    let isMounted = true;

    api
      .getProductById(numericId)
      .then((data) => {
        if (!isMounted) return;
        setProduct(data);
        setError(null);

        if (data?.category) {
          api.getProducts({ category: data.category, limit: 4 }).then((res) => {
            if (isMounted) {
              setRelatedProducts(
                res.items.filter((p) => p.id !== data.id).slice(0, 3),
              );
            }
          });
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось связаться с сервером",
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [numericId]);

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [numericId, lenis]);

  if (!numericId || Number.isNaN(numericId)) {
    return (
      <ProductNotFoundState
        title="Некорректный адрес"
        message="Указан неверный ID предмета."
      />
    );
  }

  if (isLoading && !product) {
    return <ProductSkeleton />;
  }

  if (error) {
    return <ProductErrorState />;
  }

  if (!product) {
    return <ProductNotFoundState />;
  }

  const activeImage = userSelectedImage || product.img;
  const isFav = ids.includes(product.id);

  return (
    <div className="min-h-screen bg-[#0e0d0c] text-[#e3e1dc] pt-28 md:pt-36 pb-32 px-4 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <Breadcrumbs
          items={[
            { label: "Каталог", href: PATHS.catalog },
            { label: product.name },
          ]}
          showBack
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <ProductGallery
            product={product}
            activeImage={activeImage}
            onSelectImage={setUserSelectedImage}
          />

          <ProductDetails
            product={product}
            isFavorite={isFav}
            onToggleFavorite={() => toggleFavorite(product)}
          />
        </div>

        <ProductRelated products={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;
