import React from 'react';
import { Sparkles, Heart, Ghost, Smile, Printer, Layout, Box, Target, Factory, Handshake } from 'lucide-react';

// Map icon names to components
const ICON_MAP: Record<string, any> = {
    Ghost,
    Smile,
    Printer,
    Layout,
    Box,
    Sparkles,
    Heart,
    Target,
    Factory,
    Handshake
};

interface ServiceFeaturesProps {
  featuresSection: any;
  primaryColor: string;
  isEditable?: boolean;
  onChangeTitle?: (value: string) => void;
  onChangeSubtitle?: (value: string) => void;
  onChangeItemField?: (index: number, field: 'title' | 'description', value: string) => void;
}

export function ServiceFeatures({ featuresSection, primaryColor, isEditable = false, onChangeTitle, onChangeSubtitle, onChangeItemField }: ServiceFeaturesProps) {
  if (!featuresSection || !featuresSection.items) return null;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-left mb-16">
                <div 
                  className="inline-block px-3 py-1 rounded-full border text-xs font-bold tracking-[0.2em] uppercase mb-2 shadow-[0_0_10px_-3px_rgba(0,0,0,0.2)] bg-background"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  Propuesta de Valor
                </div>
                {isEditable && onChangeTitle ? (
                  <input
                    className="w-full max-w-2xl text-3xl md:text-4xl font-bold mb-4 bg-transparent border-b border-dashed border-muted focus:outline-none focus:border-primary"
                    value={featuresSection.title || ''}
                    onChange={e => onChangeTitle(e.target.value)}
                  />
                ) : (
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuresSection.title}</h2>
                )}
                {isEditable && onChangeSubtitle ? (
                  <textarea
                    className="w-full text-muted-foreground max-w-2xl bg-transparent border border-dashed border-muted rounded-md p-2 focus:outline-none focus:border-primary"
                    value={featuresSection.subtitle || ''}
                    onChange={e => onChangeSubtitle(e.target.value)}
                    rows={2}
                  />
                ) : (
                  <p className="text-muted-foreground max-w-2xl">
                    {featuresSection.subtitle}
                  </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuresSection.items.map((item: any, idx: number) => {
                    const Icon = item.icon && ICON_MAP[item.icon] ? ICON_MAP[item.icon] : Sparkles;
                    return (
                        <div key={idx} className="bg-card border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${primaryColor}20` }}>
                                <Icon className="w-6 h-6" style={{ color: primaryColor }} />
                            </div>
                            {isEditable && onChangeItemField ? (
                              <>
                                <input
                                  className="w-full text-xl font-bold mb-3 bg-transparent border-b border-dashed border-muted focus:outline-none focus:border-primary"
                                  value={item.title || ''}
                                  onChange={e => onChangeItemField(idx, 'title', e.target.value)}
                                />
                                <textarea
                                  className="w-full text-muted-foreground leading-relaxed bg-transparent border border-dashed border-muted rounded-md p-2 focus:outline-none focus:border-primary"
                                  value={item.description || ''}
                                  onChange={e => onChangeItemField(idx, 'description', e.target.value)}
                                  rows={3}
                                />
                              </>
                            ) : (
                              <>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                              </>
                            )}
                        </div>
                    )
                })}
            </div>
         </div>
    </section>
  );
}
