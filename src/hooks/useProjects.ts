import { useState, useEffect } from 'react';
import { PortfolioItem } from '@/shared/types/domain';
import { ProjectService } from '@/services/project.service';

export interface ProjectsOptions {
  category?: string;
  isFeatured?: boolean;
  limit?: number;
}

export function useProjects(options?: ProjectsOptions) {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        
        let allProjects = await ProjectService.getAllProjects();

        // Apply filters
        if (options?.category) {
          allProjects = allProjects.filter(p => p.category === options.category);
        }

        if (options?.isFeatured) {
          allProjects = allProjects.filter(p => p.isFeatured);
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
  }, [options?.category, options?.isFeatured, options?.limit]);

  return { projects, isLoading, error };
}
