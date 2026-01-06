import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { ServiceLandingConfig, DEFAULT_SERVICE_LANDING } from '@/shared/types/service-landing';
import { SERVICE_LANDINGS_DATA } from '@/shared/data/service-landings-data';
import { ServiceLandingsService } from '@/services/service-landings.service';

export function useServiceLandingsManager() {
  const [landings, setLandings] = useState<ServiceLandingConfig[]>(SERVICE_LANDINGS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentLanding, setCurrentLanding] = useState<ServiceLandingConfig | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Load real data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Use Client Service directly to leverage client-side auth
        const data = await ServiceLandingsService.getAll();
        if (data && data.length > 0) {
          setLandings(data);
        }
      } catch (error) {
        console.error("Failed to load service landings:", error);
        toast.error("Error al cargar datos actualizados");
      }
    };
    loadData();
  }, []);

  const filteredLandings = useMemo(() => {
    return landings.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [landings, searchQuery]);

  const handleCreateNew = () => {
    const newLanding: ServiceLandingConfig = {
      ...DEFAULT_SERVICE_LANDING,
      id: crypto.randomUUID(),
      name: "Nueva Landing de Servicio",
      slug: "nuevo-servicio-" + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentLanding(newLanding);
    setIsEditing(true);
  };

  const handleEdit = (landing: ServiceLandingConfig) => {
    setCurrentLanding({...landing});
    setIsEditing(true);
  };

  const handleSave = async (landingToSave?: ServiceLandingConfig) => {
    const targetLanding = landingToSave || currentLanding;
    if (!targetLanding) return;
    
    try {
      // Optimistic update
      const exists = landings.find(l => l.id === targetLanding.id);
      let newLandings;
      
      if (exists) {
        newLandings = landings.map(l => l.id === targetLanding.id ? targetLanding : l);
      } else {
        newLandings = [...landings, targetLanding];
      }
      setLandings(newLandings);
      
      // Persist to server/file using Client Service (with Auth)
      await ServiceLandingsService.save(targetLanding);
      
      setIsEditing(false);
      setCurrentLanding(null);
      toast.success("Landing guardada correctamente");
    } catch (error) {
      console.error("Error saving landing:", error);
      toast.error("Error al guardar los cambios");
      // Could revert optimistic update here if needed
    }
  };

  const updateField = (field: keyof ServiceLandingConfig, value: any) => {
    if (!currentLanding) return;
    setCurrentLanding({ ...currentLanding, [field]: value });
  };

  const updateCurrentLanding = (landing: ServiceLandingConfig) => {
    setCurrentLanding(landing);
  };

  return {
    landings,
    searchQuery,
    setSearchQuery,
    isEditing,
    setIsEditing,
    currentLanding,
    setCurrentLanding, // Already exposed? No, it was in return but not used in component props
    updateCurrentLanding,
    previewMode,
    setPreviewMode,
    filteredLandings,
    handleCreateNew,
    handleEdit,
    handleSave,
    updateField
  };
}
