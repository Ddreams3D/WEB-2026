'use client';

// Force re-evaluation
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { 
  Store as StoreIcon,
  Settings as CogIcon,
  ShieldCheck as ShieldCheckIcon,
  Check as CheckIcon
} from '@/lib/icons';
import { LayoutTemplate, BookOpen, Languages, Brain, Dna, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminSettings, AdminSettings } from '@/features/admin/settings/hooks/useAdminSettings';
import { useAdminLayout } from '@/shared/components/layout/AdminLayout';
import dynamic from 'next/dynamic';

// Interfaces for dynamic components to satisfy TypeScript
interface SettingsProps {
  settings: AdminSettings;
  updateSetting: (section: keyof AdminSettings, key: string, value: unknown) => void;
}

const GeneralSettings = dynamic<SettingsProps>(() => import('@/features/admin/settings/components/GeneralSettings').then(m => m.GeneralSettings), { ssr: false });
const StoreSettings = dynamic<SettingsProps>(() => import('@/features/admin/settings/components/StoreSettings').then(m => m.StoreSettings), { ssr: false });
const AnalyticsSettings = dynamic<SettingsProps>(() => import('@/features/admin/settings/components/AnalyticsSettings').then(m => m.AnalyticsSettings), { ssr: false });
const PagesSettings = dynamic(() => import('@/features/admin/settings/components/PagesSettings').then(m => m.PagesSettings), { ssr: false });
const GlossarySettings = dynamic(() => import('@/features/admin/settings/components/GlossarySettings').then(m => m.GlossarySettings), { ssr: false });
const PromptVocabularySettings = dynamic(() => import('@/features/admin/settings/components/PromptVocabularySettings').then(m => m.PromptVocabularySettings), { ssr: false });
const AIRulesManager = dynamic(() => import('@/features/admin/settings/components/ai-rules/AIRulesManager').then(m => m.AIRulesManager), { ssr: false });
const ArchitectureSettings = dynamic(() => import('@/features/admin/settings/components/ArchitectureSettings').then(m => m.ArchitectureSettings), { ssr: false });

export default function Settings() {
  const searchParams = useSearchParams();
  const { settings, saved, handleSave, updateSetting } = useAdminSettings();
  const [activeTab, setActiveTab] = useState(searchParams?.get('tab') || 'general');
  const { isFullscreen, toggleFullscreen } = useAdminLayout();

  // Pestañas de navegación
  const tabs = [
    { id: 'general', label: 'General y Contacto', icon: CogIcon },
    { id: 'store', label: 'Tienda y Pagos', icon: StoreIcon },
    { id: 'pages', label: 'Páginas y Rutas', icon: LayoutTemplate },
    { id: 'analytics', label: 'Analytics', icon: ShieldCheckIcon },
    { id: 'glossary', label: 'Glosario / Conceptos', icon: BookOpen },
    { id: 'prompt-lang', label: 'Lenguaje del Proyecto', icon: Languages },
    { id: 'ai-rules', label: 'Reglas IA', icon: Brain },
    { id: 'architecture', label: 'ADN del Proyecto', icon: Dna }
  ];

  // Identificar si la pestaña actual permite modo lectura
  const isReadingTab = ['glossary', 'prompt-lang', 'ai-rules', 'architecture'].includes(activeTab);

  return (
    <div className={cn("mx-auto pb-10", isFullscreen ? "max-w-full" : "max-w-6xl")}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Configuración
            </h1>
            {isReadingTab && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="ml-2 gap-2 text-muted-foreground hover:text-primary"
                title={isFullscreen ? "Salir del modo lectura" : "Modo lectura (Pantalla completa)"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isFullscreen ? "Salir de Lectura" : "Modo Lectura"}</span>
              </Button>
            )}
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
            Personaliza la experiencia de tu tienda y administra la información vital.
          </p>
        </div>
        {!isFullscreen && (
          <Button 
            onClick={handleSave}
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            size="lg"
            disabled={saved}
          >
            {saved ? <CheckIcon className="w-5 h-5" /> : null}
            {saved ? 'Guardado Exitosamente' : 'Guardar Cambios'}
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de navegación - Oculto en fullscreen */}
        {!isFullscreen && (
          <div className="w-full lg:w-72 flex-shrink-0">
            <nav className="space-y-1 sticky top-8 bg-card p-2 rounded-xl border border-border shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="ml-auto bg-primary-foreground/20 w-1.5 h-1.5 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Contenido principal */}
        <div className={cn("flex-1 min-w-0", isFullscreen && "mx-auto max-w-5xl")}>
          {activeTab === 'general' && (
            <GeneralSettings settings={settings} updateSetting={updateSetting} />
          )}

          {activeTab === 'store' && (
            <StoreSettings settings={settings} updateSetting={updateSetting} />
          )}

          {activeTab === 'pages' && (
            <PagesSettings />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsSettings settings={settings} updateSetting={updateSetting} />
          )}

          {activeTab === 'glossary' && (
            <GlossarySettings />
          )}
          
          {activeTab === 'prompt-lang' && (
            <PromptVocabularySettings />
          )}

          {activeTab === 'ai-rules' && (
            <AIRulesManager />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureSettings />
          )}
        </div>
      </div>
    </div>
  );
}