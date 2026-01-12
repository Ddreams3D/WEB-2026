import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function TreeLayer({ position, scale, color = "#15803d" }: { position: [number, number, number], scale: number, color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
        // Subtle breathing effect
        const t = state.clock.getElapsedTime();
        meshRef.current.scale.x = scale + Math.sin(t * 2) * 0.02;
        meshRef.current.scale.z = scale + Math.sin(t * 2) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <coneGeometry args={[1, 1.5, 64]} /> 
      {/* Matte / Paper-like finish */}
      <meshStandardMaterial 
        color={color} 
        roughness={0.8}
        metalness={0.0}
        flatShading={false}
      />
    </mesh>
  );
}
