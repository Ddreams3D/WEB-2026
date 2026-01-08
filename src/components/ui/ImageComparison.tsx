'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MoveHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  primaryColor?: string;
}

export function ImageComparison({
  beforeImage,
  afterImage,
  beforeLabel = "Real",
  afterLabel = "Modelo 3D",
  className,
  primaryColor = "#ffffff"
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };
  
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  const handleMouseLeave = () => {
    if (!isDragging) {
      setSliderPosition(50);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden select-none cursor-ew-resize group touch-none", className)}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image (Right Side - e.g. 3D Model) */}
      <div className="absolute inset-0 w-full h-full">
         <Image
            src={afterImage}
            alt={afterLabel}
            fill
            className="object-cover"
            priority
         />
         {/* Label */}
         <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 z-10 pointer-events-none">
            {afterLabel}
         </div>
      </div>

      {/* Foreground Image (Left Side - e.g. Real Object) - Clipped */}
      <div 
        className={cn(
          "absolute inset-0 w-full h-full ease-out",
          isDragging ? "transition-none" : "transition-[clip-path] duration-300"
        )}
        style={{ 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` 
        }}
      >
        <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            className="object-cover"
            priority
        />
        {/* Label */}
        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 z-10 pointer-events-none">
            {beforeLabel}
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className={cn(
          "absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)] ease-out",
          isDragging ? "transition-none" : "transition-[left] duration-300"
        )}
        style={{ 
            left: `${sliderPosition}%`,
            backgroundColor: primaryColor 
        }}
      >
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center border-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
        >
            <MoveHorizontal size={16} />
        </div>
      </div>
    </div>
  );
}
