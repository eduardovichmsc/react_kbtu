import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { PATHS } from "@/shared/config/paths";

const content = {
  tagline: "HoReCa & Общественные пространства",
  heading: {
    line1: "Чувство",
    line2: "Места",
  },
  description: {
    primary: "Интерьер — это тихий язык вашего бренда.",
    secondary: "Комплектация ресторанов, отелей и",
    highlight: "гастро-проектов",
    ending: "акцентным декором.",
  },
  cta: {
    text: "Обсудить проект",
    link: PATHS.anchors.contacts,
  },
  image: {
    src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop",
    alt: "Restaurant & Lounge Atmosphere",
  },
  badge: {
    top: "Для",
    middle: "HoReCa",
    bottom: "Бизнеса",
  },
  scrollIndicator: "Далее",
};

export const HomeHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const textVariants: Variants = {
    hidden: { y: "100%" },
    visible: (i: number) => ({
      y: "0%",
      transition: {
        duration: 1.2,
        ease: [0.33, 1, 0.68, 1],
        delay: i * 0.15,
      },
    }),
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    if (lenis) {
      lenis.scrollTo(`#${id}`, {
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center px-4 md:px-12 pt-20 overflow-hidden bg-[#0e0d0c]"
    >
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* TEXT CONTENT */}
        <motion.div
          style={{ y: yText }}
          className="lg:col-span-7 flex flex-col justify-center relative z-20 mix-blend-difference"
        >
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex items-center gap-4 mb-6 md:mb-10"
          >
            <span className="w-12 h-px bg-[#bfb3a0]" />
            <span className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-[#bfb3a0]">
              {content.tagline}
            </span>
          </motion.div>

          {/* H1 Line 1 */}
          <div className="overflow-hidden">
            <motion.h1
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              // Уменьшил размер шрифта для длинных русских слов (было 13vw -> 11vw)
              className="text-[11vw] lg:text-[9vw] leading-[0.85] font-serif tracking-tight text-[#e3e1dc]"
            >
              {content.heading.line1}
            </motion.h1>
          </div>

          {/* H1 Line 2 */}
          <div className="overflow-hidden">
            <motion.h1
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              // Уменьшил отступ и шрифт для баланса
              className="text-[11vw] lg:text-[9vw] leading-[0.85] font-serif tracking-tight text-[#e3e1dc] ml-[8vw] lg:ml-[6vw]"
            >
              {content.heading.line2}
            </motion.h1>
          </div>

          {/* Description */}
          <div className="overflow-hidden mt-6 md:mt-8">
            <motion.h2
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-lg md:text-xl font-light text-neutral-400 max-w-lg ml-0.5 leading-relaxed"
            >
              {content.description.primary}
              <br className="hidden md:block" />
              {content.description.secondary}{" "}
              <span className="text-[#bfb3a0] italic">
                {content.description.highlight}
              </span>{" "}
              {content.description.ending}
            </motion.h2>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-12 flex items-center gap-4 group cursor-pointer w-fit"
          >
            <a
              href={`#${content.cta.link}`}
              onClick={(e) => handleScroll(e, content.cta.link)}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#bfb3a0] group-hover:border-[#bfb3a0] transition-all duration-500">
                <ArrowDownRight className="w-6 h-6 text-white group-hover:text-black transition-colors" />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                {content.cta.text}
              </span>
            </a>
          </motion.div>
        </motion.div>

        {/* IMAGE VISUAL */}
        <div className="lg:col-span-5 relative h-[50vh] lg:h-[70vh] w-full mt-10 lg:mt-0">
          <motion.div
            style={{ y: yImage, scale: scaleImage }}
            className="relative w-full h-full overflow-hidden"
          >
            <div className="absolute -inset-4 border border-[#bfb3a0]/30 z-0 hidden lg:block translate-x-4 translate-y-4" />

            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{
                duration: 1.5,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
              className="relative w-full h-full z-10 bg-[#1a1918]"
            >
              <img
                src={content.image.src}
                alt={content.image.alt}
                className="w-full h-full object-cover opacity-90 grayscale contrast-125 hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0c] via-transparent to-transparent opacity-60" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
