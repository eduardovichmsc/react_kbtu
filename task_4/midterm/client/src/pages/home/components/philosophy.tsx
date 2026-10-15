import { motion } from "motion/react";
import { PATHS } from "@/shared/config/paths";

const FEATURES = [
  {
    number: "01",
    title: "Визуальный фильтр",
    description: "Отсекаем лишнее",
  },
  {
    number: "02",
    title: "Складская программа",
    description: "Готовность к запуску",
  },
  {
    number: "03",
    title: "Комплектация",
    description: "Рестораны и отели",
  },
];

export const HomePhilosophy = () => {
  return (
    <section
      id={PATHS.anchors.about}
      className="relative w-full py-24 md:py-36 px-4 md:px-12 bg-[#0e0d0c] border-t border-white/5"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/3 flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <span className="w-8 h-px bg-[#bfb3a0]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#bfb3a0]">
              Концепция
            </span>
          </div>

          <div className="relative w-full max-w-sm h-80 md:h-96 grayscale contrast-125 opacity-80 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1487700160041-babef9c3cb55?q=80&w=2652&auto=format&fit=crop"
              alt="Texture and Form"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:w-2/3 flex flex-col justify-between"
        >
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] leading-[1.25] font-light text-[#e3e1dc]">
            В мире визуального шума сложно найти истину. Мы не просто продаем
            декор — мы формируем{" "}
            <span className="text-[#bfb3a0] font-serif italic">характер</span>{" "}
            пространства. Будь то бутик-отель или шумный бар, наши предметы
            работают на создание целостного образа, который{" "}
            <span className="text-[#bfb3a0] font-serif italic">врезается</span>{" "}
            в память гостя. Мы — ваш куратор в мире предметного дизайна.
          </p>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/10 pt-8">
            {FEATURES.map((item) => (
              <div key={item.number} className="flex flex-col gap-1.5">
                <span className="text-xs font-mono text-[#bfb3a0] tracking-wider">
                  {item.number}
                </span>
                <h4 className="text-sm uppercase tracking-widest text-white font-medium">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-400 tracking-wide">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
