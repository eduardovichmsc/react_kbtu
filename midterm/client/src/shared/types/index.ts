import type { LucideIcon } from "lucide-react";

export interface PricingPackage {
  id: number;
  name: string;
  price: string;
  desc: string;
  features: string[];
  img: string;
  isPopular?: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number; // Числовое значение для надежной сортировки
  category: string;
  specs: string;
  img: string;
  gallery?: string[];
  description?: string;
  inStock?: boolean;
  featured?: boolean;
  dimensions?: string;
  materials?: string;
  origin?: string;
  features?: string[];
}

export interface SocialLink {
  id: number;
  name: string;
  handle: string;
  link: string;
  icon: LucideIcon;
}

export interface NavLinkItem {
  name: string;
  href: string;
  isExternalRoute?: boolean;
}
