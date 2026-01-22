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
        themeMode: data.themeMode,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const isActive = theme.isActive;
          const isStandard = theme.id === 'standard';
          
          return (
            <Card key={theme.id} className={`overflow-hidden transition-all duration-300 ${isActive ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : 'hover:shadow-md'}`}>
              {/* Preview Header */}
              <div 
                className="h-32 relative flex items-center justify-center"
                style={{ 
                  backgroundColor: theme.landing.primaryColor || (isStandard ? '#000000' : '#888888'),
                  color: '#ffffff'
                }}
              >
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div className="relative z-10 text-center p-4">
                  <h3 className="font-bold text-xl drop-shadow-md">{theme.name}</h3>
                  {isStandard && <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-none">Por defecto</Badge>}
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {isActive ? (
                    <Badge className="bg-green-500 hover:bg-green-600 gap-1 pl-1.5">
                      <Check className="w-3 h-3" /> Activo
                    </Badge>
                  ) : (
                    theme.applyThemeToGlobal === false && (
                      <Badge variant="outline" className="bg-background/50 backdrop-blur border-white/40 text-white gap-1">
                        <Lock className="w-3 h-3" /> Solo Landing
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">ID: {theme.themeId}</span>
                  {theme.landing.primaryColor && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: theme.landing.primaryColor }} />
                      <span className="font-mono text-xs opacity-70">{theme.landing.primaryColor}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant={isActive ? "default" : "outline"} 
                    className="flex-1"
                    onClick={() => {
                      if (isActive && !isStandard) {
                        // Deactivate
                        updateTheme(theme.id, { isActive: false });
                        handleSave({ ...theme, isActive: false });
                      } else {
                        // Activate
                        updateTheme(theme.id, { isActive: true });
                        handleSave({ ...theme, isActive: true });
                      }
                    }}
                    disabled={saving || (isStandard && isActive) || automationEnabled}
                  >
                    {isActive ? 'Desactivar' : 'Activar Manualmente'}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingId(theme.id)}
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                </div>
                
                {automationEnabled && !isStandard && (
                  <p className="text-xs text-center text-muted-foreground italic">
                    Gestionado automáticamente por fecha
                  </p>
                )}
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
