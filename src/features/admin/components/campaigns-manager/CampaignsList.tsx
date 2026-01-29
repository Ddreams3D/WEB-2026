import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, AlertTriangle } from '@/lib/icons';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { getThemeStatus } from '../../utils/campaign-utils';
import DefaultImage from '@/shared/components/ui/DefaultImage';

interface CampaignsListProps {
  themes: SeasonalThemeConfig[];
  setEditingId: (id: string | null) => void;
  updateTheme: (id: string, updates: Partial<SeasonalThemeConfig>) => void;
  onSave: (theme?: SeasonalThemeConfig) => Promise<void>;
  automationEnabled?: boolean;
}

export function CampaignsList({ themes, setEditingId, updateTheme, onSave, automationEnabled }: CampaignsListProps) {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    themeId: string | null;
    action: 'activate' | 'deactivate';
    themeName: string;
  }>({
    isOpen: false,
    themeId: null,
    action: 'activate',
    themeName: ''
  });

  const handleToggle = (theme: SeasonalThemeConfig) => {
    if (automationEnabled) return;
    const newStatus = !theme.isActive;
    setConfirmState({
      isOpen: true,
      themeId: theme.id,
      action: newStatus ? 'activate' : 'deactivate',
      themeName: theme.name
    });
  };

  const confirmToggle = async () => {
    if (confirmState.themeId) {
      const theme = themes.find(t => t.id === confirmState.themeId);
      if (theme) {
        const isActive = confirmState.action === 'activate';
        const updatedTheme = { ...theme, isActive };
        
        // Update local state
        updateTheme(confirmState.themeId, { isActive });
        
        // Save immediately
        setConfirmState(prev => ({ ...prev, isOpen: false })); // Close dialog first
        await onSave(updatedTheme);
      }
    } else {
      setConfirmState(prev => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {themes.map(theme => (
          <div 
            key={theme.id} 
            className="group relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Theme Preview Header */}
            <div 
              className="relative w-full aspect-[3/2] bg-muted cursor-pointer overflow-hidden"
              onClick={() => {
                if (theme.id === 'standard') {
                  setEditingId(theme.id);
                  return;
                }
                // Open preview or edit? Typically click on card opens edit in this context, 
                // but original code opened preview on image click. 
                // Let's keep consistency: Image click -> Preview, but maybe add an edit button.
                // Actually, the original code had: "if standard -> edit", "if other -> preview".
                // Let's stick to that but maybe make it clearer.
                if (typeof window !== 'undefined') {
                   const url = `/campanas/${theme.id}?preview=true`;
                   window.open(url, '_blank');
                }
              }}
            >
                <DefaultImage
                  src={theme.landing.heroImage || theme.landing.heroImages?.[0]}
                  alt={theme.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                {/* Theme Identity on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                   <div className="flex items-center justify-between mb-1">
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md text-[10px]">
                        {theme.landing.featuredTag || 'Tema'}
                      </Badge>
                      
                      {/* Color Palette Preview */}
                      <div className="flex -space-x-1.5">
                          {theme.landing.primaryColor && (
                             <div className="w-4 h-4 rounded-full border border-white/50 shadow-sm" style={{ backgroundColor: theme.landing.primaryColor }} />
                          )}
                          {theme.landing.secondaryColor && (
                             <div className="w-4 h-4 rounded-full border border-white/50 shadow-sm" style={{ backgroundColor: theme.landing.secondaryColor }} />
                          )}
                           {theme.landing.backgroundColor && (
                             <div className="w-4 h-4 rounded-full border border-white/50 shadow-sm" style={{ backgroundColor: theme.landing.backgroundColor }} />
                          )}
                      </div>
                   </div>
                   
                   <h3 className="font-bold text-lg leading-tight mb-0.5">{theme.name}</h3>
                   <p className="text-xs text-white/70 line-clamp-1">{theme.landing.heroTitle || 'Sin título'}</p>
                </div>

                {/* Status Badge (Top Right) */}
                {theme.isActive && (
                    <div className="absolute top-3 right-3 z-[10]">
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white border-none shadow-md gap-1.5 pl-1.5 pr-2.5">
                           <span className="relative flex h-2 w-2">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                           </span>
                           ACTIVO
                        </Badge>
                    </div>
                )}
            </div>

            {/* Card Actions & Details */}
            <div className="p-4 flex flex-col gap-4 flex-1">
               {/* Date & Automation Info */}
               <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>
                      {theme.dateRanges.length > 0 
                        ? `${theme.dateRanges[0].start.day}/${theme.dateRanges[0].start.month} - ${theme.dateRanges[0].end.day}/${theme.dateRanges[0].end.month}`
                        : 'Sin fecha programada'}
                    </span>
                  </div>
                  
                  {getThemeStatus(theme) === 'auto' && (
                     <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-600 bg-blue-50">Auto</Badge>
                  )}
               </div>

               {/* Controls */}
               <div className="mt-auto pt-3 border-t flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                     <Switch 
                        id={`switch-${theme.id}`}
                        checked={theme.isActive || false}
                        onCheckedChange={() => handleToggle(theme)}
                        disabled={automationEnabled}
                        className="scale-90"
                     />
                     <label htmlFor={`switch-${theme.id}`} className="text-xs font-medium cursor-pointer">
                        {theme.isActive ? 'Activado' : 'Desactivado'}
                     </label>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs hover:bg-primary/10 hover:text-primary"
                    onClick={() => setEditingId(theme.id)}
                  >
                    Editar Tema
                  </Button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={confirmState.isOpen} onOpenChange={(open) => !open && setConfirmState(prev => ({ ...prev, isOpen: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Confirmar Cambio de Estado
            </DialogTitle>
            <DialogDescription>
              {confirmState.action === 'activate' 
                ? `¿Estás seguro de activar manualmente la campaña "${confirmState.themeName}"?`
                : `¿Estás seguro de desactivar la campaña "${confirmState.themeName}"?`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            {confirmState.action === 'activate' ? (
              <p>
                Al activar esta campaña manualmente, <strong>anulará cualquier otra campaña programada por fecha</strong> (como Navidad o Halloween).
                <br /><br />
                Asegúrate de desactivar otras campañas manuales si existen.
              </p>
            ) : (
              <p>
                Al desactivar esta campaña, el sistema volverá a usar la programación automática por fechas. Si no hay campañas vigentes, se usará el tema por defecto.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}>
              Cancelar
            </Button>
            <Button onClick={confirmToggle}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
