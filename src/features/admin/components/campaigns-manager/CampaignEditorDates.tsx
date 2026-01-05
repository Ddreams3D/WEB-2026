import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Plus, X } from '@/lib/icons';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';

interface CampaignEditorDatesProps {
  theme: SeasonalThemeConfig;
  updateDateRange: (themeId: string, index: number, field: 'start' | 'end', subField: 'month' | 'day', value: number) => void;
  addDateRange: (themeId: string) => void;
  removeDateRange: (themeId: string, index: number) => void;
}

export function CampaignEditorDates({ 
  theme, 
  updateDateRange, 
  addDateRange, 
  removeDateRange 
}: CampaignEditorDatesProps) {
  return (
    <div className="space-y-6 border-b pb-6">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <CalendarIcon className="w-5 h-5" />
        Vigencia de Campaña
      </h3>
      
      <div className="space-y-3">
        {theme.dateRanges.map((range, idx) => (
          <div key={idx} className="bg-card border rounded-md p-3 space-y-3 relative group/date">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <span className="text-xs text-muted-foreground block mb-1">Inicio (Mes/Día)</span>
                   <div className="flex gap-2">
                     <Input 
                       type="number" min="1" max="12" 
                       value={range.start.month || ''}
                       onChange={(e) => updateDateRange(theme.id, idx, 'start', 'month', parseInt(e.target.value))}
                       className="h-8 px-2"
                     />
                     <Input 
                       type="number" min="1" max="31" 
                       value={range.start.day || ''}
                       onChange={(e) => updateDateRange(theme.id, idx, 'start', 'day', parseInt(e.target.value))}
                       className="h-8 px-2"
                     />
                   </div>
                </div>
                <div>
                   <span className="text-xs text-muted-foreground block mb-1">Fin (Mes/Día)</span>
                   <div className="flex gap-2">
                     <Input 
                       type="number" min="1" max="12" 
                       value={range.end.month || ''}
                       onChange={(e) => updateDateRange(theme.id, idx, 'end', 'month', parseInt(e.target.value))}
                       className="h-8 px-2"
                     />
                     <Input 
                       type="number" min="1" max="31" 
                       value={range.end.day || ''}
                       onChange={(e) => updateDateRange(theme.id, idx, 'end', 'day', parseInt(e.target.value))}
                       className="h-8 px-2"
                     />
                   </div>
                </div>
             </div>
             <Button 
               variant="ghost" 
               size="icon" 
               className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover/date:opacity-100 transition-opacity shadow-sm"
               onClick={() => removeDateRange(theme.id, idx)}
             >
               <X className="w-3 h-3" />
             </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => addDateRange(theme.id)}>
          <Plus className="mr-2 h-3 w-3" /> Agregar Rango
        </Button>
      </div>
    </div>
  );
}
