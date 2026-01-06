import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, ExternalLink, Sun, Moon, Monitor } from 'lucide-react';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CampaignEditorContentProps {
  theme: SeasonalThemeConfig;
  updateLanding: (themeId: string, updates: Partial<SeasonalThemeConfig['landing']>) => void;
}

export function CampaignEditorContent({ theme, updateLanding }: CampaignEditorContentProps) {
  return (
    <div className="space-y-6 border-b pb-6">
      <h3 className="font-semibold text-lg flex items-center gap-2">Contenido Landing Page</h3>
      
      <div className="space-y-4">
          <div className="space-y-2">
            <Label>Modo de Tema</Label>
            <Select 
                value={theme.landing.themeMode || 'system'} 
                onValueChange={(value) => updateLanding(theme.id, { themeMode: value as any })}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona un modo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">
                        <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            <span>Claro (Light)</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            <span>Oscuro (Dark)</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="system">
                        <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            <span>Sistema (Automático)</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
                Define si esta campaña debe forzar modo oscuro (ej. Halloween) o claro.
            </p>
          </div>

          <div className="space-y-2">
             <Label>Título Hero</Label>
             <Input 
                value={theme.landing.heroTitle}
                onChange={(e) => updateLanding(theme.id, { heroTitle: e.target.value })}
             />
          </div>
          <div className="space-y-2">
             <Label>Subtítulo</Label>
             <Input 
                value={theme.landing.heroSubtitle || ''}
                onChange={(e) => updateLanding(theme.id, { heroSubtitle: e.target.value })}
             />
          </div>

          <div className="space-y-2">
             <Label>Descripción</Label>
             <Textarea 
                value={theme.landing.heroDescription}
                onChange={(e) => updateLanding(theme.id, { heroDescription: e.target.value })}
                rows={3}
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Texto CTA</Label>
              <Input 
                value={theme.landing.ctaText} 
                onChange={e => updateLanding(theme.id, { ctaText: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Enlace CTA</Label>
              <Input 
                value={theme.landing.ctaLink} 
                onChange={e => updateLanding(theme.id, { ctaLink: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
             <Label className="flex items-center gap-2">
               <Camera className="w-4 h-4" />
               URL de Imagen Hero
             </Label>
             <div className="flex gap-2">
               <Input 
                  value={theme.landing.heroImage || ''}
                  onChange={(e) => updateLanding(theme.id, { heroImage: e.target.value })}
                  className="font-mono text-xs"
               />
               {theme.landing.heroImage && (
                 <a href={theme.landing.heroImage} target="_blank" rel="noreferrer" className="flex items-center justify-center p-2 bg-muted rounded-md border hover:bg-muted/80">
                    <ExternalLink className="w-4 h-4" />
                 </a>
               )}
             </div>
             {theme.landing.heroImage && (
               <div className="mt-2 h-32 w-full rounded-md overflow-hidden bg-muted border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={theme.landing.heroImage} alt="Preview" className="w-full h-full object-cover" />
               </div>
             )}
          </div>
      </div>
    </div>
  );
}
