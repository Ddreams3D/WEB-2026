import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { ServiceLandingConfig, DEFAULT_SERVICE_LANDING } from '@/shared/types/service-landing';
import { SERVICE_LANDINGS_DATA } from '@/shared/data/service-landings-data';

export function useServiceLandingsManager() {
  const [landings, setLandings] = useState<ServiceLandingConfig[]>(SERVICE_LANDINGS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentLanding, setCurrentLanding] = useState<ServiceLandingConfig | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

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

  const handleSave = () => {
    if (!currentLanding) return;
    
    // Simulating save logic
    const exists = landings.find(l => l.id === currentLanding.id);
    if (exists) {
      setLandings(landings.map(l => l.id === currentLanding.id ? currentLanding : l));
    } else {
      setLandings([...landings, currentLanding]);
    }
    
    setIsEditing(false);
    setCurrentLanding(null);
    toast.success("Landing guardada correctamente");
  };

  const updateField = (field: keyof ServiceLandingConfig, value: any) => {
    if (!currentLanding) return;
    setCurrentLanding({ ...currentLanding, [field]: value });
  };

  return {
    landings,
    searchQuery,
    setSearchQuery,
    isEditing,
    setIsEditing,
    currentLanding,
    setCurrentLanding,
    previewMode,
    setPreviewMode,
    filteredLandings,
    handleCreateNew,
    handleEdit,
    handleSave,
    updateField
  };
}
