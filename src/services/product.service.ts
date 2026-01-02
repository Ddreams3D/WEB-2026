import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StoreProduct, Category } from '@/shared/types/domain';
import { products as productsFallbackData } from '@/data/products.data';
import { categories } from '@/data/categories.data';

import { LocalStorageService } from './local-storage.service';

const COLLECTION_NAME = 'products';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const FIRESTORE_TIMEOUT = 5000; // 5s timeout
const ENABLE_FIRESTORE_FOR_PUBLIC = true; // Enable for public/build if DB is configured

// In-memory cache
let productsCache: { data: StoreProduct[], timestamp: number } | null = null;
let categoriesCache: { data: Category[], timestamp: number } | null = null;

const mapToProduct = (data: any): StoreProduct => {
  return {
    ...data,
    kind: 'product',
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
    images: data.images?.map((img: any) => ({
      ...img,
      createdAt: img.createdAt instanceof Timestamp ? img.createdAt.toDate() : new Date(img.createdAt),
      updatedAt: img.updatedAt instanceof Timestamp ? img.updatedAt.toDate() : new Date(img.updatedAt),
    })) || []
  };
};

const mapToFirestore = (data: StoreProduct): any => {
  return {
    ...data,
    createdAt: data.createdAt instanceof Date ? Timestamp.fromDate(data.createdAt) : Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    images: data.images?.map(img => ({
      ...img,
      createdAt: img.createdAt instanceof Date ? Timestamp.fromDate(img.createdAt) : Timestamp.fromDate(new Date()),
      updatedAt: img.updatedAt instanceof Date ? Timestamp.fromDate(img.updatedAt) : Timestamp.fromDate(new Date()),
    })) || []
  };
};

