import {
  useScroll,
  useTransform,
  motion,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

const content = {
  title: "Концепция",
  body: `В мире визуального шума сложно найти истину. Мы не просто продаем декор — мы формируем _характер_ пространства. Будь то бутик-отель или шумный бар, наши предметы работают на создание целостного образа, который _врезается_ в память гостя. Мы — ваш куратор в мире предметного дизайна.`,
  array: [
    {
      number: "01",
      title: "Визуальный фильтр",
      body: "Отсекаем лишнее",
    },
    {
      number: "02",
      title: "Складская программа",
      body: "Готовность к запуску",
    },
    {
      number: "03",
      title: "Комплектация",
      body: "Рестораны и отели",
    },
  ],
};

export const HomePhilosophy = () => {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "end 0.9"],
  });

  return (
    <section
      id="about"
      ref={container}
      className="relative w-full py-40 px-4 md:px-12 bg-[#0e0d0c] border-t border-white/5"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-0">
        {/* LEFT COLUMN: Sticky Title & Visual */}
        <div className="lg:w-1/3 relative">
          <div className="lg:sticky lg:top-32 flex flex-col gap-8">
            {/* <div className="flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#bfb3a0]"></span>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#bfb3a0]">
                {content.title}
              </h3>
            </div> */}

            {/* Visual: Abstract/Architectural focus */}
            <motion.div
              style={{ opacity: scrollYProgress }}
              className="hidden lg:block relative w-80 h-96 mt-8 grayscale opacity-60"
            >
              <img
                src="https://images.unsplash.com/photo-1487700160041-babef9c3cb55?q=80&w=2652&auto=format&fit=crop"
                alt="Texture and Form"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0e0d0c]/10" />
              <span className="absolute -bottom-6 left-0 text-[10px] text-neutral-600">
                REF: ARCHIVE_VOL.2
              </span>
            </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Text */}
        <div className="lg:w-2/3">
          <Paragraph scrollYProgress={scrollYProgress}>
            {content.body}
          </Paragraph>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-white/10 pt-8">
            {content.array.map((e) => (
              <Stat number={e.number} label={e.title} sub={e.body} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Paragraph = ({
  children,
  scrollYProgress,
}: {
  children: string;
  scrollYProgress: MotionValue<number>;
}) => {
  const words = children.split(" ");
  return (
    <p className="text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.15] font-light flex flex-wrap gap-x-3 gap-y-2">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={`${word}-${i}`}
            range={[start, end]}
            progress={scrollYProgress}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word = ({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const isSpecial = children.includes("_");
  const text = children.replaceAll("_", "");

  return (
    <span className="relative">
      <motion.span
        style={{ opacity }}
        className={`transition-colors duration-200 ${
          isSpecial ? "text-[#bfb3a0] font-serif italic" : "text-[#e3e1dc]"
        }`}
      >
        {text}
      </motion.span>
    </span>
  );
};

const Stat = ({
  label,
  sub,
}: {
  number: string;
  label: string;
  sub?: string;
}) => (
  <div>
    <span className="block text-xs text-[#bfb3a0] mb-3"></span>
    <h4 className="block text-sm uppercase tracking-widest text-white mb-1">
      {label}
    </h4>
    {sub && (
      <p className="text-[10px] text-neutral-500 uppercase tracking-wide">
        {sub}
      </p>
    )}
  </div>
);
