import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Service } from '@/shared/types/domain';
import { ProductTab } from '@/shared/types';
import { TabEditor } from '../AdminEditors';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { OrganicFormCopy, DEFAULT_ORGANIC_FORM_COPY } from '@/shared/types/organic-form';
import { fetchOrganicFormCopy, saveOrganicFormCopy } from '@/services/organic-form.service';
import { useToast } from '@/components/ui/ToastManager';

type OrganicStepId = 'segmentation' | 'idea' | 'context' | 'details' | 'contact' | 'confirm';
type OrganicOptionField =
  | 'ideaOptionsB2C'
  | 'ideaOptionsB2B'
  | 'contextOptionsB2C'
  | 'contextOptionsB2B';

interface ServiceModalContentProps {
  formData: Partial<Service>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  activeTabId: string | null;
  setActiveTabId: (id: string | null) => void;
  addTab: () => void;
  updateTab: (tab: ProductTab) => void;
  removeTab: (id: string) => void;
}

const buildRawConfigText = (copy: OrganicFormCopy) => {
  const instructions = [
    'Instrucciones de edición (lee antes de modificar):',
    '',
    '- Puedes añadir, editar o eliminar opciones dentro de los arrays ideaOptionsB2C, ideaOptionsB2B, contextOptionsB2C y contextOptionsB2B.',
    '- IMPORTANTE: Ahora puedes crear nuevos IDs para tus opciones. El sistema usará automáticamente el "label" que definas aquí para los correos y resúmenes.',
    '- No se pueden crear pasos nuevos (pantallas) desde aquí: la estructura del flujo (Segmentación -> Idea -> Contexto...) es fija.',
    '',
    '--- JSON DEL FORMULARIO (no borres esta línea) ---',
    '',
  ];

  return `${instructions.join('\n')}${JSON.stringify(copy, null, 2)}`;
};

