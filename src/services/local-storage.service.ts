
import { StoreProduct, Service } from '@/shared/types/domain';

const KEYS = {
  PRODUCTS: 'ddreams_products_v1',
  SERVICES: 'ddreams_services_v1'
};

export const LocalStorageService = {
  // Products
  getProducts(): StoreProduct[] | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(KEYS.PRODUCTS);
      if (!item) return null;
      
      // Parse and restore Dates
      return JSON.parse(item, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt') {
          return new Date(value);
        }
        return value;
      });
    } catch (e) {
      console.error('Error reading products from localStorage', e);
      return null;
    }
  },

  saveProducts(products: StoreProduct[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to localStorage', e);
    }
  },

  // Services
  getServices(): Service[] | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(KEYS.SERVICES);
      if (!item) return null;

      return JSON.parse(item, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt') {
          return new Date(value);
        }
        return value;
      });
    } catch (e) {
      console.error('Error reading services from localStorage', e);
      return null;
    }
  },

  saveServices(services: Service[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error('Error saving services to localStorage', e);
    }
  },

  // Clear
  clearAll() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.PRODUCTS);
    localStorage.removeItem(KEYS.SERVICES);
  }
};
