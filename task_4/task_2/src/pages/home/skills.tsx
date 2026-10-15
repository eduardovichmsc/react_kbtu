const SKILLS = [
  "VanillaJS",
  "ReactJS (React Router) / NextJS",
  "NestJS",
  "Angular",
];

export const HomeSkills = () => {
  return (
    <section id="skills" className="scroll-mt-32">
      <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-24">
        <h2 className="text-3xl font-bold tracking-tight min-w-[200px] w-2/5">
          Technologies & stacks i do know or have experience on
        </h2>
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill, i) => (
            <div
              key={i}
              className="px-5 py-2.5 h-fit rounded-none border border-slate-200 bg-white text-slate-700 font-medium hover:border-slate-300 cursor-pointer"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
