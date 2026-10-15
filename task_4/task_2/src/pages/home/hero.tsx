import { useLenis } from "lenis/react";

export const HomeHero = () => {
  const lenis = useLenis();

  const handleScroll = (e: any, target: any) => {
    e.preventDefault();
    lenis?.scrollTo(target, { offset: -125, duration: 1.2 });
  };

  return (
    <section
      className="flex justify-between items-end pt-10 min-h-[500px]"
      id="hero"
    >
      {/* Content */}
      <div className="">
        <p className="text-sm font-medium tracking-widest uppercase text-slate-400 mb-4">
          Student Portfolio
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-3xl">
          Hi, its Darzhan.
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
          I do create <span className="text-slate-400">pure</span> and modern
          websites.
        </p>
        <div className="flex gap-4">
          <a
            href="#projects"
            onClick={(e) => handleScroll(e, "#projects")}
            className="px-8 py-4 rounded-none bg-black text-white font-medium hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={(e) => handleScroll(e, "#contacts")}
            className="px-8 py-4 rounded-none border border-slate-200 bg-white font-medium hover:bg-slate-50 transition-all"
          >
            Contacts
          </a>
        </div>
      </div>
    </section>
  );
};
