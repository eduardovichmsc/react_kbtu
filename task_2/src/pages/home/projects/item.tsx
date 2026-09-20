const IMGFOLDER = "projects/";

type ProjectItem = {
  title: string;
  img: string;
  body: string;
  stack: string[];
};

export const ProjectItem = ({
  project,
  index,
}: {
  project: ProjectItem;
  index: number;
}) => {
  return (
    <div key={index} className="group flex flex-col cursor-pointer">
      {/* Image Container */}
      <div className="w-full aspect-[16/9] bg-slate-100 overflow-hidden relative mb-6">
        <span className="absolute z-0 inset-0 flex items-center justify-center text-slate-400 font-medium group-hover:scale-105 transition-transform duration-700">
          [Обложка {index}]
        </span>
        <img
          src={IMGFOLDER + project.img}
          alt=""
          className="object-cover absolute z-10 inset-0"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold group-hover:text-slate-600 transition-colors">
            {project.title}
          </h3>
          <svg
            className="w-6 h-6 transform -rotate-45 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>

        <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
          {project.body}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.stack.length == 1 ? (
            <span className="text-xs font-semibold px-3 py-1 border border-slate-300 text-slate-600">
              {project.stack[0]}
            </span>
          ) : (
            project.stack.map((stack, i) =>
              i === 0 ? (
                <span className="text-xs font-semibold px-3 py-1 bg-black text-white">
                  {stack}
                </span>
              ) : (
                <span className="text-xs font-semibold px-3 py-1 border border-slate-300 text-slate-600">
                  {stack}
                </span>
              ),
            )
          )}
        </div>
      </div>
    </div>
  );
};
