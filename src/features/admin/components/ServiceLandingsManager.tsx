"use client";

import { useServiceLandingsManager } from "@/features/admin/hooks/useServiceLandingsManager";
import { ServiceLandingsHeader } from "./service-landings-manager/ServiceLandingsHeader";
import { ServiceLandingsList } from "./service-landings-manager/ServiceLandingsList";

export default function ServiceLandingsManager() {
    const {
        filteredLandings,
        searchQuery,
        setSearchQuery,
        handleCreateNew
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
                handleCreateNew={handleCreateNew}
            />
        </div>
    );
}
