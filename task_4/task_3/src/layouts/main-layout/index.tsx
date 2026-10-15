import { Outlet } from "react-router";
import { cn } from "@/utils/cn";

export const MainLayout = () => {
  return (
    <main className={cn("w-full min-h-dvh bg-slate-50 text-slate-900 font-sans")}>
      <Outlet />
    </main>
  );
};
