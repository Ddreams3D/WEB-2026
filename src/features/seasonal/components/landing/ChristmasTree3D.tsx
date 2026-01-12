'use client';

import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment,
  ContactShadows,
} from '@react-three/drei';
import { Scene } from './tree/TreeScene';

interface ChristmasTree3DProps {
  images: string[];
  className?: string;
  logoColor?: string;
}

export function ChristmasTree3D({ images, className, logoColor = "#fbbf24" }: ChristmasTree3DProps) {
  return (
    <div className={`w-full h-[500px] md:h-[600px] ${className}`}>
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 9], fov: 45 }}
        dpr={[1, 2]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Allow degrading quality on slow devices
      >
        {/* Soft, magical atmosphere */}
        <Environment preset="city" blur={1} />
        
        {/* Soft Contact Shadows - Optimized */}
        <ContactShadows 
            position={[0, -2.0, 0]} 
            opacity={0.3} 
            scale={10} 
            blur={3} 
            far={4}
            resolution={512}
        />

        {/* Ambient Light for base visibility */}
        <ambientLight intensity={1.5} color="#ffffff" />
        
        {/* Main Light - Warmer and softer */}
        <spotLight 
            position={[5, 8, 5]} 
            angle={0.6} 
            penumbra={1} 
            intensity={1.5} 
            color="#fff7ed"
            castShadow 
            shadow-bias={-0.0001}
        />

        {/* Fill Light - Very soft */}
        <pointLight position={[-5, 2, 5]} intensity={0.5} color="#fbbf24" distance={10} />
        
        {/* Controls: Replaced PresentationControls with OrbitControls for stability */}
        <OrbitControls 
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3} // Don't go too high
            maxPolarAngle={Math.PI / 1.8} // Don't go too low (ground)
            minAzimuthAngle={-Math.PI / 2}
            maxAzimuthAngle={Math.PI / 2}
            rotateSpeed={0.5}
            autoRotate
            autoRotateSpeed={0.5}
        />
        
        <Scene images={images} logoColor={logoColor} />
        
      </Canvas>
    </div>
  );
}
