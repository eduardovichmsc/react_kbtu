import HomeContacts from "./components/contacts";
import { HomeHero } from "./components/hero";
import { HomePhilosophy } from "./components/philosophy";
import { HomeShop } from "./components/shop";

export const HomePage = () => {
  return (
    <div className="relative z-10 bg-[#0e0d0c]">
      <HomeHero />
      <HomePhilosophy />
      <HomeShop />
      <HomeContacts />
    </div>
  );
};
