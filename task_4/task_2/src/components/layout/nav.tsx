import { useLenis } from "lenis/react";

export const Nav = () => {
  const lenis = useLenis();

  const handleScroll = (e: any, target: any) => {
    e.preventDefault();
    lenis?.scrollTo(target, { offset: -125, duration: 1.2 });
  };

  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="w-full px-8 md:px-20 lg:px-40 py-4 flex justify-end">
        <div className="space-x-8 text-base font-medium flex flex-col -mr-30">
          <a
            href="#hero"
            onClick={(e) => handleScroll(e, "#hero")}
            className="transition-colors hover:text-neutral-500"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => handleScroll(e, "#about")}
            className="transition-colors hover:text-neutral-500"
          >
            About
          </a>
          <a
            href="#skills"
            onClick={(e) => handleScroll(e, "#skills")}
            className="transition-colors hover:text-neutral-500"
          >
            Skills
          </a>
          <a
            href="#projects"
            onClick={(e) => handleScroll(e, "#projects")}
            className="transition-colors hover:text-neutral-500"
          >
            Projects
          </a>
          <a
            href="#projects"
            onClick={(e) => handleScroll(e, "#contacts")}
            className="transition-colors hover:text-neutral-500"
          >
            Contacts
          </a>
        </div>
      </div>
    </nav>
  );
};
