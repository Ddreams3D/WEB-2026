import { useState, useEffect } from 'react';
import { PortfolioItem } from '@/shared/types/domain';
import { ProjectService } from '@/services/project.service';

export interface ProjectsOptions {
  category?: string;
  isFeatured?: boolean;
  limit?: number;
  skip?: boolean; // Added to skip fetching
}

export function useProjects(options?: ProjectsOptions) {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(!options?.skip);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (options?.skip) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        
        let allProjects: PortfolioItem[] = [];

        if (options?.isFeatured) {
          allProjects = await ProjectService.getFeaturedProjects(options.limit);
          if (options.category) {
            allProjects = allProjects.filter(p => p.category === options.category);
          }
        } else if (options?.category) {
          allProjects = await ProjectService.getProjectsByCategory(options.category, options.limit);
        } else {
          allProjects = await ProjectService.getAllProjects();
        }

        if (options?.limit) {
          allProjects = allProjects.slice(0, options.limit);
        }

        if (isMounted) {
          setProjects(allProjects);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error loading projects'));
          console.error('Error loading projects:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [options?.category, options?.isFeatured, options?.limit, options?.skip]);

  return { projects, isLoading, error };
}
