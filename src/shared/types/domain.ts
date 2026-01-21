// Definiciones de dominio para desacoplar tipos
import { Category, ProductImage, ProductSpecification, ProductOption, ProductDimensions } from './index';

export type { Category };
export type { ProductImage, ProductSpecification, ProductOption, ProductDimensions };

export interface ProductTab {
  id: string;
  label: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaAction: string;
  whatsappMessage?: string;
}

// ==========================================
// 1. SERVICES (Servicios)
// ==========================================
// Servicios que se cotizan, no se compran directamente
export interface Service {
  id: string;
  kind: 'service'; // Discriminator
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  
  /**
   * @deprecated Use `kind === 'service'` instead.
   * This field is kept for backward compatibility but will be removed in future versions.
   */
  isService: true; // Discriminator (Legacy)
  displayOrder: number;
  
  // Categorization
  categoryId: string;
  categoryName: string;
  tags: string[];
  seoKeywords?: string[];
  
  // Status Flow
  status?: 'draft' | 'published' | 'archived';
  
  // Media
  images: ProductImage[];
  
  // Quote / Business Logic
  price: number; // Added for compatibility
  customPriceDisplay: string; // "Cotización según diseño"
  currency: string;
  
  // Detail Content
  landingPrices?: Record<string, number>;
  tabsTitle?: string;
  tabs?: ProductTab[];
  specifications?: ProductSpecification[];
  
  // SEO Metadata
  metaTitle?: string;
  metaDescription?: string;

  // Meta
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;

  // Soft Delete
  isDeleted?: boolean;
  deletedAt?: Date;
}

// ==========================================
// 2. STORE PRODUCTS (Catalog)
// ==========================================
// Productos físicos o digitales que se pueden comprar
export interface StoreProduct {
  id: string;
  kind: 'product'; // Discriminator
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  
  // Commerce
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  stock?: number;
  minQuantity?: number;
  maxQuantity?: number;
  
  // Categorization
  categoryId: string;
  category?: Category;
  categoryName?: string;
  tags: string[];
  seoKeywords?: string[];
  customPriceDisplay?: string;
  
  // Media
  images: ProductImage[];
  
  // SEO Metadata
  metaTitle?: string;
  metaDescription?: string;

  // Detail Content
  landingPrices?: Record<string, number>;
  tabsTitle?: string;
  tabs?: ProductTab[];
  specifications?: ProductSpecification[];
  options?: ProductOption[];
  dimensions?: ProductDimensions;
  materials?: string[];
  weight?: number;
  printTime?: number;
  complexity?: 'low' | 'medium' | 'high';
  format?: string;
  fileSize?: string;
  license?: string;
  
  // Seller
  sellerId?: string;
  sellerName?: string;
  
  // Meta
  isActive: boolean;
  isFeatured: boolean;
  displayOrder?: number;
  rating: number;
  reviewCount: number;
  downloadCount?: number;
  createdAt: Date;
  updatedAt: Date;

  // Soft Delete
  isDeleted?: boolean;
  deletedAt?: Date;
}

// Alias for backward compatibility
export type Product = StoreProduct;

// ==========================================
// 3. PORTFOLIO / GALLERY (Proyectos)
// ==========================================
// Exhibición de trabajos realizados
export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  
  // Client / Context
  clientName?: string;
  client?: string; // Legacy/Data compatibility
  projectDate: Date;
  category: string; // "Cosplay", "Ingeniería", etc.
  
  // Media
  coverImage: string; // Main display image
  galleryImages?: string[]; // Additional views
  galleryAlt?: string[]; // Alt text for gallery images
  
  // Link to related service (optional)
  relatedServiceId?: string;
  
  // Additional Info
  applications?: string;
  ctaText?: string;
  
  tags: string[];
  isFeatured: boolean;
  createdAt: Date;
  
  // Soft Delete
  isDeleted?: boolean;
  deletedAt?: Date;
}

// ==========================================
// 4. USERS (Usuarios)
// ==========================================
export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive' | 'banned';

export interface User {
  id: string; // Firebase Auth UID matches this
  email: string;
  username: string; // Display Name
  photoURL?: string;

  role: UserRole;
  status: UserStatus;

  // E-commerce Stats (Soles)
  totalOrders: number;
  totalSpent: number; // In Soles (PEN)
  lastOrderDate?: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;

  // Contact Info
  phoneNumber?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  
  // Settings
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };

  // Soft Delete
  isDeleted?: boolean;
  deletedAt?: Date;
}

// ==========================================
// 5. ORDER SYSTEM
// ==========================================

export type OrderStatus = 
  | 'quote_requested' // Solicitud de cotización (Servicios)
  | 'pending_payment' // Creado, esperando pago
  | 'paid'            // Pago confirmado
  | 'processing'      // En producción / diseño
  | 'ready'           // Listo para envío/retiro
  | 'shipped'         // Enviado
  | 'completed'       // Entregado y finalizado
  | 'cancelled'       // Cancelado
  | 'refunded';       // Reembolsado

export type PaymentMethod = 'yape' | 'plin' | 'transfer' | 'cash_on_delivery' | 'card';

export interface OrderItem {
  id: string; // Unique ID within the order (or referencing a cart item)
  productId?: string; // If product
  serviceId?: string; // If service
  type: 'product' | 'service';
  name: string;
  quantity: number;
  price: number; // Unit price at the time of purchase
  total: number; // quantity * price
  image?: string;
  customizations?: Record<string, any>; // JSON with customization details
}

export interface OrderHistoryEntry {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: string; // User ID or 'system'
}

export interface Order {
  id: string;
  userId: string; // User who placed the order (can be guest ID if we support guest checkout, but better to require auth or store guest info)
  userEmail: string; // Snapshot of email
  userName: string; // Snapshot of name
  
  items: OrderItem[];
  
  // Financials
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: 'PEN';

  // Status
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: PaymentMethod;
  paymentProofUrl?: string;

  // Shipping
  shippingMethod: 'pickup' | 'delivery';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    reference?: string;
  };

  // Tracking
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;

  // Metadata
  history: OrderHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
  
  // Contact
  customerPhone?: string;
  notes?: string; // User notes

  // Admin Notes
  adminNotes?: string;

  // Soft Delete
  isDeleted?: boolean;
  deletedAt?: Date;
}

// ==========================================
// 6. NOTIFICATIONS (Notificaciones)
// ==========================================
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'order' | 'system' | 'inbox';

export interface AppNotification {
  id: string;
  userId?: string | null; // If null/undefined, it is a system-wide notification for admins
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: Date;
  actionRequired?: boolean; // If true, opens a modal or specific UI
  metadata?: Record<string, any>; // For inbox items (inboxId, etc.)

  // Soft Delete
  isDeleted?: boolean;
  deletedAt?: Date;
}
