"use client";

import { useServiceLandingsManager } from "@/features/admin/hooks/useServiceLandingsManager";
import { ServiceLandingsHeader } from "./service-landings-manager/ServiceLandingsHeader";
import { ServiceLandingsList } from "./service-landings-manager/ServiceLandingsList";
import { ServiceLandingEditorSheet } from "./service-landings-manager/ServiceLandingEditorSheet";

export default function ServiceLandingsManager() {
    const {
        filteredLandings,
        searchQuery,
        setSearchQuery,
        handleCreateNew,
        handleEdit,
        handleSave,
        isEditing,
        setIsEditing,
        currentLanding,
        updateField,
        updateCurrentLanding
    } = useServiceLandingsManager();

    return (
        <div className="space-y-6">
            <ServiceLandingsHeader
                filteredLandings={filteredLandings}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleCreateNew={handleCreateNew}
            />

            <ServiceLandingsList
                filteredLandings={filteredLandings}
                handleEdit={handleEdit}
                handleCreateNew={handleCreateNew}
            />

            <ServiceLandingEditorSheet
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                currentLanding={currentLanding}
                updateField={updateField}
                updateCurrentLanding={updateCurrentLanding}
                onSave={handleSave}
            />
        </div>
    );
}
