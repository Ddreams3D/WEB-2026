// Tipos compartidos de la aplicación

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  status: 'active' | 'completed' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  features: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
}

export interface AnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Tipos de respuesta de API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos de configuración
export interface AppConfig {
  apiUrl: string;
  googleAnalyticsId?: string;
}

// ===== MARKETPLACE TYPES =====

// Categorías de productos
export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  imageUrl?: string;
  productCount?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Productos del marketplace
export interface Product {
  id: string;
  slug?: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  customPriceDisplay?: string;
  discount?: number;
  currency: string;
  sku?: string;
  categoryId: string;
  category?: Category;
  categoryName?: string;
  sellerId?: string;
  sellerName?: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
  options?: ProductOption[];
  tags: string[];
  seoKeywords?: string[];
  stock?: number;
  minQuantity?: number;
  maxQuantity?: number;
  weight?: number;
  dimensions?: ProductDimensions;
  materials?: string[];
  printTime?: number; // en horas
  complexity?: 'low' | 'medium' | 'high';
  format?: string;
  fileSize?: string;
  license?: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  downloadCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isPrimary: boolean;
  sortOrder?: number;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductOptionValue {
  id: string;
  name: string;
  priceModifier: number;
  hasInput?: boolean;
  maxLength?: number;
  inputPlaceholder?: string;
  isDefault?: boolean;
}

export interface ProductOption {
  id: string;
  name: string;
  type: 'select' | 'radio' | 'checkbox';
  values: ProductOptionValue[];
  required?: boolean;
}

export interface ProductSpecification {
  id?: string;
  name: string;
  value: string;
  unit?: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'mm' | 'cm' | 'm';
}

// Carrito de compras
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  customizations?: CartItemCustomization[];
  notes?: string;
  addedAt: Date;
}

export interface CartItemCustomization {
  type: 'color' | 'material' | 'size' | 'finish' | 'other';
  name: string;
  value: string;
  additionalCost?: number;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// Órdenes y pedidos
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod?: string;
  trackingNumber?: string;
  notes?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations?: CartItemCustomization[];
  status: OrderItemStatus;
  notes?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'printing'
  | 'post_processing'
  | 'quality_check'
  | 'packaging'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type OrderItemStatus = 
  | 'pending'
  | 'printing'
  | 'completed'
  | 'cancelled';

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

// Filtros y búsqueda
export interface ProductFilters {
  categoryId?: string;
  categoryIds?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  complexity?: ('low' | 'medium' | 'high')[];
  inStock?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  rating?: number;
  tags?: string[];
  sortBy?: ProductSortOption;
  sortOrder?: 'asc' | 'desc';
}

export type ProductSortOption = 
  | 'name'
  | 'price'
  | 'rating'
  | 'popularity'
  | 'newest'
  | 'oldest'
  | 'createdAt'
  | 'downloadCount';

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  rating?: number;
  category?: string;
}

// Reviews y calificaciones
export interface Review {
  id: string;
  productId: string;
  userId: string;
  user?: User;
  userName?: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Wishlist
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  addedAt: Date;
}

// Notificaciones
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'payment_received'
  | 'product_back_in_stock'
  | 'price_drop'
  | 'new_review'
  | 'system';