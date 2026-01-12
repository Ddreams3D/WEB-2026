import React, { useMemo } from 'react';
import { BlinkingLight } from './BlinkingLight';

export function TreeLights({ count = 120, colors = ['#fbbf24', '#ef4444', '#3b82f6', '#10b981', '#ffffff'] }) {
  const lights = useMemo(() => {
    const temp = [];
    const height = 3.3; // Taller to reach the top
    const startY = 0.3; // Start lower at the base
    const baseRadius = 2.2; // Much wider to clear the bottom branches (max tree radius ~1.8)
    const topRadius = 0.1;
    const loops = 7; // More loops

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const y = startY + t * height;
      
      // Linear interpolation for radius
      const currentRadius = baseRadius * (1 - t) + topRadius * t;
      
      const angle = t * loops * Math.PI * 2;
      const x = Math.cos(angle) * currentRadius;
      const z = Math.sin(angle) * currentRadius;

      temp.push({ 
          position: [x, y, z], 
          color: colors[i % colors.length],
          phase: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, [count, colors]);

  return (
    <group>
      {lights.map((light, i) => (
        <BlinkingLight 
            key={i} 
            position={light.position as any} 
            color={light.color} 
            phase={light.phase} 
        />
      ))}
    </group>
  );
}
