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

export interface FormValues {
  name: string;
  category: string;
  priceValue: string;
  specs: string;
  img: string;
  description: string;
  materials: string;
  dimensions: string;
  origin: string;
  inStock: boolean;
}
