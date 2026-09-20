import { MainLayout } from "../layouts/layout";
import { HomePage } from "../pages/home";
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
