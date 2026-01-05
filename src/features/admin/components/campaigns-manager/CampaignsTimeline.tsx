import React from 'react';
import { Calendar as CalendarIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { MONTHS, getLeftPercent, getWidthPercent, getThemeStatus } from '../../utils/campaign-utils';

interface CampaignsTimelineProps {
  themes: SeasonalThemeConfig[];
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}

export function CampaignsTimeline({ themes, editingId, setEditingId }: CampaignsTimelineProps) {
  // Calculate Today's position
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const todayPercent = getLeftPercent(currentMonth, currentDay);

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b bg-muted/30 flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          Línea de Tiempo Anual
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
             <span>Activa (Manual)</span>
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-blue-500" />
             <span>Vigente (Fecha)</span>
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
             <span>Inactiva</span>
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-0.5 h-3 bg-red-500" />
             <span>Hoy</span>
           </div>
        </div>
      </div>
      
      <div className="p-6 overflow-x-auto custom-scrollbar">
        <div className="min-w-[900px] relative">
          {/* Months Header */}
          <div className="grid grid-cols-12 gap-0 mb-6 text-center border-b border-border/50 pb-2">
            {MONTHS.map(m => (
              <div key={m} className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">{m}</div>
            ))}
          </div>

          {/* Timeline Rows */}
          <div className="space-y-4 relative pb-2">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-12 pointer-events-none h-full w-full -z-10">
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} className="border-l border-dashed border-border/40 h-full last:border-r" />
              ))}
            </div>

            {/* Today Indicator */}
            <div 
              className="absolute top-[-40px] bottom-0 w-px bg-red-500/50 z-[15] pointer-events-none flex flex-col items-center"
              style={{ left: `${todayPercent}%` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mb-auto shadow-sm" />
            </div>

            {themes.map(theme => (
              <div key={theme.id} className="relative h-12 flex items-center group/row hover:bg-muted/30 rounded-lg transition-colors -mx-2 px-2">
                {/* Label */}
                <div className="absolute -left-4 w-0 md:static md:w-32 text-right text-sm font-medium truncate pr-4 text-muted-foreground group-hover/row:text-foreground transition-colors">
                  {theme.name}
                </div>

                {/* Track */}
                <div className="w-full h-2 bg-muted/30 rounded-full relative overflow-visible">
                   {theme.dateRanges.map((range, idx) => {
                     const left = getLeftPercent(range.start.month, range.start.day);
                     const width = getWidthPercent(range.start, range.end);
                     const status = getThemeStatus(theme);
                     
                     return (
                       <div 
                         key={idx}
                         className={cn(
                           "absolute h-5 -top-1.5 rounded-full shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-105 z-10 flex items-center justify-center min-w-[10px]",
                           status === 'manual' 
                             ? "bg-green-500 ring-2 ring-background text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]" 
                             : status === 'auto'
                               ? "bg-blue-500 ring-2 ring-background text-white"
                               : "bg-muted-foreground/40 hover:bg-muted-foreground/60",
                           editingId === theme.id ? "ring-2 ring-offset-2 ring-primary scale-105" : ""
                         )}
                         style={{ left: `${left}%`, width: `${width}%` }}
                         onClick={() => setEditingId(theme.id === editingId ? null : theme.id)}
                       >
                          {width > 8 && (
                              <span className="text-[10px] text-white font-bold px-2 truncate drop-shadow-sm select-none">
                              {theme.name}
                              </span>
                          )}
                       </div>
                     );
                   })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
