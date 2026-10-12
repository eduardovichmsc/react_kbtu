import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLenis } from "lenis/react";
import { Link, useLocation } from "react-router";
import { navLinks, PATHS } from "../config/paths";
import type { NavLinkItem } from "../types";

export default function Footer() {
  const container = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const location = useLocation();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavLinkItem) => {
    if (item.isExternalRoute) return;

    if (item.href.includes("#")) {
      const [path, hash] = item.href.split("#");
      const targetPath = path || "/";

      if (location.pathname === targetPath) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(`#${hash}`, {
            duration: 1.5,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <div
      ref={container}
      className="relative h-[800px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="md:fixed md:bottom-0 h-[800px] w-full bg-[#0e0d0c] text-[#e3e1dc] flex flex-col justify-between px-4 md:px-12 py-12">
        {/* TOP SECTION: GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-12">
          {/* CTA / NEWSLETTER */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <h3 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                Не пропустите <br />{" "}
                <span className="text-[#bfb3a0] italic">новые коллекции</span>.
              </h3>
            </div>
            <div className="mt-8 md:mt-0 relative max-w-md">
              <input
                type="email"
                placeholder="Ваш email"
                className="w-full bg-transparent border-b border-white/20 py-4 text-lg focus:outline-none focus:border-[#bfb3a0] transition-colors placeholder:text-neutral-600"
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-xs uppercase tracking-widest hover:text-[#bfb3a0] transition-colors cursor-pointer"
              >
                Подписаться
              </button>
            </div>
          </div>

          {/* LINKS COLUMNS */}
          <div className="md:col-span-2 md:col-start-8">
            <h4 className="text-xs font-mono text-[#bfb3a0] uppercase mb-6 tracking-widest">
              Sitemap
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={(e) => handleLinkClick(e, item)}
                    className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-mono text-[#bfb3a0] uppercase mb-6 tracking-widest">
              Socials
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              {[
                { name: "Instagram", url: PATHS.socials.instagram },
                { name: "Pinterest", url: PATHS.socials.pinterest },
                { name: "Behance", url: PATHS.socials.behance },
                { name: "Telegram", url: PATHS.socials.telegram },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {item.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-xs font-mono text-[#bfb3a0] uppercase mb-6 tracking-widest">
              Almaty
            </h4>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Dostyk Ave 42,
              <br />
              Kazakhstan
            </p>
          </div>
        </div>

        {/* BOTTOM SECTION: GIANT TITLE */}
        <div className="relative overflow-hidden flex flex-col justify-end grow">
          <div className="flex justify-between items-end mb-4 px-1">
            <span className="text-[10px] md:text-xs uppercase text-neutral-600 tracking-widest">
              Privacy Policy
            </span>
            <span className="text-[10px] md:text-xs uppercase text-neutral-600 tracking-widest">
              ©{new Date().getFullYear()} Aura Decor
            </span>
          </div>

          <h2 className="w-full">
            <svg viewBox="0 0 100 22" className="w-full h-auto fill-[#e3e1dc]">
              <text
                x="50%"
                y="18"
                textAnchor="middle"
                fontSize="22"
                fontFamily="serif"
                fontWeight="bold"
                letterSpacing="-1"
              >
                AURA.
              </text>
            </svg>
          </h2>
        </div>
      </div>
    </div>
  );
}
