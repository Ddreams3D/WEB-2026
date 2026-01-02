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
  Timestamp,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PortfolioItem } from '@/shared/types/domain';
import { projects as staticProjects } from '@/data/projects.data';

const COLLECTION = 'projects';

// Helper to convert Firestore data to PortfolioItem
const convertDoc = (doc: any): PortfolioItem => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    projectDate: data.projectDate instanceof Timestamp ? data.projectDate.toDate() : new Date(data.projectDate),
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
  } as PortfolioItem;
};

export const ProjectService = {
  async getAllProjects(): Promise<PortfolioItem[]> {
    try {
      const q = query(collection(db, COLLECTION), orderBy('projectDate', 'desc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // If no projects in Firestore, return static data
        // This ensures the site works before migration
        // However, for Admin purposes, we might want to trigger migration.
        // For now, return static data mapped to have IDs if they don't have one (though they do)
        console.warn('No projects in Firestore, returning static data.');
        return staticProjects as unknown as PortfolioItem[];
      }

      return snapshot.docs.map(convertDoc);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback to static data on error
      return staticProjects as unknown as PortfolioItem[];
    }
  },

  async getProjectById(idOrSlug: string): Promise<PortfolioItem | undefined> {
    try {
      // Try fetching by ID first
      const docRef = doc(db, COLLECTION, idOrSlug);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertDoc(docSnap);
      }

      // If not found by ID, try finding by slug
      // Note: This requires scanning all or adding a query. 
      // Since we fetch all often, let's reuse getAllProjects for slug search to minimize indexes for now
      // or add a specific query.
      const q = query(collection(db, COLLECTION), where('slug', '==', idOrSlug));
      // 'where' needs import. 
      const querySnapshot = await getDocs(query(collection(db, COLLECTION)));
      const found = querySnapshot.docs.find(d => d.data().slug === idOrSlug);
      
      if (found) return convertDoc(found);

      // Fallback to static
      return (staticProjects as unknown as PortfolioItem[]).find(p => p.id === idOrSlug || p.slug === idOrSlug);
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      return (staticProjects as unknown as PortfolioItem[]).find(p => p.id === idOrSlug || p.slug === idOrSlug);
    }
  },

  async getFeaturedProjects(): Promise<PortfolioItem[]> {
    const allProjects = await this.getAllProjects();
    return allProjects.filter(p => p.isFeatured);
  },

  async getProjectsByCategory(category: string): Promise<PortfolioItem[]> {
    const allProjects = await this.getAllProjects();
    return allProjects.filter(p => p.category === category);
  },

  // Admin Methods
  async createProject(project: Omit<PortfolioItem, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...project,
      createdAt: Timestamp.now(),
      projectDate: Timestamp.fromDate(project.projectDate)
    });
    return docRef.id;
  },

  async updateProject(id: string, data: Partial<PortfolioItem>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    const updateData: any = { ...data };
    if (data.projectDate) {
      updateData.projectDate = Timestamp.fromDate(data.projectDate);
    }
    // Remove id from data if present
    delete updateData.id;
    
    await updateDoc(docRef, updateData);
  },

  async deleteProject(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },

  // Migration Tool
  async checkMigrationNeeded(): Promise<boolean> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.empty;
  },

  async seedProjectsFromStatic(force = false): Promise<void> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    if (!snapshot.empty && !force) {
      console.log('Projects collection is not empty. Skipping seed.');
      return;
    }

    const batch = writeBatch(db);
    
    staticProjects.forEach((project) => {
      // Create a new doc reference. 
      // We can use the existing ID if it's compatible or let Firestore generate one.
      // staticProjects items have 'id' (e.g. '1', '2'). Firestore IDs usually are strings.
      // Let's use the existing ID to preserve links if possible, or generate new ones.
      // Using setDoc with specific ID is better for consistency if IDs are good.
      const docRef = doc(db, COLLECTION, project.id);
      
      // Adapt static data to PortfolioItem structure if needed
      // staticProjects has 'images' (string[]), PortfolioItem has 'coverImage' + 'galleryImages'
      const images = (project as any).images || [];
      const coverImage = images.length > 0 ? images[0] : '';
      const galleryImages = images.slice(1);

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
