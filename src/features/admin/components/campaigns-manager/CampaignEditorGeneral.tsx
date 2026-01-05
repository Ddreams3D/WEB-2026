import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Check } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { THEMES } from '@/contexts/ThemeContext';
import { THEME_CONFIG } from '@/config/themes';

interface CampaignEditorGeneralProps {
  theme: SeasonalThemeConfig;
  updateTheme: (themeId: string, updates: Partial<SeasonalThemeConfig>) => void;
}

export function CampaignEditorGeneral({ theme, updateTheme }: CampaignEditorGeneralProps) {
  return (
    <div className="space-y-6 border-b pb-6">
       <h3 className="font-semibold text-lg flex items-center gap-2">Configuración General</h3>
       
       <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
          <div className="space-y-0.5">
            <Label className="text-base">Activación Manual</Label>
            <p className="text-xs text-muted-foreground">Forzar la campaña visible ignorando fechas.</p>
          </div>
          <Switch 
            checked={theme.isActive || false}
            onCheckedChange={(checked) => updateTheme(theme.id, { isActive: checked })}
          />
       </div>

       <div className="space-y-3">
          <Label className="text-base block mb-2">Tema Visual</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {THEMES.map(tKey => {
              const config = THEME_CONFIG[tKey];
              const isSelected = theme.themeId === tKey;
              
              return (
                <div 
                  key={tKey}
                  onClick={() => updateTheme(theme.id, { themeId: tKey })}
                  className={cn(
                    "relative flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-transparent bg-card hover:border-muted-foreground/20"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                  
                  {/* Color Preview */}
                  <div className="flex gap-1 mb-2">
                    {config.previewColors.slice(0, 2).map((color, i) => (
                      <div key={i} className={cn("w-4 h-4 rounded-full shadow-sm ring-1 ring-black/5", color)} />
                    ))}
                  </div>
                  
                  <span className="text-xs font-medium text-center leading-tight">
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
       </div>
    </div>
  );
}
