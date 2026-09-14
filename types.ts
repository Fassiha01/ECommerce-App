export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize?: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  date: string;
  paymentMethod: 'apple_pay' | 'google_pay' | 'card' | 'cod';
  shippingAddress: ShippingAddress;
  status: 'confirmed' | 'shipped' | 'delivered';
}

export type DeviceOS = 'ios' | 'android' | 'responsive';
export type AppScreen = 'home' | 'categories' | 'wishlist' | 'orders' | 'cart';
