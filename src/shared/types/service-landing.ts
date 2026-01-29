export type ServiceLandingTheme = 'light' | 'dark' | 'system';

export interface ServiceLandingSection {
  id: string;
  type: 'hero' | 'features' | 'gallery' | 'cta' | 'testimonials' | 'faq' | 'focus' | 'process';
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  // Flexible props for different section types without over-engineering
  items?: Array<{
    title: string;
    description: string;
    icon?: string;
    image?: string;
    images?: string[]; // Support for multiple images (e.g. Success Stories grid)
    content?: string; // Long description for success stories
    location?: string; // e.g. "Cliente corporativo en Lima"
  }>;
}

export interface ServiceLandingConfig {
  id: string;
  slug: string; // URL path: /servicios-especiales/impresion-resina
  name: string; // Internal name
  isActive: boolean;
  themeMode: ServiceLandingTheme;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  
  // SEO & Indexing
  robots?: string; // e.g. 'noindex, nofollow'
  
  // Classification
  category?: 'vertical' | 'special'; // 'vertical' = Core Business, 'special' = Independent/Satellite

  // Visual Identity
  primaryColor?: string; // Optional override
  heroImage?: string;
  heroImageComparison?: string; // Optional second image for before/after slider
  featuredTag?: string; // Tag to filter products
  
  // Content Sections (Modular approach)
  sections: ServiceLandingSection[];
  
  createdAt: string;
  updatedAt: string;
  
  // Soft Delete
  isDeleted?: boolean;
  deletedAt?: string; // Using string to match other date fields in this type
}

// Initial state for new landings
export const DEFAULT_SERVICE_LANDING: ServiceLandingConfig = {
  id: '',
  slug: '',
  name: 'Nueva Landing',
  isActive: false,
  themeMode: 'system',
  metaTitle: '',
  metaDescription: '',
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      title: 'Título Principal del Servicio',
      subtitle: 'Descripción corta e impactante del servicio.',
      content: 'Llamada a la acción principal',
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
