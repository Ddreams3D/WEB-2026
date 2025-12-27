'use client';

import React from 'react';
import ImageOptimizer from './ImageOptimizer';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';

interface PageHeaderProps {
  title: string;
  description: string;
  image: string;
}

export default function PageHeader({ title, description, image }: PageHeaderProps) {
  return (
    <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden pt-20">
      <div className="absolute inset-0 bg-black/60 z-10" />
      {/* Top Gradient to blend with Navbar - Matching Hero style */}
      <div className={cn("absolute top-0 left-0 w-full h-40 z-20 pointer-events-none", colors.gradients.heroTopOverlay)} />
      {/* Bottom fade - Matching Hero style */}
      <div className={cn("absolute bottom-0 left-0 w-full h-24 z-20 pointer-events-none", colors.gradients.overlayFadeUp)} />
      
      <ImageOptimizer
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg leading-tight text-white">
            {title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 font-light leading-relaxed drop-shadow-md">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
