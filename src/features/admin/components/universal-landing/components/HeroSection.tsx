import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LayoutTemplate, Type, MousePointerClick, Link as LinkIcon, ImageIcon } from 'lucide-react';
import { UnifiedLandingData } from '../types';
import ImageUpload from '@/features/admin/components/ImageUpload';

interface HeroSectionProps {
  data: UnifiedLandingData;
  updateField: (field: keyof UnifiedLandingData, value: any) => void;
}

export function HeroSection({ data, updateField }: HeroSectionProps) {
  const isService = data.type === 'service';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-border/50">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-sm">
          <LayoutTemplate className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Portada & Hero
          </h2>
          <p className="text-sm text-muted-foreground">
            La primera impresión que verán tus visitantes.
          </p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left Column: Content */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-card border rounded-xl p-5 shadow-sm space-y-5">
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  Título Principal
                </Label>
                <Input 
                  value={data.heroTitle} 
                  onChange={(e) => updateField('heroTitle', e.target.value)}
                  className="text-lg font-bold h-12 border-primary/20 focus-visible:ring-primary/30"
                  placeholder="Ej: Impresión 3D Profesional"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Subtítulo / Gancho</Label>
                <Textarea 
                  value={data.heroSubtitle || ''} 
                  onChange={(e) => updateField('heroSubtitle', e.target.value)}
                  rows={2}
                  className="resize-none text-base"
                  placeholder="Una frase corta y atractiva..."
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Descripción Detallada</Label>
                <Textarea 
                  value={data.heroDescription || ''} 
                  onChange={(e) => updateField('heroDescription', e.target.value)}
                  rows={4}
                  className="bg-muted/20"
                  placeholder="Explica más detalles sobre tu oferta..."
                />
              </div>
           </div>

           <div className="bg-gradient-to-br from-card to-muted/20 border rounded-xl p-5 shadow-sm space-y-4">
              <Label className="text-base font-medium flex items-center gap-2 text-primary">
                 <MousePointerClick className="w-4 h-4" />
                 Llamada a la Acción (Botón)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Texto del Botón</Label>
                  <Input 
                    value={data.ctaText || ''} 
                    onChange={(e) => updateField('ctaText', e.target.value)}
                    placeholder="Ej: Ver Catálogo"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> Enlace
                  </Label>
                  <Input 
                    value={data.ctaLink || ''} 
                    onChange={(e) => updateField('ctaLink', e.target.value)}
                    placeholder="/catalogo"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
           </div>
        </div>

        {/* Right Column: Image */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border rounded-xl p-5 shadow-sm h-full flex flex-col">
            <Label className="text-base font-medium flex items-center gap-2 mb-4">
               <ImageIcon className="w-4 h-4 text-primary" />
               {isService ? 'Imágenes del Hero (Comparación)' : 'Imagen de Fondo'}
            </Label>
            
            <div className="flex-1 border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-4 bg-muted/5 hover:bg-muted/10 transition-colors relative overflow-hidden group min-h-[300px]">
              <div className="w-full relative z-10 space-y-6">
                {isService ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Imagen 1 (Escultura Real)
                      </Label>
                      <ImageUpload
                        value={data.heroImage}
                        onChange={(url) => updateField('heroImage', url)}
                        onRemove={() => updateField('heroImage', '')}
                        defaultName={`hero-real-${data.slug || 'service'}`}
                        storagePath={`images/landings/services/${data.slug || 'service'}/hero`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Imagen 2 (Modelo 3D)
                      </Label>
                      <ImageUpload
                        value={data.heroImageComparison}
                        onChange={(url) => updateField('heroImageComparison', url)}
                        onRemove={() => updateField('heroImageComparison', '')}
                        defaultName={`hero-3d-${data.slug || 'service'}`}
                        storagePath={`images/landings/services/${data.slug || 'service'}/hero`}
                      />
                    </div>
                  </>
                ) : (
                  <ImageUpload
                    value={data.heroImage}
                    onChange={(url) => updateField('heroImage', url)}
                    onRemove={() => updateField('heroImage', '')}
                    defaultName={`hero-${data.slug || 'landing'}`}
                    storagePath="images/landings"
                  />
                )}
              </div>
              <div className="text-center space-y-1">
                {isService ? (
                  <>
                    <p className="text-xs text-muted-foreground font-medium">Encuadre Recomendado</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <p className="text-[10px] text-muted-foreground/70 bg-muted px-2 py-1 rounded-full">3:4 o 4:5 Vertical</p>
                      <p className="text-[10px] text-muted-foreground/70 bg-muted px-2 py-1 rounded-full">Min: 1080w x 1350h</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      Ideal: <strong>1200 Ancho x 1600 Alto</strong>.
                    </p>
                    <p className="text-[10px] text-amber-500/90 mt-2 font-medium">
                      ⚠️ Importante: Usa el MISMO fondo en ambas fotos (o ambas transparentes) para que el efecto funcione.
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      Formatos: <strong>WebP</strong> (Mejor) o <strong>JPG</strong>. Evita PNG si no hay transparencia.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground font-medium">Dimensiones Recomendadas</p>
                    <p className="text-[10px] text-muted-foreground/70 bg-muted px-2 py-1 rounded-full inline-block">1920 x 1080 px</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
