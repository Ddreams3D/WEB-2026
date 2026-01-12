'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HeartbeatLineProps {
  className?: string;
  color?: string;
  children?: React.ReactNode;
}

export function HeartbeatLine({ className, color = "#fb7185", children }: HeartbeatLineProps) {
  // Use a brighter version of the color for the light
  const glowColor = "#fff1f2"; // Rose-50

  // Path definition for 3 large, wide peaks
  // ViewBox 0 0 900 200
  // Peak 1: Center X ~175
  // Peak 2: Center X ~475
  // Peak 3: Center X ~775
  const pathData = "M0,100 L100,100 L150,20 L200,180 L250,100 L400,100 L450,20 L500,180 L550,100 L700,100 L750,20 L800,180 L850,100 L900,100";

  return (
    <div className={cn("w-full h-64 relative", className)}>
      
      {/* Images Layer - Rendered underneath the line but aligned with peaks */}
      <div className="absolute inset-0 z-10 flex items-start justify-between px-[8%] pt-4 pointer-events-auto">
         {/* Slot for 3 images passed as children */}
         {children}
      </div>

      {/* SVG Line Layer - On top */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">
        <svg
          viewBox="0 0 900 200"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="50%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            
            <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base Static Line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="3"
            className="opacity-40"
          />
          
          {/* Moving Light/Pulse */}
          <path
            d={pathData}
            fill="none"
            stroke={glowColor}
            strokeWidth="4"
            strokeLinecap="round"
            className="heartbeat-pulse"
            strokeDasharray="200 3000"
            strokeDashoffset="200"
            filter="url(#glow-strong)"
          />
        </svg>
      </div>

      <style jsx global>{`
        .heartbeat-pulse {
          animation: pulseTravel 12s linear infinite;
        }
        
        @keyframes pulseTravel {
          0% {
            stroke-dashoffset: 200;
          }
          100% {
            stroke-dashoffset: -2000;
          }
        }

        /* 
           Image Scale Animation synchronized with the pulse 
           Total duration: 12s
           
           Target Times (Linear Calculation):
           - Peak 1: ~1.6s
           - Peak 2: ~4.4s
           - Peak 3: ~7.1s
           
           PulseScale Peak is at 50% (6s).
           Delays calculated as: TargetTime - 6s
        */
        @keyframes pulseScale {
          0%, 25%, 75%, 100% { 
            transform: scale(1); 
            z-index: 10; 
            box-shadow: 0 0 15px rgba(225, 29, 72, 0.2); 
            border-color: rgba(225, 29, 72, 0.5);
          }
          50% { 
            transform: scale(1.35); /* Much smoother scale */
            z-index: 50; 
            box-shadow: 0 0 60px rgba(225, 29, 72, 0.5); /* Softer, wider glow */
            border-color: rgba(255, 241, 242, 0.9); 
          }
        }

        .animate-pulse-scale-1 {
          animation: pulseScale 12s cubic-bezier(0.4, 0, 0.6, 1) infinite; /* Soft ease for the scaling effect */
          animation-delay: -4.4s;
        }

        .animate-pulse-scale-2 {
          animation: pulseScale 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: -1.6s;
        }

        .animate-pulse-scale-3 {
          animation: pulseScale 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 1.1s;
        }
      `}</style>
    </div>
  );
}
