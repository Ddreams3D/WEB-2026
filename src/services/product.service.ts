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

const COLLECTION_NAME = 'products';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

export const ProductService = {
  // Get all products
  async getAllProducts(forceRefresh = false): Promise<StoreProduct[]> {
    // Check cache
    if (!forceRefresh && productsCache && (Date.now() - productsCache.timestamp < CACHE_DURATION)) {
      return productsCache.data;
    }

    let products: StoreProduct[] = [];

    // 1. Try Firestore
    if (db) {
      try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          products = snapshot.docs.map(doc => mapToProduct(doc.data()));
        } else {
          console.log('No products found in Firestore. Using fallback.');
        }
      } catch (error) {
        console.error('Error fetching products from Firestore:', error);
      }
    }

    // 2. Fallback to local data if Firestore failed or empty
    if (products.length === 0) {
      products = productsFallbackData.map(mapToProduct);
    }
    
    // Sort by createdAt (newest first)
    products.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Update cache
    productsCache = {
      data: products,
      timestamp: Date.now()
    };
    
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

    try {
      const docRef = doc(db, COLLECTION_NAME, product.id);
      await setDoc(docRef, {
        ...product,
        updatedAt: Timestamp.fromDate(new Date())
      });

      // Invalidate cache
      productsCache = null;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    if (!db) {
       // Mock behavior if no DB
       if (productsCache) {
          productsCache.data = productsCache.data.filter(p => p.id !== id);
       }
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
        // Mock
         if (!productsCache) await this.getAllProducts();
         if (productsCache) productsCache.data.push(newProduct);
    }
    
    return newProduct;
  },

  // Update product
  async updateProduct(id: string, updates: Partial<StoreProduct>): Promise<StoreProduct | null> {
    const product = await this.getProductById(id);
    if (!product) return null;

    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: new Date()
    };

    if (db) {
        await this.saveProduct(updatedProduct);
    } else {
        // Mock
         if (productsCache) {
            const index = productsCache.data.findIndex(p => p.id === id);
            if (index !== -1) productsCache.data[index] = updatedProduct;
         }
    }

    return updatedProduct;
  },

  // Seed Firestore with initial data from fallback
  async seedProducts(): Promise<void> {
    if (!db) return;

    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      if (!snapshot.empty) {
        console.log('Products collection already exists. Skipping seed.');
        return;
      }

      console.log('Seeding products to Firestore...');
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
