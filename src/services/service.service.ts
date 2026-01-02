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

import { LocalStorageService } from './local-storage.service';

const COLLECTION_NAME = 'services';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const FIRESTORE_TIMEOUT = 5000; // 5s timeout for Admin/Explicit fetches

// Configuration
// Set to 'true' only when Firestore is populated and ready to be the primary source for public users.
// Currently set to 'false' to ensure fast loading from JSON fallback since Firestore is empty/slow.
const ENABLE_FIRESTORE_FOR_PUBLIC = true;

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

const mapToFirestore = (data: Service): any => {
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

export const ServiceService = {
  // Get all services
  async getAllServices(forceRefresh = false): Promise<Service[]> {
    console.log(`[ServiceService] getAllServices called. forceRefresh=${forceRefresh}`);
    // Check cache
    if (!forceRefresh && servicesCache && (Date.now() - servicesCache.timestamp < CACHE_DURATION)) {
      console.log('[ServiceService] Returning cached data');
      return servicesCache.data;
    }

    let services: Service[] = [];
    const shouldFetch = !!db;
    let fetchFailed = false;

    if (shouldFetch) {
      try {
        console.log('[ServiceService] Fetching from Firestore...');
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore timeout')), FIRESTORE_TIMEOUT)
        );

        // REMOVED orderBy('displayOrder') to prevent hiding services without this field
        const q = query(collection(db, COLLECTION_NAME));
        const snapshot = await Promise.race([
          getDocs(q),
          timeoutPromise
        ]) as any;

        if (!snapshot.empty) {
          console.log(`[ServiceService] Found ${snapshot.docs.length} services in Firestore`);
          services = snapshot.docs.map((doc: any) => mapToService(doc.data()));

          // AUTO-REPAIR: Check for missing displayOrder and fix in background
          const servicesMissingOrder = services.filter(s => typeof s.displayOrder !== 'number');
          if (servicesMissingOrder.length > 0) {
              console.warn(`[ServiceService] Found ${servicesMissingOrder.length} services without displayOrder. Triggering auto-repair...`);
              // Non-blocking repair
              this.normalizeDisplayOrders(services).catch(err => console.error('Auto-repair failed:', err));
          }
        } else {
           console.log('No services found in Firestore. Auto-seeding default data...');
           await this.seedServices();
           services = servicesFallbackData.map(mapToService);
           console.log(`[ServiceService] Auto-seeded ${services.length} services`);
        }
      } catch (error) {
        console.error('Error fetching services from Firestore:', error);
        fetchFailed = true;
      }
    }

    // Fallback to LocalStorage
    if (services.length === 0 && (!shouldFetch || fetchFailed)) {
      console.log('[ServiceService] Falling back to LocalStorage...');
      const localServices = LocalStorageService.getServices();
      if (localServices && localServices.length > 0) {
        services = localServices;
      }
    }

    // Fallback to static data
    if (services.length === 0) {
      console.log('Using static fallback data for services');
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

  // Save (Create or Update) a service
  async saveService(service: Service): Promise<void> {
    if (!db) throw new Error('Firestore is not configured.');

    console.log('[ServiceService] Saving service to Firestore:', service.id);

    try {
      const firestoreData = mapToFirestore(service);
      
      const docRef = doc(db, COLLECTION_NAME, service.id);
      await setDoc(docRef, firestoreData);

      console.log('[ServiceService] Service saved successfully');
      servicesCache = null;
    } catch (error) {
      console.error('[ServiceService] Error saving service:', error);
      throw error;
    }
  },

  /**
   * Delete a service from Firestore.
   */
  async deleteService(id: string): Promise<void> {
    if (!db) {
        // Mock with Persistence
        const currentServices = await this.getAllServices();
        const newServices = currentServices.filter(s => s.id !== id);
        LocalStorageService.saveServices(newServices);
        servicesCache = { data: newServices, timestamp: Date.now() };
        return;
    }

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
  async seedServices(force = false): Promise<void> {
    if (!db) return;

    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      if (!snapshot.empty && !force) {
        console.log('Services collection already exists. Skipping seed.');
        return;
      }

      console.log('Seeding services to Firestore (Force: ' + force + ')...');
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

    if (db) {
        await this.saveService(newService);
    } else {
        // Mock with Persistence
        const currentServices = await this.getAllServices();
        currentServices.push(newService);
        LocalStorageService.saveServices(currentServices);
        servicesCache = { data: currentServices, timestamp: Date.now() };
    }
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

    if (db) {
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
  }
};
