'use client';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Save } from '@/lib/icons';
import { useCampaignsManager } from '../hooks/useCampaignsManager';
import { CampaignsTimeline } from './campaigns-manager/CampaignsTimeline';
import { CampaignsList } from './campaigns-manager/CampaignsList';
import { CampaignEditorSheet } from './campaigns-manager/CampaignEditorSheet';

export default function CampaignsManager() {
  const {
    themes,
    loading,
    saving,
    editingId,
    setEditingId,
    handleSave,
    updateTheme,
    updateLanding,
    updateAnnouncement,
    updateDateRange,
    addDateRange,
    removeDateRange
  } = useCampaignsManager();

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Calendario de Campañas
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestiona la visibilidad y contenido de las campañas estacionales.
          </p>
        </div>
        <div className="flex gap-2 relative">
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="hover:bg-muted">
            Cancelar
          </Button>
          <Button onClick={() => handleSave()} disabled={saving} className="min-w-[140px] shadow-md hover:shadow-lg transition-all">
            {saving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Todo
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Visual Calendar - Redesigned */}
      <CampaignsTimeline 
        themes={themes}
        editingId={editingId}
        setEditingId={setEditingId}
      />

      {/* Campaigns List (Grid View Redesigned) */}
      <CampaignsList 
        themes={themes}
        setEditingId={setEditingId}
      />

      {/* Editor Sheet */}
      <CampaignEditorSheet
        editingId={editingId}
        themes={themes}
        onClose={() => setEditingId(null)}
        onSave={handleSave}
        isSaving={saving}
        updateTheme={updateTheme}
        updateLanding={updateLanding}
        updateAnnouncement={updateAnnouncement}
        updateDateRange={updateDateRange}
        addDateRange={addDateRange}
        removeDateRange={removeDateRange}
      />
    </div>
  );
}
