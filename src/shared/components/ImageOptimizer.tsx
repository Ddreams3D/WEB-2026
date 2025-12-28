'use client';

import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ImageOptimizerProps extends ImageProps {
  className?: string;
}

export default function ImageOptimizer({ className, alt, ...props }: ImageOptimizerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        {...props}
        alt={alt}
        className={cn(
          "duration-700 ease-in-out",
          isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
          className
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
