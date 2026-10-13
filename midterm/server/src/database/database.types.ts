export interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  category: string;
  specs: string;
  img: string;
  gallery: string[];
  description: string;
  dimensions?: string;
  materials?: string;
  origin?: string;
  features: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPackage {
  id: number;
  name: string;
  price: string;
  desc: string;
  features: string[];
  img: string;
  isPopular?: boolean;
}

export interface ContactRequest {
  id: number;
  type: 'QUOTE' | 'CONSULTATION' | 'ORDER';
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  productId?: number;
  productName?: string;
  packageName?: string;
  status: 'PENDING' | 'CONTACTED' | 'COMPLETED';
  createdAt: string;
}

export interface SocialLink {
  id: number;
  name: string;
  handle: string;
  link: string;
  iconName: string;
}

export interface AppConfig {
  logo: {
    text: string;
  };
  contacts: {
    address: {
      text: string;
      time: string;
    };
    email: {
      text: string;
    };
    socialLinks: SocialLink[];
  };
}

export interface DatabaseSchema {
  products: Product[];
  pricingPackages: PricingPackage[];
  contactRequests: ContactRequest[];
  config: AppConfig;
}
