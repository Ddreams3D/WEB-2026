import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ className, size = 'md', ...props }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={cn('animate-spin rounded-full border-t-2 border-b-2 border-primary', sizeClasses[size], className)}
      {...props}
    />
  );
};

export default LoadingSpinner;
