import { Route, Routes } from "react-router";
import { ROUTES } from "../utils/routes";

export const RouterContext = () => {
  return (
    <Routes>
      {ROUTES.map((route) => {
        const LAYOUT = route.layout;
        const { children } = route;
        return (
          <>
            <Route element={<LAYOUT />}>
              {children.map((e) => {
                const Element = e.element;
                return (
                  <Route key={e.path} path={e.path} element={<Element />} />
                );
              })}
            </Route>
          </>
        );
      })}
    </Routes>
  );
};
