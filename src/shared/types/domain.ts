// Definiciones de dominio para desacoplar tipos
import { Category, ProductImage, ProductSpecification, ProductOption, ProductTab, ProductDimensions } from './index';

export type { Category };
export type { ProductImage, ProductSpecification, ProductOption, ProductTab, ProductDimensions };

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
  
  // Media
  images: ProductImage[];
  
  // Quote / Business Logic
  price: number; // Added for compatibility
  customPriceDisplay: string; // "Cotización según diseño"
  currency: string;
  
  // Detail Content
  tabsTitle?: string;
  tabs?: ProductTab[];
  specifications?: ProductSpecification[];
  
  // Meta
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// 2. STORE PRODUCTS (Marketplace)
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
  sku?: string;
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
  
  // Product Details
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
}

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
}
