import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BlinkingLight({ position, color, phase }: { position: [number, number, number], color: string, phase: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
        const t = state.clock.getElapsedTime();
        // Blink based on phase
        const intensity = Math.sin(t * 3 + phase) * 0.5 + 0.5;
        (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity * 3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
      <pointLight color={color} distance={0.8} intensity={0.8} decay={1} />
    </mesh>
  );
}
