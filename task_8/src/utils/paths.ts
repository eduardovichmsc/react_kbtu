export const PATHS = {
  HOME: {
    name: "Home",
    path: "/",
  },
  ABOUT: {
    name: "About",
    path: "/about",
  },
  PRODUCTS: {
    name: "Products",
    path: "/products",
  },
  PRODUCT_DETAILS: {
    name: "Product Details",
    path: "/products/:id",
  },
  DASHBOARD: {
    name: "Dashboard",
    path: "/dashboard",
  },
  LOGIN: {
    name: "Sign In",
    path: "/login",
  },
  SIGNUP: {
    name: "Sign Up",
    path: "/signup",
  },
  PROFILE: {
    name: "Profile",
    path: "/profile",
  },
} as const;
