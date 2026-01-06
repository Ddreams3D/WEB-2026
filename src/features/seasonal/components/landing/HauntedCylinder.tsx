import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HauntedCylinderProps {
    images: string[];
}

export const HauntedCylinder: React.FC<HauntedCylinderProps> = ({ images }) => {
    // Ensure we have enough items for a nice cylinder. 
    // If less than 6, we duplicate to form a circle.
    // If empty, return null or placeholder.
    if (!images || images.length === 0) return null;

    let displayImages = [...images];
    // Aim for at least 8 items for a good cylinder shape
    while (displayImages.length < 8) {
        displayImages = [...displayImages, ...images];
    }
    // Cap at 16 to avoid performance issues if someone uploads 1 but logic goes wrong, 
    // though with the while loop it will just reach >= 8.
    // If input is large (e.g. 10 images), it stays 10.
    
    const finalCount = displayImages.length;
    const itemWidth = 250; // Width of container
    // Calculate radius to arrange items in a circle without overlapping too much
    // Circumference ~ itemWidth * count (with some gap)
    // r = C / 2pi
    // Or precise chord formula: r = (w / 2) / tan(pi / n)
    // We add some gap to itemWidth in calculation
    const gap = 20;
    const effectiveWidth = itemWidth + gap;
    const radius = Math.round((effectiveWidth / 2) / Math.tan(Math.PI / finalCount));

    const DURATION = 120; // Extremely slow (120s) for maximum suspense

    // Generate random particles for atmosphere
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        size: Math.random() * 4 + 1,
    }));

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden" style={{ perspective: '1200px' }}>
            
            {/* Atmosphere: Floating Dust/Spirit Particles */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {particles.map(p => (
                    <div 
                        key={p.id}
                        className="absolute bg-orange-500/30 rounded-full blur-[1px]"
                        style={{
                            left: p.left,
                            bottom: '-10px',
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            animation: `particle-float ${4 + Math.random() * 4}s linear infinite`,
                            animationDelay: p.animationDelay
                        }}
                    />
                ))}
            </div>

            <div 
                className="relative w-[250px] h-[350px] z-20"
                style={{ 
                    transformStyle: 'preserve-3d',
                    animation: `cylinder-spin ${DURATION}s linear infinite`,
                }}
            >
                {displayImages.map((src, index) => {
                    const angle = (360 / finalCount) * index;
                    // Sync delay so 0deg (Front) is at 0% animation progress
                    const delay = - (angle / 360) * DURATION;

                    return (
                        <div
                            key={index}
                            className="absolute inset-0"
                            style={{
                                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                backfaceVisibility: 'hidden', // Ensure back items are strictly hidden
                            }}
                        >
                            <div className={cn(
                                "w-full h-full relative transition-transform hover:scale-110 duration-500",
                                // Combined animations: Float (independent) + FadeSpin (synced)
                                // Note: We apply fade-spin here to the inner container
                            )}
                            style={{
                                animation: `fade-spin ${DURATION}s linear infinite`,
                                animationDelay: `${delay}s`
                            }}
                            >
                                <div className="w-full h-full animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                                    <Image 
                                        src={src}
                                        alt="Haunted Product"
                                        fill
                                        className="object-contain drop-shadow-[0_0_25px_rgba(255,100,0,0.6)]"
                                        sizes="(max-width: 768px) 100vw, 250px"
                                    />
                                    {/* Ghostly aura removed to avoid "visible box" artifact */}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Fog Overlay at the bottom to blend "background" */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        </div>
    );
};
