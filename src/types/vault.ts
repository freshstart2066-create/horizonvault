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
  releaseDate: string;
  cushioning: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Sneakers' | 'Techwear' | 'Outerwear' | 'Accessories';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
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
