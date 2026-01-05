import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Ghost, Skull, Heart } from 'lucide-react';

// Custom Pumpkin Icon (using SVG) - Authentic Jack-o'-lantern with Zigzag Smile
export const Pumpkin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Stem - Adjusted for wider body */}
    <path d="M12 4c0-2-1-3-3-3" />
    
    {/* Pumpkin Body - Wide & Oblong (Radio X=11, Y=8) */}
    <path d="M23 12c0 4.5-5 8-11 8s-11-3.5-11-8 5-8 11-8 11 3.5 11 8z" />
    
    {/* Ribs - Adjusted for wider shape */}
    <path d="M12 4v16" className="opacity-30" />
    <path d="M19 5c1 2 2 4 2 7s-1 5-2 7" className="opacity-30" />
    <path d="M5 5c-1 2-2 4-2 7s1 5 2 7" className="opacity-30" />

    {/* Triangular Eyes - Wider apart */}
    <path d="M7 11l-1.5 2h3z" fill="currentColor" className="opacity-80" />
    <path d="M17 11l-1.5 2h3z" fill="currentColor" className="opacity-80" />
    
    {/* Zigzag Mouth - Wider smile */}
    <path d="M6 16l1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5" />
  </svg>
);

interface FloatingIconProps {
    Icon: any;
    isHalloween: boolean;
    index: number;
    onExorcise?: () => void;
}

export const InteractiveFloatingIcon = ({ Icon, isHalloween, index, onExorcise }: FloatingIconProps) => {
    const [vanished, setVanished] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 }); 
    
    // VARIANT SELECTION (Fixed on mount to avoid hydration mismatch)
    const variantRef = React.useRef<'a' | 'b' | 'c'>('a');
    // EASTER EGG: 1 in ~33 chance (3%) to be Immortal (Retreat & Reappear) - True rarity
    const isImmortalRef = React.useRef(false);
    // Track mount status to prevent memory leaks on unmount
    const isMountedRef = React.useRef(true);

    useEffect(() => {
        return () => { isMountedRef.current = false; };
    }, []);

    useEffect(() => {
        // Randomly assign variant and immortality only on client
        const variants: ('a' | 'b' | 'c')[] = ['a', 'b', 'c'];
        variantRef.current = variants[Math.floor(Math.random() * variants.length)];
        isImmortalRef.current = Math.random() < 0.03; 

        setStyle({
            // Constrain positioning to 10-90% to avoid edge clipping (Design Purist)
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            width: isHalloween ? `${Math.random() * 60 + 40}px` : `${Math.random() * 40 + 20}px`,
            height: isHalloween ? `${Math.random() * 60 + 40}px` : `${Math.random() * 40 + 20}px`,
            animationDuration: isHalloween ? `${Math.random() * 10 + 20}s` : `${Math.random() * 15 + 10}s`,
            animationDelay: `-${Math.random() * 20}s`,
            opacity: 1 
        });
    }, [isHalloween]);

    const handleInteraction = () => {
        // COOLDOWN CHECK
        if (vanished || isAnimating) return;
        
        setIsAnimating(true);
        setVanished(true);
        
        // TRIGGER TEXT FEEDBACK
        if (onExorcise) onExorcise();

        // EASTER EGG LOGIC: If Immortal, reappear elsewhere
        if (isHalloween && isImmortalRef.current) {
            setTimeout(() => {
                if (!isMountedRef.current) return; // Prevent leak if unmounted
                
                // Reset position after retreat animation (1s)
                setStyle(prev => ({
                    ...prev,
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    // Slight change in size to mask the reset
                    width: `${Math.random() * 60 + 40}px`,
                }));
                setVanished(false);
                setIsAnimating(false);
            }, 1200); // Wait slightly longer than animation (1s)
        }
    };

    // Determine animation class based on variant
    const getAnimationClass = () => {
        if (!isHalloween) return "transition-all duration-700 ease-out transform opacity-0 scale-150 blur-[50px] pointer-events-none";
        
        if (isImmortalRef.current) return "animate-retreat"; // Special retreat animation
        
        switch (variantRef.current) {
            case 'b': return "animate-resist-b";
            case 'c': return "animate-resist-c";
            default: return "animate-resist-a";
        }
    };

    return (
        <div 
            className="absolute z-10" 
            style={style}
        >
             <div 
                className={cn(
                    vanished 
                        ? getAnimationClass()
                        : "transition-all duration-700 ease-out transform opacity-100 scale-100"
                )}
             >
                <div 
                    className={cn(
                        "pointer-events-auto cursor-crosshair p-24 -m-24 rounded-full", 
                        isHalloween ? "animate-ghost-wander" : "animate-float"
                    )}
                    onMouseEnter={handleInteraction}
                    onTouchStart={handleInteraction}
                >
                    <Icon 
                        strokeWidth={1.5}
                        className={cn(
                            "w-full h-full drop-shadow-[0_0_15px_rgba(255,100,0,0.2)]",
                            isHalloween
                                ? cn(
                                    index % 3 === 0 ? "text-orange-500/20 fill-orange-500/5" : 
                                    index % 3 === 1 ? "text-white/20 fill-white/5" :           
                                    "text-red-500/20 fill-red-500/5"                        
                                  ) 
                                : cn(
                                    (index % 2 === 0 ? "text-rose-400/20 fill-rose-400/10" : "text-primary/20 stroke-rose-300/30")
                                )
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
