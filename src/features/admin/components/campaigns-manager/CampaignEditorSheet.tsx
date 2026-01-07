import React, { useMemo } from 'react';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { AnnouncementBarConfig } from '@/shared/types/landing';
import { UniversalLandingEditor } from '../universal-landing/UniversalLandingEditor';
import { campaignToUnified, unifiedToCampaign } from '../universal-landing/adapters';
import { UnifiedLandingData } from '../universal-landing/types';

interface CampaignEditorSheetProps {
  editingId: string | null;
  themes: SeasonalThemeConfig[];
  onClose: () => void;
  onSave: (theme?: SeasonalThemeConfig) => Promise<void>;
  isSaving: boolean;
  updateTheme: (themeId: string, updates: Partial<SeasonalThemeConfig>) => void;
  // Legacy props - not used by UniversalEditor but kept for compatibility if needed
  updateLanding?: (themeId: string, updates: Partial<SeasonalThemeConfig['landing']>) => void;
  updateAnnouncement?: (themeId: string, updates: Partial<AnnouncementBarConfig>) => void;
  updateDateRange?: (themeId: string, index: number, field: 'start' | 'end', subField: 'month' | 'day', value: number) => void;
  addDateRange?: (themeId: string) => void;
  removeDateRange?: (themeId: string, index: number) => void;
  automationEnabled?: boolean;
}

export function CampaignEditorSheet({
  editingId,
  themes,
  onClose,
  onSave,
  isSaving,
  updateTheme,
  automationEnabled
}: CampaignEditorSheetProps) {
  const editingTheme = themes.find(t => t.id === editingId);

  const initialData: UnifiedLandingData | null = useMemo(() => {
    if (!editingTheme) return null;
    return campaignToUnified(editingTheme);
  }, [editingTheme]);

  const handleUniversalSave = async (data: UnifiedLandingData) => {
    if (!editingTheme) return;
    
    // Convert back to Campaign format
    const updates = unifiedToCampaign(data);
    
    // Create the full updated theme object
    const updatedTheme = { ...editingTheme, ...updates };

    // Update local state
    updateTheme(editingTheme.id, updates);
    
    // Persist to backend with the NEW theme data
    await onSave(updatedTheme);
    
    // Close editor
    onClose();
  };

  if (!editingTheme || !initialData) return null;

  return (
    <UniversalLandingEditor
      isOpen={!!editingId}
      onClose={onClose}
      onSave={handleUniversalSave}
      initialData={initialData}
      isSaving={isSaving}
      automationEnabled={automationEnabled}
    />
  );
}
