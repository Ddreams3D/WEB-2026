import React, { useState } from 'react';
import { 
  Edit, 
  ExternalLink, 
  LayoutTemplate,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Eye } from '@/lib/icons';
import DefaultImage from '@/shared/components/ui/DefaultImage';

interface ServiceLandingsListProps {
    filteredLandings: ServiceLandingConfig[];
    handleEdit: (landing: ServiceLandingConfig) => void;
    handleCreateNew: () => void;
}

export function ServiceLandingsList({
    filteredLandings,
    handleEdit,
    handleCreateNew
}: ServiceLandingsListProps) {
  const [livePreview, setLivePreview] = useState<{
    open: boolean;
    url: string;
    title: string;
  }>({
    open: false,
    url: '',
    title: ''
  });

  const openLivePreview = (landing: ServiceLandingConfig) => {
    const url = `/servicios/${landing.slug}`;
    setLivePreview({
      open: true,
      url,
      title: landing.name
    });
  };

  return (
    <>
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredLandings.map((landing) => (
            <div 
                key={landing.id} 
                className="group relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
                {/* Browser Mockup Frame */}
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-xl bg-muted border-b">
                    {/* Browser Header */}
                    <div className="absolute top-0 left-0 right-0 h-7 bg-muted/90 backdrop-blur-sm border-b flex items-center px-3 gap-1.5 z-20">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                        <div className="ml-2 flex-1 h-4 bg-background/50 rounded text-[9px] flex items-center px-2 text-muted-foreground/60 truncate">
                            ddreams3d.com/servicios/{landing.slug}
                        </div>
                    </div>

                    {/* Content Preview */}
                    <div className="absolute top-7 left-0 right-0 bottom-0 bg-background">
                      <DefaultImage
                        src={landing.heroImage || landing.heroImageComparison}
                        alt={landing.metaTitle || landing.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 25vw"
                        className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[10px] text-white/80 font-semibold uppercase tracking-wider truncate">
                              {landing.sections?.[0]?.subtitle || landing.name}
                            </div>
                            <div className="text-white font-bold text-sm leading-snug line-clamp-2">
                              {landing.sections?.[0]?.title || landing.metaTitle || landing.name}
                            </div>
                          </div>
                          {landing.featuredTag && (
                            <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm">
                              {landing.featuredTag}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
                        <Button 
                            size="sm" 
                            variant="secondary" 
                            className="font-semibold shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                            onClick={() => handleEdit(landing)}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="font-semibold shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                            onClick={() => openLivePreview(landing)}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Vista
                        </Button>
                        <a 
                            href={`/servicios/${landing.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-secondary text-secondary-foreground shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 hover:bg-secondary/80"
                            title="Ver página real"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Status Badge */}
                    {landing.isActive && (
                        <div className="absolute top-10 right-3 z-[10]">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                        </div>
                    )}
                </div>
                
                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{landing.name}</h3>
                            <Badge 
                                variant={landing.isActive ? "default" : "outline"} 
                                className={cn(
                                    "text-[10px] px-1.5 h-5",
                                    landing.isActive 
                                        ? "bg-green-500 hover:bg-green-600" 
                                        : "text-muted-foreground"
                                )}
                            >
                                {landing.isActive ? "ACTIVA" : "BORRADOR"}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{landing.metaDescription || "Sin descripción"}</p>
                    </div>

                    <div className="mt-auto pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-[10px] font-medium opacity-80">
                            {/* Tag de productos vinculados */}
                            {landing.featuredTag && (
                                <Badge variant="outline" className="h-5 px-1.5 bg-muted/50 font-normal border-dashed">
                                    Tag: {landing.featuredTag}
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {/* Theme Mode simplificado */}
                            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
                                {landing.themeMode === 'system' ? 'Auto' : 
                                 landing.themeMode === 'dark' ? 'Dark' : 'Light'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        ))}

        {/* Empty State */}
        {filteredLandings.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/5">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <LayoutTemplate className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold">No hay landings creadas</h3>
                <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                    Comienza creando tu primera landing page específica para un servicio.
                </p>
                <Button onClick={handleCreateNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primera Landing
                </Button>
            </div>
        )}
    </div>
    <Dialog
      open={livePreview.open}
      onOpenChange={(open) => setLivePreview(prev => ({ ...prev, open }))}
    >
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 overflow-hidden">
        <div className="h-10 bg-muted/90 border-b flex items-center justify-between px-3 gap-3">
          <div className="text-xs text-muted-foreground truncate">
            {livePreview.title} — {livePreview.url}
          </div>
          <a
            href={livePreview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir
          </a>
        </div>
        <iframe
          title={livePreview.title || 'Vista en vivo'}
          src={livePreview.url}
          className="w-full h-[calc(85vh-40px)] bg-background"
        />
      </DialogContent>
    </Dialog>
    </>
  );
}
