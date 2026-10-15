import { ProjectItem } from "./item";

const STACKS = {
  VANILLA: "VanillaJS",
  ANGULAR: "Angular",
  REACT: "React",
  NEXTJS: "Nextjs",
  TAILWIND: "Tailwind",
} as const;

const PROJECTS = [
  {
    title: "Simuero",
    img: "{1B25AF51-2706-4299-ACEF-6F0C90727353}.png",
    body: "E-commerce project made for Web-Development classes final",
    stack: [STACKS.ANGULAR],
  },
  {
    title: "AURA",
    img: "{231B42D5-E2FA-4C8E-8C36-0242A61875E7}.png",
    body: "E-commerce of HoReCa furnitures, made for my friend",
    stack: [STACKS.NEXTJS, STACKS.TAILWIND],
  },
  {
    title: "Piano",
    img: "{E47D2DEB-5F62-4B29-8ABF-FAF26F510688}.png",
    body: "Just to play Piano with keyboard (no midi is supported)",
    stack: [STACKS.VANILLA],
  },
  {
    title: "Ghetto Records",
    img: "{CB45B9A0-9A30-4DB3-BFB8-0C3E6DCE742E}.png",
    body: "Portfolio website for Ghetto Records label",
    stack: [STACKS.NEXTJS, STACKS.TAILWIND],
  },
];

export const HomeProjects = () => {
  return (
    <section id="projects" className="scroll-mt-32">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl font-bold tracking-tight min-w-[200px]"></h2>
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
        {PROJECTS.map((project, i) => (
          <ProjectItem project={project} index={i} />
        ))}
        and much more of such unfinished or undeployed projects that are lost
      </div>
    </section>
  );
};
