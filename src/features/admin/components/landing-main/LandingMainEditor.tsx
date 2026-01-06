import React, { useMemo } from 'react';
import { LandingMainConfig } from '@/shared/types/landing';
import { UniversalLandingEditor } from '../universal-landing/UniversalLandingEditor';
import { mainToUnified, unifiedToMain } from '../universal-landing/adapters';
import { UnifiedLandingData } from '../universal-landing/types';

interface LandingMainEditorProps {
    form: LandingMainConfig;
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;
    updateField: (key: keyof LandingMainConfig, value: any) => void;
    // Legacy props
    updateAnnouncement?: (updates: Partial<any>) => void;
    handleAddBubble?: () => void;
    handleRemoveBubble?: (index: number) => void;
    handleUpdateBubble?: (index: number, value: string) => void;
    // New prop for saving directly from editor
    onSave?: (config?: LandingMainConfig) => Promise<void>;
    isSaving?: boolean;
}

export function LandingMainEditor({
    form,
    isEditing,
    setIsEditing,
    updateField,
    onSave,
    isSaving = false
}: LandingMainEditorProps) {

  const initialData: UnifiedLandingData = useMemo(() => {
    return mainToUnified(form);
  }, [form]);

  const handleUniversalSave = async (data: UnifiedLandingData) => {
    // Convert back to Main format
    const newConfig = unifiedToMain(data);
    
    // Update local state (field by field to match legacy updateField if needed, or we could bulk update if we had a bulk update function)
    // Since we only have updateField, we iterate keys or we need a bulk update.
    // However, LandingMainManager manages state via useLandingMainForm which exposes updateField.
    // We should probably just call updateField for each key that changed, OR better:
    // We assume onSave saves the *current form state*. 
    // BUT UniversalEditor works with its own local state copy until save.
    
    // So we need to sync UniversalEditor state back to parent state.
    Object.keys(newConfig).forEach((key) => {
        const k = key as keyof LandingMainConfig;
        if (newConfig[k] !== form[k]) {
            updateField(k, newConfig[k]);
        }
    });

    // If onSave is provided (it should be), call it.
    if (onSave) {
        await onSave(newConfig);
    }
    
    setIsEditing(false);
  };

  return (
    <UniversalLandingEditor
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleUniversalSave}
        initialData={initialData}
        isSaving={isSaving}
    />
  );
}