export function ServiceModalContent({
  formData,
  handleChange,
  activeTabId,
  setActiveTabId,
  addTab,
  updateTab,
  removeTab
}: ServiceModalContentProps) {
  const isWizardService =
    formData.slug === 'modelado-3d-personalizado' ||
    formData.slug === 'merchandising-3d-personalizado' ||
    formData.slug === 'trofeos-medallas-3d-personalizados' ||
    formData.slug === 'maquetas-didacticas-material-educativo-3d' ||
    formData.slug === 'proyectos-anatomicos-3d-personalizados';
  const [organicCopy, setOrganicCopy] = useState<OrganicFormCopy>(DEFAULT_ORGANIC_FORM_COPY);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [savingCopy, setSavingCopy] = useState(false);
  const [activeOrganicStep, setActiveOrganicStep] = useState<OrganicStepId>('segmentation');
  const [openHelpers, setOpenHelpers] = useState<Record<string, boolean>>({});
  const [showRawEditor, setShowRawEditor] = useState(false);
  const [rawConfig, setRawConfig] = useState('');
  const { showError, showSuccess } = useToast();

  const organicSteps: { id: OrganicStepId; label: string; description?: string }[] = [
    { id: 'segmentation', label: 'Segmentación', description: 'Persona vs Empresa' },
    { id: 'idea', label: 'Idea del proyecto', description: 'Opciones según tipo de cliente' },
    { id: 'context', label: 'Contexto de uso', description: 'Para qué usará la pieza' },
    { id: 'details', label: 'Detalles de la idea', description: 'Texto libre de la idea' },
    { id: 'contact', label: 'Datos de contacto', description: 'WhatsApp y datos básicos' },
    { id: 'confirm', label: 'Confirmación y WhatsApp', description: 'Resumen y botón final' },
  ];

  const handleAddOption = (field: OrganicOptionField) => {
    const newOptionId = `${field}-${Date.now()}`;
    setOrganicCopy((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        {
          id: newOptionId,
          label: 'Nueva opción',
          helper: '',
        },
      ],
    }));
  };

  const handleRemoveOption = (field: OrganicOptionField, id: string) => {
    setOrganicCopy((prev) => ({
      ...prev,
      [field]: prev[field].filter((option) => option.id !== id),
    }));
    setOpenHelpers((prev) => {
      if (!(id in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleHelper = (id: string) => {
    setOpenHelpers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    if (!isWizardService) return;

    let active = true;
    const load = async () => {
      try {
        setLoadingCopy(true);
        const data = await fetchOrganicFormCopy(formData.slug);
        if (!active) return;
        setOrganicCopy(data);
      } catch (error: any) {
        showError(
          'Error al cargar el formulario',
          error?.message || 'No se pudieron cargar los textos.'
        );
      } finally {
        if (active) {
          setLoadingCopy(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [isWizardService, formData.slug, showError]);

  useEffect(() => {
    setRawConfig(buildRawConfigText(organicCopy));
  }, [organicCopy]);

  const handleCopyRawConfig = async () => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(rawConfig);
        showSuccess('Texto copiado', 'Se copió toda la configuración avanzada al portapapeles.');
        return;
      }
      throw new Error('API del portapapeles no disponible');
    } catch (error: any) {
      showError(
        'No se pudo copiar',
        error?.message || 'Copia manualmente el texto desde el cuadro inferior.'
      );
    }
  };

  const handleApplyRawConfig = () => {
    try {
      const jsonStart = rawConfig.indexOf('{');
      if (jsonStart === -1) {
        throw new Error('No se encontró un bloque JSON válido en el texto.');
      }
      const jsonText = rawConfig.slice(jsonStart);
      const parsed = JSON.parse(jsonText);
      setOrganicCopy(parsed);
      showSuccess('Configuración aplicada', 'Se actualizaron todos los textos del formulario.');
    } catch (error: any) {
      showError(
        'Texto inválido',
        error?.message || 'Revisa el formato del texto antes de aplicar los cambios.'
      );
    }
  };

  const handleSaveOrganicCopy = async () => {
    try {
      setSavingCopy(true);
      await saveOrganicFormCopy(organicCopy, formData.slug);
      showSuccess('Formulario actualizado', 'Los textos del formulario se han guardado correctamente.');
    } catch (error: any) {
      showError('Error al guardar', error?.message || 'No se pudieron guardar los cambios.');
    } finally {
      setSavingCopy(false);
    }
  };

  if (isWizardService) {
    return (
      <div className="space-y-6">
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Flujo del formulario de Modelado 3D Personalizado</p>
          <p className="text-xs text-muted-foreground">
            Este editor sigue el mismo orden que ve el cliente en el sitio. Usa el menú de pasos para moverte más rápido por el flujo.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[260px,1fr]">
          <div className="space-y-2 rounded-lg border border-border/60 bg-background/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Pasos del formulario
            </p>
            <div className="space-y-1">
              {organicSteps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveOrganicStep(step.id)}
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-xs transition ${
                    activeOrganicStep === step.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/60 bg-background/60 text-muted-foreground hover:border-primary/40 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      Paso {index + 1} · {step.label}
                    </span>
                    {step.description && (
                      <span className="mt-0.5 text-[10px] opacity-80">
                        {step.description}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {activeOrganicStep === 'segmentation' && (
              <div className="space-y-5 rounded-lg border border-border/60 bg-background/60 p-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Paso 1 · Segmentación
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Pantalla inicial donde el cliente elige si es para uso personal o para un proyecto/marca.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Título de segmentación</label>
                    <Input
                      value={organicCopy.segmentationTitle}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, segmentationTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Texto de ayuda de segmentación</label>
                    <Textarea
                      value={organicCopy.segmentationSubtitle}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, segmentationSubtitle: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeOrganicStep === 'idea' && (
              <div className="space-y-5 rounded-lg border border-border/60 bg-background/60 p-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Paso 2 · Idea del proyecto
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Se muestra después de segmentación. Las opciones cambian según Persona/Empresa, pero este título es único.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Título de la idea</label>
                    <Input
                      value={organicCopy.ideaTitle}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, ideaTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          Opciones para Personas (B2C)
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => handleAddOption('ideaOptionsB2C')}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Añadir
                        </Button>
                      </div>
                      {organicCopy.ideaOptionsB2C.map((option, index) => {
                        const helperOpen = openHelpers[option.id] ?? false;
                        const hasHelper = Boolean(option.helper && option.helper.length > 0);
                        return (
                          <div
                            key={option.id}
                            className="space-y-1.5 rounded-md border border-border/60 bg-background/70 p-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                Opción {index + 1}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleRemoveOption('ideaOptionsB2C', option.id)}
                                className="rounded-full p-1 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-medium text-muted-foreground">
                                Texto principal
                              </label>
                              <Input
                                value={option.label}
                                onChange={(e) =>
                                  setOrganicCopy({
                                    ...organicCopy,
                                    ideaOptionsB2C: organicCopy.ideaOptionsB2C.map((o) =>
                                      o.id === option.id ? { ...o, label: e.target.value } : o
                                    ),
                                  })
                                }
                                className="h-8 text-xs"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleHelper(option.id)}
                              className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary"
                            >
                              {helperOpen ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                              <span>
                                {helperOpen
                                  ? 'Ocultar texto explicativo'
                                  : hasHelper
                                  ? 'Ver texto explicativo'
                                  : 'Añadir texto explicativo'}
                              </span>
                            </button>
                            {helperOpen && (
                              <div className="space-y-0.5">
                                <label className="text-[10px] font-medium text-muted-foreground">
                                  Texto explicativo (opcional)
                                </label>
                                <Textarea
                                  value={option.helper || ''}
                                  onChange={(e) =>
                                    setOrganicCopy({
                                      ...organicCopy,
                                      ideaOptionsB2C: organicCopy.ideaOptionsB2C.map((o) =>
                                        o.id === option.id ? { ...o, helper: e.target.value } : o
                                      ),
                                    })
                                  }
                                  rows={2}
                                  className="text-xs"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          Opciones para Empresas (B2B)
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => handleAddOption('ideaOptionsB2B')}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Añadir
                        </Button>
                      </div>
                      {organicCopy.ideaOptionsB2B.map((option, index) => {
                        const helperOpen = openHelpers[option.id] ?? false;
                        const hasHelper = Boolean(option.helper && option.helper.length > 0);
                        return (
                          <div
                            key={option.id}
                            className="space-y-1.5 rounded-md border border-border/60 bg-background/70 p-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                Opción {index + 1}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleRemoveOption('ideaOptionsB2B', option.id)}
                                className="rounded-full p-1 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-medium text-muted-foreground">
                                Texto principal
                              </label>
                              <Input
                                value={option.label}
                                onChange={(e) =>
                                  setOrganicCopy({
                                    ...organicCopy,
                                    ideaOptionsB2B: organicCopy.ideaOptionsB2B.map((o) =>
                                      o.id === option.id ? { ...o, label: e.target.value } : o
                                    ),
                                  })
                                }
                                className="h-8 text-xs"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleHelper(option.id)}
                              className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary"
                            >
                              {helperOpen ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                              <span>
                                {helperOpen
                                  ? 'Ocultar texto explicativo'
                                  : hasHelper
                                  ? 'Ver texto explicativo'
                                  : 'Añadir texto explicativo'}
                              </span>
                            </button>
                            {helperOpen && (
                              <div className="space-y-0.5">
                                <label className="text-[10px] font-medium text-muted-foreground">
                                  Texto explicativo (opcional)
                                </label>
                                <Textarea
                                  value={option.helper || ''}
                                  onChange={(e) =>
                                    setOrganicCopy({
                                      ...organicCopy,
                                      ideaOptionsB2B: organicCopy.ideaOptionsB2B.map((o) =>
                                        o.id === option.id ? { ...o, helper: e.target.value } : o
                                      ),
                                    })
                                  }
                                  rows={2}
                                  className="text-xs"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeOrganicStep === 'context' && (
              <div className="space-y-5 rounded-lg border border-border/60 bg-background/60 p-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Paso 3 · Contexto de uso
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Aquí el cliente indica para qué usará la pieza (regalo, marca, evento, etc.).
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Título del contexto</label>
                      <Input
                        value={organicCopy.contextTitle}
                        onChange={(e) =>
                          setOrganicCopy({ ...organicCopy, contextTitle: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Texto del contexto</label>
                      <Textarea
                        value={organicCopy.contextSubtitle}
                        onChange={(e) =>
                          setOrganicCopy({ ...organicCopy, contextSubtitle: e.target.value })
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          Contextos para Personas (B2C)
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => handleAddOption('contextOptionsB2C')}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Añadir
                        </Button>
                      </div>
                      {organicCopy.contextOptionsB2C.map((option, index) => {
                        const helperOpen = openHelpers[option.id] ?? false;
                        const hasHelper = Boolean(option.helper && option.helper.length > 0);
                        return (
                          <div
                            key={option.id}
                            className="space-y-1.5 rounded-md border border-border/60 bg-background/70 p-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                Contexto {index + 1}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleRemoveOption('contextOptionsB2C', option.id)}
                                className="rounded-full p-1 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-medium text-muted-foreground">
                                Texto principal
                              </label>
                              <Input
                                value={option.label}
                                onChange={(e) =>
                                  setOrganicCopy({
                                    ...organicCopy,
                                    contextOptionsB2C: organicCopy.contextOptionsB2C.map((o) =>
                                      o.id === option.id ? { ...o, label: e.target.value } : o
                                    ),
                                  })
                                }
                                className="h-8 text-xs"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleHelper(option.id)}
                              className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary"
                            >
                              {helperOpen ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                              <span>
                                {helperOpen
                                  ? 'Ocultar texto explicativo'
                                  : hasHelper
                                  ? 'Ver texto explicativo'
                                  : 'Añadir texto explicativo'}
                              </span>
                            </button>
                            {helperOpen && (
                              <div className="space-y-0.5">
                                <label className="text-[10px] font-medium text-muted-foreground">
                                  Texto explicativo (opcional)
                                </label>
                                <Textarea
                                  value={option.helper || ''}
                                  onChange={(e) =>
                                    setOrganicCopy({
                                      ...organicCopy,
                                      contextOptionsB2C: organicCopy.contextOptionsB2C.map((o) =>
                                        o.id === option.id ? { ...o, helper: e.target.value } : o
                                      ),
                                    })
                                  }
                                  rows={2}
                                  className="text-xs"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          Contextos para Empresas (B2B)
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => handleAddOption('contextOptionsB2B')}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Añadir
                        </Button>
                      </div>
                      {organicCopy.contextOptionsB2B.map((option, index) => {
                        const helperOpen = openHelpers[option.id] ?? false;
                        const hasHelper = Boolean(option.helper && option.helper.length > 0);
                        return (
                          <div
                            key={option.id}
                            className="space-y-1.5 rounded-md border border-border/60 bg-background/70 p-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                Contexto {index + 1}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleRemoveOption('contextOptionsB2B', option.id)}
                                className="rounded-full p-1 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-medium text-muted-foreground">
                                Texto principal
                              </label>
                              <Input
                                value={option.label}
                                onChange={(e) =>
                                  setOrganicCopy({
                                    ...organicCopy,
                                    contextOptionsB2B: organicCopy.contextOptionsB2B.map((o) =>
                                      o.id === option.id ? { ...o, label: e.target.value } : o
                                    ),
                                  })
                                }
                                className="h-8 text-xs"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleHelper(option.id)}
                              className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary"
                            >
                              {helperOpen ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                              <span>
                                {helperOpen
                                  ? 'Ocultar texto explicativo'
                                  : hasHelper
                                  ? 'Ver texto explicativo'
                                  : 'Añadir texto explicativo'}
                              </span>
                            </button>
                            {helperOpen && (
                              <div className="space-y-0.5">
                                <label className="text-[10px] font-medium text-muted-foreground">
                                  Texto explicativo (opcional)
                                </label>
                                <Textarea
                                  value={option.helper || ''}
                                  onChange={(e) =>
                                    setOrganicCopy({
                                      ...organicCopy,
                                      contextOptionsB2B: organicCopy.contextOptionsB2B.map((o) =>
                                        o.id === option.id ? { ...o, helper: e.target.value } : o
                                      ),
                                    })
                                  }
                                  rows={2}
                                  className="text-xs"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeOrganicStep === 'details' && (
              <div className="space-y-5 rounded-lg border border-border/60 bg-background/60 p-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Paso 4 · Detalles de la idea
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Etapa donde el cliente escribe con sus palabras la idea y detalles principales.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Título de detalles</label>
                    <Input
                      value={organicCopy.detailsTitle}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, detailsTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Texto de detalles</label>
                    <Textarea
                      value={organicCopy.detailsSubtitle}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, detailsSubtitle: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeOrganicStep === 'contact' && (
              <div className="space-y-5 rounded-lg border border-border/60 bg-background/60 p-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Paso 5 · Datos de contacto
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Etapa donde se piden WhatsApp, nombre y opcionalmente correo para cotización formal.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Título de contacto</label>
                    <Input
                      value={organicCopy.contactTitle}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, contactTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Texto de contacto</label>
                    <Textarea
                      value={organicCopy.contactSubtitle}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, contactSubtitle: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeOrganicStep === 'confirm' && (
              <div className="space-y-5 rounded-lg border border-border/60 bg-background/60 p-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Paso 6 · Confirmación y envío a WhatsApp
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Pantalla final con resumen del proyecto y botón para iniciar la conversación por WhatsApp.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Título final</label>
                    <Input
                      value={organicCopy.confirmTitle}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, confirmTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Texto inicial de cierre</label>
                    <Textarea
                      value={organicCopy.confirmIntro}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, confirmIntro: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Texto bajo el resumen</label>
                    <Textarea
                      value={organicCopy.confirmFooter}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, confirmFooter: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Texto del botón de WhatsApp</label>
                    <Input
                      value={organicCopy.whatsappButtonLabel}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, whatsappButtonLabel: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Texto pequeño bajo el botón</label>
                    <Textarea
                      value={organicCopy.whatsappDisclaimer}
                      onChange={(e) =>
                        setOrganicCopy({ ...organicCopy, whatsappDisclaimer: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 rounded-lg border border-border/60 bg-background/60 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Edición avanzada de textos
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Aquí controlas solo los textos del formulario (títulos, descripciones y opciones
                    de cada paso) en un único bloque.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[11px]"
                    onClick={handleCopyRawConfig}
                  >
                    Copiar texto
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[11px]"
                    onClick={() => setShowRawEditor((prev) => !prev)}
                  >
                    {showRawEditor ? 'Ocultar texto' : 'Ver texto completo'}
                  </Button>
                </div>
              </div>

              {showRawEditor && (
                <div className="space-y-2">
                  <p className="text-[11px] text-muted-foreground">
                    El formato es JSON. Puedes copiarlo, editarlo fuera de esta ventana y luego
                    pegarlo aquí de nuevo. Al aplicar, se actualizarán todos los textos de todos los
                    pasos y las listas de opciones (idea/contexto B2C y B2B).
                  </p>
                  <Textarea
                    value={rawConfig}
                    onChange={(e) => setRawConfig(e.target.value)}
                    rows={16}
                    className="font-mono text-[11px]"
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-muted-foreground space-y-0.5">
                      <p>
                        Puedes añadir, editar o eliminar opciones dentro de los arrays
                        ideaOptionsB2C/B2B y contextOptionsB2C/B2B, así como cambiar cualquier texto
                        de los pasos existentes.
                      </p>
                      <p>
                        No se pueden crear pasos nuevos desde aquí: la estructura del formulario se
                        define en el código, este texto solo controla el contenido.
                      </p>
                      <p>
                        Ten cuidado al modificar los identificadores (id) de las opciones; los
                        usamos para mantener la estructura interna.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 px-3 text-[11px]"
                      onClick={handleApplyRawConfig}
                      disabled={savingCopy || loadingCopy}
                    >
                      Aplicar cambios desde texto
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <p className="text-[11px] text-muted-foreground">
            Los cambios se aplican al formulario de este servicio en el sitio público.
          </p>
          <Button
            type="button"
            onClick={handleSaveOrganicCopy}
            disabled={loadingCopy || savingCopy}
            className="h-9 px-4 text-sm"
          >
            {savingCopy ? 'Guardando...' : 'Guardar textos del formulario'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Título de las Pestañas</label>
          <input
            type="text"
            name="tabsTitle"
            value={formData.tabsTitle || ''}
            onChange={handleChange}
            placeholder="Ej. Selecciona tu perfil"
            className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
          />
        </div>
        <Button type="button" onClick={addTab} className="mt-6">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Pestaña
        </Button>
      </div>

      <div className="space-y-4 mt-4">
        {formData.tabs?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            No hay pestañas configuradas. Agrega una para mostrar contenido segmentado (B2B/B2C).
          </div>
        )}
        
        {formData.tabs?.map((tab) => (
          <TabEditor
            key={tab.id}
            tab={tab}
            isOpen={activeTabId === tab.id}
            onToggle={() => setActiveTabId(activeTabId === tab.id ? null : tab.id)}
            onChange={updateTab}
            onRemove={() => removeTab(tab.id)}
          />
        ))}
      </div>
    </div>
  );
}
