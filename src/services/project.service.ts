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
  async getAllProjects(): Promise<PortfolioItem[]> {
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

      const projects = snapshot.docs.map(convertDoc);
      // Sort in memory to avoid index issues
      return projects.sort((a, b) => b.projectDate.getTime() - a.projectDate.getTime());
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback to static data on error
      return staticProjects as unknown as PortfolioItem[];
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
        return convertDoc(docSnap);
      }

      // If not found by ID, try finding by slug
      // Note: This requires scanning all or adding a query. 
      // Since we fetch all often, let's reuse getAllProjects for slug search to minimize indexes for now
      // or add a specific query.
      const q = query(collection(dbInstance, COLLECTION), where('slug', '==', idOrSlug));
      // 'where' needs import. 
      const querySnapshot = await getDocs(q);
      const found = querySnapshot.docs.find(d => d.data().slug === idOrSlug);
      
      if (found) return convertDoc(found);

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
        const projects = snapshot.docs.map(convertDoc);
        return projects.sort((a, b) => b.projectDate.getTime() - a.projectDate.getTime());
      }

      return [];

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
        const projects = snapshot.docs.map(convertDoc);
        return projects.sort((a, b) => b.projectDate.getTime() - a.projectDate.getTime());
      }

      return [];
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
