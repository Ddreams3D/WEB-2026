import { Service } from '@/shared/types/domain';
import { Product } from '@/shared/types';

/**
 * Adapta un Servicio (del dominio) a la interfaz de Producto (compartida)
 * para permitir su visualización en componentes genéricos como grids y listas.
 */
export function adaptServiceToProduct(service: Service): Product {
  // Construimos un objeto que cumple estrictamente con la interfaz Product
  // usamos casting porque kind='service' no es compatible con Product (kind='product')
  const product = {
    // Base properties
    id: service.id,
    kind: 'service' as const,
    slug: service.slug,
    name: service.name,
    description: service.description,
    shortDescription: service.shortDescription,
    
    // Price & Currency
    price: service.price || 0,
    currency: service.currency,
    customPriceDisplay: service.customPriceDisplay,
    
    // Categorization
    categoryId: service.categoryId,
    categoryName: service.categoryName,
    category: {
      id: service.categoryId,
      name: service.categoryName,
      slug: service.categoryId, // Fallback slug
      isActive: true,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    tags: service.tags || [],
    seoKeywords: service.seoKeywords,
    
    // Media
    images: service.images,
    
    // Status & Metrics
    isActive: service.isActive,
    isFeatured: service.isFeatured,
    rating: service.rating || 0,
    reviewCount: service.reviewCount || 0,
    displayOrder: service.displayOrder,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
    
    // Service Specifics mapped to Product fields
    tabs: service.tabs,
    tabsTitle: service.tabsTitle,
    specifications: service.specifications || [],
    
    // Defaults for mandatory Product fields that Services don't naturally have
    stock: 999, // Infinite stock for services
    minQuantity: 1,
    maxQuantity: 100,
    options: [],
    
    // Optional fields initialized as undefined
    originalPrice: undefined,
    discount: undefined,
    sellerId: undefined,
    sellerName: undefined,
    downloadCount: undefined,
    weight: undefined,
    dimensions: undefined,
    materials: undefined,
    printTime: undefined,
    complexity: undefined,
    format: undefined,
    fileSize: undefined,
    license: undefined
  } as unknown as Product;
  
  return product;
}
