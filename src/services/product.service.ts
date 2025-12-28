import { db, isFirebaseConfigured } from '@/lib/firebase';
import { mockProducts, mockCategories } from '@/shared/data/mockData';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  Timestamp,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { Product, Category } from '@/shared/types';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';

// Helper to convert Firestore data to Product type
const convertProductData = (doc: DocumentData): Product => {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
    images: data.images?.map((img: any) => ({
      ...img,
      createdAt: img.createdAt instanceof Timestamp ? img.createdAt.toDate() : new Date(img.createdAt || Date.now()),
      updatedAt: img.updatedAt instanceof Timestamp ? img.updatedAt.toDate() : new Date(img.updatedAt || Date.now())
    })) || []
  } as Product;
};

// Helper to convert Firestore data to Category type
const convertCategoryData = (doc: DocumentData): Category => {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
  } as Category;
};

// Simple in-memory cache
let productsCache: { data: Product[], timestamp: number } | null = null;
let categoriesCache: { data: Category[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Circuit breaker state
let _firebaseCircuitOpen = false;

import { unstable_cache } from 'next/cache';

// Helper to get docs with timeout
const getDocsWithTimeout = async (query: any, timeoutMs: number = 1500) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Firebase request timed out')), timeoutMs);
  });
  
  return Promise.race([
    getDocs(query),
    timeoutPromise
  ]) as Promise<any>;
};

// Internal function to fetch all products from Firebase
const fetchAllProductsFromFirebase = async (): Promise<Product[]> => {
    // Circuit breaker check
    if (_firebaseCircuitOpen) {
      console.log('Firebase circuit is open, skipping connection attempt and using mock data');
      return mockProducts;
    }

    // If Firebase is not configured, use mock data immediately
    if (!isFirebaseConfigured) {
      return mockProducts;
    }

    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
      
      // Use timeout wrapper to prevent long loading times if Firebase is unreachable
      const snapshot = await getDocsWithTimeout(q, 1500); // 1.5 second timeout
      
      const products = snapshot.docs.map(convertProductData);
      
      // If Firebase returns no products, fallback to mock data
      if (products.length === 0) {
        console.log('No products in Firebase, using mock data fallback');
        return mockProducts;
      }

      return products;
    } catch (error) {
      console.warn('Error fetching products from Firebase:', error);
      // Open circuit breaker on error to prevent further timeouts
      _firebaseCircuitOpen = true;
      // Reset circuit breaker after 1 minute
      setTimeout(() => { _firebaseCircuitOpen = false; }, 60000);
      
      return mockProducts;
    }
};

// Cached version of fetchAllProducts
const getCachedProducts = unstable_cache(
  async () => fetchAllProductsFromFirebase(),
  ['all-products'],
  { revalidate: 3600, tags: ['products'] } // Cache for 1 hour
);

