'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Zap, ZapOff, Save, Check, Lock } from 'lucide-react';
import { useCampaignsManager } from '../../hooks/useCampaignsManager';
import { UniversalLandingEditor } from '../universal-landing/UniversalLandingEditor';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { UnifiedLandingData } from '../universal-landing/types';
import { serviceToUnified, unifiedToService } from '../universal-landing/adapters';
import { toast } from 'sonner';

export default function ThemeManager() {
  const {
    themes,
    automationEnabled,
    loading,
    saving,
    editingId,
    setEditingId,
    handleSave,
    toggleAutomation,
    updateTheme,
  } = useCampaignsManager();

  // Adapter functions for Theme Only editing
  const getEditorData = (themeId: string): UnifiedLandingData => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) throw new Error('Theme not found');

    // Adapt SeasonalThemeConfig to UnifiedLandingData
    // We mock a campaign landing but focus on visual props
    return {
      type: 'campaign',
      id: theme.id,
      internalName: theme.name,
      isActive: theme.isActive,
      themeMode: theme.landing.themeMode || 'light',
      primaryColor: theme.landing.primaryColor,
      secondaryColor: theme.landing.secondaryColor,
      backgroundColor: theme.landing.backgroundColor,
      patternOverlay: theme.landing.patternOverlay,
      buttonStyle: theme.landing.buttonStyle,
      fontFamilyHeading: theme.landing.fontFamilyHeading,
      fontFamilyBody: theme.landing.fontFamilyBody,
      // Pass necessary but hidden props
      heroTitle: theme.landing.heroTitle,
      heroSubtitle: theme.landing.heroSubtitle,
      heroDescription: theme.landing.heroDescription,
      heroImage: theme.landing.heroImage,
      campaignDates: theme.dateRanges,
      campaignThemeId: theme.themeId,
      applyThemeToGlobal: theme.applyThemeToGlobal,
      _originalCampaign: theme
    };
  };

  const handleEditorSave = async (data: UnifiedLandingData) => {
    if (!data._originalCampaign) return;

    // Merge visual updates back into SeasonalThemeConfig
    const updatedTheme: SeasonalThemeConfig = {
      ...data._originalCampaign,
      landing: {
        ...data._originalCampaign.landing,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        backgroundColor: data.backgroundColor,
        themeMode: data.themeMode,
        patternOverlay: data.patternOverlay,
        buttonStyle: data.buttonStyle,
        fontFamilyHeading: data.fontFamilyHeading,
        fontFamilyBody: data.fontFamilyBody,
        // Ensure other fields are preserved
      },
      applyThemeToGlobal: data.applyThemeToGlobal
    };

    await handleSave(updatedTheme);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent pointer-events-none" />
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Palette className="w-6 h-6 text-pink-500" />
            Apariencia Global
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestiona los temas visuales (colores, decoraciones) que se aplican a toda la web.
          </p>
        </div>
        
        <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
          <Switch 
            id="automation-mode-theme" 
            checked={automationEnabled}
            onCheckedChange={toggleAutomation}
            disabled={saving}
          />
          <Label htmlFor="automation-mode-theme" className="cursor-pointer flex items-center gap-2 text-sm font-medium">
            {automationEnabled ? (
              <>
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-amber-700">Automático ON</span>
              </>
            ) : (
              <>
                <ZapOff className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Automático OFF</span>
              </>
            )}
          </Label>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {themes.map((theme) => {
          const isActive = theme.isActive;
          const isStandard = theme.id === 'standard';
          
          return (
            <Card key={theme.id} className={`group overflow-hidden transition-all duration-300 border-2 ${isActive ? 'border-primary shadow-lg scale-[1.01]' : 'border-transparent hover:border-border hover:shadow-md'}`}>
              
              {/* Theme Preview Body */}
              <div className="relative aspect-[4/3] w-full bg-muted/20 flex flex-col">
                 {/* Mini UI Mockup */}
                 <div className="absolute inset-0 p-4 flex flex-col gap-3" style={{ backgroundColor: theme.landing.backgroundColor || '#ffffff' }}>
                    {/* Fake Header */}
                    <div className="h-2 w-1/3 rounded-full opacity-20 bg-current" />
                    
                    {/* Hero Area Mock */}
                    <div className="flex-1 rounded-lg flex items-center justify-center p-4 text-center relative overflow-hidden" 
                         style={{ 
                           backgroundColor: theme.landing.primaryColor || '#000',
                           color: '#ffffff'
                         }}>
                       <div className="relative z-10 space-y-2">
                          <div className="h-2 w-16 mx-auto rounded-full bg-white/40" />
                          <div className="h-6 w-24 mx-auto rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold">
                             {theme.name}
                          </div>
                       </div>
                       {/* Decorative Circle */}
                       <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-20" style={{ backgroundColor: theme.landing.secondaryColor || 'transparent' }} />
                    </div>

                    {/* Content Mock */}
                    <div className="space-y-2">
                       <div className="flex gap-2">
                          <div className="h-8 w-full rounded-md opacity-10 bg-current" />
                          <div className="h-8 w-8 rounded-md" style={{ backgroundColor: theme.landing.secondaryColor || '#888' }} />
                       </div>
                    </div>
                 </div>

                 {/* Overlay Actions (Visible on Hover) */}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-transparent text-white border-white hover:bg-white hover:text-black"
                      onClick={() => setEditingId(theme.id)}
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Personalizar
                    </Button>
                 </div>

                 {/* Active Badge */}
                 {isActive && (
                    <div className="absolute top-3 right-3 z-20">
                      <Badge className="bg-green-500 hover:bg-green-600 text-white border-none shadow-sm gap-1">
                        <Check className="w-3 h-3" /> Activo
                      </Badge>
                    </div>
                 )}
              </div>

              {/* Theme Info Footer */}
              <div className="p-4 bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-sm">{theme.name}</h3>
                    <p className="text-xs text-muted-foreground">{isStandard ? 'Tema Base' : 'Campaña Estacional'}</p>
                  </div>
                  
                  {/* Color Palette Dots */}
                  <div className="flex -space-x-2">
                    {[theme.landing.primaryColor, theme.landing.secondaryColor, theme.landing.backgroundColor].filter(Boolean).map((color, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-card shadow-sm" style={{ backgroundColor: color }} title={color} />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                   <Button 
                      variant={isActive ? "secondary" : "outline"} 
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => {
                        if (isActive && !isStandard) {
                           updateTheme(theme.id, { isActive: false });
                           handleSave({ ...theme, isActive: false });
                        } else {
                           updateTheme(theme.id, { isActive: true });
                           handleSave({ ...theme, isActive: true });
                        }
                      }}
                      disabled={saving || (isStandard && isActive) || automationEnabled}
                   >
                      {isActive ? 'Desactivar' : 'Activar'}
                   </Button>
                </div>
              </div>

            </Card>
          );
        })}
      </div>

      {/* Editor Modal */}
      {editingId && (
        <UniversalLandingEditor
          isOpen={!!editingId}
          onClose={() => setEditingId(null)}
          onSave={handleEditorSave}
          initialData={getEditorData(editingId)}
          isSaving={saving}
          automationEnabled={automationEnabled}
          mode="theme_only"
        />
      )}
    </div>
  );
}
