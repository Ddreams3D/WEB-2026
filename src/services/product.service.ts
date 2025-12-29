import { StoreProduct, Category } from '@/shared/types/domain';
import { products } from '@/data/products.data';
import { categories } from '@/data/categories.data';

// Simple in-memory cache
let productsCache: { data: StoreProduct[], timestamp: number } | null = null;
let categoriesCache: { data: Category[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const ProductService = {
  // Get all products
  async getAllProducts(): Promise<StoreProduct[]> {
    // Check cache
    if (productsCache && (Date.now() - productsCache.timestamp < CACHE_DURATION)) {
      return productsCache.data;
    }

    // In a real app, this might fetch from an API/DB
    // For now, we return the static data
    
    // Sort by createdAt (newest first) or any other criteria
    const sortedProducts = [...products].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Update cache
    productsCache = {
      data: sortedProducts,
      timestamp: Date.now()
    };
    
    return sortedProducts;
  },

  // Get product by ID or Slug
  async getProductById(idOrSlug: string): Promise<StoreProduct | undefined> {
    const allProducts = await this.getAllProducts();
    return allProducts.find((p: StoreProduct) => p.id === idOrSlug || p.slug === idOrSlug);
  },

  // Get products by category
  async getProductsByCategory(categoryId: string): Promise<StoreProduct[]> {
    const allProducts = await this.getAllProducts();
    return allProducts.filter((p: StoreProduct) => p.categoryId === categoryId);
  },

  // Get featured products
  async getFeaturedProducts(): Promise<StoreProduct[]> {
    const allProducts = await this.getAllProducts();
    return allProducts.filter((p: StoreProduct) => p.isFeatured);
  },

  // Get all categories
  async getCategories(): Promise<Category[]> {
    // Check cache
    if (categoriesCache && (Date.now() - categoriesCache.timestamp < CACHE_DURATION)) {
      return categoriesCache.data;
    }

    // Sort by sortOrder
    const sortedCategories = [...categories].sort((a, b) => 
      (a.sortOrder || 0) - (b.sortOrder || 0)
    );

    // Update cache
    categoriesCache = {
      data: sortedCategories,
      timestamp: Date.now()
    };
    
    return sortedCategories;
  },

  // Delete product (Mock)
  async deleteProduct(id: string): Promise<boolean> {
    // Update cache if exists to simulate deletion
    if (productsCache) {
      productsCache.data = productsCache.data.filter(p => p.id !== id);
      return true;
    }
    return true; // Return true to simulate success even if cache wasn't initialized
  },

  // Create product (Mock)
  async createProduct(product: Partial<StoreProduct>): Promise<StoreProduct> {
    // Ensure cache is populated
    if (!productsCache) {
      await this.getAllProducts();
    }

    const newProduct: StoreProduct = {
      // Default values for required fields
      slug: `product-${Date.now()}`,
      name: 'New Product',
      description: '',
      price: 0,
      currency: 'PEN',
      categoryId: 'general',
      tags: [],
      images: [],
      isActive: true,
      isFeatured: false,
      rating: 0,
      reviewCount: 0,
      // Override with provided values
      ...product,
      // Force these if not provided or to ensure validity
      id: product.id || `prod-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    } as StoreProduct;

    if (productsCache) {
      productsCache.data.push(newProduct);
    }
    
    return newProduct;
  },

  // Update product (Mock)
  async updateProduct(id: string, updates: Partial<StoreProduct>): Promise<StoreProduct | null> {
    if (!productsCache) {
      await this.getAllProducts();
    }
    
    if (productsCache) {
      const index = productsCache.data.findIndex(p => p.id === id);
      if (index !== -1) {
        const updatedProduct = {
          ...productsCache.data[index],
          ...updates,
          updatedAt: new Date()
        };
        productsCache.data[index] = updatedProduct;
        return updatedProduct;
      }
    }
    return null;
  }
};
