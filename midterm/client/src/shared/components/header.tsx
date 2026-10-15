import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Heart, Menu, X, ArrowUpRight } from "lucide-react";
import { useLenis } from "lenis/react";
import useFavoritesStore from "@/shared/store/favorites";
import { navLinks, PATHS } from "@/shared/config/paths";
import CustomLink from "@/shared/components/custom-link";
import { cn } from "@/utils/cn";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { count: favoritesCount, openDrawer } = useFavoritesStore();
  const lenis = useLenis();

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "unset";
    }
  }, [isOpen, lenis]);

  const menuVariants: Variants = {
    initial: { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
    animate: {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  const linkVariants: Variants = {
    initial: { y: 80, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.1 + i * 0.1,
      },
    }),
    exit: { y: 80, opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-12 py-6 transition-colors duration-500 ${
          isOpen ? "text-[#e3e1dc]" : "text-[#bfb3a0] mix-blend-difference"
        }`}
      >
        <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center">
          <CustomLink
            to={PATHS.home}
            className="text-xl font-bold tracking-tighter uppercase font-serif cursor-pointer z-50 bg-transparent border-none text-inherit p-0"
            onClick={() => setIsOpen(false)}
          >
            Aura.
          </CustomLink>

          <nav className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
            {navLinks.map((link) => (
              <CustomLink
                key={link.name}
                to={link.href}
                className="transition-colors hover:text-white relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-300 w-0 group-hover:w-full" />
              </CustomLink>
            ))}
          </nav>

          <div className="flex gap-4 items-center z-50">
            {/* Кнопка открытия избранного */}
            <button
              type="button"
              className={cn(
                "relative cursor-pointer group bg-transparent border-none p-1 pr-0 text-inherit",
              )}
              onClick={openDrawer}
              aria-label="Открыть избранное"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isOpen ? "text-[#e3e1dc]" : "group-hover:text-white"
                }`}
              />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 right-3 bg-[#bfb3a0] text-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="md:hidden w-6 h-6 flex items-center justify-center focus:outline-none cursor-pointer bg-transparent border-none text-inherit"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Переключить меню"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="w-6 h-6 text-[#e3e1dc]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-[#0e0d0c] z-40 flex flex-col justify-center px-4 md:px-12"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="max-w-[1600px] mx-auto w-full flex flex-col justify-center h-full relative">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <div key={link.name} className="overflow-hidden">
                    <motion.div custom={index} variants={linkVariants}>
                      <CustomLink
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-5xl font-serif text-[#e3e1dc] hover:text-[#bfb3a0] transition-colors inline-flex items-center gap-4 group"
                      >
                        {link.name}
                        <ArrowUpRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#bfb3a0]" />
                      </CustomLink>
                    </motion.div>
                  </div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.5, duration: 0.5 },
                }}
                className="absolute bottom-10 left-0 text-[#bfb3a0]"
              >
                <p className="text-xs uppercase tracking-widest mb-2 opacity-50">
                  Contacts
                </p>
                <p className="text-sm font-light">hello@aura.decor</p>
                <p className="text-sm font-light">+7 (700) 123-45-67</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </>
  );
}
