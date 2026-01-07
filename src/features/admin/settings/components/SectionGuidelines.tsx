import React, { useState } from 'react';
import { Check, X, Info, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SectionGuidelinesProps {
  title?: string;
  description?: string;
  dos: string[];
  donts: string[];
  className?: string;
}

export function SectionGuidelines({ 
  title = "Guía de Uso", 
  description,
  dos, 
  donts,
  className 
}: SectionGuidelinesProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className={cn("border-l-4 border-l-primary/40 bg-muted/10 shadow-sm mb-6 overflow-hidden transition-all duration-300", className)}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground/90 text-sm flex items-center gap-2">
              {title}
            </h3>
            {description && !isOpen && (
              <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      <div className={cn(
        "grid transition-all duration-300 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <CardContent className="pt-0 pb-4 px-4 sm:px-14">
            {description && (
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {description}
              </p>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* DO's Section */}
              <div className="space-y-3 bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-green-600/80 flex items-center gap-2 mb-1">
                  <Check className="w-4 h-4" />
                  Lo que SÍ va aquí
                </h4>
                <ul className="space-y-2">
                  {dos.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500/40 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DONT's Section */}
              <div className="space-y-3 bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-500/80 flex items-center gap-2 mb-1">
                  <X className="w-4 h-4" />
                  Lo que NO va aquí
                </h4>
                <ul className="space-y-2">
                  {donts.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500/40 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
