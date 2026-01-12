import React from 'react';
import { cn } from '@/lib/utils';
import { Ghost, Skull, Heart } from 'lucide-react';
import { InteractiveFloatingIcon, Pumpkin } from './InteractiveFloatingIcon';
import { SpookyEyes } from './SpookyEyes';

interface SeasonalAtmosphereProps {
    isHalloween: boolean;
    isValentines: boolean;
    isMothersDay: boolean;
    isChristmas: boolean;
    mounted: boolean;
    themeStyles: any;
    onExorcise: () => void;
}

export function SeasonalAtmosphere({
    isHalloween,
    isValentines,
    isMothersDay,
    isChristmas,
    mounted,
    themeStyles,
    onExorcise
}: SeasonalAtmosphereProps) {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Christmas Snow */}
            {isChristmas && mounted && (
                 <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full opacity-70 animate-fall"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-${Math.random() * 20}%`,
                                width: `${Math.random() * 4 + 2}px`,
                                height: `${Math.random() * 4 + 2}px`,
                                animationDuration: `${Math.random() * 5 + 5}s`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Halloween Atmosphere: Fog & Eyes */}
            {isHalloween && (
                <>
                    {/* Low Fog - Made more visible with brighter color */}
                    <div className="absolute bottom-0 left-0 w-[200%] h-[500px] bg-gradient-to-t from-orange-500/10 via-orange-900/5 to-transparent animate-fog z-0 pointer-events-none blur-3xl" />
                    
                    {/* Watching Eyes (Randomly placed with JS for variety) */}
                    {mounted && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                         {[...Array(2)].map((_, i) => (
                             <SpookyEyes key={i} />
                         ))}
                    </div>
                    )}
                </>
            )}

            {/* Gradient Orbs - Balanced 50/50 - Hidden for Halloween and Christmas */}
            {!isHalloween && !isChristmas && (
            <>
            <div className={cn(
                "absolute rounded-full opacity-25 animate-pulse-slow mix-blend-screen",
                // Default size/pos/blur
                "w-[900px] h-[900px] -top-[10%] -right-[10%] blur-[120px]",
                // Valentines/Mothers Day: Responsive sizing to prevent touching on small screens
                // Mobile: 300px, Tablet: 500px, Desktop: 800px
                (isValentines || isMothersDay) && "w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[800px] lg:h-[800px] -top-[5%] -right-[5%] blur-[60px] md:blur-[75px] lg:blur-[90px]",
                themeStyles.previewColors[0]
            )} />
            <div className={cn(
                "absolute rounded-full opacity-25 mix-blend-screen",
                "animate-pulse-slow delay-1000",
                // Default size/pos/blur
                "w-[900px] h-[900px] -bottom-[10%] -left-[10%] blur-[120px]",
                // Valentines/Mothers Day: Responsive sizing
                (isValentines || isMothersDay) && "w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[800px] lg:h-[800px] -bottom-[5%] -left-[5%] blur-[60px] md:blur-[75px] lg:blur-[90px]",
                themeStyles.previewColors[1] || themeStyles.previewColors[0]
            )} />
            </>
            )}
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" 
                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />

            {/* Floating Hearts/Ghosts */}
            {mounted && (isValentines || isMothersDay || isHalloween) && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {[...Array(isHalloween ? 20 : 8)].map((_, i) => {
                        // Halloween Icon Mix
                        const halloweenIcons = [Ghost, Skull, Pumpkin];
                        const Icon = isHalloween ? halloweenIcons[i % halloweenIcons.length] : Heart;
                        
                        return (
                            <InteractiveFloatingIcon 
                                key={i}
                                Icon={Icon}
                                isHalloween={isHalloween}
                                index={i}
                                onExorcise={onExorcise}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
