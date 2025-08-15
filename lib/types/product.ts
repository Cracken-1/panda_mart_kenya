export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  brand: string;
  sku: string;
  inStock: boolean;
  stockCount: number;
  lowStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  tags: string[];
  specifications: Record<string, string>;
  storeAvailability: StoreAvailability[];
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  relatedProducts?: string[];
  warranty?: string;
  returnPolicy?: string;
  shippingInfo?: ShippingInfo;
}

export interface StoreAvailability {
  storeId: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  distance: number;
  inStock: boolean;
  stockCount: number;
  price: number;
  lastUpdated: string;
  estimatedRestockDate?: string;
  canReserve: boolean;
  reservationHours: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount: number;
  sku?: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export interface ShippingInfo {
  freeShipping: boolean;
  freeShippingThreshold?: number;
  estimatedDelivery: string;
  shippingCost: number;
  expressAvailable: boolean;
  expressCost?: number;
  expressDelivery?: string;
}

export interface ProductFilter {
  priceRange: [number, number];
  brands: string[];
  rating: number;
  availability: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
  discount: boolean;
  newArrivals: boolean;
  featured: boolean;
  freeShipping: boolean;
  categories: string[];
  tags: string[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  subcategories: SubCategory[];
  featuredBrands: string[];
  popularTags: string[];
}

export interface SubCategory {
  id: string;
  name: string;
  productCount: number;
}

export type SortOption = 
  | 'featured'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'newest'
  | 'popularity'
  | 'discount';

export type ViewMode = 'grid' | 'list';

export interface ProductSearchParams {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}