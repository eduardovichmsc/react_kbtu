import { MainLayout } from "@/layouts/main-layout";
import { HomePage } from "@/pages/home";
import { CatalogPage } from "@/pages/catalog";
import { ProductPage } from "@/pages/product";
import { PATHS } from "@/shared/config/paths";

export const ROUTES = [
  {
    layout: MainLayout,
    children: [
      {
        path: PATHS.home,
        element: HomePage,
      },
      {
        path: PATHS.catalog,
        element: CatalogPage,
      },
      {
        path: PATHS.product.pattern,
        element: ProductPage,
      },
    ],
  },
];
