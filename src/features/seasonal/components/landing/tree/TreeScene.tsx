import React from 'react';
import { Sparkles } from '@react-three/drei';
import { TreeLayer } from './TreeLayer';
import { Ornament } from './Ornament';
import { LogoTopper } from './LogoTopper';
import { Gift } from './Gift';
import { TreeLights } from './TreeLights';
import { ProductCards } from './ProductCards';

export function Scene({ images, logoColor }: { images: string[], logoColor: string }) {
    // Fallback images if needed
    const safeImages = images.length > 0 ? images : [
        "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=2074&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?q=80&w=1974&auto=format&fit=crop"
    ];

    return (
        <group position={[0, -1.5, 0]}>
            {/* Trunk */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
                <meshStandardMaterial color="#451a03" />
            </mesh>

            {/* Tree Layers (Stacked Cones) */}
            <TreeLayer position={[0, 1.2, 0]} scale={1.8} />
            <TreeLayer position={[0, 2.0, 0]} scale={1.4} />
            <TreeLayer position={[0, 2.7, 0]} scale={1.0} />

            {/* Floating Product Cards */}
            <ProductCards images={safeImages} />

            {/* Ornaments - Manually placed for aesthetics */}
            <Ornament position={[0.6, 1.2, 0.6]} color="red" textureUrl={safeImages[0]} />
            <Ornament position={[-0.5, 1.5, 0.5]} color="gold" textureUrl={safeImages[1]} />
            <Ornament position={[0.2, 2.2, 0.4]} color="blue" textureUrl={safeImages[2]} />
            <Ornament position={[-0.4, 1.0, -0.5]} color="purple" textureUrl={safeImages[3] || safeImages[0]} />
            <Ornament position={[0.5, 1.8, -0.4]} color="red" size={0.12} />
            <Ornament position={[-0.2, 2.5, 0.3]} color="gold" size={0.12} />
            
            {/* Topper */}
            <LogoTopper color={logoColor} />

            {/* Gifts */}
            {/* Front Group */}
            <Gift position={[0.8, 0.2, 0.5]} color="#ef4444" rotation={[0, 0.2, 0]} />
            <Gift position={[-0.7, 0.2, 0.4]} color="#3b82f6" size={[0.5, 0.3, 0.5]} rotation={[0, -0.2, 0]} />
            <Gift position={[0.2, 0.2, 0.8]} color="#10b981" size={[0.3, 0.6, 0.3]} rotation={[0, 0.1, 0]} />
            
            {/* Side & Back Group (New) */}
            <Gift position={[-0.9, 0.2, -0.2]} color="#8b5cf6" size={[0.4, 0.4, 0.4]} rotation={[0, 0.5, 0]} /> {/* Purple Left */}
            <Gift position={[0.6, 0.2, -0.6]} color="#f59e0b" size={[0.35, 0.35, 0.35]} rotation={[0, -0.4, 0]} /> {/* Gold Back Right */}
            <Gift position={[-0.4, 0.2, -0.7]} color="#ec4899" size={[0.45, 0.3, 0.45]} rotation={[0, 0.8, 0]} /> {/* Pink Back Left */}
            <Gift position={[1.0, 0.15, -0.1]} color="#06b6d4" size={[0.25, 0.25, 0.25]} rotation={[0, 0.3, 0]} /> {/* Cyan Tiny Right */}
            <Gift position={[-0.2, 0.2, 0.9]} color="#f43f5e" size={[0.3, 0.3, 0.3]} rotation={[0, -0.1, 0]} /> {/* Rose Front Center */}

            {/* Lights */}
            <TreeLights count={90} />
            <Sparkles count={50} scale={4} size={4} speed={0.4} opacity={0.5} color="#fbbf24" position={[0, 2, 0]} />
        </group>
    );
}
