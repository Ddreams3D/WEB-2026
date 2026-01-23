import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/ToastManager';
import { WhatsAppService } from '@/services/whatsapp.service';
import { WhatsAppPersistenceService } from '@/services/whatsapp-persistence.service';
import { WhatsAppTemplate, WhatsAppTemplateId } from '@/config/whatsapp.templates';

export function WhatsAppSettings() {
  const [templates, setTemplates] = useState<Record<WhatsAppTemplateId, WhatsAppTemplate> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      // Load directly from persistence to get latest
      const data = await WhatsAppPersistenceService.loadTemplates();
      setTemplates(data);
      // Also update the service in-memory
      WhatsAppService.updateTemplates(data);
    } catch (error) {
      console.error(error);
      showError('Error', 'No se pudieron cargar las plantillas');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleMessageChange = (id: WhatsAppTemplateId, newMessage: string) => {
    if (!templates) return;
    setTemplates({
      ...templates,
      [id]: {
        ...templates[id],
        message: newMessage
      }
    });
  };

  const handleSave = async () => {
    if (!templates) return;
    setSaving(true);
    try {
      await WhatsAppPersistenceService.saveTemplates(templates);
      WhatsAppService.updateTemplates(templates);
      showSuccess('Guardado', 'Las plantillas de WhatsApp han sido actualizadas');
    } catch (error) {
      console.error(error);
      showError('Error', 'Hubo un problema al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = (id: WhatsAppTemplateId) => {
    // Logic to reset to default would require importing defaults again or storing initial state.
    // For now, simpler to just reload from DB if user messed up before saving.
    // But to "Reset to Factory", we'd need the original constant.
    // Let's implement a simple "Reload" for now.
    loadTemplates();
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!templates) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Plantillas de WhatsApp</h2>
          <p className="text-muted-foreground">Personaliza los mensajes automáticos que se envían a WhatsApp.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar Cambios
        </Button>
      </div>

      <div className="grid gap-6">
        {Object.values(templates).map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.label}</CardTitle>
                  <CardDescription>ID: {template.id}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`msg-${template.id}`}>Mensaje</Label>
                <Textarea
                  id={`msg-${template.id}`}
                  value={template.message}
                  onChange={(e) => handleMessageChange(template.id, e.target.value)}
                  className="min-h-[100px] font-mono text-sm"
                />
              </div>
              
              {template.variables.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Variables Disponibles:</span>
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map((v) => (
                      <Badge key={v} variant="secondary" className="font-mono text-xs cursor-pointer hover:bg-secondary/80"
                        onClick={() => {
                           // Optional: Insert variable at cursor position (complex with basic Textarea)
                           // For now just copy or show it exists.
                           navigator.clipboard.writeText(`{{${v}}}`);
                           showSuccess('Copiado', `Variable {{${v}}} copiada al portapapeles`);
                        }}
                      >
                        {`{{${v}}}`}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Haz clic en una variable para copiarla. Estas se reemplazarán automáticamente con datos reales.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
