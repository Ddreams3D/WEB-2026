import { useEffect, useState } from 'react';
import { PromptVocabularyItem } from '@/shared/types/prompt-vocabulary';
import { PromptVocabularyService } from '@/services/prompt-vocabulary.service';
import { toast } from 'sonner';

export function usePromptVocabulary() {
  const [items, setItems] = useState<PromptVocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await PromptVocabularyService.fetch();
      setItems(data);
    } catch (error) {
      console.error('Failed to load prompt vocabulary:', error);
      toast.error('Error al cargar el lenguaje del proyecto');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (id: string, updates: Partial<PromptVocabularyItem>) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item))
    );
  };

  const addItem = (item: PromptVocabularyItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = async () => {
    try {
      setSaving(true);
      await PromptVocabularyService.save(items);
      toast.success('Lenguaje del Proyecto actualizado');
    } catch (error) {
      console.error('Failed to save prompt vocabulary:', error);
      toast.error('Error al guardar el lenguaje del proyecto');
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
    save,
    refresh: load,
  };
}

