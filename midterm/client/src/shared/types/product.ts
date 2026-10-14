export interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
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
