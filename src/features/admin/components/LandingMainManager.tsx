'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutTemplate, ExternalLink, Save } from 'lucide-react';
import { useLandingMainForm } from '../hooks/useLandingMainForm';
import { LandingMainPreview } from './landing-main/LandingMainPreview';
import { LandingMainStats } from './landing-main/LandingMainStats';
import { LandingMainEditor } from './landing-main/LandingMainEditor';

export default function LandingMainManager() {
  const {
    form,
    loading,
    saving,
    isEditing,
    previewMode,
    setIsEditing,
    setPreviewMode,
    updateField,
    updateAnnouncement,
    handleAddBubble,
    handleRemoveBubble,
    handleUpdateBubble,
    handleSave
  } = useLandingMainForm();

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
            <div className="relative">
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <LayoutTemplate className="w-6 h-6 text-primary" />
                Landing Principal
                </h2>
                <p className="text-muted-foreground mt-1">
                Configura la página de inicio que ven tus usuarios cuando no hay campañas activas.
                </p>
            </div>
            <div className="flex gap-2 relative">
                <Button variant="outline" asChild className="hover:bg-muted">
                    <a href="/impresion-3d-arequipa" target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver en vivo
                    </a>
                </Button>
                <Button onClick={handleSave} disabled={saving} className="min-w-[140px] shadow-md">
                    {saving ? (
                        <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full" />
                        Guardando...
                        </>
                    ) : (
                        <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                        </>
                    )}
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column: Visual Preview (Takes 2 cols on XL) */}
            <LandingMainPreview 
                form={form}
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                setIsEditing={setIsEditing}
            />

            {/* Right Column: Quick Status & Config */}
            <LandingMainStats 
                form={form}
                setIsEditing={setIsEditing}
            />
        </div>

        {/* Edit Sheet */}
        <LandingMainEditor 
            form={form}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            updateField={updateField}
            updateAnnouncement={updateAnnouncement}
            handleAddBubble={handleAddBubble}
            handleRemoveBubble={handleRemoveBubble}
            handleUpdateBubble={handleUpdateBubble}
        />
    </div>
  );
}
