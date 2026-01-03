import 'server-only';
import { unstable_cache } from 'next/cache';
import { ProductService } from '@/services/product.service';
import { ServiceService } from '@/services/service.service';
import { ProjectService } from '@/services/project.service';
import { StoreProduct, Service, PortfolioItem, Category } from '@/shared/types/domain';

// Cache configuration
const CACHE_TAGS = {
  PRODUCTS: 'products',
  SERVICES: 'services',
  PROJECTS: 'projects',
  CATEGORIES: 'categories'
};

const REVALIDATE_TIME = 3600; // 1 hour

// --- Products ---

export const getCachedProducts = unstable_cache(
  async (includeDeleted = false) => {
    return await ProductService.getAllProducts(includeDeleted);
  },
  ['products-all'],
  { 
    tags: [CACHE_TAGS.PRODUCTS], 
    revalidate: REVALIDATE_TIME 
  }
);

export const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    return await ProductService.getProductById(slug);
  },
  ['product-by-slug'], // We append slug dynamically? No, unstable_cache keyparts.
  { 
    tags: [CACHE_TAGS.PRODUCTS], 
    revalidate: REVALIDATE_TIME 
  }
);

// Wrapper for dynamic slug since unstable_cache needs unique key parts
export const getProductBySlug = async (slug: string) => {
  const fn = unstable_cache(
    async () => ProductService.getProductById(slug),
    [`product-by-slug-${slug}`],
    { tags: [CACHE_TAGS.PRODUCTS], revalidate: REVALIDATE_TIME }
  );
  return fn();
};


// --- Categories ---

export const getCachedCategories = unstable_cache(
  async () => {
    return await ProductService.getCategories();
  },
  ['categories-all'],
  { 
    tags: [CACHE_TAGS.CATEGORIES], 
    revalidate: REVALIDATE_TIME 
  }
);

// --- Services ---

export const getCachedServices = unstable_cache(
  async (includeDeleted = false) => {
    return await ServiceService.getAllServices(includeDeleted);
  },
  ['services-all'],
  { 
    tags: [CACHE_TAGS.SERVICES], 
    revalidate: REVALIDATE_TIME 
  }
);

// --- Projects ---

export const getCachedFeaturedProjects = unstable_cache(
  async (limit: number) => {
    return await ProjectService.getFeaturedProjects(limit);
  },
  ['projects-featured'],
  { 
    tags: [CACHE_TAGS.PROJECTS], 
    revalidate: REVALIDATE_TIME 
  }
);

export const getCachedAllProjects = unstable_cache(
  async () => {
    return await ProjectService.getAllProjects();
  },
  ['projects-all'],
  { 
    tags: [CACHE_TAGS.PROJECTS], 
    revalidate: REVALIDATE_TIME 
  }
);
