'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutTemplate, 
  FileText, 
  Palette, 
  Settings, 
  Save, 
  Box,
  Eye,
  Columns
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
}

export function UniversalLandingEditor({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false,
  automationEnabled
}: UniversalLandingEditorProps) {
  const [data, setData] = useState<UnifiedLandingData>(initialData);
  const [splitView, setSplitView] = useState(false);

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
    if (data.type === 'campaign') return '✨ Editor de Campaña';
    if (data.type === 'main') return '🚀 Editor Principal';
    if (data.type === 'service') return `🛠️ Editor de Servicio: ${data.internalName || 'Nuevo'}`;
    return '✏️ Editor de Landing';
  };

  const showSeoTab = data.type === 'service';
  const previewUrl = useMemo(() => {
    if (data.type === 'service') {
      const slug = data.slug || data._originalService?.slug || '';
      return slug ? `/servicios/${slug}` : '';
    }
    if (data.type === 'campaign') {
      const id = data._originalCampaign?.id || '';
      return id ? `/campanas/${id}?preview=true` : '';
    }
    return '/';
  }, [data]);

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      description="Personaliza cada detalle de tu página de aterrizaje con estilo."
      className="max-w-6xl"
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
        <div className="flex items-center justify-end pb-4">
          <Button
            variant={splitView ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setSplitView(v => !v)}
            className={cn('gap-2')}
          >
            <Columns className="w-4 h-4" />
            {splitView ? 'Vista Unica' : 'Split View'}
          </Button>
        </div>
        <div className={cn(splitView ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : '')}>
          <div>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className={`grid w-full mb-8 h-auto p-1.5 bg-muted/30 rounded-2xl ${showSeoTab ? 'grid-cols-5' : 'grid-cols-4'}`}>
                <TabsTrigger value="general" className="py-2.5 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
                  <Settings className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="hero" className="py-2.5 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-indigo-500 data-[state=active]:shadow-sm transition-all">
                  <LayoutTemplate className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Hero</span>
                </TabsTrigger>
                <TabsTrigger value="visual" className="py-2.5 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-pink-500 data-[state=active]:shadow-sm transition-all">
                  <Palette className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Visual</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="py-2.5 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-teal-500 data-[state=active]:shadow-sm transition-all">
                  {data.type === 'service' ? <Box className="w-4 h-4 md:mr-2" /> : <FileText className="w-4 h-4 md:mr-2" />}
                  <span className="hidden md:inline">Contenido</span>
                </TabsTrigger>
                {showSeoTab && (
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

                <TabsContent value="hero" className="mt-0 focus-visible:outline-none">
                  <HeroSection data={data} updateField={updateField} />
                </TabsContent>

                <TabsContent value="visual" className="mt-0 focus-visible:outline-none">
                  <VisualSection data={data} updateField={updateField} />
                </TabsContent>

                <TabsContent value="content" className="mt-0 focus-visible:outline-none">
                  <ContentSection data={data} updateField={updateField} />
                </TabsContent>

                {showSeoTab && (
                  <TabsContent value="seo" className="mt-0 focus-visible:outline-none">
                    <SeoSection data={data} updateField={updateField} />
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>
          {splitView && previewUrl && (
            <div className="rounded-2xl border bg-muted/30 overflow-hidden">
              <div className="h-10 bg-muted/60 border-b flex items-center justify-between px-3 gap-3 text-xs">
                <div className="truncate">
                  {previewUrl}
                </div>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Eye className="w-4 h-4" />
                  Abrir
                </a>
              </div>
              <iframe title="Vista previa" src={previewUrl} className="w-full h-[70vh] bg-background" />
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
}