export const ProductService = {
  // Get all products
  async getAllProducts(forceRefresh = false): Promise<StoreProduct[]> {
    console.log(`[ProductService] getAllProducts called. forceRefresh=${forceRefresh}`);
    // Check cache (memory)
    if (!forceRefresh && productsCache && (Date.now() - productsCache.timestamp < CACHE_DURATION)) {
      console.log('[ProductService] Returning cached data');
      return productsCache.data;
    }

    let products: StoreProduct[] = [];

    // 1. Try Firestore if configured
    const shouldFetch = !!db;
    let fetchFailed = false;

    if (shouldFetch) {
      try {
        console.log('[ProductService] Fetching from Firestore...');
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore timeout')), FIRESTORE_TIMEOUT)
        );

        // REMOVED orderBy('displayOrder') to prevent hiding products without this field
        // We will sort in memory and auto-repair missing orders
        const q = query(collection(db, COLLECTION_NAME));
        
        // Race between fetch and timeout
        const snapshot = await Promise.race([
          getDocs(q),
          timeoutPromise
        ]) as any;

        if (!snapshot.empty) {
          console.log(`[ProductService] Found ${snapshot.docs.length} products in Firestore`);
          products = snapshot.docs.map((doc: any) => mapToProduct(doc.data()));
          
          // AUTO-REPAIR: Check for missing displayOrder and fix in background
          const productsMissingOrder = products.filter(p => typeof p.displayOrder !== 'number');
          if (productsMissingOrder.length > 0) {
              console.warn(`[ProductService] Found ${productsMissingOrder.length} products without displayOrder. Triggering auto-repair...`);
              // Non-blocking repair
              this.normalizeDisplayOrders(products).catch(err => console.error('Auto-repair failed:', err));
          }
        } else {
           console.log('No products found in Firestore. Auto-seeding default data...');
           await this.seedProducts();
           products = productsFallbackData.map(mapToProduct);
           console.log(`[ProductService] Auto-seeded ${products.length} products`);
        }
      } catch (error) {
        console.error('Error fetching products from Firestore:', error);
        fetchFailed = true;
        // If Firestore fails, we fall through to LocalStorage/Fallback
      }
    }

    // 2. If no products from DB (or DB disabled/failed), try LocalStorage (Persistence for Dev/Mock)
    // Only fallback if we didn't check DB, or if DB check failed. 
    // If DB check succeeded and returned 0, we trust it (unless we auto-seeded above).
    if (products.length === 0 && (!shouldFetch || fetchFailed)) {
      console.log('[ProductService] Falling back to LocalStorage...');
      const localProducts = LocalStorageService.getProducts();
      if (localProducts && localProducts.length > 0) {
        console.log('Loaded products from LocalStorage');
        products = localProducts;
      }
    }

    // 3. Fallback to static JSON if everything else failed
    if (products.length === 0) {
      console.log('Using static fallback data');
      products = productsFallbackData.map(mapToProduct);
      // Initialize LocalStorage with fallback if it was empty
      LocalStorageService.saveProducts(products);
    }
    
    // Sort by displayOrder
    products.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    // Update memory cache
    productsCache = {
      data: products,
      timestamp: Date.now()
    };
    
    // Sync DB result to LocalStorage for offline/backup (only if we got data from DB)
    if (shouldFetch && products.length > 0) {
        LocalStorageService.saveProducts(products);
    }
    
    return products;
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

  // Save (Create or Update) a product to Firestore
  async saveProduct(product: StoreProduct): Promise<void> {
    if (!db) throw new Error('Firestore is not configured.');

    console.log('[ProductService] Saving product to Firestore:', product.id);
    
    try {
      // 1. Prepare data (sanitize and convert Dates to Timestamps)
      const firestoreData = mapToFirestore(product);
      
      console.log('[ProductService] Payload prepared for Firestore:', {
          id: product.id,
          imagesCount: firestoreData.images?.length,
          updatedAt: firestoreData.updatedAt
      });

      // 2. Perform write
      const docRef = doc(db, COLLECTION_NAME, product.id);
      await setDoc(docRef, firestoreData);

      console.log('[ProductService] Product saved successfully');
      
      // 3. Invalidate cache
      productsCache = null;
    } catch (error) {
      console.error('[ProductService] Error saving product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    if (!db) {
       // Mock behavior if no DB
       const currentProducts = await this.getAllProducts();
       const newProducts = currentProducts.filter(p => p.id !== id);
       LocalStorageService.saveProducts(newProducts);
       productsCache = { data: newProducts, timestamp: Date.now() };
       return true;
    }

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      // Invalidate cache
      productsCache = null;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  // Create product
  async createProduct(product: Partial<StoreProduct>): Promise<StoreProduct> {
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
      kind: 'product',
      // Override with provided values
      ...product,
      // Force these if not provided or to ensure validity
      id: product.id || `prod-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    } as StoreProduct;

    if (db) {
        await this.saveProduct(newProduct);
    } else {
        // Mock with Persistence
        const currentProducts = await this.getAllProducts();
        currentProducts.push(newProduct);
        LocalStorageService.saveProducts(currentProducts);
        productsCache = { data: currentProducts, timestamp: Date.now() };
    }
    
    return newProduct;
  },

  // Update product
  async updateProduct(id: string, updates: Partial<StoreProduct>): Promise<StoreProduct | null> {
    console.log(`[ProductService] updateProduct called for ID: ${id}`);
    let product = await this.getProductById(id);

    // Recovery Logic: If not found in active list (DB), check fallback data
    // This handles the case where DB is partially populated (so no auto-seed) but missing legacy products
    if (!product) {
        console.warn(`[ProductService] Product ${id} not found in active DB list. Checking fallback data for recovery...`);
        const fallback = productsFallbackData.find(p => p.id === id);
        if (fallback) {
             product = mapToProduct(fallback);
             console.log(`[ProductService] Recovered product ${id} from fallback data. Will persist to DB.`);
        }
    }

    if (!product) {
        console.error(`[ProductService] Product ${id} not found anywhere (DB or Fallback). Update failed.`);
        return null;
    }

    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: new Date()
    };

    if (db) {
        await this.saveProduct(updatedProduct);
    } else {
        // Mock with Persistence
         const currentProducts = await this.getAllProducts();
         const index = currentProducts.findIndex(p => p.id === id);
         if (index !== -1) {
             currentProducts[index] = updatedProduct;
             LocalStorageService.saveProducts(currentProducts);
             productsCache = { data: currentProducts, timestamp: Date.now() };
         }
    }

    return updatedProduct;
  },

  // Auto-repair missing displayOrder fields
  async normalizeDisplayOrders(products: StoreProduct[]): Promise<void> {
    if (!db) return;
    
    try {
        const batch = writeBatch(db);
        let maxOrder = 0;
        
        // Find current max order
        products.forEach(p => {
            if (typeof p.displayOrder === 'number' && p.displayOrder > maxOrder) {
                maxOrder = p.displayOrder;
            }
        });
        
        let updatesCount = 0;
        products.forEach(p => {
            if (typeof p.displayOrder !== 'number') {
                maxOrder++;
                const docRef = doc(db, COLLECTION_NAME, p.id);
                // Update only the displayOrder field to minimize impact
                batch.update(docRef, { displayOrder: maxOrder });
                updatesCount++;
            }
        });
        
        if (updatesCount > 0) {
            console.log(`[ProductService] Auto-repairing ${updatesCount} products with missing displayOrder...`);
            await batch.commit();
            console.log('[ProductService] Auto-repair complete.');
        }
    } catch (error) {
        console.error('[ProductService] Error during auto-repair:', error);
    }
  },

  // Seed Firestore with initial data from fallback
  async seedProducts(force = false): Promise<void> {
    if (!db) return;

    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      if (!snapshot.empty && !force) {
        console.log('Products collection already exists. Skipping seed.');
        return;
      }

      console.log('Seeding products to Firestore (Force: ' + force + ')...');
      const batch = writeBatch(db);
      
      const fallbackProducts = productsFallbackData.map(mapToProduct);
      
      fallbackProducts.forEach(product => {
        const docRef = doc(db, COLLECTION_NAME, product.id);
        const firestoreData = {
          ...product,
          createdAt: Timestamp.fromDate(product.createdAt),
          updatedAt: Timestamp.fromDate(product.updatedAt),
          images: product.images.map(img => ({
            ...img,
            createdAt: Timestamp.fromDate(img.createdAt),
            updatedAt: Timestamp.fromDate(img.updatedAt)
          }))
        };
        batch.set(docRef, firestoreData);
      });

      await batch.commit();
      console.log('Products seeded successfully.');
      
      productsCache = null;
    } catch (error) {
      console.error('Error seeding products:', error);
      throw error;
    }
  }
};
