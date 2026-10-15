import { Outlet } from "react-router";
import { cn } from "../utils/cn";
import { Nav } from "../components/layout/nav";
import { SmoothScroll } from "../components/layout/lenis";

export const MainLayout = () => {
  return (
    <SmoothScroll>
      <main
        className={cn(
          "min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-black selection:text-white",
        )}
      >
        <Nav />

        <Outlet />
      </main>
    </SmoothScroll>
  );
};
