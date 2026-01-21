export const STORAGE_PATHS = {
  // Roots
  IMAGES: 'images',
  PRODUCTS: 'images/catalogo', 
  LANDINGS: 'images/landings',
  SERVICES: 'images/services',
  PROJECTS: 'images/projects',
  SEASONAL: 'images/seasonal',
  CATEGORIES: 'images/categories',
  UI: 'images/ui',
  BLOG: 'images/blog',
  HOME: 'images/home',
  COMPANY: 'images/company',
  
  // System
  FINANCES: 'finances',
  ORDERS: 'orders',
  ASSETS: 'assets',
} as const;

export const StoragePathBuilder = {
    /**
     * Returns path for product images: images/catalogo/{category}/{slug}/
     */
    products: (category: string = 'general', slug: string) => 
        `${STORAGE_PATHS.PRODUCTS}/${category}/${slug}`,

    /**
     * Returns path for landing images: images/landings/{slug}/{section}/
     */
    landings: (slug: string, section: 'hero' | 'gallery' | 'content' | 'general' | 'bubbles' = 'general') => 
        `${STORAGE_PATHS.LANDINGS}/${slug}/${section}`,

    /**
     * Returns path for service images: images/services/{slug}/{section}/
     */
    services: (slug: string, section: 'hero' | 'gallery' | 'content' | 'general' = 'general') => 
        section === 'general'
            ? `${STORAGE_PATHS.SERVICES}/${slug}`
            : `${STORAGE_PATHS.SERVICES}/${slug}/${section}`,
        
    /**
     * Returns path for project images: images/projects/{slug}/{section}/
     */
    projects: (slug: string, section: 'cover' | 'gallery' | 'general' = 'general') => 
        section === 'general'
            ? `${STORAGE_PATHS.PROJECTS}/${slug}`
            : `${STORAGE_PATHS.PROJECTS}/${slug}/${section}`,

    /**
     * Returns path for seasonal theme images: images/seasonal/{themeId}/{section}/
     */
    seasonal: (themeId: string, section: 'hero' | 'gallery' | 'content' | 'general' = 'general') => 
        section === 'general'
            ? `${STORAGE_PATHS.SEASONAL}/${themeId}`
            : `${STORAGE_PATHS.SEASONAL}/${themeId}/${section}`,

    /**
     * Returns path for category images: images/categories/{slug}/
     */
    categories: (slug: string) => 
        `${STORAGE_PATHS.CATEGORIES}/${slug}`,

    /**
     * Returns path for home images: images/home/{section}/
     */
    home: (section: 'hero' | 'bubbles' | 'general' | 'banners' = 'general') => 
        section === 'general'
            ? STORAGE_PATHS.HOME
            : `${STORAGE_PATHS.HOME}/${section}`,

    /**
     * Returns path for company images: images/company/{section}/
     */
    company: (section: 'about' | 'legal' | 'general' = 'general') =>
        `${STORAGE_PATHS.COMPANY}/${section}`,

    /**
     * UI Assets
     */
    ui: {
        placeholders: () => `${STORAGE_PATHS.UI}/placeholders`,
        brand: () => `${STORAGE_PATHS.UI}/brand`,
        icons: () => `${STORAGE_PATHS.UI}/icons`,
        banners: () => `${STORAGE_PATHS.UI}/banners`,
    }
};
