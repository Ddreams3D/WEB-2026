import React from 'react';
import { Html } from '@react-three/drei';
import NextImage from 'next/image';

interface ProductCardsProps {
  images: string[];
  radius?: number;
}

export function ProductCards({ images, radius = 2.5 }: ProductCardsProps) {
  if (!images || images.length === 0) return null;

  // Limit to 3 images for a cleaner look
  const displayImages = images.slice(0, 3); 
  
  return (
    <group rotation={[0, 0, 0]}> 
         {displayImages.map((img, i) => {
            // Position in a semi-circle in front of the tree
            const angle = (i - (displayImages.length - 1) / 2) * 0.8; // Spread out slightly
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius * 0.8;
            const y = 0.5; // Lower down

            return (
                <ProductCard key={i} position={[x, y, z]} image={img} />
            );
         })}
    </group>
  );
}

function ProductCard({ position, image }: { position: [number, number, number], image: string }) {
    return (
        <group position={position}>
            <Html transform distanceFactor={6} center>
                <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
                    <div className="w-32 h-24 bg-white p-1 shadow-lg rounded-md overflow-hidden border border-gray-200 relative">
                        <NextImage 
                            src={image} 
                            alt="Product" 
                            fill
                            className="object-cover rounded-sm"
                            sizes="128px"
                        />
                    </div>
                </div>
            </Html>
        </group>
    )
}
