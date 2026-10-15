import { MainLayout } from "@/layouts/main-layout";
import { HomePage } from "@/pages/home";
import { PATHS } from "./paths";

export const ROUTES = [
  {
    layout: MainLayout,
    children: [
      {
        path: PATHS.HOME.path,
        element: HomePage,
      },
    ],
  },
];
