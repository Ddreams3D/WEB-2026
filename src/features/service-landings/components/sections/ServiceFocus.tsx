import React from 'react';
import { Sparkles, Trophy, Lightbulb, Fingerprint, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceFocusProps {
  focusSection: any;
  primaryColor: string;
}

export function ServiceFocus({ focusSection, primaryColor }: ServiceFocusProps) {
  if (!focusSection) return null;

  const lines = focusSection.content 
    ? focusSection.content.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0)
    : [];

  const isSegmentation = focusSection.id === 'segmentation';

  let forWhom: string[] = [];
  let notForWhom: string[] = [];
  let footerLine: string | null = null;

  if (isSegmentation && lines.length > 0) {
    const clean = lines.map((line: string) => line.replace(/^\*\*|\*\*$/g, ''));
    const idxFor = clean.findIndex((line: string) => line.toLowerCase().includes('para quién es'));
    const idxNotFor = clean.findIndex((line: string) => line.toLowerCase().includes('para quién no es'));

    const rawFooter = clean.find((line: string) => line.startsWith('👉')) || null;

    if (idxFor !== -1 && idxNotFor !== -1) {
      forWhom = clean.slice(idxFor + 1, idxNotFor).filter((line: string) => !line.startsWith('👉'));
      notForWhom = clean.slice(idxNotFor + 1).filter((line: string) => !line.startsWith('👉'));
    }

    if (rawFooter) {
      footerLine = rawFooter.replace(/^👉\s*/, '');
    }
  }

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
                    {isSegmentation && footerLine && (
                      <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                        {footerLine}
                      </p>
                    )}
                </div>

                {isSegmentation && forWhom.length > 0 && notForWhom.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border bg-card/80 p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h3 className="text-base md:text-lg font-semibold">
                          ¿Para quién es?
                        </h3>
                      </div>
                      <ul className="space-y-2 text-sm md:text-base text-foreground/80">
                        {forWhom.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border bg-card/80 p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                          <XCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <h3 className="text-base md:text-lg font-semibold">
                          ¿Para quién no es?
                        </h3>
                      </div>
                      <ul className="space-y-2 text-sm md:text-base text-foreground/80">
                        {notForWhom.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-red-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-4 flex justify-center md:justify-end">
                      <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-20 animate-[spin_10s_linear_infinite]" style={{ borderColor: primaryColor }} />
                        <div className="absolute inset-4 rounded-full border border-opacity-10" style={{ borderColor: primaryColor }} />
                        <Trophy className="w-24 h-24 opacity-80" style={{ color: primaryColor }} />
                        <div className="absolute top-0 right-0 p-2 bg-background shadow-lg rounded-full border border-border/50 animate-bounce delay-100">
                          <Lightbulb className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div className="absolute bottom-4 left-4 p-2 bg-background shadow-lg rounded-full border border-border/50 animate-bounce delay-700">
                          <Fingerprint className="w-5 h-5 text-blue-500" />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-8 space-y-6">
                      {lines.map((line: string, index: number) => {
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
                )}
            </div>
        </div>
    </section>
  );
}
