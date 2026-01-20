import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  limit,
  Timestamp,
  setDoc,
  writeBatch,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PortfolioItem } from '@/shared/types/domain';
import { projects as staticProjects } from '@/data/projects.data';

const COLLECTION = 'projects';

// Helper to convert Firestore data to PortfolioItem
const convertDoc = (doc: QueryDocumentSnapshot<DocumentData> | DocumentData): PortfolioItem => {
  const data = typeof doc.data === 'function' ? doc.data() : doc;
  const id = typeof doc.id === 'string' ? doc.id : data.id;
  
  // Ensure we don't leak Firestore types (Timestamps) that cause serialization issues
  // and only return what's needed.
  return {
    id,
    title: data.title || '',
    slug: data.slug || '',
    description: data.description || '',
    clientName: data.clientName || data.client,
    client: data.client, // Keep for legacy if needed
    category: data.category || 'General',
    coverImage: data.coverImage || '',
    galleryImages: data.galleryImages || [],
    galleryAlt: data.galleryAlt || [],
    relatedServiceId: data.relatedServiceId,
    applications: data.applications,
    ctaText: data.ctaText,
    tags: data.tags || [],
    isFeatured: !!data.isFeatured,
    
    // Handle Dates
    projectDate: data.projectDate instanceof Timestamp ? data.projectDate.toDate() : (data.projectDate ? new Date(data.projectDate) : new Date()),
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
    // Explicitly exclude other fields like updatedAt if they exist as Timestamps
  } as PortfolioItem;
};

