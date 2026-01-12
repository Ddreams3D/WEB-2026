import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const FALLBACK_TEXTURE_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/WhZ6wAAAABJRU5ErkJggg==';

export function Ornament({ position, color, textureUrl, size = 0.15 }: { position: [number, number, number], color: string, textureUrl?: string, size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Always call useLoader. If textureUrl is missing, use a tiny 1x1 transparent/fallback image.
  const texture = useLoader(THREE.TextureLoader, textureUrl ?? FALLBACK_TEXTURE_URL);
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2}>
      <mesh ref={meshRef} position={position} castShadow>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
            color={textureUrl ? "white" : color} 
            map={textureUrl ? texture : null}
            roughness={0.5} 
            metalness={0.2} 
            envMapIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}
