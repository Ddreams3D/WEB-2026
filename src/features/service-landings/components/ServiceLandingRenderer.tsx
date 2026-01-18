'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { cn } from '@/lib/utils';
import { useServiceLanding } from '@/features/service-landings/hooks/useServiceLanding';
import { ServiceHero } from './sections/ServiceHero';
import { ServiceFeatures } from './sections/ServiceFeatures';
import { ServiceFocus } from './sections/ServiceFocus';
import { ServiceProcess } from './sections/ServiceProcess';
import { ServiceShowcase } from './sections/ServiceShowcase';
import { ServiceCTA } from './sections/ServiceCTA';
import { ServiceFooter } from './sections/ServiceFooter';
import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';
import { useAdminPermissions } from '@/features/admin/hooks/useAdminProtection';
import { UniversalLandingEditor } from '@/features/admin/components/universal-landing/UniversalLandingEditor';
import { serviceToUnified, unifiedToService } from '@/features/admin/components/universal-landing/adapters';
import { UnifiedLandingData } from '@/features/admin/components/universal-landing/types';
import { ServiceLandingsService } from '@/services/service-landings.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ServiceLandingRendererProps {
  config: ServiceLandingConfig;
  isPreview?: boolean;
}

export default function ServiceLandingRenderer({ config, isPreview = false }: ServiceLandingRendererProps) {
  const [currentConfig, setCurrentConfig] = useState<ServiceLandingConfig>(config);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isContentEditing, setIsContentEditing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ServiceLandingConfig | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { isAdmin } = useAdminPermissions();

  useEffect(() => {
    setCurrentConfig(config);
  }, [config]);

  const renderConfig = editingConfig ?? currentConfig;
  const isOrganicLanding = renderConfig.id === 'organic-modeling';

  const {
    featuredProducts,
    themeClass,
    primaryColor,
    heroSection,
    featuresSection,
    focusSection,
    processSection,
    gallerySection
  } = useServiceLanding(renderConfig, isPreview);

  useEffect(() => {
    if (isPreview) return;

    trackEvent(AnalyticsEvents.VIEW_SERVICE_LANDING, {
      id: currentConfig.id,
      name: currentConfig.name,
      location: AnalyticsLocations.SERVICE_LANDING,
      page_type: 'service',
    });
  }, [currentConfig.id, currentConfig.name, isPreview]);

  const style = {
      '--primary-color': primaryColor,
  } as React.CSSProperties;

  if (renderConfig.id === 'organic-modeling') {
    (style as any)['--foreground'] = '20 14.3% 10%';
    (style as any)['--muted-foreground'] = '25 5.3% 45%';
  }

  if (renderConfig.id === 'trophies') {
    (style as any)['--background'] = '222.2 84% 4.9%';
    (style as any)['--card'] = '222.2 84% 4.9%';
    (style as any)['--popover'] = '222.2 84% 4.9%';
    
    // Foregrounds (Slate 50)
    (style as any)['--foreground'] = '210 40% 98%';
    (style as any)['--card-foreground'] = '210 40% 98%';
    (style as any)['--popover-foreground'] = '210 40% 98%';
    
    // Secondary/Muted elements (Slate 900/800)
    (style as any)['--secondary'] = '217.2 32.6% 17.5%';
    (style as any)['--secondary-foreground'] = '210 40% 98%';
    (style as any)['--muted'] = '217.2 32.6% 17.5%';
    (style as any)['--muted-foreground'] = '215 20.2% 65.1%'; // Lighter gray for readability on dark
    (style as any)['--accent'] = '217.2 32.6% 17.5%';
    (style as any)['--accent-foreground'] = '210 40% 98%';
    
    // Borders (Slate 800)
    (style as any)['--border'] = '217.2 32.6% 17.5%';
    (style as any)['--input'] = '217.2 32.6% 17.5%';
  }

  const initialData: UnifiedLandingData | null = useMemo(() => {
    return serviceToUnified(currentConfig);
  }, [currentConfig]);

  const handleSave = async (data: UnifiedLandingData) => {
    try {
      setIsSaving(true);
      const newConfig = unifiedToService(data);
      await ServiceLandingsService.save(newConfig);
      setCurrentConfig(newConfig);
      toast.success('Landing actualizada correctamente');
      setIsEditing(false);
    } catch (error: any) {
      const message = error?.message || 'No se pudo guardar la landing';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const startContentEditing = () => {
    if (!isOrganicLanding) return;
    setEditingConfig(currentConfig);
    setIsContentEditing(true);
    setHasUnsavedChanges(false);
  };

  const cancelContentEditing = () => {
    setEditingConfig(null);
    setIsContentEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleInlineSave = async () => {
    if (!editingConfig) return;
    try {
      setIsSaving(true);
      await ServiceLandingsService.save(editingConfig);
      setCurrentConfig(editingConfig);
      setEditingConfig(null);
      setIsContentEditing(false);
      setHasUnsavedChanges(false);
      toast.success('Contenido actualizado correctamente');
    } catch (error: any) {
      const message = error?.message || 'No se pudo guardar el contenido';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSectionField = (sectionType: 'hero' | 'features', field: 'title' | 'subtitle' | 'content', value: string) => {
    setEditingConfig(prev => {
      if (!prev) return prev;
      const sections = prev.sections.map(section => {
        if (section.type === sectionType) {
          return {
            ...section,
            [field]: value,
          };
        }
        return section;
      });
      return {
        ...prev,
        sections,
      };
    });
    setHasUnsavedChanges(true);
  };

  const updateFeatureItemField = (index: number, field: 'title' | 'description', value: string) => {
    setEditingConfig(prev => {
      if (!prev) return prev;
      const sections = prev.sections.map(section => {
        if (section.type !== 'features' || !section.items) return section;
        const items = section.items.map((item, idx) => {
          if (idx !== index) return item;
          return {
            ...item,
            [field]: value,
          };
        });
        return {
          ...section,
          items,
        };
      });
      return {
        ...prev,
        sections,
      };
    });
    setHasUnsavedChanges(true);
  };

  return (
    <>
      <div 
        className={cn("min-h-screen bg-background overflow-x-hidden text-foreground", themeClass)} 
        style={style}
        data-theme={themeClass === 'light' ? 'standard' : undefined}
      >
        <ServiceHero 
          config={renderConfig} 
          heroSection={heroSection} 
          primaryColor={primaryColor} 
          isEditable={isAdmin && !isPreview && isContentEditing && isOrganicLanding}
          onChangeField={(field, value) => updateSectionField('hero', field, value)}
        />

        <ServiceFocus 
          focusSection={focusSection} 
          primaryColor={primaryColor} 
        />

        <ServiceProcess 
          processSection={processSection} 
          primaryColor={primaryColor} 
        />

        <ServiceFeatures 
          featuresSection={featuresSection} 
          primaryColor={primaryColor} 
          isEditable={isAdmin && !isPreview && isContentEditing && isOrganicLanding}
          onChangeTitle={value => updateSectionField('features', 'title', value)}
          onChangeSubtitle={value => updateSectionField('features', 'subtitle', value)}
          onChangeItemField={updateFeatureItemField}
        />

        <ServiceShowcase 
          config={renderConfig} 
          featuredProducts={featuredProducts} 
          gallerySection={gallerySection}
          isPreview={isPreview} 
        />

        <ServiceCTA
          primaryColor={primaryColor} 
          config={renderConfig}
          isPreview={isPreview} 
        />

        <ServiceFooter
          primaryColor={primaryColor} 
          config={renderConfig}
          isPreview={isPreview} 
        />

        {isAdmin && !isPreview && (
          <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {isOrganicLanding ? (
              !isContentEditing ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary bg-background/80 backdrop-blur shadow-md hover:bg-primary hover:text-white"
                    onClick={startContentEditing}
                    disabled={isSaving}
                  >
                    Editar contenido
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-background/80 backdrop-blur shadow-md hover:bg-primary hover:text-white"
                    onClick={() => setIsEditing(true)}
                    disabled={isSaving}
                  >
                    Panel avanzado
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-primary text-white shadow-md hover:opacity-90"
                    onClick={handleInlineSave}
                    disabled={isSaving || !hasUnsavedChanges}
                  >
                    Guardar contenido
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-background/80 backdrop-blur shadow-md hover:bg-muted"
                    onClick={cancelContentEditing}
                    disabled={isSaving}
                  >
                    Descartar
                  </Button>
                </div>
              )
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="bg-background/80 backdrop-blur shadow-md hover:bg-primary hover:text-white"
                onClick={() => setIsEditing(true)}
                disabled={isSaving}
              >
                Editar landing
              </Button>
            )}
          </div>
        )}
      </div>

      {isAdmin && !isPreview && initialData && (
        <UniversalLandingEditor
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          initialData={initialData}
          isSaving={isSaving}
        />
      )}
    </>
  );
}
