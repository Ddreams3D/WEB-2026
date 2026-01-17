import React, { useEffect, useState } from 'react';
import { Button, Input, Textarea } from '@/components/ui';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { registerOrganicLead } from '@/actions/organic-leads.actions';
import { WHATSAPP_REDIRECT } from '@/shared/constants/contactInfo';
import { CountrySelector } from './CountrySelector';
import {
  DEFAULT_ORGANIC_FORM_COPY,
  OrganicFormCopy,
} from '@/shared/types/organic-form';
import { fetchOrganicFormCopy } from '@/services/organic-form.service';
import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';

interface OrganicUniversalForm {
  projectType: string;
  usageContext: string;
  projectDetails: string;
  style: string;
  size: string;
  deliverables: string;
  references: string;
  budget: string;
  contactType: 'persona' | 'empresa';
  clientSegment: 'b2c' | 'b2b' | '';
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  preferredContactTime: string;
  notes: string;
}

type OrganicStage = 'segmentation' | 'idea' | 'context' | 'details' | 'contact' | 'confirm';

function buildOrganicUniversalMessage(form: OrganicUniversalForm, copy: OrganicFormCopy, slug?: string) {
  const projectTypeLabelMap: Record<string, string> = {
    'figura-personalizada': 'Figura o personaje personalizado',
    'regalo-unico': 'Regalo único y especial',
    'marca-evento': 'Proyecto para Marca o Evento',
    'mascota-marca': 'Mascota o personaje para marca',
    'escultura-proyecto': 'Escultura o pieza artística para proyecto',
    'figura-produccion': 'Figura orgánica para producción o fabricación',
    'elemento-evento': 'Elemento visual para evento o presentación',
    'no-definido-otro': 'No definido / Otro',
  };

  const getLabelForId = (id: string, options: { id: string; label: string }[]) => {
    return options?.find((o) => o.id === id)?.label;
  };

  // Safety check to prevent crash if copy is undefined
  const safeCopy = copy || ({} as OrganicFormCopy);

  let intro = 'Hola, quiero cotizar un proyecto de modelado 3D personalizado.';
  if (slug === 'merchandising-3d-personalizado') {
    intro = 'Hola, quiero cotizar merchandising 3D personalizado.';
  } else if (slug === 'trofeos-medallas-3d-personalizados') {
    intro = 'Hola, quiero cotizar trofeos o medallas personalizadas.';
  } else if (slug === 'maquetas-didacticas-material-educativo-3d') {
    intro = 'Hola, quiero cotizar material didáctico o maquetas educativas.';
  } else if (slug === 'proyectos-anatomicos-3d-personalizados') {
    intro = 'Hola, quiero cotizar uno o varios modelos anatómicos 3D personalizados.';
  }

  let message = `${intro}\n\n`;
  message += 'Tipo de proyecto\n';
  if (form.projectType) {
    // Try to find label in dynamic copy first, then fallback to map or raw ID
    const dynamicLabel =
      getLabelForId(form.projectType, safeCopy.ideaOptionsB2C || []) ||
      getLabelForId(form.projectType, safeCopy.ideaOptionsB2B || []);
    
    const projectLabel = dynamicLabel || projectTypeLabelMap[form.projectType] || form.projectType;
    message += `• ${projectLabel}\n`;
  }
  message += '\nUso o contexto\n';
  if (form.usageContext) {
     const dynamicContextLabel =
      getLabelForId(form.usageContext, safeCopy.contextOptionsB2C || []) ||
      getLabelForId(form.usageContext, safeCopy.contextOptionsB2B || []);
      
    message += `• ${dynamicContextLabel || form.usageContext}\n`;
  }
  message += '\nDetalles del proyecto\n';
  if (form.projectDetails) message += `• Descripción: ${form.projectDetails}\n`;
  if (form.style) message += `• Estilo: ${form.style}\n`;
  if (form.size) message += `• Tamaño aproximado: ${form.size}\n`;
  if (form.deliverables) message += `• Entregables: ${form.deliverables}\n`;
  if (form.references) message += `• Referencias visuales: ${form.references}\n`;
  if (form.budget) message += `• Presupuesto aproximado: ${form.budget}\n`;
  message += '\nDatos de contacto\n';
  if (form.contactType) message += `• Tipo de cliente: ${form.contactType === 'persona' ? 'Persona' : 'Empresa'}\n`;
  if (form.fullName) message += `• Nombre: ${form.fullName}\n`;
  if (form.companyName && form.contactType === 'empresa') message += `• Empresa: ${form.companyName}\n`;
  if (form.email) message += `• Correo: ${form.email}\n`;
  if (form.phone) message += `• Teléfono: ${form.phone}\n`;
  if (form.preferredContactTime) message += `• Horario preferido de contacto: ${form.preferredContactTime}\n`;
  if (form.notes) message += `\nNotas adicionales\n• ${form.notes}\n`;
  return message;
}

