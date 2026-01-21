'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Settings, Sparkles, LayoutTemplate } from 'lucide-react';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { ServiceLandingsService } from '@/services/service-landings.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { UniversalLandingEditor } from '@/features/admin/components/universal-landing/UniversalLandingEditor';
import { serviceToUnified, unifiedToService } from '@/features/admin/components/universal-landing/adapters';
import { UnifiedLandingData } from '@/features/admin/components/universal-landing/types';
import { revalidateServiceLandingAction } from '@/actions/service-landings-actions';
import { DEFAULT_HERO } from '@/app/soportes-personalizados/data';

interface SupportsAdminClientProps {
    initialLanding: ServiceLandingConfig | null;
}

export default function SupportsAdminClient({ initialLanding }: SupportsAdminClientProps) {
  const router = useRouter();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [landing, setLanding] = useState<ServiceLandingConfig | null>(initialLanding);

  const handleSave = async (data: UnifiedLandingData) => {
    // 1. Validate Hex Color
    if (data.primaryColor && !/^#([0-9A-F]{3}){1,2}$/i.test(data.primaryColor)) {
      toast.error('Color inválido. Debe ser un formato hexadecimal válido (ej: #7c3aed)');
      return;
    }

    setIsSaving(true);
    try {
      const serviceLanding = unifiedToService(data);
      
      // Ensure we keep the specific ID and slug for this special landing
      serviceLanding.id = 'soportes-personalizados-landing';
      serviceLanding.slug = 'soportes-personalizados';
      
      await ServiceLandingsService.save(serviceLanding);
      
      // Revalidate cache
      await revalidateServiceLandingAction(serviceLanding.slug);
      
      setLanding(serviceLanding);
      setIsEditorOpen(false);
      toast.success(`Cambios guardados. Color actualizado a ${serviceLanding.primaryColor}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar: No se pudo persistir la configuración en la base de datos.');
    } finally {
      setIsSaving(false);
    }
  };

  // Default config if none exists
  const defaultConfig: ServiceLandingConfig = {
    id: 'soportes-personalizados-landing',
    slug: 'soportes-personalizados',
    name: 'Soportes Personalizados',
    isActive: true,
    themeMode: 'system',
    category: 'special',
    metaTitle: 'Soportes Personalizados | Ddreams 3D',
    metaDescription: 'Colección exclusiva de soportes personalizados para Alexa, Nintendo Switch, celulares y más.',
    primaryColor: '#7c3aed', // Violet-600
     heroImage: DEFAULT_HERO.imageUrl,
    sections: [
      {
        id: 'hero-main',
        type: 'hero',
        title: DEFAULT_HERO.title,
        subtitle: DEFAULT_HERO.subtitle,
        content: 'Diseños únicos para Alexa, Nintendo Switch y más.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const currentLanding = landing || defaultConfig;
  const unifiedData = serviceToUnified(currentLanding);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LayoutTemplate className="w-8 h-8 text-primary" />
            Soportes Personalizados
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Gestiona la apariencia y contenido de la landing page de soportes.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" asChild>
            <a href="/soportes-personalizados" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Ver Landing
            </a>
          </Button>
          <Button onClick={() => setIsEditorOpen(true)} className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
            <Settings className="w-4 h-4" />
            Abrir Editor Visual
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Estado de la Landing
            </CardTitle>
            <CardDescription>Información actual de la configuración</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">Estado</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${currentLanding.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="font-medium">{currentLanding.isActive ? 'Activa' : 'Inactiva'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Última actualización</span>
                <div className="font-medium">
                  {new Date(currentLanding.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Secciones Activas</span>
                <div className="font-medium">
                  {currentLanding.sections?.length || 0} secciones
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Tema</span>
                <div className="font-medium capitalize">
                  {currentLanding.themeMode || 'Sistema'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center items-center text-center p-6 border-dashed border-2 bg-transparent hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => setIsEditorOpen(true)}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Editar Contenido</h3>
            <p className="text-muted-foreground max-w-xs">
                Abre el editor visual para modificar textos, imágenes, secciones y SEO.
            </p>
            <Button variant="link" className="mt-2 text-primary">
                Comenzar a editar &rarr;
            </Button>
        </Card>
      </div>

      {/* Editor Modal */}
      <UniversalLandingEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        initialData={unifiedData}
        isSaving={isSaving}
      />
    </div>
  );
}
