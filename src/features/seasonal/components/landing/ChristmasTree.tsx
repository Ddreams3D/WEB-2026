import Image from 'next/image';
import { cn } from '@/lib/utils';
import { IsotypeLogo } from '@/components/ui';

interface ChristmasTreeProps {
  images: string[];
  className?: string;
}

export function ChristmasTree({ images, className }: ChristmasTreeProps) {
  // Ensure we have enough images or fallback
  const safeImages = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=2074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?q=80&w=1974&auto=format&fit=crop"
  ];

  const getImg = (idx: number) => safeImages[idx % safeImages.length];

  return (
    <div className={cn("relative w-full max-w-[600px] aspect-[4/5] flex flex-col items-center justify-end perspective-1000", className)}>
      
      {/* Tree Container */}
      <div className="relative w-full h-[95%] flex flex-col items-center filter drop-shadow-2xl">
        
        {/* Topper - Logo (Floating & Glowing) */}
        <div className="absolute top-0 z-50 animate-float-slow">
             <div className="relative">
                 <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse" />
                 <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-200 via-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.6)] border-[3px] border-yellow-100/50 backdrop-blur-sm relative z-10">
                    <IsotypeLogo className="w-12 h-12 md:w-14 md:h-14 text-white drop-shadow-md" primaryColor="#fbbf24" />
                    {/* Shine effect */}
                    <div className="absolute top-2 left-2 w-6 h-6 bg-white/40 rounded-full blur-[2px]" />
                 </div>
             </div>
        </div>

        {/* Tree Layers - Using SVG for organic shape */}
        <div className="absolute top-16 w-full h-full flex flex-col items-center z-20">
            
            {/* Tree Body SVG */}
            <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMax slice">
                <defs>
                    <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#064e3b" /> {/* emerald-900 */}
                        <stop offset="50%" stopColor="#10b981" /> {/* emerald-500 (highlight) */}
                        <stop offset="100%" stopColor="#064e3b" /> {/* emerald-900 */}
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                
                {/* Layer 1 (Top) */}
                <path d="M200,20 L260,120 Q200,140 140,120 Z" fill="url(#treeGradient)" className="drop-shadow-lg" />
                <path d="M200,20 L260,120 Q200,140 140,120 Z" fill="black" opacity="0.2" className="mix-blend-overlay" /> {/* Texture/Shadow */}
                
                {/* Layer 2 */}
                <path d="M200,80 L290,220 Q200,250 110,220 Z" fill="url(#treeGradient)" className="drop-shadow-lg" />
                <path d="M200,80 L290,220 Q200,250 110,220 Z" fill="black" opacity="0.2" className="mix-blend-overlay" />

                {/* Layer 3 */}
                <path d="M200,180 L320,340 Q200,380 80,340 Z" fill="url(#treeGradient)" className="drop-shadow-lg" />
                <path d="M200,180 L320,340 Q200,380 80,340 Z" fill="black" opacity="0.2" className="mix-blend-overlay" />

                {/* Layer 4 (Bottom) */}
                <path d="M200,280 L360,460 Q200,500 40,460 Z" fill="url(#treeGradient)" className="drop-shadow-lg" />
                <path d="M200,280 L360,460 Q200,500 40,460 Z" fill="black" opacity="0.2" className="mix-blend-overlay" />

                {/* Trunk */}
                <path d="M180,460 L180,500 L220,500 L220,460 Z" fill="#451a03" />
            </svg>

            {/* Lights / Garland (CSS Overlay) */}
            <div className="absolute inset-0 pointer-events-none">
                 {/* Light String 1 */}
                 <div className="absolute top-[25%] left-[30%] w-[40%] h-[20%] border-b-4 border-dashed border-yellow-200/30 rounded-[100%] rotate-6" />
                 {/* Light String 2 */}
                 <div className="absolute top-[50%] left-[20%] w-[60%] h-[25%] border-b-4 border-dashed border-yellow-200/30 rounded-[100%] -rotate-3" />
                 {/* Light String 3 */}
                 <div className="absolute top-[75%] left-[10%] w-[80%] h-[20%] border-b-4 border-dashed border-yellow-200/30 rounded-[100%] rotate-2" />
            </div>

            {/* Ornaments with Product Photos - Precisely Placed */}
            
            {/* Top Layer Ornaments */}
            <div className="absolute top-[18%] left-[45%] z-30 animate-swing origin-top" style={{ animationDelay: '0.2s' }}>
                <ProductOrnament img={getImg(0)} color="red" size="sm" />
            </div>

            {/* Middle Layer Ornaments */}
            <div className="absolute top-[35%] left-[35%] z-30 animate-swing origin-top" style={{ animationDelay: '0.5s' }}>
                <ProductOrnament img={getImg(1)} color="gold" size="md" />
            </div>
            <div className="absolute top-[38%] right-[32%] z-30 animate-swing origin-top" style={{ animationDelay: '0.8s' }}>
                <ProductOrnament img={getImg(2)} color="blue" size="md" />
            </div>

            {/* Bottom Layer Ornaments */}
            <div className="absolute top-[60%] left-[25%] z-30 animate-swing origin-top" style={{ animationDelay: '1.2s' }}>
                <ProductOrnament img={getImg(3)} color="purple" size="lg" />
            </div>
            <div className="absolute top-[65%] right-[25%] z-30 animate-swing origin-top" style={{ animationDelay: '1.5s' }}>
                <ProductOrnament img={getImg(4)} color="red" size="lg" />
            </div>
             <div className="absolute top-[55%] left-[50%] z-30 animate-swing origin-top" style={{ animationDelay: '1.8s' }}>
                <ProductOrnament img={getImg(0)} color="gold" size="sm" />
            </div>

             {/* Extra Decorative Balls (No Image) */}
             <div className="absolute top-[28%] right-[42%] w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse" />
             <div className="absolute top-[48%] left-[30%] w-4 h-4 bg-yellow-400 rounded-full shadow-lg animate-pulse delay-75" />
             <div className="absolute top-[75%] right-[35%] w-5 h-5 bg-blue-400 rounded-full shadow-lg animate-pulse delay-150" />

        </div>

      </div>

      {/* Gifts at the base - 3D Styled */}
      <div className="absolute bottom-2 w-full flex justify-center items-end gap-4 z-40 transform translate-y-6">
        <GiftBox color="red" size="w-20 h-20" ribbonColor="gold" delay="0s" />
        <GiftBox color="blue" size="w-24 h-16" ribbonColor="silver" delay="0.2s" />
        <GiftBox color="green" size="w-16 h-24" ribbonColor="red" delay="0.4s" />
      </div>

    </div>
  );
}

