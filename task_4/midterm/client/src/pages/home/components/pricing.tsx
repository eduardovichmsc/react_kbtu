import { useState, useEffect, useCallback } from "react";
import { Ruler, AlertTriangle, RotateCcw } from "lucide-react";
import { PricingCard } from "./pricing-card";
import { PATHS } from "@/shared/config/paths";
import { api } from "@/shared/api";
import type { PricingPackage } from "@/shared/types";

export const HomePricing = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPackages = useCallback(() => {
    setIsLoading(true);
    setError(null);
    api
      .getPricingPackages()
      .then((data) => {
        setPackages(data);
        setError(null);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Не удалось загрузить тарифы",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;
    api
      .getPricingPackages()
      .then((data) => {
        if (!isMounted) return;
        setPackages(data);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err instanceof Error ? err.message : "Не удалось загрузить тарифы",
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
  }, []);

  return (
    <section
      id={PATHS.anchors.priceList}
      className="relative py-32 px-4 md:px-12 bg-[#0e0d0c] text-[#e3e1dc]"
    >
      {/* HEADER SECTION */}
      <div className="max-w-[1600px] mx-auto mb-20 flex flex-col md:flex-row justify-between md:items-end gap-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-[1px] bg-[#bfb3a0]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#bfb3a0]">
              Прайс лист
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif leading-[0.9]">
            Пакеты <br />{" "}
            <span className="text-neutral-500 italic">оформления</span>
          </h2>
        </div>

        <div className="bg-[#1a1918] border border-white/10 p-6 rounded-none max-w-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#bfb3a0] text-black flex items-center justify-center rounded-full shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-serif text-white mb-1">
                Бесплатный выезд
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Наш декоратор приедет, сделает замеры и предложит 3 варианта
                сметы под ваш бюджет.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="max-w-[1600px] mx-auto border border-white/10 bg-[#141312] py-16 px-6 text-center flex flex-col items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-[#bfb3a0] mb-3 stroke-[1.5]" />
          <h3 className="text-xl font-serif text-white mb-2">
            Ошибка загрузки
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mb-6">
            Не удалось загрузить тарифы с сервера.
          </p>
          <button
            type="button"
            onClick={loadPackages}
            className="py-2.5 px-6 border border-white/20 text-xs uppercase tracking-widest text-neutral-200 hover:text-black hover:bg-[#bfb3a0] hover:border-[#bfb3a0] transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Повторить попытку
          </button>
        </div>
      ) : (
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isLoading && packages.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#121110] border border-white/10 min-h-[500px] animate-pulse"
                />
              ))
            : packages.map((pkg, i) => (
                <PricingCard key={pkg.id} pkg={pkg} index={i} />
              ))}
        </div>
      )}
    </section>
  );
};
