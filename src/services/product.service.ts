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

// Helper to simulate network delay
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ProductService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    // If Firebase is not configured, use mock data immediately
    if (!isFirebaseConfigured) {
      console.log('Firebase not configured, using mock data');
      await simulateDelay(500);
      return mockProducts;
    }

    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const products = snapshot.docs.map(convertProductData);
      
      // If Firebase returns no products, fallback to mock data
      // This handles cases where Firebase is configured but empty
      if (products.length === 0) {
        console.log('No products in Firebase, using mock data fallback');
        return mockProducts;
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data on error
      console.log('Error fetching from Firebase, using mock data fallback');
      return mockProducts;
    }
  },

  // Get product by ID or Slug
  async getProductById(idOrSlug: string): Promise<Product | undefined> {
    // Helper to find in mock data
    const findInMock = () => mockProducts.find(p => p.id === idOrSlug || p.slug === idOrSlug);

    if (!isFirebaseConfigured) {
      await simulateDelay(300);
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

    if (!isFirebaseConfigured) {
      await simulateDelay(500);
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
  async getCategories(): Promise<Category[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('sortOrder', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(convertCategoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
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
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      await import('firebase/firestore').then(({ deleteDoc }) => deleteDoc(productRef));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};
