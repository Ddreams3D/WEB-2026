import React from 'react';
import { Monitor, Smartphone, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LandingMainConfig } from '@/shared/types/landing';
import LandingMainPageClient from '@/features/landing-main/LandingMainPageClient';
import AnnouncementBar from '@/shared/components/layout/AnnouncementBar';

// Mock Navbar for Preview
const NavbarMock = () => (
  <div className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 w-full">
    <div className="flex items-center gap-2">
       <div className="w-8 h-8 bg-primary rounded-lg" />
       <div className="w-24 h-5 bg-muted rounded hidden sm:block" />
    </div>
    <div className="hidden md:flex gap-6">
       <div className="w-16 h-4 bg-muted rounded" />
       <div className="w-16 h-4 bg-muted rounded" />
       <div className="w-16 h-4 bg-muted rounded" />
    </div>
    <div className="flex gap-2">
       <div className="w-8 h-8 bg-muted rounded-full" />
       <div className="w-8 h-8 bg-muted rounded-full" />
    </div>
  </div>
);

interface LandingMainPreviewProps {
    form: LandingMainConfig;
    previewMode: 'desktop' | 'mobile';
    setPreviewMode: (mode: 'desktop' | 'mobile') => void;
    setIsEditing: (editing: boolean) => void;
}

export function LandingMainPreview({ form, previewMode, setPreviewMode, setIsEditing }: LandingMainPreviewProps) {
  return (
    <div className="xl:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Monitor className="w-5 h-5 text-muted-foreground" />
                Vista Previa
            </h3>
            <div className="flex bg-muted rounded-lg p-1">
                <button 
                    onClick={() => setPreviewMode('desktop')}
                    className={cn(
                        "p-2 rounded-md transition-all",
                        previewMode === 'desktop' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Monitor className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setPreviewMode('mobile')}
                    className={cn(
                        "p-2 rounded-md transition-all",
                        previewMode === 'mobile' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Smartphone className="w-4 h-4" />
                </button>
            </div>
        </div>

        <div className="border rounded-xl overflow-hidden shadow-2xl bg-muted/10 relative group ring-1 ring-border/50">
            {/* Browser Mockup Header */}
            <div className="absolute top-0 left-0 right-0 h-9 bg-muted/90 backdrop-blur border-b flex items-center px-4 gap-2 z-20">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="ml-4 flex-1 max-w-xl h-6 bg-background/50 rounded-md text-[10px] flex items-center px-3 text-muted-foreground/60 select-none">
                    ddreams3d.com
                </div>
            </div>
            
            {/* Scaled Content Container */}
            <div className={cn(
                "relative bg-background transition-all duration-500 mx-auto border-x border-border/50 mt-9",
                previewMode === 'mobile' ? "w-[375px] h-[600px]" : "w-full h-[600px]"
            )}>
                <div className={cn(
                    "origin-top-left absolute top-0 left-0 w-full",
                    previewMode === 'desktop' ? "scale-[0.5] w-[200%] h-[200%]" : "scale-[0.5] w-[200%] h-[200%]"
                )}>
                    {/* Simulated Page Layout */}
                    <div className={cn(
                        "flex flex-col min-h-screen bg-background text-foreground pointer-events-none select-none",
                        form.themeMode === 'dark' ? 'dark' : form.themeMode === 'light' ? 'light' : ''
                    )}>
                        <AnnouncementBar config={form.announcement} />
                        <NavbarMock />
                        <div className="flex-1">
                            <LandingMainPageClient 
                                initialConfig={form}
                                featuredProducts={[]}
                                services={[]}
                                bubbleImages={form.bubbleImages || []}
                            />
                        </div>
                    </div>
                </div>
                
                    {/* Interactive Overlay */}
                    <div 
                    className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-[1px]"
                    onClick={() => setIsEditing(true)}
                >
                    <Button size="lg" className="shadow-2xl scale-110 font-bold">
                        <Edit className="w-5 h-5 mr-2" />
                        Editar Contenido
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
