export type RouteStatus = 'active' | 'warning' | 'inactive' | 'redirect';
export type RouteCategory = 'General' | 'Tienda' | 'Servicios' | 'Marketing' | 'Legal' | 'Usuario' | 'Admin' | 'Sistema';
export type RouteType = 'Static' | 'Dynamic' | 'Protected' | 'Dev' | 'Generada' | 'Redirect' | 'Campaign';

export interface SeoConfig {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  robots?: string; // Simplificado a string para flexibilidad, aunque UI restringe opciones
  ogImage?: string;
  updatedAt?: string;
}

export interface RouteItem {
  path: string;
  name: string;
  type: RouteType;
  category: RouteCategory;
  status: RouteStatus;
  description?: string;
  redirectTarget?: string; // For redirects
  seo?: SeoConfig;
}