// Subcomponents for cleaner code

function ProductOrnament({ img, color, size = 'md' }: { img: string, color: 'red' | 'gold' | 'blue' | 'purple', size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-14 h-14',
        lg: 'w-16 h-16'
    };

    const colorClasses = {
        red: 'border-red-400 bg-red-100',
        gold: 'border-amber-400 bg-amber-100',
        blue: 'border-blue-400 bg-blue-100',
        purple: 'border-purple-400 bg-purple-100'
    };

    return (
        <div className={cn(
            "rounded-full relative group cursor-pointer transition-transform hover:scale-110 z-30",
            sizeClasses[size],
            "shadow-[0_4px_10px_rgba(0,0,0,0.3)]",
            "before:content-[''] before:absolute before:-top-4 before:left-1/2 before:-translate-x-1/2 before:w-[2px] before:h-4 before:bg-white/50" // String
        )}>
            {/* Ornament Body */}
            <div className={cn(
                "w-full h-full rounded-full overflow-hidden border-2 relative",
                colorClasses[color]
            )}>
                <Image src={img} alt="Product" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                
                {/* Glass Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/60 pointer-events-none rounded-full" />
                <div className="absolute top-2 left-3 w-[40%] h-[20%] bg-white/40 rounded-full blur-[2px] -rotate-45" />
            </div>
            
            {/* Cap */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-gradient-to-r from-yellow-600 to-yellow-300 rounded-sm shadow-sm" />
        </div>
    );
}

function GiftBox({ color, size, ribbonColor, delay }: { color: string, size: string, ribbonColor: string, delay: string }) {
    const bgColors: Record<string, string> = {
        red: 'bg-red-600',
        blue: 'bg-blue-600',
        green: 'bg-emerald-600'
    };
    
    const ribbonColors: Record<string, string> = {
        gold: 'bg-yellow-400',
        silver: 'bg-gray-200',
        red: 'bg-red-500'
    };

    return (
        <div 
            className={cn("relative rounded-sm shadow-xl hover:-translate-y-2 transition-transform duration-500", bgColors[color], size)}
            style={{ transitionDelay: delay }}
        >
            {/* 3D Depth effect (Top/Side borders) */}
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] rounded-sm" />
            
            {/* Ribbon Vertical */}
            <div className={cn("absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 shadow-sm", ribbonColors[ribbonColor])} />
            
            {/* Ribbon Horizontal */}
            <div className={cn("absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 shadow-sm", ribbonColors[ribbonColor])} />
            
            {/* Bow */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 flex justify-center">
                 <div className={cn("w-4 h-4 rounded-full -mr-1 relative top-1", ribbonColors[ribbonColor])} />
                 <div className={cn("w-4 h-4 rounded-full -ml-1 relative top-1", ribbonColors[ribbonColor])} />
            </div>
        </div>
    );
}
