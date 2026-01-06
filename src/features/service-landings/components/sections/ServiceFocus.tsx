import React from 'react';
import { Sparkles, Trophy, Lightbulb, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceFocusProps {
  focusSection: any;
  primaryColor: string;
}

export function ServiceFocus({ focusSection, primaryColor }: ServiceFocusProps) {
  if (!focusSection) return null;

  // Split content by newlines if it's a string
  const lines = focusSection.content 
    ? focusSection.content.split('\n').filter((line: string) => line.trim().length > 0)
    : [];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] rounded-full opacity-5 blur-[80px]" style={{ backgroundColor: primaryColor }} />
            <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full opacity-5 blur-[80px]" style={{ backgroundColor: primaryColor }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                        {focusSection.title || 'Nuestro Enfoque'}
                    </h2>
                    <div className="h-1.5 w-24 mx-auto rounded-full" style={{ backgroundColor: primaryColor }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    {/* Left Column: Visual/Icon */}
                    <div className="md:col-span-4 flex justify-center md:justify-end">
                        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                             <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-20 animate-[spin_10s_linear_infinite]" style={{ borderColor: primaryColor }} />
                             <div className="absolute inset-4 rounded-full border border-opacity-10" style={{ borderColor: primaryColor }} />
                             <Trophy className="w-24 h-24 opacity-80" style={{ color: primaryColor }} />
                             
                             {/* Floating icons */}
                             <div className="absolute top-0 right-0 p-2 bg-background shadow-lg rounded-full border border-border/50 animate-bounce delay-100">
                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                             </div>
                             <div className="absolute bottom-4 left-4 p-2 bg-background shadow-lg rounded-full border border-border/50 animate-bounce delay-700">
                                <Fingerprint className="w-5 h-5 text-blue-500" />
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Text Content */}
                    <div className="md:col-span-8 space-y-6">
                        {lines.map((line: string, index: number) => {
                            // Simple parser for **bold** text
                            const isBold = line.startsWith('**') && line.endsWith('**');
                            const content = isBold ? line.slice(2, -2) : line;

                            return (
                                <div 
                                    key={index} 
                                    className="flex items-start space-x-4 p-4 rounded-xl transition-all hover:bg-muted/30 border border-transparent hover:border-border/40 group"
                                >
                                    <div className="mt-1 flex-shrink-0">
                                        <Sparkles className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: primaryColor }} />
                                    </div>
                                    <p className={cn(
                                        "text-lg md:text-xl text-foreground/80 leading-relaxed",
                                        isBold ? "font-bold text-foreground" : "font-medium"
                                    )}>
                                        {content}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