function buildOrganicUiSummary(form: OrganicUniversalForm, copy: OrganicFormCopy) {
  const chips: string[] = [];
  const projectTypeLabelMap: Record<string, string> = {
    'figura-personalizada': 'Figura o personaje personalizado',
    'regalo-unico': 'Regalo único y especial',
    'marca-evento': 'Proyecto para Marca o Evento',
    'mascota-marca': 'Mascota o personaje para marca',
    'escultura-proyecto': 'Escultura o pieza artística para proyecto',
    'figura-produccion': 'Figura orgánica para producción o fabricación',
    'elemento-evento': 'Elemento visual para evento o presentación',
    'no-definido-otro': 'No definido / Otro',
  };

  const getLabelForId = (id: string, options: { id: string; label: string }[]) => {
    return options?.find((o) => o.id === id)?.label;
  };

  // Safety check
  const safeCopy = copy || ({} as OrganicFormCopy);

  if (form.projectType) {
    const dynamicLabel =
      getLabelForId(form.projectType, safeCopy.ideaOptionsB2C || []) ||
      getLabelForId(form.projectType, safeCopy.ideaOptionsB2B || []);
      
    chips.push(dynamicLabel || projectTypeLabelMap[form.projectType] || form.projectType);
  }

  if (form.usageContext) {
     const dynamicContextLabel =
      getLabelForId(form.usageContext, safeCopy.contextOptionsB2C || []) ||
      getLabelForId(form.usageContext, safeCopy.contextOptionsB2B || []);
      
    chips.push(dynamicContextLabel || form.usageContext);
  }

  if (form.style) {
    chips.push(form.style);
  }

  const visibleChips = chips.slice(0, 3);

  let description = form.projectDetails || '';
  const maxLength = 160;
  if (description.length > maxLength) {
    description = `${description.slice(0, maxLength).trim()}…`;
  }

  return {
    chips: visibleChips,
    description,
  };
}

