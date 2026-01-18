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
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {themes.map(theme => (
          <div 
            key={theme.id} 
            className="group relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Browser Mockup Frame */}
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-xl bg-muted border-b">
                {/* Browser Header */}
                <div className="absolute top-0 left-0 right-0 h-7 bg-muted/90 backdrop-blur-sm border-b flex items-center px-3 gap-1.5 z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                    <div className="ml-2 flex-1 h-4 bg-background/50 rounded text-[9px] flex items-center px-2 text-muted-foreground/60">
                        {theme.id === 'standard' ? 'ddreams3d.com' : `ddreams3d.com/campanas/${theme.id}`}
                    </div>
                </div>

                {/* Content Preview (clickable area) */}
                <div
                  className="absolute top-7 left-0 right-0 bottom-0 bg-background cursor-pointer"
                  onClick={() => {
                    if (theme.id === 'standard') {
                      setEditingId(theme.id);
                      return;
                    }
                    if (typeof window !== 'undefined') {
                      const url = `/campanas/${theme.id}?preview=true`;
                      window.open(url, '_blank');
                    }
                  }}
                >
                  <DefaultImage
                    src={theme.landing.heroImage || theme.landing.heroImages?.[0]}
                    alt={theme.landing.heroTitle || theme.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 25vw"
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[10px] text-white/80 font-semibold uppercase tracking-wider truncate">
                          {theme.landing.heroSubtitle || theme.name}
                        </div>
                        <div className="text-white font-bold text-sm leading-snug line-clamp-2">
                          {theme.landing.heroTitle || theme.name}
                        </div>
                      </div>
                      <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm">
                        {theme.landing.featuredTag || 'Campaña'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                {theme.isActive && (
                    <div className="absolute top-10 right-3 z-[10]">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                )}
            </div>

            {/* Card Content (no click handler) */}
            <div className="p-5 flex flex-col flex-1 gap-3">
              <div>
                  <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{theme.name}</h3>
                      {(() => {
                        const status = getThemeStatus(theme);
                        if (status === 'manual') return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-[10px] px-1.5 h-5">ACTIVO (M)</Badge>;
                        if (status === 'auto') return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-[10px] px-1.5 h-5">VIGENTE</Badge>;
                        return <Badge variant="outline" className="text-[10px] px-1.5 h-5 text-muted-foreground">INACTIVO</Badge>;
                      })()}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{theme.landing.heroTitle}</p>
              </div>

              {/* Manual Toggle Row */}
              <div className="flex items-center justify-between py-2 border-t border-b bg-muted/10 -mx-5 px-5">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  Activación Manual
                  {automationEnabled && (
                    <span title="Desactivado porque el modo automático está encendido" className="cursor-help text-amber-500">*</span>
                  )}
                </span>
                <Switch 
                  checked={theme.isActive || false}
                  onCheckedChange={() => handleToggle(theme)}
                  className="scale-75 origin-right"
                  disabled={automationEnabled}
                />
              </div>

              <div className="mt-auto pt-3 flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>
                      {theme.dateRanges.length > 0 
                        ? `${theme.dateRanges[0].start.day}/${theme.dateRanges[0].start.month} - ${theme.dateRanges[0].end.day}/${theme.dateRanges[0].end.month}`
                        : 'Sin fecha'}
                    </span>
                  </div>
                  <Badge variant="secondary" className="font-normal text-[10px]">{theme.landing.featuredTag || 'Campaña'}</Badge>
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
