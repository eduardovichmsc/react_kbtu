import { Route, Routes } from "react-router";
import { ROUTES } from "@/utils/routes";

export const RouterContext = () => {
  return (
    <Routes>
      {ROUTES.map((route, routeIndex) => {
        const Layout = route.layout;
        const { children } = route;
        return (
          <Route key={`route-group-${routeIndex}`} element={<Layout />}>
            {children.map((childRoute) => {
              const Element = childRoute.element;
              return (
                <Route
                  key={childRoute.path}
                  path={childRoute.path}
                  element={<Element />}
                />
              );
            })}
          </Route>
        );
      })}
    </Routes>
  );
};
