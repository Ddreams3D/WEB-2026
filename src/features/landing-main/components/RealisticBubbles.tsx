'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  wobbleAmplitude: number;
  shouldPop: boolean;
  popAt: number; // 0-1 percentage of ascent where it pops
  image?: string; // Optional image URL
}

interface Props {
  productImages?: string[];
}

export const RealisticBubbles = ({ productImages = [] }: Props) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Create a static set of bubbles that loop
    // To make it look continuous, we use negative delays and long durations
    const totalBubbles = 25;
    const maxImages = 5;
    let imagesAssigned = 0;

    const newBubbles = Array.from({ length: totalBubbles }).map((_, i) => {
      // Determine if this bubble should have an image
      // Only assign if we have images, haven't reached max, and random chance hits
      const hasImage = productImages.length > 0 && imagesAssigned < maxImages && Math.random() > 0.7;
      
      if (hasImage) {
        imagesAssigned++;
      }

      return {
        id: i,
        size: hasImage ? Math.random() * 100 + 150 : Math.random() * 80 + 40, // Image bubbles are larger (150-250px)
        // If it has an image, constrain to right half (50-90%)
        // Otherwise use full width (0-100%)
        left: hasImage ? Math.random() * 40 + 50 : Math.random() * 100, 
        duration: hasImage ? Math.random() * 20 + 25 : Math.random() * 15 + 10, // Image bubbles are much slower (25-45s)
        delay: Math.random() * -40, // Longer negative delay for spread
        wobbleAmplitude: hasImage ? Math.random() * 5 + 2 : Math.random() * 40 + 20, // Minimal wobble for images
        shouldPop: hasImage ? false : Math.random() > 0.95, // Image bubbles NEVER pop
        popAt: Math.random() * 0.4 + 0.5, // Pop between 50% and 90% of height
        image: hasImage ? productImages[Math.floor(Math.random() * productImages.length)] : undefined
      };
    });
      setBubbles(newBubbles);
    }, [productImages]);

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <style jsx>{`
          @keyframes rise {
            0% {
              transform: translateY(100vh) translateX(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            95% {
              opacity: 1;
            }
            100% {
              transform: translateY(-120vh) translateX(var(--wobble-end));
              opacity: 0;
            }
          }

          @keyframes riseSlowFade {
            0% {
              transform: translateY(110vh) translateX(0);
              opacity: 0;
            }
            15% {
              opacity: 1;
            }
            85% {
              opacity: 1;
            }
            100% {
              transform: translateY(-20vh) translateX(var(--wobble-end)); /* End earlier or higher? */
              /* Actually user wants them to float up, so translate Y needs to go up */
              transform: translateY(-120vh) translateX(var(--wobble-end));
              opacity: 0;
            }
          }

        @keyframes riseAndPop {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          95% {
            transform: translateY(var(--pop-height)) translateX(var(--wobble-at-pop));
            opacity: 1;
            scale: 1;
          }
          100% {
            transform: translateY(var(--pop-height)) translateX(var(--wobble-at-pop));
            opacity: 0;
            scale: 1.5;
          }
        }

        @keyframes wobble {
          0%, 100% { margin-left: -10px; }
          50% { margin-left: 10px; }
        }

        .realistic-bubble {
          position: absolute;
          bottom: -250px; /* Start further below for large bubbles */
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 70%);
          box-shadow: 
            inset 0 0 10px rgba(255, 255, 255, 0.4),
            inset 2px 2px 5px rgba(255, 255, 255, 0.3),
            0 0 15px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(0.5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          will-change: transform, opacity;
          overflow: hidden; /* Important for images */
        }

        .realistic-bubble.with-image {
           /* Sombra interna sutil para efecto de suspensión */
           box-shadow: 
             inset 0 0 20px rgba(0, 0, 0, 0.05), /* Sombra suave interna */
             inset 0 0 10px rgba(255, 255, 255, 0.3), /* Brillo borde */
             0 4px 20px rgba(0, 0, 0, 0.05); /* Sombra externa suave */
           border: 1px solid rgba(255, 255, 255, 0.3);
           background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02) 60%, rgba(255, 255, 255, 0) 80%);
        }

        .realistic-bubble img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 12%; /* Un poco más de padding para que flote en el centro */
            opacity: 0.95;
            filter: drop-shadow(0 8px 12px rgba(0,0,0,0.15)); /* Sombra del producto flotando */
            transition: transform 0.5s ease;
        }

        .realistic-bubble::before {
          content: '';
          position: absolute;
          top: 15%;
          left: 18%;
          width: 25%;
          height: 15%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%);
          transform: rotate(45deg);
          filter: blur(0.5px);
          pointer-events: none;
          z-index: 20; /* Ensure reflection is above image */
        }

        .realistic-bubble::after {
          content: '';
          position: absolute;
          bottom: 15%;
          right: 18%;
          width: 15%;
          height: 10%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
          transform: rotate(45deg);
          filter: blur(1px);
          pointer-events: none;
          z-index: 20;
        }
      `}</style>
      
      {bubbles.map((bubble) => {
        // Calculate dynamic styles
        const wobbleEnd = bubble.shouldPop ? bubble.wobbleAmplitude * bubble.popAt : bubble.wobbleAmplitude;
        const popHeight = `${100 - (bubble.popAt * 120)}vh`; // Approximate conversion
        const isImage = !!bubble.image;

        return (
          <div
            key={bubble.id}
            className={cn("realistic-bubble", isImage && "with-image")}
            style={{
              left: `${bubble.left}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animationName: bubble.shouldPop ? 'riseAndPop' : (isImage ? 'riseSlowFade' : 'rise'),
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              '--wobble-end': `${Math.random() > 0.5 ? '' : '-'}${bubble.wobbleAmplitude}px`,
              '--pop-height': popHeight,
              '--wobble-at-pop': `${Math.random() > 0.5 ? '' : '-'}${bubble.wobbleAmplitude * 0.5}px`
            } as React.CSSProperties}
          >
            {/* Image Content */}
            {bubble.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bubble.image} alt="Producto 3D" className="absolute inset-0 z-0" />
            )}

            {/* Inner Wobble Effect */}
            <div 
              className="w-full h-full animate-pulse absolute inset-0 z-10 pointer-events-none" 
              style={{ 
                animationDuration: '3s',
                animationDelay: `${Math.random() * -5}s`
              }} 
            />
          </div>
        );
      })}
    </div>
  );
};
