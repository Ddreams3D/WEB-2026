import { ServiceLandingsService } from './service-landings.service';
import { ProjectService } from './project.service';
import { ProductService } from './product.service';
import { fetchThemesFromFirestore } from './seasonal.service';
import { ServiceService } from './service.service';
import * as LandingService from './landing.service';
import { 
  heroImages, 
  serviceImages, 
  productImages as staticProductImages, 
  aboutImages, 
  processImages 
} from '@/config/images';
import imageMapping from '@/data/image-mapping.json';

export const StorageAuditService = {
  /**
   * Retrieves a Set of all image URLs currently referenced in the database.
   * Scans: Service Landings, Projects, Products, Seasonal Themes, Services, Home Landing,
   * AND Hardcoded references in config/images.ts and data/image-mapping.json.
   */
  async getUsedImageUrls(): Promise<Set<string>> {
    const usedUrls = new Set<string>();

    try {
      // 0. Hardcoded Config Files (Critical for static pages)
      const addFromObject = (obj: Record<string, string>) => {
        Object.values(obj).forEach(url => {
          if (url && typeof url === 'string' && url.includes('firebasestorage')) {
            usedUrls.add(url);
          }
        });
      };

      addFromObject(heroImages);
      addFromObject(serviceImages);
      addFromObject(staticProductImages);
      addFromObject(aboutImages);
      addFromObject(processImages);
      
      // Image Mapping JSON
      addFromObject(imageMapping);

      // 1. Service Landings
      const landings = await ServiceLandingsService.getAll();
      landings.forEach(landing => {
        if (landing.heroImage) usedUrls.add(landing.heroImage);
        if (landing.heroImageComparison) usedUrls.add(landing.heroImageComparison);
        
        landing.sections?.forEach(section => {
          if (section.image) usedUrls.add(section.image);
          section.items?.forEach(item => {
            if (item.image) usedUrls.add(item.image);
          });
        });
      });

      // 2. Projects
      const projects = await ProjectService.getAllProjects(true); // Include deleted to be safe
      projects.forEach(project => {
        if (project.coverImage) usedUrls.add(project.coverImage);
        if (project.galleryImages) {
          project.galleryImages.forEach(url => usedUrls.add(url));
        }
      });

      // 3. Products
      const products = await ProductService.getAllProducts(true, true); // Force refresh, include deleted
      products.forEach(product => {
        if (product.images) {
          product.images.forEach(img => {
            if (img.url) usedUrls.add(img.url);
          });
        }
      });

      // 4. Seasonal Themes
      const themes = await fetchThemesFromFirestore();
      themes.forEach(theme => {
        if (theme.landing?.heroImage) usedUrls.add(theme.landing.heroImage);
        if (theme.landing?.heroImages) {
          theme.landing.heroImages.forEach(url => usedUrls.add(url));
        }
        if (theme.landing?.heroVideo) usedUrls.add(theme.landing.heroVideo);
      });

      // 5. Services (Main)
      const services = await ServiceService.getAllServices(true, true);
      services.forEach(service => {
        if (service.images) {
            service.images.forEach(img => {
                if (img.url) usedUrls.add(img.url);
            });
        }
      });

      // 6. Home Landing
      const landingMain = await LandingService.fetchLandingMain();
      if (landingMain) {
          if (landingMain.heroImage) usedUrls.add(landingMain.heroImage);
          if (landingMain.bubbleImages) {
              landingMain.bubbleImages.forEach(url => usedUrls.add(url));
          }
      }

    } catch (error) {
      console.error('Error auditing used images:', error);
    }

    return usedUrls;
  }
};
