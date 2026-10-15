export const HomeContacts = () => {
  return (
    <section id="contacts" className="scroll-mt-32">
      <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-24">
        <h2 className="text-3xl font-bold tracking-tight min-w-[200px] w-2/5">
          Contacts
        </h2>
        <div className="flex flex-col gap-6 w-full">
          <p className="text-slate-600 leading-relaxed text-lg max-w-2xl">
            I'm currently open to internships or junior positions.
          </p>
          <div className="flex flex-col gap-4">
            <a
              href="mailto:zxc@ingrave.com"
              className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors w-fit underline underline-offset-4"
            >
              Email
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors w-fit underline underline-offset-4"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors w-fit underline underline-offset-4"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
