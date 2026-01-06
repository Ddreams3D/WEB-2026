import React, { useMemo } from 'react';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { UniversalLandingEditor } from '../universal-landing/UniversalLandingEditor';
import { serviceToUnified, unifiedToService } from '../universal-landing/adapters';
import { UnifiedLandingData } from '../universal-landing/types';

interface ServiceLandingEditorSheetProps {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    currentLanding: ServiceLandingConfig | null;
    updateField: (field: keyof ServiceLandingConfig, value: any) => void;
    updateCurrentLanding?: (landing: ServiceLandingConfig) => void;
    onSave: (landing?: ServiceLandingConfig) => void;
    isSaving?: boolean;
}

export function ServiceLandingEditorSheet({
    isEditing,
    setIsEditing,
    currentLanding,
    updateCurrentLanding,
    onSave,
    isSaving = false
}: ServiceLandingEditorSheetProps) {
  
  const initialData: UnifiedLandingData | null = useMemo(() => {
    if (!currentLanding) return null;
    return serviceToUnified(currentLanding);
  }, [currentLanding]);

  const handleUniversalSave = async (data: UnifiedLandingData) => {
    if (!currentLanding) return;
    
    // Convert back to Service format
    const newConfig = unifiedToService(data);
    
    // Update local state
    if (updateCurrentLanding) {
        updateCurrentLanding(newConfig);
    }
    
    // Persist
    onSave(newConfig);
  };

  if (!currentLanding || !initialData) return null;

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
