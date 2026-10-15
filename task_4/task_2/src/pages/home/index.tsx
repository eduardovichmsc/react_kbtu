import { HomeAbout } from "./about";
import { HomeHero } from "./hero";
import { HomeProjects } from "./projects";
import { HomeSkills } from "./skills";
import { HomeContacts } from "./contacts";

export const HomePage = () => {
  return (
    <div className="">
      <main className="w-full px-8 md:px-20 lg:px-40 pt-32 pb-20 flex flex-col gap-32">
        {/* Hero Section */}
        <HomeHero />

        {/* About Section */}
        <HomeAbout />

        {/* Skills Section */}
        <HomeSkills />

        {/* Projects Section */}
        <HomeProjects />

        {/* Contacts Section */}
        <HomeContacts />
      </main>
    </div>
  );
};
