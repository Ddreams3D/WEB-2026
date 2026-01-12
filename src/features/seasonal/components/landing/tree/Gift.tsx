import React from 'react';

export function Gift({ position, color, size = [0.4, 0.4, 0.4], rotation = [0, 0, 0] }: { position: [number, number, number], color: string, size?: [number, number, number], rotation?: [number, number, number] }) {
  const [width, height, depth] = size as [number, number, number];
  
  return (
    <group position={position} rotation={rotation as any}>
      {/* Box */}
      <mesh castShadow>
        <boxGeometry args={size as any} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      
      {/* Vertical Ribbon */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width * 1.02, height, depth * 0.2]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </mesh>
      
      {/* Horizontal Ribbon */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width * 0.2, height, depth * 1.02]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </mesh>

      {/* Bow */}
      <mesh position={[0, height/2, 0]}>
         <sphereGeometry args={[width * 0.2, 16, 16]} />
         <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </mesh>
    </group>
  );
}
