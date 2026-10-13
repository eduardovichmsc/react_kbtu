import { Ruler } from "lucide-react";
import { PricingCard } from "./pricing-card";
import type { PricingPackage } from "@/shared/types";

const packages: PricingPackage[] = [
  {
    id: 1,
    name: "Regular",
    price: "200k — 300k ₸",
    desc: "Базовое оформление входной группы. Привлекает внимание пешеходного трафика.",
    features: [
      "Оформление входной двери",
      "Гирлянды (Теплый свет)",
      "Монтаж / Демонтаж",
    ],
    img: "https://images.unsplash.com/photo-1576686616016-5b436154625f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Light",
    price: "350k — 500k ₸",
    desc: "Комплексное решение для фасада и витрин. Создает атмосферу внутри и снаружи.",
    features: [
      "Декор фасада и окон",
      "Флористические композиции",
      "Световой занавес",
      "Вывеска с подсветкой",
    ],
    isPopular: true,
    img: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Premium",
    price: "500k — 1.5m ₸",
    desc: "Полное погружение. Фотозоны, интерьер и масштабные инсталляции под ключ.",
    features: [
      "Полный декор (Фасад + Зал)",
      "Ростовые фигуры и арт-объекты",
      "Кастомные фотозоны",
      "Дизайнерская елка",
    ],
    img: "https://images.unsplash.com/photo-1512413914633-b5043f4041ea?q=80&w=800&auto=format&fit=crop",
  },
];

export const HomePricing = () => {
  return (
    <section
      id="price_list"
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

        {/* FREE ESTIMATION BADGE */}
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

      {/* CARDS GRID */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {packages.map((pkg, i) => (
          <PricingCard key={pkg.id} pkg={pkg} index={i} />
        ))}
      </div>
    </section>
  );
};
