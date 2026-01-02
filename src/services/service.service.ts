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
import { Service } from '@/shared/types/domain';
import servicesFallbackData from '@/shared/data/services-fallback.json';

const COLLECTION_NAME = 'services';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const FIRESTORE_TIMEOUT = 2000; // 2s timeout for Admin/Explicit fetches

// Configuration
// Set to 'true' only when Firestore is populated and ready to be the primary source for public users.
// Currently set to 'false' to ensure fast loading from JSON fallback since Firestore is empty/slow.
const ENABLE_FIRESTORE_FOR_PUBLIC = false;

// In-memory cache
let servicesCache: { data: Service[], timestamp: number } | null = null;

/**
 * Helper to convert Firestore data or JSON to Service object.
 * Handles Date/Timestamp conversion.
 */
const mapToService = (data: any): Service => {
  return {
    ...data,
    // Ensure kind is 'service'
    kind: 'service',
    isService: true,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
    images: data.images?.map((img: any) => ({
      ...img,
      createdAt: img.createdAt instanceof Timestamp ? img.createdAt.toDate() : new Date(img.createdAt),
      updatedAt: img.updatedAt instanceof Timestamp ? img.updatedAt.toDate() : new Date(img.updatedAt),
    })) || []
  };
};

export const ServiceService = {
  /**
   * Get all services from Firestore with JSON fallback.
   * Uses in-memory caching.
   */
  async getAllServices(forceRefresh = false): Promise<Service[]> {
    // Return cached data if valid and not forced
    if (!forceRefresh && servicesCache && (Date.now() - servicesCache.timestamp < CACHE_DURATION)) {
      return servicesCache.data;
    }

    let services: Service[] = [];

    // 1. Try Firestore (Only if configured for public, or forced for Admin)
    const shouldFetchFirestore = db && (forceRefresh || ENABLE_FIRESTORE_FOR_PUBLIC);

    if (shouldFetchFirestore) {
      try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('displayOrder'));
        
        // Timeout to prevent hanging if Firestore is unreachable
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore timeout')), FIRESTORE_TIMEOUT)
        );

        const snapshot = await Promise.race([
          getDocs(q),
          timeoutPromise
        ]) as any;

        if (!snapshot.empty) {
          services = snapshot.docs.map((doc: any) => mapToService(doc.data()));
        } else {
          console.log('No services found in Firestore. Using fallback.');
        }
      } catch (error) {
        console.error('Error fetching services from Firestore:', error);
      }
    }

    // 2. Fallback to JSON if Firestore failed or empty
    if (services.length === 0) {
      services = servicesFallbackData.map(mapToService);
    }

    // Sort by displayOrder (redundant if Firestore sort worked, but safe)
    services.sort((a, b) => a.displayOrder - b.displayOrder);

    // Update cache
    servicesCache = {
      data: services,
      timestamp: Date.now()
    };

    return services;
  },

  /**
   * Get service by ID or Slug.
   */
  async getServiceById(idOrSlug: string): Promise<Service | undefined> {
    const allServices = await this.getAllServices();
    return allServices.find(s => s.id === idOrSlug || s.slug === idOrSlug);
  },

  /**
   * Get services by category.
   */
  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    const allServices = await this.getAllServices();
    return allServices.filter(s => s.categoryId === categoryId);
  },

  /**
   * Get featured services.
   */
  async getFeaturedServices(): Promise<Service[]> {
    const allServices = await this.getAllServices();
    return allServices.filter(s => s.isFeatured);
  },

  /**
   * Save (Create or Update) a service to Firestore.
   */
  async saveService(service: Service): Promise<void> {
    if (!db) throw new Error('Firestore is not configured.');

    try {
      const docRef = doc(db, COLLECTION_NAME, service.id);
      await setDoc(docRef, {
        ...service,
        updatedAt: Timestamp.fromDate(new Date())
      });

      // Invalidate cache
      servicesCache = null;
    } catch (error) {
      console.error('Error saving service:', error);
      throw error;
    }
  },

  /**
   * Delete a service from Firestore.
   */
  async deleteService(id: string): Promise<void> {
    if (!db) throw new Error('Firestore is not configured.');

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      
      // Invalidate cache
      servicesCache = null;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  /**
   * Seed Firestore with initial data from JSON.
   * Only runs if Firestore collection is empty.
   */
  async seedServices(): Promise<void> {
    if (!db) return;

    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      if (!snapshot.empty) {
        console.log('Services collection already exists. Skipping seed.');
        return;
      }

      console.log('Seeding services to Firestore...');
      const batch = writeBatch(db);
      
      const fallbackServices = servicesFallbackData.map(mapToService);
      
      fallbackServices.forEach(service => {
        const docRef = doc(db, COLLECTION_NAME, service.id);
        // Convert Dates to Timestamps for Firestore
        const firestoreData = {
          ...service,
          createdAt: Timestamp.fromDate(service.createdAt),
          updatedAt: Timestamp.fromDate(service.updatedAt),
          images: service.images.map(img => ({
            ...img,
            createdAt: Timestamp.fromDate(img.createdAt),
            updatedAt: Timestamp.fromDate(img.updatedAt)
          }))
        };
        batch.set(docRef, firestoreData);
      });

      await batch.commit();
      console.log('Services seeded successfully.');
      
      // Invalidate cache
      servicesCache = null;
    } catch (error) {
      console.error('Error seeding services:', error);
      throw error;
    }
  },

  /**
   * Mock method to match previous interface (Create).
   * Internally calls saveService.
   */
  async createService(partialService: Partial<Service>): Promise<Service> {
    const newService: Service = {
      slug: `service-${Date.now()}`,
      name: 'New Service',
      description: '',
      shortDescription: '',
      displayOrder: 0,
      categoryId: 'general',
      categoryName: 'General',
      tags: [],
      images: [],
      price: 0,
      customPriceDisplay: 'Cotización',
      currency: 'PEN',
      isActive: true,
      isFeatured: false,
      rating: 0,
      reviewCount: 0,
      kind: 'service',
      isService: true,
      specifications: [],
      tabs: [],
      tabsTitle: '',
      ...partialService,
      id: partialService.id || `serv-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Service;

    await this.saveService(newService);
    return newService;
  },

  /**
   * Mock method to match previous interface (Update).
   * Internally calls saveService.
   */
  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    const service = await this.getServiceById(id);
    if (!service) return null;

    const updatedService = {
      ...service,
      ...updates,
      updatedAt: new Date()
    };

    await this.saveService(updatedService);
    return updatedService;
  }
};
