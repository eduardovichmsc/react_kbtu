import type { NavLinkItem } from "../types";

export const PATHS = {
  home: "/",
  catalog: "/catalog",
  addProduct: "/add-product",
  shop: "/#shop",

  anchors: {
    hero: "hero",
    shop: "shop",
    priceList: "price_list",
    about: "about",
    lookbook: "lookbook",
    contacts: "contacts",
  },

  product: {
    root: "/catalog",
    pattern: "/catalog/:id",
    slug: (id: string | number) => `/catalog/${id}`,
  },

  cart: "/cart",
  checkout: "/checkout",

  legal: {
    privacy: "/privacy-policy",
    terms: "/terms-of-service",
  },

  socials: {
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    telegram: "https://t.me",
  },
} as const;

export const navLinks: NavLinkItem[] = [
  { name: "Главная", href: PATHS.home, isExternalRoute: true },
  { name: "Каталог", href: PATHS.catalog, isExternalRoute: true },
  { name: "Добавить", href: PATHS.addProduct, isExternalRoute: true },
  { name: "Коллекция", href: `${PATHS.home}#${PATHS.anchors.shop}` },
  { name: "Концепция", href: `${PATHS.home}#${PATHS.anchors.about}` },
  // { name: "Прайс лист", href: `${PATHS.home}#${PATHS.anchors.priceList}` },
  { name: "Контакты", href: `${PATHS.home}#${PATHS.anchors.contacts}` },
];

export const socialLinks = [
  { name: "Instagram", href: PATHS.socials.instagram },
  { name: "Pinterest", href: PATHS.socials.pinterest },
  { name: "Telegram", href: PATHS.socials.telegram },
];
