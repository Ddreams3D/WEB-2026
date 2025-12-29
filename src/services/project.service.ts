import { PortfolioItem } from '@/shared/types/domain';
import { projects } from '@/data/projects.data';

let projectsCache: { data: PortfolioItem[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const ProjectService = {
  async getAllProjects(): Promise<PortfolioItem[]> {
    // Check cache
    if (projectsCache && (Date.now() - projectsCache.timestamp < CACHE_DURATION)) {
      return projectsCache.data;
    }

    // Simulate API delay if needed, or just return data
    // In a real app, this would fetch from an API
    const sortedProjects = [...projects].sort((a, b) => 
      new Date(b.projectDate).getTime() - new Date(a.projectDate).getTime()
    );

    // Update cache
    projectsCache = {
      data: sortedProjects,
      timestamp: Date.now()
    };

    return sortedProjects;
  },

  async getProjectById(idOrSlug: string): Promise<PortfolioItem | undefined> {
    const allProjects = await this.getAllProjects();
    return allProjects.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  },

  async getFeaturedProjects(): Promise<PortfolioItem[]> {
    const allProjects = await this.getAllProjects();
    return allProjects.filter(p => p.isFeatured);
  },

  async getProjectsByCategory(category: string): Promise<PortfolioItem[]> {
    const allProjects = await this.getAllProjects();
    return allProjects.filter(p => p.category === category);
  }
};
