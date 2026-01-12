import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp,
  deleteDoc,
  DocumentData,
  writeBatch,
  QuerySnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Service, ProductImage } from '@/shared/types/domain';
import servicesFallbackData from '@/shared/data/services-fallback.json';

import { LocalStorageService } from './local-storage.service';

const COLLECTION_NAME = 'services';
const CACHE_DURATION = 1000 * 30; // 30 seconds cache
const FIRESTORE_TIMEOUT = 5000; // 5s timeout for Admin/Explicit fetches

// In-memory cache
let servicesCache: { data: Service[], timestamp: number } | null = null;

/**
 * Helper to convert Firestore data or JSON to Service object.
 * Handles Date/Timestamp conversion.
 */
const mapToService = (data: DocumentData): Service => {
  return {
    ...data,
    // Ensure kind is 'service'
    kind: 'service',
    isService: true,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
    deletedAt: data.deletedAt ? (data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : new Date(data.deletedAt)) : undefined,
    images: data.images?.map((img: DocumentData) => ({
      ...img,
      createdAt: img.createdAt instanceof Timestamp ? img.createdAt.toDate() : new Date(img.createdAt),
      updatedAt: img.updatedAt instanceof Timestamp ? img.updatedAt.toDate() : new Date(img.updatedAt),
    })) || []
  } as Service;
};

const mapToFirestore = (data: Service): DocumentData => {
  return {
    ...data,
    createdAt: data.createdAt instanceof Date ? Timestamp.fromDate(data.createdAt) : Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    deletedAt: data.deletedAt instanceof Date ? Timestamp.fromDate(data.deletedAt) : (data.deletedAt || null),
    images: data.images?.map(img => ({
      ...img,
      createdAt: img.createdAt instanceof Date ? Timestamp.fromDate(img.createdAt) : Timestamp.fromDate(new Date()),
      updatedAt: img.updatedAt instanceof Date ? Timestamp.fromDate(img.updatedAt) : Timestamp.fromDate(new Date()),
    })) || []
  };
};

const deleteImagesFromStorage = async (images: ProductImage[]) => {
  if (!images || images.length === 0 || !storage) return;
  const storageInstance = storage;

  const deletePromises = images.map(async (img) => {
    if (!img.url) return;
    try {
      const imageRef = ref(storageInstance, img.url);
      await deleteObject(imageRef);
    } catch (error) {
      console.warn(`[ServiceService] Failed to delete image ${img.url}:`, error);
    }
  });

  await Promise.all(deletePromises);
};

