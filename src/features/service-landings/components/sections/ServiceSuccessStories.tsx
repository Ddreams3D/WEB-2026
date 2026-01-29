import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SERVICE_LANDINGS_DATA } from '@/shared/data/service-landings-data';

interface ServiceSuccessStoriesProps {
  section: any;
  primaryColor: string;
}

export function ServiceSuccessStories({ section, primaryColor }: ServiceSuccessStoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!section || !section.items || section.items.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % section.items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + section.items.length) % section.items.length);
  };

  const currentItem = section.items[currentIndex];

  // Fallback to static data if content or location is missing (Code > DB rule)
  const { content, location } = (() => {
    // Debug
    // console.log('Current Item:', currentItem.title);
    
    // Start with current values
    let resolvedContent = currentItem.content;
    let resolvedLocation = currentItem.location;

    // If both exist, no need to search
    if (resolvedContent && resolvedLocation) {
        return { content: resolvedContent, location: resolvedLocation };
    }

    // Search in static data
    for (const landing of SERVICE_LANDINGS_DATA) {
      const successSection = landing.sections.find(s => s.id === 'success-stories');
      if (successSection && successSection.items) {
        // Try exact match first, then fuzzy match
        const staticItem = successSection.items.find(i => {
            const match = i.title === currentItem.title || 
            (i.title.toLowerCase().includes('drag pharma') && currentItem.title.toLowerCase().includes('drag pharma')) ||
            i.title.includes(currentItem.title) ||
            currentItem.title.includes(i.title);
            
            // if (match) console.log('Static Item Found:', i.title);
            return match;
        });
        
        if (staticItem) {
            if (!resolvedContent && staticItem.content) resolvedContent = staticItem.content;
            if (!resolvedLocation && staticItem.location) resolvedLocation = staticItem.location;
        }
      }
    }
    return { content: resolvedContent, location: resolvedLocation };
  })();

  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-left mb-12">
            <div 
              className="inline-block px-3 py-1 rounded-full border text-xs font-bold tracking-[0.2em] uppercase mb-2 shadow-[0_0_10px_-3px_rgba(0,0,0,0.2)] bg-background"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Casos de Éxito
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.title}</h2>
            {section.subtitle && (
                <p className="text-muted-foreground max-w-2xl">
                    {section.subtitle}
                </p>
            )}
        </div>

        <div className="max-w-6xl mx-auto bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            {/* Left Column: Image / Grid */}
            <div className="relative bg-muted/30 h-64 lg:h-auto border-b lg:border-b-0 lg:border-r border-border p-6 flex items-center justify-center">
              {(() => {
                const images = currentItem.images && currentItem.images.length > 0 
                  ? currentItem.images 
                  : (currentItem.image ? [currentItem.image] : []);

                if (images.length === 0) {
                  return (
                    <div className="text-muted-foreground flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <span className="text-2xl">🖼️</span>
                        </div>
                        <span className="text-sm">Sin imagen</span>
                    </div>
                  );
                }

                // Grid Logic
                // 1 Image: Full fill
                // 2 Images: 2 columns
                // 3 Images: 2 top, 1 bottom spanning 2
                // 4 Images: 2x2 grid
                return (
                  <div className={cn(
                    "grid gap-2 w-full h-full min-h-[300px]",
                    images.length === 1 && "grid-cols-1",
                    images.length === 2 && "grid-cols-2",
                    images.length >= 3 && "grid-cols-2 grid-rows-2"
                  )}>
                    {images.slice(0, 4).map((img: string, idx: number) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "relative rounded-xl overflow-hidden shadow-inner bg-muted",
                          // For 3 images, make the 3rd one span full width
                          images.length === 3 && idx === 2 && "col-span-2"
                        )}
                      >
                         <Image
                           src={img}
                           alt={`${currentItem.title} - ${idx + 1}`}
                           fill
                           className="object-cover transition-transform duration-500 hover:scale-110"
                         />
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Right Column: Content */}
            <div className="relative p-8 lg:p-12 flex flex-col justify-between min-h-[400px]">
              <div>
                 <div 
                   className="inline-block px-3 py-1 rounded-full border text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm bg-background/50 backdrop-blur-sm w-fit mb-6"
                   style={{ borderColor: primaryColor, color: primaryColor }}
                 >
                   Caso de Éxito {currentIndex + 1} / {section.items.length}
                 </div>
              
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                        {currentItem.title}
                     </h3>
                     {location && (
                        <div className="flex items-center gap-2 text-primary font-medium text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {location}
                        </div>
                     )}
                   </div>
                   
                   <p className="text-lg font-medium text-foreground/80 leading-snug">
                      {currentItem.description}
                   </p>

                   {content && (
                      <div className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line pt-4 border-t border-border/40">
                          {content}
                      </div>
                   )}
                 </div>
              </div>

              {/* Navigation Button (Bottom Right) */}
              {section.items.length > 1 && (
                  <div className="mt-8 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrev}
                        className="rounded-full w-10 h-10 hover:bg-muted"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={handleNext}
                        className="rounded-full w-10 h-10"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <ChevronRight className="w-4 h-4 text-white" />
                      </Button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
