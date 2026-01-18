import React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, ExternalLink, Sun, Moon, Monitor, Upload, Link as LinkIcon } from 'lucide-react';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from '../ImageUpload';
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
               Imagen Hero Principal
             </Label>
             
             <Tabs defaultValue="upload" className="w-full">
               <TabsList className="grid w-full grid-cols-2">
                 <TabsTrigger value="upload" className="flex items-center gap-2">
                   <Upload className="w-4 h-4" />
                   Subir Imagen
                 </TabsTrigger>
                 <TabsTrigger value="url" className="flex items-center gap-2">
                   <LinkIcon className="w-4 h-4" />
                   URL Externa
                 </TabsTrigger>
               </TabsList>
               
               <TabsContent value="upload" className="pt-4">
                 <div className="space-y-4">
                   <ImageUpload 
                     value={theme.landing.heroImage}
                     onChange={(url) => updateLanding(theme.id, { heroImage: url })}
                     onRemove={() => updateLanding(theme.id, { heroImage: '' })}
                     defaultName={`hero-${theme.themeId}`}
                     storagePath={`campaigns/${theme.id}/hero-images`}
                   />
                   <p className="text-xs text-muted-foreground">
                     Imagen principal que se mostrará por defecto.
                   </p>
                 </div>
               </TabsContent>
               
               <TabsContent value="url" className="pt-4">
                <div className="space-y-2">
                  <Label>URL de la imagen</Label>
                  <div className="flex gap-2">
                    <Input 
                       value={theme.landing.heroImage || ''}
                       onChange={(e) => updateLanding(theme.id, { heroImage: e.target.value })}
                       placeholder="https://ejemplo.com/imagen.jpg"
                       className="font-mono text-xs"
                    />
                    {theme.landing.heroImage && (
                      <a href={theme.landing.heroImage} target="_blank" rel="noreferrer" className="flex items-center justify-center p-2 bg-muted rounded-md border hover:bg-muted/80">
                         <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

             <div className="space-y-2 border-t pt-4">
             <Label className="flex items-center gap-2">
               <Camera className="w-4 h-4" />
               Galería / Slider (Opcional)
             </Label>
             <p className="text-xs text-muted-foreground mb-4">
                Sube múltiples imágenes para mostrar un carrusel en el Hero.
             </p>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {theme.landing.heroImages?.map((img, index) => (
                    <div key={index} className="relative group aspect-square rounded-md overflow-hidden border bg-muted">
                        <Image 
                            src={img} 
                            alt={`Slide ${index + 1}`} 
                            fill 
                            className="object-cover" 
                        />
                        <button
                            onClick={() => {
                                const newImages = [...(theme.landing.heroImages || [])];
                                newImages.splice(index, 1);
                                updateLanding(theme.id, { heroImages: newImages });
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ExternalLink className="w-3 h-3 rotate-45" /> {/* Using as X icon */}
                        </button>
                    </div>
                ))}
             </div>

             <div className="p-4 border rounded-lg bg-muted/30">
                 <Label className="mb-2 block text-xs">Agregar nueva imagen al slider</Label>
                 <ImageUpload 
                     value=""
                     onChange={(url) => {
                         if (url) {
                             updateLanding(theme.id, { 
                                 heroImages: [...(theme.landing.heroImages || []), url] 
                             });
                         }
                     }}
                     onRemove={() => {}}
                     defaultName={`hero-slider-${Date.now()}`}
                     storagePath={`campaigns/${theme.id}/hero-images/slider`}
                 />
             </div>
          </div>
      </div>
    </div>
  );
}
