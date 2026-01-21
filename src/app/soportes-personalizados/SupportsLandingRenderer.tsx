'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { cn } from '@/lib/utils';
import { useServiceLanding } from '@/features/service-landings/hooks/useServiceLanding';
import { ServiceHero } from '@/features/service-landings/components/sections/ServiceHero';
import { ServiceFeatures } from '@/features/service-landings/components/sections/ServiceFeatures';
import { ServiceFocus } from '@/features/service-landings/components/sections/ServiceFocus';
import { ServiceProcess } from '@/features/service-landings/components/sections/ServiceProcess';
import { ServiceShowcase } from '@/features/service-landings/components/sections/ServiceShowcase';
import { ServiceCTA } from '@/features/service-landings/components/sections/ServiceCTA';
import { ServiceFooter } from '@/features/service-landings/components/sections/ServiceFooter';
import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';
import { useAdminPermissions } from '@/features/admin/hooks/useAdminProtection';
import { UniversalLandingEditor } from '@/features/admin/components/universal-landing/UniversalLandingEditor';
import { serviceToUnified, unifiedToService } from '@/features/admin/components/universal-landing/adapters';
import { UnifiedLandingData } from '@/features/admin/components/universal-landing/types';
import { ServiceLandingsService } from '@/services/service-landings.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SupportCategory, SupportItem } from './data';
import Link from 'next/link';
import Image from 'next/image';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

interface SupportsLandingRendererProps {
  config: ServiceLandingConfig;
  categories: SupportCategory[];
  isPreview?: boolean;
}

export default function SupportsLandingRenderer({ config, categories, isPreview = false }: SupportsLandingRendererProps) {
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
  
  // Reuse the hook for theme, colors, and standard sections
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

  const initialData: UnifiedLandingData | null = useMemo(() => {
    return serviceToUnified(currentConfig);
  }, [currentConfig]);

  const handleSave = async (data: UnifiedLandingData) => {
    try {
      setIsSaving(true);
      const newConfig = unifiedToService(data);
      // Ensure we keep the correct ID/Slug for this special landing
      newConfig.id = 'soportes-personalizados-landing';
      newConfig.slug = 'soportes-personalizados';
      newConfig.category = 'special';
      
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
        {/* 1. Hero Section (Standard) */}
        <ServiceHero 
          config={renderConfig} 
          heroSection={heroSection} 
          primaryColor={primaryColor} 
          isEditable={isAdmin && !isPreview && isContentEditing}
          onChangeField={(field, value) => updateSectionField('hero', field, value)}
        />

        {/* 2. Optional Features (Before Products) */}
        <ServiceFeatures 
          featuresSection={featuresSection} 
          primaryColor={primaryColor} 
          isEditable={isAdmin && !isPreview && isContentEditing}
          onChangeTitle={value => updateSectionField('features', 'title', value)}
          onChangeSubtitle={value => updateSectionField('features', 'subtitle', value)}
          onChangeItemField={updateFeatureItemField}
        />

        {/* 3. Optional Focus Section */}
        <ServiceFocus 
          focusSection={focusSection} 
          primaryColor={primaryColor} 
        />

        {/* 4. CUSTOM PRODUCT GRID (The core content) */}
        <div id="coleccion" className="relative py-12 md:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--primary-color),_transparent_70%)] opacity-5" style={{ '--primary-color': primaryColor } as React.CSSProperties} />
            <div className="relative container mx-auto px-4 max-w-6xl">

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((category: SupportCategory) => (
                <Link
                  key={category.id}
                  href={`#${category.id}`}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-slate-100 text-xs md:text-sm font-medium text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors dark:border-indigo-500/30 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-indigo-300 dark:hover:bg-slate-900/90"
                >
                  {category.title.replace('Soportes para ', '')}
                </Link>
              ))}
            </div>

            {/* Categories & Items */}
            <div className="space-y-20">
              {categories.map((category: SupportCategory) => (
                <section key={category.id} id={category.id} className="scroll-mt-24">
                  <div className="flex flex-col md:flex-row items-baseline gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                      {category.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {category.description}
                    </p>
                  </div>

                  {category.items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.items.map((item: SupportItem) => (
                        <div 
                          key={item.id}
                          className="group relative bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-xl"
                          style={{
                              borderColor: 'transparent', // Reset default border to allow custom override via style if needed, but Tailwind usually wins.
                              // Actually, we need to target hover state. 
                              // React inline styles don't support pseudo-classes.
                              // We'll rely on a CSS variable or a class helper if possible.
                              // Or simply use the primaryColor for the price and button, which are the most important.
                              // For border, we can use a dynamic class if we had one, but we don't.
                              // Let's stick to the button/text for now to ensure cleanliness.
                          }}
                        >
                          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <Image
                              src={item.imageUrl || `/${StoragePathBuilder.ui.placeholders()}/placeholder.svg`}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {item.price ? `S/ ${item.price.toFixed(2)}` : 'Consultar'}
                              </span>
                              {item.slug ? (
                                <Link 
                                    href={`/catalogo-impresion-3d/${item.categorySlug || 'general'}/${item.slug}`}
                                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 hover:bg-opacity-90 transition-colors"
                                    style={{ 
                                        color: primaryColor,
                                        backgroundColor: `${primaryColor}15` // 15 = ~8% opacity
                                    }}
                                >
                                    Ver Detalles
                                </Link>
                              ) : (
                                <button 
                                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 hover:bg-opacity-90 transition-colors"
                                    style={{ 
                                        color: primaryColor,
                                        backgroundColor: `${primaryColor}15` 
                                    }}
                                >
                                    Ver Detalles
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-slate-500 dark:text-slate-400">
                        Próximamente agregaremos modelos a esta categoría.
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>

            </div>
        </div>

        {/* 5. Optional Process */}
        <ServiceProcess 
          processSection={processSection} 
          primaryColor={primaryColor} 
        />

        {/* 6. REMOVED GENERIC SHOWCASE - User requested categorization only */}

        {/* 7. CTA */}
        <ServiceCTA
          primaryColor={primaryColor} 
          config={renderConfig}
          isPreview={isPreview} 
        />

        {/* 8. Footer */}
        <ServiceFooter
          primaryColor={primaryColor} 
          config={renderConfig}
          isPreview={isPreview} 
        />

        {/* Admin Tools */}
        {isAdmin && !isPreview && (
          <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
              {!isContentEditing ? (
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
              )}
          </div>
        )}

        {isAdmin && (
            <UniversalLandingEditor
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                onSave={handleSave}
                initialData={initialData!}
                isSaving={isSaving}
            />
        )}
      </div>
    </>
  );
}
