import React, { useEffect, useState } from 'react';

// Spooky Eyes Component (Simple blinking red eyes)
export const SpookyEyes = () => {
    const [style, setStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        // Random positioning and delay
        setStyle({
            top: `${20 + Math.random() * 60}%`, 
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 5}s`,
            transform: `scale(${0.8 + Math.random() * 0.5})`,
            opacity: 0.8
        });
    }, []);

    return (
         <div 
            className="absolute animate-blink pointer-events-none p-4"
            style={style}
         >
             <div className="flex gap-3">
                 {/* Left Eye */}
                 <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600 shadow-[0_0_15px_rgba(255,0,0,1)] animate-pulse" />
                 {/* Right Eye */}
                 <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600 shadow-[0_0_15px_rgba(255,0,0,1)] animate-pulse" />
             </div>
         </div>
    );
};
