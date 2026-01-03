import React from 'react';
import DefaultImage from '@/shared/components/ui/DefaultImage';
import { Eye } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PortfolioItem } from '@/shared/types/domain';

interface GalleryCardProps {
  project: PortfolioItem;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function GalleryCard({ project, onClick, className, style }: GalleryCardProps) {
  return (
    <article
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white dark:bg-neutral-900 transition-all duration-300 cursor-pointer",
        "border-neutral-200 dark:border-neutral-800",
        "shadow-sm hover:shadow-xl",
        className
      )}
      style={style}
    >
      {/* Project Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <DefaultImage
          src={project.coverImage}
          alt={project.title}
          fill
          className={cn(
            "object-cover transition-transform duration-700 will-change-transform group-hover:scale-110",
            "object-center" // Default position
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800">
            {project.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4">
          {project.description}
        </p>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          variant="outline"
          className="w-full justify-between group/btn hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
        >
          Ver proyecto
          <Eye className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </article>
  );
}
