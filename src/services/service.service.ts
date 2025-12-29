import { Service } from '@/shared/types/domain';
import { services } from '@/data/services.data';

// Simple in-memory cache
let servicesCache: { data: Service[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const ServiceService = {
  // Get all services
  async getAllServices(): Promise<Service[]> {
    // Check cache
    if (servicesCache && (Date.now() - servicesCache.timestamp < CACHE_DURATION)) {
      return servicesCache.data;
    }

    // In a real app, this might fetch from an API/DB
    // For now, we return the static data
    // We can add simulation of network delay if needed, but for SSG/ISR it's not strictly necessary
    
    // Sort by displayOrder
    const sortedServices = [...services].sort((a, b) => a.displayOrder - b.displayOrder);

    // Update cache
    servicesCache = {
      data: sortedServices,
      timestamp: Date.now()
    };
    
    return sortedServices;
  },

  // Get service by ID or Slug
  async getServiceById(idOrSlug: string): Promise<Service | undefined> {
    const allServices = await this.getAllServices();
    return allServices.find(s => s.id === idOrSlug || s.slug === idOrSlug);
  },

  // Get services by category
  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    const allServices = await this.getAllServices();
    return allServices.filter(s => s.categoryId === categoryId);
  },

  // Get featured services
  async getFeaturedServices(): Promise<Service[]> {
    const allServices = await this.getAllServices();
    return allServices.filter(s => s.isFeatured);
  },

  // Delete service (Mock)
  async deleteService(id: string): Promise<boolean> {
    // Update cache if exists to simulate deletion
    if (servicesCache) {
      servicesCache.data = servicesCache.data.filter(s => s.id !== id);
      return true;
    }
    return true; // Return true to simulate success even if cache wasn't initialized
  },

  // Create service (Mock)
  async createService(service: Partial<Service>): Promise<Service> {
    // Ensure cache is populated
    if (!servicesCache) {
      await this.getAllServices();
    }

    const newService: Service = {
      // Default values for required fields
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
      // Override with provided values
      ...service,
      // Force these if not provided or to ensure validity
      id: service.id || `serv-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Service;

    if (servicesCache) {
      servicesCache.data.push(newService);
    }
    
    return newService;
  },

  // Update service (Mock)
  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    if (!servicesCache) {
      await this.getAllServices();
    }
    
    if (servicesCache) {
      const index = servicesCache.data.findIndex(s => s.id === id);
      if (index !== -1) {
        const updatedService = {
          ...servicesCache.data[index],
          ...updates,
          updatedAt: new Date()
        };
        servicesCache.data[index] = updatedService;
        return updatedService;
      }
    }
    return null;
  }
};
