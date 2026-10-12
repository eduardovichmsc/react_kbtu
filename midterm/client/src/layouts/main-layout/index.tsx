import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import { FavoritesDrawer } from "@/shared/components/favorites-drawer";
import { Outlet } from "react-router";
import { ReactLenis } from "lenis/react";

export const MainLayout = () => {
  return (
    <ReactLenis root>
      <div className="bg-[#0e0d0c] text-[#e3e1dc] antialiased overflow-x-hidden min-h-screen flex flex-col">
        <Header />
        <main className="border-b-2 border-white/10 bg-[rgb(14,13,12)] flex-1">
          <Outlet />
        </main>
        <Footer />
        <FavoritesDrawer />
      </div>
    </ReactLenis>
  );
};