export const ProjectService = {
  async getAllProjects(includeDeleted = false): Promise<PortfolioItem[]> {
    const dbInstance = db;
    if (!dbInstance) {
        console.warn('Firestore not configured, returning static projects.');
        return staticProjects as unknown as PortfolioItem[];
    }
    try {
      const q = query(collection(dbInstance, COLLECTION));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.warn('No projects in Firestore, returning static data.');
        return staticProjects as unknown as PortfolioItem[];
      }

      let projects = snapshot.docs.map(convertDoc);
      
      if (!includeDeleted) {
        projects = projects.filter(p => !p.isDeleted);
      }

      // Sort in memory to avoid index issues
      return projects.sort((a, b) => b.projectDate.getTime() - a.projectDate.getTime());
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback to static data on error
      return staticProjects as unknown as PortfolioItem[];
    }
  },

  async updateImageReference(oldUrl: string, newUrl: string): Promise<number> {
    const map = new Map<string, string>();
    map.set(oldUrl, newUrl);
    return this.bulkUpdateImageReferences(map);
  },

  async bulkUpdateImageReferences(replacements: Map<string, string>): Promise<number> {
    const dbInstance = db;
    if (!dbInstance || replacements.size === 0) return 0;
    try {
      let updatedCount = 0;
      const allProjects = await this.getAllProjects(true); // Include deleted
      
      const batch = writeBatch(dbInstance);
      let batchCount = 0;

      for (const project of allProjects) {
        let changed = false;
        
        // 1. Cover Image
        let newCoverImage = project.coverImage;
        if (project.coverImage && replacements.has(project.coverImage)) {
            newCoverImage = replacements.get(project.coverImage)!;
            changed = true;
        }

        // 2. Gallery Images
        let newGalleryImages = project.galleryImages;
        if (project.galleryImages) {
            let galleryChanged = false;
            const updatedGallery = project.galleryImages.map(url => {
                if (url && replacements.has(url)) {
                    galleryChanged = true;
                    return replacements.get(url)!;
                }
                return url;
            });
            if (galleryChanged) {
                newGalleryImages = updatedGallery;
                changed = true;
            }
        }

        if (changed) {
          const ref = doc(dbInstance, COLLECTION, project.id);
          // Only update affected fields
          batch.update(ref, { 
              coverImage: newCoverImage,
              galleryImages: newGalleryImages,
              updatedAt: Timestamp.now() 
          });
          updatedCount++;
          batchCount++;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }

      return updatedCount;
    } catch (error) {
      console.error('Error updating project image references:', error);
      return 0;
    }
  },

  async getProjectById(idOrSlug: string): Promise<PortfolioItem | undefined> {
    const dbInstance = db;
    if (!dbInstance) {
         return (staticProjects as unknown as PortfolioItem[]).find(p => p.id === idOrSlug || p.slug === idOrSlug);
    }
    try {
      // Try fetching by ID first
      const docRef = doc(dbInstance, COLLECTION, idOrSlug);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = convertDoc(docSnap);
        if (data.isDeleted) return undefined;
        return data;
      }

      // If not found by ID, try finding by slug
      // Note: We query by slug only and filter isDeleted in memory to avoid index requirements
      const q = query(collection(dbInstance, COLLECTION), where('slug', '==', idOrSlug));
      const querySnapshot = await getDocs(q);
      
      // Find first non-deleted matching slug
      const foundDoc = querySnapshot.docs.find(d => {
          const data = d.data();
          return data.slug === idOrSlug && !data.isDeleted;
      });
      
      if (foundDoc) return convertDoc(foundDoc);

      // Fallback to static
      return (staticProjects as unknown as PortfolioItem[]).find(p => p.id === idOrSlug || p.slug === idOrSlug);
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      return (staticProjects as unknown as PortfolioItem[]).find(p => p.id === idOrSlug || p.slug === idOrSlug);
    }
  },

  async getFeaturedProjects(limitCount?: number): Promise<PortfolioItem[]> {
    const dbInstance = db;
    if (!dbInstance) {
      let results = (staticProjects as unknown as PortfolioItem[]).filter(p => p.isFeatured);
      if (limitCount) {
        results = results.slice(0, limitCount);
      }
      return results;
    }
    try {
      let q = query(
        collection(dbInstance, COLLECTION), 
        where('isFeatured', '==', true)
      );
      
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      
      // If we find projects in DB, return them
      if (!snapshot.empty) {
        const projects = snapshot.docs.map(convertDoc).filter(p => !p.isDeleted);
        return projects.sort((a, b) => b.projectDate.getTime() - a.projectDate.getTime());
      }

      console.warn('No featured projects in Firestore, returning static data.');
      let results = (staticProjects as unknown as PortfolioItem[]).filter(p => p.isFeatured);
      if (limitCount) {
        results = results.slice(0, limitCount);
      }
      return results;

    } catch (error) {
      console.error('Error fetching featured projects:', error);
      let results = (staticProjects as unknown as PortfolioItem[]).filter(p => p.isFeatured);
      if (limitCount) {
        results = results.slice(0, limitCount);
      }
      return results;
    }
  },

  async getProjectsByCategory(category: string, limitCount?: number): Promise<PortfolioItem[]> {
    const dbInstance = db;
    if (!dbInstance) {
      let results = (staticProjects as unknown as PortfolioItem[]).filter(p => p.category === category);
      if (limitCount) {
        results = results.slice(0, limitCount);
      }
      return results;
    }
    try {
      let q = query(
        collection(dbInstance, COLLECTION), 
        where('category', '==', category)
      );

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const projects = snapshot.docs.map(convertDoc).filter(p => !p.isDeleted);
        return projects.sort((a, b) => b.projectDate.getTime() - a.projectDate.getTime());
      }

      console.warn('No projects by category in Firestore, returning static data.');
      let results = (staticProjects as unknown as PortfolioItem[]).filter(p => p.category === category);
      if (limitCount) {
        results = results.slice(0, limitCount);
      }
      return results;
    } catch (error) {
      console.error('Error fetching projects by category:', error);
      let results = (staticProjects as unknown as PortfolioItem[]).filter(p => p.category === category);
      if (limitCount) {
        results = results.slice(0, limitCount);
      }
      return results;
    }
  },

  // Admin Methods
  async createProject(project: Omit<PortfolioItem, 'id'>): Promise<string> {
    const dbInstance = db;
    if (!dbInstance) throw new Error('Firestore is not configured.');
    const docRef = await addDoc(collection(dbInstance, COLLECTION), {
      ...project,
      createdAt: Timestamp.now(),
      projectDate: Timestamp.fromDate(project.projectDate)
    });
    return docRef.id;
  },

  async updateProject(id: string, data: Partial<PortfolioItem>): Promise<void> {
    const dbInstance = db;
    if (!dbInstance) throw new Error('Firestore is not configured.');
    const docRef = doc(dbInstance, COLLECTION, id);
    const updateData: Record<string, unknown> = { ...data };
    if (data.projectDate) {
      updateData.projectDate = Timestamp.fromDate(data.projectDate);
    }
    // Remove id from data if present
    delete updateData.id;
    
    await updateDoc(docRef, updateData);
  },

  async deleteProject(id: string): Promise<void> {
    const dbInstance = db;
    if (!dbInstance) throw new Error('Firestore is not configured.');
    const docRef = doc(dbInstance, COLLECTION, id);
    await updateDoc(docRef, {
      isDeleted: true,
      deletedAt: Timestamp.now()
    });
  },

  async restoreProject(id: string): Promise<void> {
    const dbInstance = db;
    if (!dbInstance) throw new Error('Firestore is not configured.');
    const docRef = doc(dbInstance, COLLECTION, id);
    await updateDoc(docRef, {
      isDeleted: false,
      deletedAt: null // or deleteField() if imported
    });
  },

  async permanentDeleteProject(id: string): Promise<void> {
    const dbInstance = db;
    if (!dbInstance) throw new Error('Firestore is not configured.');
    await deleteDoc(doc(dbInstance, COLLECTION, id));
  },

  // Migration Tool
  async checkMigrationNeeded(): Promise<boolean> {
    const dbInstance = db;
    if (!dbInstance) return false;
    try {
      const snapshot = await getDocs(collection(dbInstance, COLLECTION));
      return snapshot.empty;
    } catch (error) {
      console.warn('Error checking migration status (likely permission/connection issue):', error);
      return false; // Assume no migration needed if we can't check, to prevent UI blocking
    }
  },

  async seedProjectsFromStatic(force = false): Promise<void> {
    const dbInstance = db;
    if (!dbInstance) return;
    const snapshot = await getDocs(collection(dbInstance, COLLECTION));
    if (!snapshot.empty && !force) {
      console.log('Projects collection is not empty. Skipping seed.');
      return;
    }

    const batch = writeBatch(dbInstance);
    
    staticProjects.forEach((project) => {
      // Create a new doc reference. 
      // We can use the existing ID if it's compatible or let Firestore generate one.
      // staticProjects items have 'id' (e.g. '1', '2'). Firestore IDs usually are strings.
      // Let's use the existing ID to preserve links if possible, or generate new ones.
      // Using setDoc with specific ID is better for consistency if IDs are good.
      const docRef = doc(dbInstance, COLLECTION, project.id);
      
      // Adapt static data to PortfolioItem structure if needed
      // staticProjects already has 'coverImage' and 'galleryImages'
      const coverImage = project.coverImage || '';
      const galleryImages = project.galleryImages || [];

      const data = {
        ...project,
        client: project.client || null, // Fix: Firestore doesn't accept undefined
        coverImage,
        galleryImages,
        projectDate: Timestamp.fromDate(new Date(project.projectDate)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      batch.set(docRef, data);
    });

    await batch.commit();
    console.log('Projects seeded successfully.');
  }
};
