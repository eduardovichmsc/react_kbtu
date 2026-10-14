import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { PATHS } from "@/shared/config/paths";
import type { Product } from "@/shared/types";
import { AddProductForm } from "./components/form";

export const AddProductPage = () => {
  const navigate = useNavigate();
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSuccess = (product: Product) => {
    setCreatedProduct(product);
    setServerError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0e0d0c] text-[#e3e1dc] pt-28 pb-24 px-4 md:px-12 selection:bg-[#bfb3a0] selection:text-black">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Каталог", href: PATHS.catalog },
            { label: "Добавление предмета" },
          ]}
        />

        <h1 className="mb-8 text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-[#e3e1dc]">
          Добавить предмет в каталог
        </h1>

        {/* success */}
        <AnimatePresence>
          {createdProduct && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 p-6 md:p-8 border border-[#bfb3a0]/40 bg-[#161514] rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#bfb3a0]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#bfb3a0]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    Предмет «{createdProduct.name}» успешно сохранен!
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Присвоен ID #{createdProduct.id}. Товар теперь доступен в
                    общем каталоге.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCreatedProduct(null)}
                  className="px-4 py-2.5 text-xs uppercase tracking-widest border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
                >
                  Добавить еще один
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate(PATHS.product.slug(createdProduct.id))
                  }
                  className="px-5 py-2.5 text-xs uppercase tracking-widest bg-[#bfb3a0] text-black font-medium hover:bg-white transition-colors cursor-pointer"
                >
                  Открыть страницу товара
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* server error */}
        {serverError && (
          <div className="mb-8 p-4 border border-rose-500/40 bg-rose-950/20 text-rose-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{serverError}</span>
          </div>
        )}

        <AddProductForm onSuccess={handleSuccess} onError={setServerError} />
      </div>
    </div>
  );
};

export default AddProductPage;
