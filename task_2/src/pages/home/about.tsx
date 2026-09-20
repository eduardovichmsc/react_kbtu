export const HomeAbout = () => {
  return (
    <section id="about" className="scroll-mt-32">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        <h2 className="text-3xl font-bold tracking-tight min-w-[200px] block w-2/5">
          About me
        </h2>
        <div className="flex flex-col gap-10">
          <div>
            <h3 className="text-xl font-semibold mb-3">
              Life before University
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg max-w-2xl">
              I was born in a small village 300 km from Atyrau, near Astrakhan
              (100 km). Living the life of a based-normie.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Hobby</h3>
            <p className="text-slate-600 leading-relaxed text-lg max-w-2xl">
              At the start of 9th grade, I joined a table tennis club but quit a
              half year later when the coronavirus hit - though I did manage to
              win one tournament during that time. During the coronavirus
              pandemic, I started spending more time at my PC and got into music
              production; by now, I have around 20 releases with a total of 5
              million streams on Spotify.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Education Timeline</h3>
            <p className="text-slate-600 leading-relaxed text-lg max-w-2xl">
              APEC PetroTechnic, undergraduate education
              <br /> 2020 - 2024, Information Systems.
              <br />
              Here I gained basics of development things.
            </p>
            <br />
            <p className="text-slate-600 leading-relaxed text-lg max-w-2xl">
              Kazakh British Technical University, bachelor's degree
              <br /> 2024 - 2027, Information Systems
              <br />
              Learning & studying, trying to find real job, at least internship
              which is related to my speciality (it's been 3 years of trying it
              now).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
