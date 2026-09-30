export interface Colorway {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
  angleImages: string[];
}

export interface ProductSpecs {
  weight: string;
  materials: string;
  provenance: string;
  cushioning: string;
}

export interface Product {
  id: string;
  name: string;
  styleCode: string;
  brand: string;
  category: 'Footwear' | 'Outerwear' | 'Tailoring' | 'Accessories';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  details: string[];
  colorways: Colorway[];
  sizes: number[];
  inStock: boolean;
  badge?: string;
  specs: ProductSpecs;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColorway: Colorway;
  selectedSize: number;
  quantity: number;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';
