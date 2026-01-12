import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import { IsotypeLogo } from '@/components/ui';
import * as THREE from 'three';

export function LogoTopper({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
        // Rotate the star/logo
        groupRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 3.8, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <pointLight color={color} intensity={2} distance={3} decay={2} />
            <Html center transform distanceFactor={6} style={{ pointerEvents: 'none' }}>
                    <div className="relative flex items-center justify-center pt-4" style={{ transform: 'translateX(-3px)' }}>
                        <IsotypeLogo className="w-16 h-16" primaryColor={color} />
                    </div>
            </Html>
        </Float>
    </group>
  );
}
