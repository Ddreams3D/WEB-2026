'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutTemplate, 
  FileText, 
  Palette, 
  Settings, 
  Save, 
  Box
} from 'lucide-react';
import { UnifiedLandingData } from './types';
import { Sheet } from '@/components/ui/simple-sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSection } from './components/GeneralSection';
import { HeroSection } from './components/HeroSection';
import { VisualSection } from './components/VisualSection';
import { ContentSection } from './components/ContentSection';
import { SeoSection } from './components/SeoSection';
import { cn } from '@/lib/utils';

interface UniversalLandingEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UnifiedLandingData) => Promise<void>;
  initialData: UnifiedLandingData;
  isSaving?: boolean;
  automationEnabled?: boolean;
  inheritedPrimaryColor?: string;
  mode?: 'full' | 'theme_only';
}

export function UniversalLandingEditor({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false,
  automationEnabled,
  inheritedPrimaryColor,
  mode = 'full'
}: UniversalLandingEditorProps) {
  const [data, setData] = useState<UnifiedLandingData>(initialData);

  // Reset data when opening
  useEffect(() => {
    if (isOpen) {
      setData(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const updateField = (field: keyof UnifiedLandingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await onSave(data);
  };

  const getTitle = () => {
    if (mode === 'theme_only') return '🎨 Editor de Apariencia Global';
    if (data.type === 'campaign') return '✨ Editor de Campaña';
    if (data.type === 'main') return '🚀 Editor Landing SEO (/impresion-3d-arequipa)';
    if (data.type === 'service') return `🛠️ Editor de Servicio: ${data.internalName || 'Nuevo'}`;
    return '✏️ Editor de Landing';
  };

  const showSeoTab = data.type === 'service';
  const isOrganicService = data.type === 'service' && (data.id === 'organic-modeling' || data._originalService?.id === 'organic-modeling');
  const isThemeOnly = mode === 'theme_only';

  // Calculate dynamic styles for the editor container to reflect landing colors
  const editorStyle = useMemo(() => {
    const primaryColor = data.primaryColor;
    // Default base styles (Light Mode forced for readability)
    const baseStyles = {
      '--background': '0 0% 100%',
      '--foreground': '222.2 84% 4.9%',
      '--card': '0 0% 100%',
      '--card-foreground': '222.2 84% 4.9%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '222.2 84% 4.9%',
      '--muted': '210 40% 96.1%',
      '--muted-foreground': '215.4 16.3% 46.9%',
      '--accent': '210 40% 96.1%',
      '--accent-foreground': '222.2 47.4% 11.2%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '210 40% 98%',
      '--border': '214.3 31.8% 91.4%',
      '--input': '214.3 31.8% 91.4%',
    };

    const styles: Record<string, string> = { ...baseStyles };

    // --- Colors ---
    if (primaryColor) {
      const hexToRgb = (hex: string): string | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
          `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` 
          : null;
      };

      const rgb = hexToRgb(primaryColor);
      if (rgb) {
        styles['--primary'] = rgb;
        styles['--primary-500'] = rgb;
        styles['--primary-600'] = rgb;
        styles['--ring'] = rgb;
      }
    }

    // --- Radius ---
    if (data.buttonStyle === 'pill') styles['--radius'] = '9999px';
    else if (data.buttonStyle === 'square') styles['--radius'] = '0rem';
    else styles['--radius'] = '0.5rem';

    // --- Fonts ---
    if (data.fontFamilyHeading === 'playfair') styles['--font-heading'] = 'var(--font-playfair), serif';
    else if (data.fontFamilyHeading === 'oswald') styles['--font-heading'] = 'var(--font-oswald), sans-serif';
    else if (data.fontFamilyHeading === 'montserrat') styles['--font-heading'] = 'var(--font-montserrat), sans-serif';
    else styles['--font-heading'] = 'var(--font-inter), sans-serif';

    if (data.fontFamilyBody === 'roboto') styles['--font-body'] = 'var(--font-roboto), sans-serif';
    else if (data.fontFamilyBody === 'open-sans') styles['--font-body'] = 'var(--font-open-sans), sans-serif';
    else styles['--font-body'] = 'var(--font-inter), sans-serif';

    // --- Pattern ---
    if (data.patternOverlay === 'dots') {
      styles['--pattern-style'] = 'radial-gradient(currentColor 1px, transparent 1px)';
      styles['--pattern-size'] = '20px 20px';
    } else if (data.patternOverlay === 'grid') {
      styles['--pattern-style'] = 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)';
      styles['--pattern-size'] = '40px 40px';
    } else if (data.patternOverlay === 'noise') {
      styles['--pattern-style'] = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")';
      styles['--pattern-size'] = 'auto';
    } else {
      styles['--pattern-style'] = 'none';
      styles['--pattern-size'] = 'auto';
    }

    return styles as React.CSSProperties;
  }, [data.primaryColor, data.buttonStyle, data.fontFamilyHeading, data.fontFamilyBody, data.patternOverlay]);

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      description="Personaliza cada detalle de tu página de aterrizaje con estilo."
      className="max-w-3xl light text-foreground bg-background"
      style={editorStyle}
      footer={
        <div className="flex justify-end gap-3 w-full pt-4 border-t">
          <Button variant="ghost" onClick={onClose} disabled={isSaving} className="hover:bg-destructive/10 hover:text-destructive">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2 min-w-[140px] shadow-lg shadow-primary/20">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="py-6 px-1">
        <div>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className={`grid w-full mb-8 h-auto p-1.5 bg-muted/30 rounded-2xl ${
                isThemeOnly
                  ? 'grid-cols-2'
                  : showSeoTab
                    ? (isOrganicService ? 'grid-cols-4' : 'grid-cols-5')
                    : 'grid-cols-4'
              }`}>
                <TabsTrigger value="general" className="py-2.5 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
                  <Settings className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">General</span>
                </TabsTrigger>
                
                {!isThemeOnly && !isOrganicService && (
                  <TabsTrigger value="hero" className="py-2.5 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-indigo-500 data-[state=active]:shadow-sm transition-all">
                    <LayoutTemplate className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Hero</span>
                  </TabsTrigger>
                )}

                <TabsTrigger value="visual" className="py-2.5 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-pink-500 data-[state=active]:shadow-sm transition-all">
                  <Palette className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Visual</span>
                </TabsTrigger>

                {!isThemeOnly && (
                  <TabsTrigger value="content" className="py-2.5 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-teal-500 data-[state=active]:shadow-sm transition-all">
                    {data.type === 'service' ? <Box className="w-4 h-4 md:mr-2" /> : <FileText className="w-4 h-4 md:mr-2" />}
                    <span className="hidden md:inline">Contenido</span>
                  </TabsTrigger>
                )}

                {!isThemeOnly && showSeoTab && (
                  <TabsTrigger value="seo" className="py-2.5 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-blue-500 data-[state=active]:shadow-sm transition-all">
                    <FileText className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">SEO</span>
                  </TabsTrigger>
                )}
              </TabsList>

              <div className="min-h-[400px]">
                <TabsContent value="general" className="mt-0 focus-visible:outline-none">
                   <GeneralSection data={data} updateField={updateField} automationEnabled={automationEnabled} />
                </TabsContent>

                {!isThemeOnly && !isOrganicService && (
                  <TabsContent value="hero" className="mt-0 focus-visible:outline-none">
                    <HeroSection data={data} updateField={updateField} disableTextEditing={isOrganicService} />
                  </TabsContent>
                )}

                <TabsContent value="visual" className="mt-0 focus-visible:outline-none">
                  <VisualSection 
                    data={data} 
                    updateField={updateField} 
                    inheritedPrimaryColor={inheritedPrimaryColor}
                  />
                </TabsContent>

                {!isThemeOnly && (
                  <TabsContent value="content" className="mt-0 focus-visible:outline-none">
                    <ContentSection data={data} updateField={updateField} disableFeaturesText={isOrganicService} />
                  </TabsContent>
                )}

                {!isThemeOnly && showSeoTab && (
                  <TabsContent value="seo" className="mt-0 focus-visible:outline-none">
                    <SeoSection data={data} updateField={updateField} />
                  </TabsContent>
                )}
              </div>
            </Tabs>
        </div>
      </div>
    </Sheet>
  );
}
