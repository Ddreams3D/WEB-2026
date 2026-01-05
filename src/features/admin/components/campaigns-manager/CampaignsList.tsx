import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, ExternalLink, Calendar as CalendarIcon } from '@/lib/icons';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import SeasonalLanding from '@/features/seasonal/components/SeasonalLanding';
import { getThemeStatus } from '../../utils/campaign-utils';

interface CampaignsListProps {
  themes: SeasonalThemeConfig[];
  setEditingId: (id: string | null) => void;
}

export function CampaignsList({ themes, setEditingId }: CampaignsListProps) {
  return (
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
                      ddreams3d.com/campanas/{theme.id}
                  </div>
              </div>

              {/* Content Preview */}
              <div 
                  className="w-[400%] h-[400%] absolute top-7 left-0 transform scale-[0.25] origin-top-left pointer-events-none select-none bg-background cursor-pointer"
                  onClick={() => setEditingId(theme.id)}
              >
                  <SeasonalLanding config={theme} />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
                  <Button 
                      size="sm" 
                      variant="secondary" 
                      className="font-semibold shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                      onClick={() => setEditingId(theme.id)}
                  >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                  </Button>
                  <a 
                      href={`/campanas/${theme.id}?preview=true`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-secondary text-secondary-foreground shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 hover:bg-secondary/80"
                      title="Ver página real"
                  >
                      <ExternalLink className="w-4 h-4" />
                  </a>
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
          
          {/* Card Content */}
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

            <div className="mt-auto pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
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
  );
}
