import { useState, useEffect } from 'react';
import { GlossaryItem } from '@/shared/types/glossary';
import { GlossaryService } from '@/services/glossary.service';
import { toast } from 'sonner';

export function useGlossary() {
  const [items, setItems] = useState<GlossaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGlossary();
  }, []);

  const loadGlossary = async () => {
    try {
      setLoading(true);
      const data = await GlossaryService.fetch();
      setItems(data);
    } catch (error) {
      console.error('Failed to load glossary:', error);
      toast.error('Error al cargar el glosario');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (id: string, definition: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, definition, lastUpdated: new Date().toISOString() } : item
    ));
  };

  const addItem = (item: GlossaryItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const saveGlossary = async () => {
    try {
      setSaving(true);
      await GlossaryService.save(items);
      toast.success('Glosario actualizado correctamente');
    } catch (error) {
      console.error('Failed to save glossary:', error);
      toast.error('Error al guardar el glosario');
    } finally {
      setSaving(false);
    }
  };

  return {
    items,
    loading,
    saving,
    updateItem,
    addItem,
    removeItem,
    saveGlossary,
    refresh: loadGlossary
  };
}