export const ServiceService = {
  // Get all services
  async getAllServices(forceRefresh = false, includeDeleted = false): Promise<Service[]> {
    // Check cache
    if (!forceRefresh && servicesCache && (Date.now() - servicesCache.timestamp < CACHE_DURATION)) {
      const cachedServices = servicesCache.data;
      return includeDeleted ? cachedServices : cachedServices.filter(s => !s.isDeleted);
    }

    let services: Service[] = [];
    const dbInstance = db;
    const shouldFetch = !!dbInstance;
    let fetchFailed = false;

    if (shouldFetch && dbInstance) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore timeout')), FIRESTORE_TIMEOUT)
        );

        // REMOVED orderBy('displayOrder') to prevent hiding services without this field
        const q = query(collection(dbInstance, COLLECTION_NAME));
        const snapshot = await Promise.race([
          getDocs(q),
          timeoutPromise
        ]) as QuerySnapshot<DocumentData>;

        if (!snapshot.empty) {
          services = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => mapToService(doc.data()));

          // AUTO-REPAIR: Check for missing displayOrder and fix in background
          const servicesMissingOrder = services.filter(s => typeof s.displayOrder !== 'number');
          if (servicesMissingOrder.length > 0) {
              console.warn(`[ServiceService] Found ${servicesMissingOrder.length} services without displayOrder. Triggering auto-repair...`);
              // Non-blocking repair
              this.normalizeDisplayOrders(services).catch((err: unknown) => console.error('Auto-repair failed:', err));
          }
        } else {
           // Auto-seeding disabled to prevent permission errors in build/production environments
           // await this.seedServices();
           services = servicesFallbackData.map(mapToService);
        }
      } catch (error) {
        console.error('Error fetching services from Firestore:', error);
        fetchFailed = true;
      }
    }

    // Fallback to LocalStorage
    if (services.length === 0 && (!shouldFetch || fetchFailed)) {
      const localServices = LocalStorageService.getServices();
      if (localServices && localServices.length > 0) {
        services = localServices;
      }
    }

    // Fallback to static data
    if (services.length === 0) {
      services = servicesFallbackData.map(mapToService);
      LocalStorageService.saveServices(services);
    }
    
    // Sort
    services.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    // Update cache
    servicesCache = {
      data: services,
      timestamp: Date.now()
    };
    
    // Sync to LocalStorage
    if (shouldFetch && services.length > 0) {
        LocalStorageService.saveServices(services);
    }
    
    return includeDeleted ? services : services.filter(s => !s.isDeleted);
  },

  // Get service by ID or Slug
  async getServiceById(idOrSlug: string): Promise<Service | undefined> {
    const allServices = await this.getAllServices(false, true); // Allow finding deleted for restore
    return allServices.find((s: Service) => s.id === idOrSlug || s.slug === idOrSlug);
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

  // Save (Create or Update) a service
  async saveService(service: Service): Promise<void> {
    const dbInstance = db;
    if (!dbInstance) throw new Error('Firestore is not configured.');

    try {
      const firestoreData = mapToFirestore(service);
      
      const docRef = doc(dbInstance, COLLECTION_NAME, service.id);
      await setDoc(docRef, firestoreData);

      servicesCache = null;
    } catch (error) {
      console.error('[ServiceService] Error saving service:', error);
      throw error;
    }
  },

  /**
   * Soft Delete a service (Moves to Trash).
   */
  async deleteService(id: string): Promise<void> {
    console.log(`[ServiceService] Soft deleting service ${id}`);
    await this.updateService(id, { 
      isDeleted: true, 
      isActive: false, 
      deletedAt: new Date() 
    });
  },

  /**
   * Restore service from Trash.
   */
  async restoreService(id: string): Promise<void> {
    console.log(`[ServiceService] Restoring service ${id}`);
    await this.updateService(id, { 
      isDeleted: false, 
      isActive: false, 
      deletedAt: undefined 
    });
  },

  /**
   * Permanent Delete service (Destroys data and images).
   */
  async permanentDeleteService(id: string): Promise<void> {
    console.log(`[ServiceService] Permanently deleting service ${id}`);
    const dbInstance = db;
    if (!dbInstance) {
        // Mock with Persistence
        const currentServices = await this.getAllServices(false, true);
        const newServices = currentServices.filter(s => s.id !== id);
        LocalStorageService.saveServices(newServices);
        servicesCache = { data: newServices, timestamp: Date.now() };
        return;
    }

    try {
      const allServices = await this.getAllServices(false, true);
      const service = allServices.find(s => s.id === id);
      
      if (service?.images) {
        await deleteImagesFromStorage(service.images);
      }

      await deleteDoc(doc(dbInstance, COLLECTION_NAME, id));
      
      // Invalidate cache
      servicesCache = null;
    } catch (error) {
      console.error('Error permanently deleting service:', error);
      throw error;
    }
  },

  /**
   * Seed Firestore with initial data from JSON.
   * Only runs if Firestore collection is empty.
   */
  async seedServices(force = false): Promise<void> {
    const dbInstance = db;
    if (!dbInstance) return;

    try {
      const snapshot = await getDocs(collection(dbInstance, COLLECTION_NAME));
      if (!snapshot.empty && !force) {
        console.log('Services collection already exists. Skipping seed.');
        return;
      }

      console.log('Seeding services to Firestore (Force: ' + force + ')...');
      const batch = writeBatch(dbInstance);
      
      const fallbackServices = servicesFallbackData.map(mapToService);
      
      fallbackServices.forEach(service => {
        const docRef = doc(dbInstance, COLLECTION_NAME, service.id);
        // Convert Dates to Timestamps for Firestore
        const firestoreData = {
          ...service,
          createdAt: service.createdAt ? Timestamp.fromDate(service.createdAt) : Timestamp.now(),
          updatedAt: service.updatedAt ? Timestamp.fromDate(service.updatedAt) : Timestamp.now(),
          images: service.images.map(img => ({
            ...img,
            createdAt: img.createdAt ? Timestamp.fromDate(img.createdAt) : Timestamp.now(),
            updatedAt: img.updatedAt ? Timestamp.fromDate(img.updatedAt) : Timestamp.now()
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

    const dbInstance = db;
    if (dbInstance) {
        await this.saveService(newService);
    }
    
    // Also save to local storage
    const currentServices = LocalStorageService.getServices() || [];
    LocalStorageService.saveServices([...currentServices, newService]);
    servicesCache = null; // Invalidate cache

    return newService;
  },

  /**
   * Mock method to match previous interface (Update).
   * Internally calls saveService.
   */
  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    console.log(`[ServiceService] updateService called for ID: ${id}`);
    let service = await this.getServiceById(id);

    // Recovery Logic for Services
    if (!service) {
        console.warn(`[ServiceService] Service ${id} not found in active DB list. Checking fallback data for recovery...`);
        const fallback = servicesFallbackData.find(s => s.id === id);
        if (fallback) {
             service = mapToService(fallback);
             console.log(`[ServiceService] Recovered service ${id} from fallback data. Will persist to DB.`);
        }
    }

    if (!service) {
        console.error(`[ServiceService] Service ${id} not found anywhere. Update failed.`);
        return null;
    }

    const updatedService = {
      ...service,
      ...updates,
      updatedAt: new Date()
    };

    const dbInstance = db;
    if (dbInstance) {
        await this.saveService(updatedService);
    } else {
        // Mock with Persistence
         const currentServices = await this.getAllServices();
         const index = currentServices.findIndex(s => s.id === id);
         if (index !== -1) {
             currentServices[index] = updatedService;
             LocalStorageService.saveServices(currentServices);
             servicesCache = { data: currentServices, timestamp: Date.now() };
         }
    }
    return updatedService;
  },

  async normalizeDisplayOrders(services: Service[]): Promise<void> {
    const dbInstance = db;
    if (!dbInstance) return;
    const batch = writeBatch(dbInstance);
    let updatedCount = 0;

    services.forEach((service, index) => {
        if (typeof service.displayOrder !== 'number') {
            const ref = doc(dbInstance, COLLECTION_NAME, service.id);
            batch.update(ref, { displayOrder: index });
            updatedCount++;
        }
    });

    if (updatedCount > 0) {
        await batch.commit();
        console.log(`[ServiceService] Normalized displayOrder for ${updatedCount} services.`);
    }
  }
};
