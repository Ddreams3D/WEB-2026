import React from 'react';
import { Sparkles, Heart, Ghost, Smile, Printer, Layout, Box } from 'lucide-react';

// Map icon names to components
const ICON_MAP: Record<string, any> = {
    Ghost,
    Smile,
    Printer,
    Layout,
    Box,
    Sparkles,
    Heart
};

interface ServiceFeaturesProps {
  featuresSection: any;
  primaryColor: string;
}

export function ServiceFeatures({ featuresSection, primaryColor }: ServiceFeaturesProps) {
  if (!featuresSection || !featuresSection.items) return null;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuresSection.title}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {featuresSection.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuresSection.items.map((item: any, idx: number) => {
                    const Icon = item.icon && ICON_MAP[item.icon] ? ICON_MAP[item.icon] : Sparkles;
                    return (
                        <div key={idx} className="bg-card border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${primaryColor}20` }}>
                                <Icon className="w-6 h-6" style={{ color: primaryColor }} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    )
                })}
            </div>
         </div>
    </section>
  );
}
