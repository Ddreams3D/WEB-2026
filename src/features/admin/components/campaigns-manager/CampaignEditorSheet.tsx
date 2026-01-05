import React from 'react';
import { Sheet } from '@/components/ui/simple-sheet';
import { Button } from '@/components/ui/button';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { AnnouncementBarConfig } from '@/shared/types/landing';
import { CampaignEditorGeneral } from './CampaignEditorGeneral';
import { CampaignEditorDates } from './CampaignEditorDates';
import { CampaignEditorContent } from './CampaignEditorContent';
import { CampaignEditorAnnouncement } from './CampaignEditorAnnouncement';

interface CampaignEditorSheetProps {
  editingId: string | null;
  themes: SeasonalThemeConfig[];
  onClose: () => void;
  updateTheme: (themeId: string, updates: Partial<SeasonalThemeConfig>) => void;
  updateLanding: (themeId: string, updates: Partial<SeasonalThemeConfig['landing']>) => void;
  updateAnnouncement: (themeId: string, updates: Partial<AnnouncementBarConfig>) => void;
  updateDateRange: (themeId: string, index: number, field: 'start' | 'end', subField: 'month' | 'day', value: number) => void;
  addDateRange: (themeId: string) => void;
  removeDateRange: (themeId: string, index: number) => void;
}

export function CampaignEditorSheet({
  editingId,
  themes,
  onClose,
  updateTheme,
  updateLanding,
  updateAnnouncement,
  updateDateRange,
  addDateRange,
  removeDateRange
}: CampaignEditorSheetProps) {
  const editingTheme = themes.find(t => t.id === editingId);

  return (
    <Sheet 
      isOpen={!!editingId} 
      onClose={onClose} 
      title={editingTheme ? `Editar: ${editingTheme.name}` : 'Editar Campaña'}
      description={editingTheme ? `ID: ${editingTheme.id}` : ''}
      className="sm:max-w-xl md:max-w-2xl"
      underHeader={true}
    >
      {editingTheme && (
        <div className="space-y-8 pb-8">
          <CampaignEditorGeneral 
            theme={editingTheme} 
            updateTheme={updateTheme} 
          />

          <CampaignEditorDates
            theme={editingTheme}
            updateDateRange={updateDateRange}
            addDateRange={addDateRange}
            removeDateRange={removeDateRange}
          />

          <CampaignEditorContent 
            theme={editingTheme} 
            updateLanding={updateLanding} 
          />

          <CampaignEditorAnnouncement
            theme={editingTheme}
            updateAnnouncement={updateAnnouncement}
          />

          <div className="flex justify-end pt-8 border-t">
             <Button onClick={onClose} className="min-w-[120px]">
                Hecho
             </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