export function OrganicModelingServiceForm({ productSlug }: { productSlug: string }) {
  const [form, setForm] = useState<OrganicUniversalForm>({
    projectType: '',
    usageContext: '',
    projectDetails: '',
    style: '',
    size: '',
    deliverables: '',
    references: '',
    budget: '',
    contactType: 'persona',
    clientSegment: '',
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    preferredContactTime: '',
    notes: ''
  });
  const [stage, setStage] = useState<OrganicStage>('segmentation');
  const [showCustomContext, setShowCustomContext] = useState(false);
  const [showEmailField, setShowEmailField] = useState(false);
  const [projectDetailsRows, setProjectDetailsRows] = useState(3);
  const [countryCode, setCountryCode] = useState('+51');
  const [isManualCountry, setIsManualCountry] = useState(false);
  const [copy, setCopy] = useState<OrganicFormCopy>(DEFAULT_ORGANIC_FORM_COPY);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let active = true;

    const loadCopy = async () => {
      const data = await fetchOrganicFormCopy(productSlug);
      if (!active) return;
      setCopy(data);
    };

    loadCopy();

    return () => {
      active = false;
    };
  }, [productSlug]);

  const handleSegmentationSelect = (segment: 'b2c' | 'b2b') => {
    // Resetear form para evitar que queden datos "basura" de la otra rama
    setForm({ 
      ...form, 
      clientSegment: segment,
      contactType: segment === 'b2b' ? 'empresa' : 'persona',
      projectType: '', // Resetear para que no se guarde una opción inválida
      usageContext: '', // Resetear contexto
    });

    if (!hasStarted) {
      trackEvent(AnalyticsEvents.FORM_START, {
        location: AnalyticsLocations.SERVICE_FORM,
        page_type: 'service',
        form_id: 'organic_modeling',
        client_segment: segment,
      });
      setHasStarted(true);
    }

    setStage('idea');
  };

  const handleSubmit = () => {
    const message = buildOrganicUniversalMessage(form, copy, productSlug);
    const encoded = encodeURIComponent(message);
    
    // Clean phone number (remove non-digits)
    const cleanPhone = form.phone.replace(/[^0-9]/g, '');
    // Remove '+' from country code if present for cleaner DB storage (optional, but good for consistency)
    const cleanCountryCode = countryCode.replace('+', '');
    
    const fullPhone = `${cleanCountryCode}${cleanPhone}`;
    
    trackEvent(AnalyticsEvents.FORM_SUBMIT, {
      location: AnalyticsLocations.SERVICE_FORM,
      page_type: 'service',
      form_id: 'organic_modeling',
      service_slug: productSlug,
      client_type: form.contactType,
      client_segment: form.clientSegment,
    });

    registerOrganicLead({
      ...form,
      phone: fullPhone, 
      serviceSlug: productSlug,
    });

    trackEvent(AnalyticsEvents.WHATSAPP_CLICK, {
      location: AnalyticsLocations.SERVICE_FORM,
      page_type: 'service',
      form_id: 'organic_modeling',
      service_slug: productSlug,
      client_type: form.contactType,
      client_segment: form.clientSegment,
    });

    window.open(`${WHATSAPP_REDIRECT}?text=${encoded}`, '_blank');
  };

  const handleIdeaSelect = (type: string) => {
    setForm({ ...form, projectType: type });
    setStage('context');
    setShowCustomContext(false);
  };

  const handleContextSelect = (context: string) => {
    setForm({ 
      ...form, 
      usageContext: context,
      contactType: form.clientSegment === 'b2b' ? 'empresa' : 'persona'
    });
    setStage('details');
  };

  const handleToggleCustomContext = () => {
    const next = !showCustomContext;
    setShowCustomContext(next);
    if (next) {
      setForm({
        ...form,
        usageContext: '',
      });
    }
  };

  const handleProjectDetailsChange = (value: string) => {
    setForm({
      ...form,
      projectDetails: value,
    });

    const lineCount = value.split('\n').length;
    const nextRows = Math.max(3, Math.min(10, lineCount + 1));
    setProjectDetailsRows(nextRows);
  };

  const uiSummary = buildOrganicUiSummary(form, copy);

  return (
    <section id="cotizar" className="space-y-6 rounded-2xl border border-border bg-card/60 p-5 lg:p-6 shadow-sm transition-all duration-300">
      <div className="space-y-6">
        {stage === 'segmentation' && (
          <div className="space-y-5 rounded-2xl bg-background/60 border border-border/70 p-4 md:p-6 animate-fade-in-up">
            <h3 className="text-base font-medium text-foreground">
              {copy.segmentationTitle}
            </h3>
            <p className="text-xs text-muted-foreground">
              {copy.segmentationSubtitle}
            </p>
            <div className="grid grid-cols-1 gap-3">
              <Button
                type="button"
                variant="ghost"
                className={`w-full h-auto py-4 px-5 text-sm justify-start text-left whitespace-normal leading-snug rounded-2xl border transition-all
                  ${form.clientSegment === 'b2c'
                    ? 'bg-gradient-to-br from-primary/10 via-card to-card dark:from-primary/20 dark:via-muted/60 dark:to-muted/40 border-primary/60 shadow-md'
                    : 'bg-card/90 dark:bg-muted/40 border-border/60 hover:bg-card dark:hover:bg-muted/60 hover:border-primary/40'
                  }`}
                onClick={() => handleSegmentationSelect('b2c')}
              >
                <span className="font-semibold block w-full mb-0.5">Para una persona / uso personal</span>
                <div className="w-full flex justify-end">
                  <span className="block w-[220px] text-xs text-muted-foreground font-normal min-h-[1.1rem] pl-3 border-l border-muted-foreground/30">
                    Un detalle único para ti o para regalar
                  </span>
                </div>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={`w-full h-auto py-4 px-5 text-sm justify-start text-left whitespace-normal leading-snug rounded-2xl border transition-all
                  ${form.clientSegment === 'b2b'
                    ? 'bg-gradient-to-br from-primary/10 via-card to-card dark:from-primary/20 dark:via-muted/60 dark:to-muted/40 border-primary/60 shadow-md'
                    : 'bg-card/90 dark:bg-muted/40 border-border/60 hover:bg-card dark:hover:bg-muted/60 hover:border-primary/40'
                  }`}
                onClick={() => handleSegmentationSelect('b2b')}
              >
                <span className="font-semibold block w-full mb-0.5">Para un proyecto, marca o institución</span>
                <div className="w-full flex justify-end">
                  <span className="block w-[220px] text-xs text-muted-foreground font-normal min-h-[1.1rem] pl-3 border-l border-muted-foreground/30">
                    Requerimientos corporativos o comerciales
                  </span>
                </div>
              </Button>
            </div>
          </div>
        )}

        {stage === 'idea' && (
          <div className="space-y-5 rounded-2xl bg-background/60 border border-border/70 p-4 md:p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -ml-2"
                onClick={() => setStage('segmentation')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-base font-medium text-foreground">
                {copy.ideaTitle}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {form.clientSegment === 'b2b'
                ? (copy.ideaOptionsB2B || DEFAULT_ORGANIC_FORM_COPY.ideaOptionsB2B).map(
                    (option) => (
                      <Button
                        key={option.id}
                        type="button"
                        variant="ghost"
                        className={`w-full h-auto py-4 px-5 text-sm justify-start text-left whitespace-normal leading-snug rounded-2xl border transition-all
                          ${form.projectType === option.id
                            ? 'bg-gradient-to-br from-primary/10 via-card to-card dark:from-primary/20 dark:via-muted/60 dark:to-muted/40 border-primary/60 shadow-md'
                            : 'bg-card/90 dark:bg-muted/40 border-border/60 hover:bg-card dark:hover:bg-muted/60 hover:border-primary/40'
                          }`}
                        onClick={() => handleIdeaSelect(option.id)}
                      >
                        <span className="font-semibold block w-full mb-0.5">
                          {option.label}
                        </span>
                        {option.helper && (
                          <div className="w-full flex justify-end">
                            <span className="block w-[220px] text-xs text-muted-foreground font-normal min-h-[1.1rem] pl-3 border-l border-muted-foreground/30">
                              {option.helper}
                            </span>
                          </div>
                        )}
                      </Button>
                    )
                  )
                : (copy.ideaOptionsB2C || DEFAULT_ORGANIC_FORM_COPY.ideaOptionsB2C).map(
                    (option) => (
                      <Button
                        key={option.id}
                        type="button"
                        variant="ghost"
                        className={`w-full h-auto py-4 px-5 text-sm justify-start text-left whitespace-normal leading-snug rounded-2xl border transition-all
                          ${form.projectType === option.id
                            ? 'bg-gradient-to-br from-primary/10 via-card to-card dark:from-primary/20 dark:via-muted/60 dark:to-muted/40 border-primary/60 shadow-md'
                            : 'bg-card/90 dark:bg-muted/40 border-border/60 hover:bg-card dark:hover:bg-muted/60 hover:border-primary/40'
                          }`}
                        onClick={() => handleIdeaSelect(option.id)}
                      >
                        <span className="font-semibold block w-full mb-0.5">
                          {option.label}
                        </span>
                        {option.helper && (
                          <div className="w-full flex justify-end">
                            <span className="block w-[220px] text-xs text-muted-foreground font-normal min-h-[1.1rem] pl-3 border-l border-muted-foreground/30">
                              {option.helper}
                            </span>
                          </div>
                        )}
                      </Button>
                    )
                  )}
            </div>
            {form.clientSegment === 'b2b' && (
              <div className="flex justify-center mt-2">
                <div className="inline-flex flex-col items-center gap-0.5 group">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-1 h-8 px-4 text-[11px] rounded-full border-border/70 text-muted-foreground bg-background/60 hover:bg-accent/50 hover:border-primary/50"
                    onClick={() => {
                      setForm({ ...form, projectType: 'no-definido-otro' });
                      setStage('context');
                      setShowCustomContext(false);
                    }}
                  >
                    No lo tengo definido
                  </Button>
                  <span className="text-[10px] text-muted-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    Lo definimos en la siguiente etapa
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {stage === 'context' && (
          <div className="space-y-5 rounded-2xl bg-background/60 border border-border/70 p-4 md:p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -ml-2"
                onClick={() => {
                  setStage('idea');
                  setShowCustomContext(false);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-base font-medium text-foreground">
                {copy.contextTitle}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {copy.contextSubtitle}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(form.clientSegment === 'b2c'
                ? copy.contextOptionsB2C || DEFAULT_ORGANIC_FORM_COPY.contextOptionsB2C
                : copy.contextOptionsB2B || DEFAULT_ORGANIC_FORM_COPY.contextOptionsB2B
              ).map((option) => (
                <div key={option.id} className="group flex flex-col items-start gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    className={`w-full h-auto py-4 px-4 text-sm justify-center text-center whitespace-normal leading-relaxed rounded-2xl border transition-all
                      ${form.usageContext === option.id
                        ? 'bg-gradient-to-br from-primary/10 via-card to-card dark:from-primary/20 dark:via-muted/60 dark:to-muted/40 border-primary/60 shadow-md'
                        : 'bg-card/90 dark:bg-muted/40 border-border/60 hover:bg-card dark:hover:bg-muted/60 hover:border-primary/40'
                      }`}
                    onClick={() => handleContextSelect(option.id)}
                  >
                    {option.label}
                  </Button>
                  {option.helper && (
                    <span className="text-[11px] text-muted-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity min-h-[1.1rem]">
                      {option.helper}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <div className="inline-flex flex-col items-center gap-0.5 group">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1 h-8 px-4 text-[11px] rounded-full border-border/70 text-muted-foreground bg-background/60 hover:bg-accent/50 hover:border-primary/50"
                  onClick={handleToggleCustomContext}
                >
                  Mi idea no encaja en estas opciones
                </Button>
                <span className="text-[10px] text-muted-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  Cuéntanos con tus palabras
                </span>
              </div>
            </div>

            {showCustomContext && (
              <div className="space-y-3 animate-fade-in-up">
                <div className="rounded-2xl bg-muted/70 dark:bg-muted/30 px-4 py-3">
                  <Textarea 
                    placeholder="Cuéntanos con tus palabras para qué lo estás imaginando…" 
                    className="min-h-[90px] text-sm resize-none border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
                    value={form.usageContext} 
                    onChange={(e) => setForm({ ...form, usageContext: e.target.value })}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (form.usageContext) {
                        setStage('details');
                      }
                    }}
                    disabled={!form.usageContext}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {stage === 'details' && (
          <div className="space-y-5 rounded-2xl bg-background/60 border border-border/70 p-4 md:p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2" onClick={() => setStage('context')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-base font-medium text-foreground">
                {copy.detailsTitle}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {copy.detailsSubtitle}
            </p>
            
            <div className="flex justify-center">
              <div className="w-full max-w-xl rounded-2xl bg-muted/70 dark:bg-muted/30 px-4 py-3">
                <Textarea
                  value={form.projectDetails}
                  rows={projectDetailsRows}
                  className="w-full text-base resize-none border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
                  placeholder={
                    form.clientSegment === 'b2b'
                      ? "No tiene que estar perfecto. Puedes incluir, si lo deseas:\n\n• Objetivo de la pieza\n• Uso previsto (impresión, digital, molde, exhibición...)\n• Cantidad estimada\n• Plazo o fecha importante\n• Referencias visuales o conceptuales"
                      : "No tiene que estar perfecto. Escríbenos la idea como la imaginas."
                  }
                  onChange={(e) => handleProjectDetailsChange(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg bg-accent/30 p-3 text-xs text-muted-foreground">
              <p>💡 Estilos, tamaños y referencias los afinamos luego por WhatsApp.</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setStage('contact')}
                disabled={!form.projectDetails}
              >
                Entendido, seguimos
              </Button>
            </div>
          </div>
        )}

        {stage === 'contact' && (
          <div className="space-y-5 rounded-2xl bg-background/60 border border-border/70 p-4 md:p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2" onClick={() => setStage('details')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-base font-medium text-foreground">
                {copy.contactTitle}
              </h3>
            </div>
            <div className="flex justify-center">
              <p className="text-xs text-muted-foreground w-full max-w-xs">
                {copy.contactSubtitle}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-center">
                  <div className="w-full max-w-xs px-4 py-1">
                    <p className="text-[11px] text-muted-foreground mb-1">
                      Te escribimos por WhatsApp al:
                    </p>
                    <div className="flex items-center w-full border-b border-border/50 focus-within:border-primary/50 transition-colors gap-2">
                      <CountrySelector value={countryCode} onChange={setCountryCode} />
                      <Input
                        value={form.phone}
                        placeholder="999 000 000"
                        className="w-full border-none bg-transparent px-0 py-1 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/40"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setForm({ ...form, phone: value });
                        }}
                        maxLength={15}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-center">
                  <div className="w-full max-w-xs px-4 py-1">
                    <p className="text-[11px] text-muted-foreground mb-1">
                      Y tu nombre es:
                    </p>
                    <div className="flex items-center w-full border-b border-border/50 focus-within:border-primary/50 transition-colors">
                      <Input
                        value={form.fullName}
                        placeholder="Ej. Juan Pérez"
                        className="w-full border-none bg-transparent px-0 py-1 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/40"
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-4 text-[11px] rounded-full border-border/70 text-muted-foreground bg-background/60"
                    onClick={() => setShowEmailField(prev => !prev)}
                  >
                    ¿Quieres cotización formal por correo?
                  </Button>
                </div>
                {showEmailField && (
                  <div className="space-y-1">
                    <div className="flex justify-center">
                      <div className="w-full max-w-xs px-4 py-1">
                        <p className="text-[11px] text-muted-foreground mb-1">
                          Si quieres, también te enviamos la cotización formal a:
                        </p>
                        <div className="flex items-center w-full border-b border-border/50 focus-within:border-primary/50 transition-colors">
                          <Input
                            type="email"
                            value={form.email}
                            placeholder="Ingresa tu correo electrónico"
                            className="w-full border-none bg-transparent px-0 py-1 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/40"
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setStage('confirm')}
                disabled={!form.fullName || !form.phone}
              >
                Listo, ver resumen
              </Button>
            </div>
          </div>
        )}

        {stage === 'confirm' && (
          <div className="space-y-5 rounded-2xl bg-background/60 border border-border/70 p-4 md:p-6 animate-fade-in-up">
             <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2" onClick={() => setStage('contact')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-base font-medium text-foreground">
                {copy.confirmTitle}
              </h3>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground text-center">
              <p>
                {copy.confirmIntro}
              </p>
            </div>

            <details className="group border border-dashed border-border/60 rounded-xl bg-muted/40">
              <summary className="flex items-center justify-between px-3 py-2 cursor-pointer text-xs md:text-sm text-muted-foreground hover:bg-muted/60 rounded-xl">
                <span>Ver resumen de tu proyecto</span>
                <span className="text-[10px] uppercase tracking-wide group-open:hidden">Mostrar</span>
                <span className="text-[10px] uppercase tracking-wide hidden group-open:inline">Ocultar</span>
              </summary>
              <div className="px-3 pb-3 pt-2 text-xs md:text-sm text-muted-foreground/90 space-y-2">
                {uiSummary.chips.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {uiSummary.chips.map((chip) => (
                      <span
                        key={chip}
                        className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-2.5 py-0.5 text-[11px]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
                {uiSummary.description && (
                  <p className="text-xs md:text-sm leading-relaxed">
                    {uiSummary.description}
                  </p>
                )}
              </div>
            </details>

            <p className="text-xs md:text-sm text-muted-foreground text-center">
              {copy.confirmFooter}
            </p>

            <div className="pt-2">
              <Button
                type="button"
                size="lg"
                className="w-full h-14 rounded-xl font-semibold text-base shadow-lg shadow-primary/20 animate-pulse-slow"
                onClick={handleSubmit}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                {copy.whatsappButtonLabel}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-3">
                {copy.whatsappDisclaimer}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
