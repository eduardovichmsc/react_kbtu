import { useRef } from "react";
import { navLinks, PATHS } from "../config/paths";
import CustomLink from "./custom-link";

const content = {
  primaryText: "Не пропустите",
  secondaryText: "новые коллекции",
  email: {
    placeholder: "Ваш email",
    submitText: "Подписаться",
  },
  menu: [
    {
      title: "Sitemap",
      class: "md:col-span-2 md:col-start-8",
      array: [...navLinks],
    },
    {
      title: "Social",
      class: "md:col-span-2",
      array: [
        { name: "Instagram", href: PATHS.socials.instagram },
        { name: "Pinterest", href: PATHS.socials.pinterest },
        { name: "Behance", href: PATHS.socials.behance },
        { name: "Telegram", href: PATHS.socials.telegram },
      ],
    },
  ],
};

export default function Footer() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      className="relative h-[700px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="md:fixed md:bottom-0 h-[700px] w-full bg-[#0e0d0c] text-[#e3e1dc] flex flex-col justify-between px-4 md:px-12 py-12">
        <div className="mx-auto max-w-[1600px]">
          {/* TOP SECTION: GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-12">
            {/* CTA / NEWSLETTER */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div>
                <h3 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                  {content.primaryText} <br />{" "}
                  <span className="text-[#bfb3a0] italic">
                    {content.secondaryText}
                  </span>
                  .
                </h3>
              </div>
              <div className="mt-8 md:mt-0 relative max-w-md">
                <input
                  type="email"
                  placeholder={content.email.placeholder}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-lg focus:outline-none focus:border-[#bfb3a0] transition-colors placeholder:text-neutral-600"
                />
                <button
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xs uppercase tracking-widest hover:text-[#bfb3a0] transition-colors cursor-pointer"
                >
                  {content.email.submitText}
                </button>
              </div>
            </div>

            {/* LINKS COLUMNS */}
            {content.menu.map((e) => (
              <div key={e.title} className={e.class}>
                <h4 className="text-xs text-[#bfb3a0] uppercase mb-6 tracking-widest">
                  {/* {e.title} */}
                </h4>
                <ul className="space-y-3 text-sm text-neutral-400">
                  {e.array.map((item) => (
                    <li key={item.name}>
                      <CustomLink
                        to={item.href}
                        className="hover:text-white transition-all duration-300 inline-block"
                      >
                        {item.name}
                      </CustomLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="">
              <h4 className="text-xs text-[#bfb3a0] uppercase mb-6 tracking-widest"></h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Almaty,
                <br />
                Dostyk Ave 42
              </p>
            </div>
          </div>

          {/* BOTTOM SECTION: GIANT TITLE */}
          <div className="relative overflow-hidden flex flex-col justify-end grow">
            <h2 className="w-full">
              <svg
                viewBox="0 0 100 22"
                className="w-full h-auto fill-[#e3e1dc]"
              >
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
    </div>
  );
}
