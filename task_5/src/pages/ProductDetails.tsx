import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useProduct } from "@/hooks/useProduct";
import { Breadcrumbs } from "@/components/product-details/Breadcrumbs";

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const [selectedImage, setSelectedImage] = useState<string>("");

  if (loading) {
    return <LoadingSpinner message={`Loading details for product #${id}...`} />;
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto my-8">
        <ErrorMessage
          title="Product Not Available"
          message={error || `Could not find product with ID "${id}".`}
        />
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            &larr; Go Back
          </button>
          <Link
            to="/products"
            className="px-4 py-2 bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            All Products
          </Link>
        </div>
      </div>
    );
  }

  const activeImage =
    selectedImage ||
    product.thumbnail ||
    (product.images && product.images[0]) ||
    "";
  const originalPrice =
    product.discountPercentage > 0
      ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
      : null;

  return (
    <div className="space-y-6">
      <Breadcrumbs navigate={navigate} product={product} />

      <div className="bg-white border border-gray-200 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-80 bg-gray-50 border border-gray-200 flex items-center justify-center p-4">
              <img
                src={activeImage}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 border p-1 bg-gray-50 shrink-0 cursor-pointer ${
                      activeImage === img
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {product.brand && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 font-medium">
                  <span className="uppercase">{product.category}</span> /{" "}
                  {product.brand}
                </span>
              )}
              {product.sku && (
                <span className="text-gray-400 text-xs ml-auto">
                  {product.sku}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-600 font-bold text-sm">
                  {product.rating}
                </span>
                <span className="text-xs text-gray-500">
                  {product.availabilityStatus ||
                    (product.stock > 0 ? "In Stock" : "Out of Stock")}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="p-4 bg-gray-50 border border-gray-100 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ${originalPrice}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5">
                    Save {product.discountPercentage}%
                  </span>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="text-gray-500">Category</div>
                <div className="text-gray-900 font-medium capitalize">
                  {product.category}
                </div>

                <div className="text-gray-500">Brand</div>
                <div className="text-gray-900 font-medium">
                  {product.brand || "Independent"}
                </div>

                <div className="text-gray-500">Stock Available</div>
                <div className="text-gray-900 font-medium">
                  {product.stock} units
                </div>

                <div className="text-gray-500">Rating</div>
                <div className="text-gray-900 font-medium">
                  {product.rating} / 5.0
                </div>

                <div className="text-gray-500">Warranty</div>
                <div className="text-gray-900 font-medium">
                  {product.warrantyInformation ||
                    "Standard manufacturer warranty"}
                </div>

                <div className="text-gray-500">Shipping</div>
                <div className="text-gray-900 font-medium">
                  {product.shippingInformation || "Standard ground shipping"}
                </div>

                <div className="text-gray-500">Return Policy</div>
                <div className="text-gray-900 font-medium">
                  {product.returnPolicy || "30 days return guarantee"}
                </div>

                {product.weight && (
                  <>
                    <div className="text-gray-500">Weight</div>
                    <div className="text-gray-900 font-medium">
                      {product.weight} kg
                    </div>
                  </>
                )}

                {product.dimensions && (
                  <>
                    <div className="text-gray-500">Dimensions (W×H×D)</div>
                    <div className="text-gray-900 font-medium">
                      {product.dimensions.width} × {product.dimensions.height} ×{" "}
                      {product.dimensions.depth} cm
                    </div>
                  </>
                )}
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
