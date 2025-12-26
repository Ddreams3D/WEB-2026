'use client';

import React from 'react';
import ImageOptimizer from './ImageOptimizer';

interface PageHeaderProps {
  title: string;
  description: string;
  image: string;
}

export default function PageHeader({ title, description, image }: PageHeaderProps) {
  return (
    <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden pt-20">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <ImageOptimizer
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-200">{description}</p>
        </div>
      </div>
    </div>
  );
}