export const ProductService = {
  // Get all products
  async getAllProducts(forceRefresh = false): Promise<Product[]> {
    // Return cached data if valid (Memory cache for client-side)
    if (!forceRefresh && productsCache && (Date.now() - productsCache.timestamp < CACHE_DURATION)) {
      return productsCache.data;
    }

    let products: Product[];

    // Use Next.js Data Cache on server if available and not forcing refresh
    if (typeof window === 'undefined' && !forceRefresh) {
        products = await getCachedProducts();
    } else {
        products = await fetchAllProductsFromFirebase();
    }

    // Update memory cache
    productsCache = {
      data: products,
      timestamp: Date.now()
    };
    
    return products;
  },

  // Get product by ID or Slug
  async getProductById(idOrSlug: string): Promise<Product | undefined> {
    // Helper to find in mock data
    const findInMock = () => mockProducts.find(p => p.id === idOrSlug || p.slug === idOrSlug);

    // Try cache first
    if (productsCache) {
      const cachedProduct = productsCache.data.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      if (cachedProduct) return cachedProduct;
    }

    if (!isFirebaseConfigured) {
      return findInMock();
    }

    try {
      // Try by ID first
      const docRef = doc(db, PRODUCTS_COLLECTION, idOrSlug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return convertProductData(docSnap);
      }

      // Try by slug
      const q = query(collection(db, PRODUCTS_COLLECTION), where('slug', '==', idOrSlug));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return convertProductData(snapshot.docs[0]);
      }

      // If not found in Firebase, try mock data
      console.log('Product not found in Firebase, checking mock data');
      return findInMock();
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback to mock data on error
      return findInMock();
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const getMockByCategory = () => mockProducts.filter(p => p.categoryId === categoryId);

    // Try cache first
    if (productsCache) {
      const cachedProducts = productsCache.data.filter(p => p.categoryId === categoryId);
      if (cachedProducts.length > 0) return cachedProducts;
    }

    if (!isFirebaseConfigured) {
      return getMockByCategory();
    }

    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION), 
        where('categoryId', '==', categoryId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(convertProductData);
      
      if (products.length === 0) {
        return getMockByCategory();
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return getMockByCategory();
    }
  },

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    const getMockFeatured = () => mockProducts.filter(p => p.isFeatured).slice(0, 10);

    // Try cache first
    if (productsCache) {
        const cachedFeatured = productsCache.data.filter(p => p.isFeatured).slice(0, 10);
        if (cachedFeatured.length > 0) return cachedFeatured;
    }

    if (!isFirebaseConfigured) {
      return getMockFeatured();
    }

    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION), 
        where('isFeatured', '==', true),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(convertProductData);
      
      if (products.length === 0) {
        return getMockFeatured();
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return getMockFeatured();
    }
  },

  // Search products
  async searchProducts(searchTerm: string): Promise<Product[]> {
    // Note: Firestore doesn't support full-text search natively.
    // This is a basic client-side filter implementation for small datasets.
    // For production, consider Algolia or ElasticSearch.
    try {
      const products = await this.getAllProducts();
      const term = searchTerm.toLowerCase();
      
      return products.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term) ||
        product.tags.some(tag => tag.toLowerCase().includes(term))
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  // Get all categories
  async getCategories(forceRefresh = false): Promise<Category[]> {
    // Circuit breaker check
    if (_firebaseCircuitOpen) {
      console.log('Firebase circuit is open, skipping categories fetch and using mock data');
      return mockCategories;
    }

    if (!isFirebaseConfigured) {
      console.log('Firebase not configured, using mock categories');
      return mockCategories;
    }

    // Return cached data if valid
    if (!forceRefresh && categoriesCache && (Date.now() - categoriesCache.timestamp < CACHE_DURATION)) {
        return categoriesCache.data;
    }

    try {
      const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('sortOrder', 'asc'));
      
      console.log('Attempting to fetch categories from Firebase...');
      const snapshot = await getDocsWithTimeout(q, 1500); // 1.5 second timeout
      
      const categories = snapshot.docs.map(convertCategoryData);
      
      if (categories.length === 0) {
        console.log('No categories in Firebase, using mock data fallback');
        return mockCategories;
      }

      // Update cache
      categoriesCache = { data: categories, timestamp: Date.now() };

      return categories;
    } catch (error) {
      console.warn('Error fetching categories from Firebase (or timeout):', error);
      // Open circuit breaker
      _firebaseCircuitOpen = true;
      console.log('Firebase circuit breaker opened (in getCategories) - subsequent requests will use mock data immediately');
      
      // Cache mock categories on error too
      categoriesCache = { data: mockCategories, timestamp: Date.now() };
      return mockCategories;
    }
  },

  // Create new product
  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      // Create a reference with a generated ID
      const newProductRef = doc(collection(db, PRODUCTS_COLLECTION));
      const id = newProductRef.id;
      
      const now = Timestamp.now();
      
      const newProduct = {
        ...productData,
        id,
        createdAt: now,
        updatedAt: now,
        // Ensure images have proper dates if present
        images: productData.images?.map(img => ({
          ...img,
          createdAt: now,
          updatedAt: now
        })) || []
      };

      await import('firebase/firestore').then(({ setDoc }) => setDoc(newProductRef, newProduct));
      
      // Return the product with JS Date objects
      return {
        ...productData,
        id,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
        images: productData.images?.map(img => ({
          ...img,
          createdAt: now.toDate(),
          updatedAt: now.toDate()
        })) || []
      } as Product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update existing product
  async updateProduct(id: string, productData: Partial<Product>): Promise<void> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      const now = Timestamp.now();
      
      const updates = {
        ...productData,
        updatedAt: now
      };
      
      // If images are being updated, ensure they have dates
      if (updates.images) {
        updates.images = updates.images.map(img => ({
          ...img,
          createdAt: img.createdAt instanceof Date ? Timestamp.fromDate(img.createdAt) : (img.createdAt || now),
          updatedAt: now
        })) as any;
      }

      await import('firebase/firestore').then(({ updateDoc }) => updateDoc(productRef, updates as any));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    if (!isFirebaseConfigured) throw new Error('Firebase not configured');
    try {
      // Invalidate cache
      productsCache = null;
      
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      await import('firebase/firestore').then(({ deleteDoc }) => deleteDoc(productRef));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};
