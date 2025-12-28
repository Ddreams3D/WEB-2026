import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';

interface InfoCardProps {
  title: string;
  description: string | React.ReactNode;
  icon: LucideIcon;
  className?: string;
  index?: number;
}

export default function InfoCard({ title, description, icon: Icon, className, index = 0 }: InfoCardProps) {
  return (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-xl p-8 transition-all duration-300",
        "bg-white dark:bg-neutral-900",
        "border border-neutral-100 dark:border-white/10",
        "hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-none",
        className
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background Gradient Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary-50/50 via-transparent to-transparent dark:from-primary-900/10 dark:via-transparent dark:to-transparent pointer-events-none" />
      
      {/* Top Accent Line (Optional, subtle) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Icon + Title */}
        <div className="mb-6">
          <div className="mb-6 inline-flex">
            <Icon 
              className="h-10 w-10 text-primary-600 dark:text-primary-400 transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 drop-shadow-sm" 
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 tracking-tight">
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed font-medium">
            {description}
          </div>
        </div>

        {/* Bottom Expandable Line */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500 ease-out w-0 group-hover:w-full" />
      </div>
    </div>
  );
}
