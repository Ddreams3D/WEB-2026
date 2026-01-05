'use client';

import React, { useEffect, useState } from 'react';
import { LandingMainConfig } from '@/shared/types/landing';
import { saveLandingMain, fetchLandingMain } from '@/services/landing.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/ToastManager';
import { StringListEditor } from './AdminEditors';

export default function LandingMainManager() {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<LandingMainConfig>({
    heroTitle: 'Impresión 3D en Arequipa',
    heroSubtitle: 'Prototipos, piezas y regalos personalizados',
    heroDescription: 'Calidad profesional con entrega rápida y asesoría experta.',
    heroImage: '',
    ctaText: 'Cotiza tu proyecto',
    ctaLink: '/cotizaciones',
  });

  useEffect(() => {
    async function load() {
      try {
        const cfg = await fetchLandingMain();
        if (cfg) setForm(cfg);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateField = (key: keyof LandingMainConfig, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveLandingMain(form);
      showSuccess('Landing principal guardada');
    } catch (error: any) {
      showError(error.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-neutral-500">Cargando...</div>;
  }

  return (
    <div className="max-w-3xl p-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Título</label>
        <Input value={form.heroTitle} onChange={e => updateField('heroTitle', e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Subtítulo</label>
        <Input value={form.heroSubtitle || ''} onChange={e => updateField('heroSubtitle', e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Descripción</label>
        <Textarea value={form.heroDescription} onChange={e => updateField('heroDescription', e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Imagen (URL)</label>
        <Input value={form.heroImage || ''} onChange={e => updateField('heroImage', e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Imágenes en Burbujas (Máx 5)</label>
        <div className="text-xs text-muted-foreground mb-2">
            Añade URLs de imágenes de productos (sin fondo o PNG recomendado). Aparecerán dentro de las burbujas flotantes en la parte derecha.
        </div>
        <StringListEditor 
            items={form.bubbleImages || []} 
            onChange={items => updateField('bubbleImages', items)}
            placeholder="https://ejemplo.com/imagen-producto.png"
            addButtonText="Agregar Imagen"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Texto CTA</label>
          <Input value={form.ctaText} onChange={e => updateField('ctaText', e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Link CTA</label>
          <Input value={form.ctaLink} onChange={e => updateField('ctaLink', e.target.value)} />
        </div>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Barra de Anuncios Superior</h3>
        <div className="space-y-4 bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
             <label className="text-sm font-medium">Habilitar Barra</label>
             <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={form.announcement?.enabled ?? false}
                  onChange={e => updateField('announcement', { ...form.announcement, enabled: e.target.checked })}
                  className="h-4 w-4"
                />
             </div>
          </div>
          
          {form.announcement?.enabled && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contenido del Mensaje</label>
                <Input 
                  value={form.announcement?.content || ''} 
                  onChange={e => updateField('announcement', { ...form.announcement, content: e.target.value })}
                  placeholder="Ej: ¡Envíos gratis por compras mayores a S/100!"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Texto del Link (Opcional)</label>
                    <Input 
                      value={form.announcement?.linkText || ''} 
                      onChange={e => updateField('announcement', { ...form.announcement, linkText: e.target.value })}
                      placeholder="Ver detalles"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">URL del Link (Opcional)</label>
                    <Input 
                      value={form.announcement?.linkUrl || ''} 
                      onChange={e => updateField('announcement', { ...form.announcement, linkUrl: e.target.value })}
                      placeholder="/catalogo"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Color de Fondo (Tailwind o Hex)</label>
                    <Input 
                      value={form.announcement?.bgColor || ''} 
                      onChange={e => updateField('announcement', { ...form.announcement, bgColor: e.target.value })}
                      placeholder="bg-primary o #ff0000"
                    />
                    <p className="text-xs text-muted-foreground">Dejar vacío para usar el color por defecto (Primary).</p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Color de Texto</label>
                    <Input 
                      value={form.announcement?.textColor || ''} 
                      onChange={e => updateField('announcement', { ...form.announcement, textColor: e.target.value })}
                      placeholder="text-white o #ffffff"
                    />
                 </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={form.announcement?.closable ?? true}
                  onChange={e => updateField('announcement', { ...form.announcement, closable: e.target.checked })}
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium">Permitir cerrar</label>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button variant="outline" asChild>
          <a href="/impresion-3d-arequipa" target="_blank">Ver landing</a>
        </Button>
      </div>
    </div>
  );
}
