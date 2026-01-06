import React from 'react';
import { Lightbulb, PenTool, Hammer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceProcessProps {
  processSection: any;
  primaryColor: string;
}

export function ServiceProcess({ processSection, primaryColor }: ServiceProcessProps) {
  if (!processSection || !processSection.items) return null;

  const icons = {
    'Lightbulb': Lightbulb,
    'PenTool': PenTool,
    'Hammer': Hammer
  };

  return (
    <section className="py-20 bg-muted/10 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
            {/* Optional Section Header */}
            {processSection.title && (
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                        {processSection.title}
                    </h2>
                    {processSection.subtitle && (
                        <p className="text-muted-foreground text-lg">
                            {processSection.subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                {processSection.items.map((item: any, index: number) => {
                    const IconComponent = icons[item.icon as keyof typeof icons] || Lightbulb;
                    
                    return (
                        <div 
                            key={index} 
                            className="group relative bg-background rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center"
                        >
                            {/* Step Indicator (Breathing Animation) */}
                            <div 
                                className="absolute top-6 left-6 text-4xl font-black text-muted-foreground/10 select-none animate-pulse"
                                style={{ animationDelay: `${index * 600}ms`, animationDuration: '3s' }}
                            >
                                0{index + 1}
                            </div>

                            {/* Icon Circle */}
                            <div 
                                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500"
                                style={{ backgroundColor: `${primaryColor}15` }} // 15 = low opacity hex
                            >
                                <IconComponent 
                                    className="w-8 h-8 stroke-[1.5]" 
                                    style={{ color: primaryColor }} 
                                />
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">
                                {item.title}
                            </h3>
                            
                            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                {item.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
  );
}
