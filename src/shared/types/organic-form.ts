export interface OrganicOptionCopy {
  id: string;
  label: string;
  helper?: string;
}

export interface OrganicFormCopy {
  segmentationTitle: string;
  segmentationSubtitle: string;
  ideaTitle: string;
  ideaOptionsB2C: OrganicOptionCopy[];
  ideaOptionsB2B: OrganicOptionCopy[];
  contextTitle: string;
  contextSubtitle: string;
  contextOptionsB2C: OrganicOptionCopy[];
  contextOptionsB2B: OrganicOptionCopy[];
  detailsTitle: string;
  detailsSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;
  confirmTitle: string;
  confirmIntro: string;
  confirmFooter: string;
  whatsappButtonLabel: string;
  whatsappDisclaimer: string;
}

export const DEFAULT_ORGANIC_FORM_COPY: OrganicFormCopy = {
  segmentationTitle: '¿Para qué lo necesitas principalmente?',
  segmentationSubtitle: 'Esto nos ayuda a entender mejor el enfoque del proyecto.',
  ideaTitle: '¿Qué tienes en mente?',
  ideaOptionsB2C: [
    {
      id: 'figura-personalizada',
      label: 'Figura o personaje personalizado',
      helper: 'Para colección, regalo o hobby',
    },
    {
      id: 'regalo-unico',
      label: 'Regalo único y especial',
      helper: 'Sorprende a alguien con algo irrepetible',
    },
  ],
  ideaOptionsB2B: [
    {
      id: 'mascota-marca',
      label: 'Mascota o personaje para marca',
    },
    {
      id: 'escultura-proyecto',
      label: 'Escultura o pieza artística para proyecto',
    },
    {
      id: 'figura-produccion',
      label: 'Figura orgánica para producción o fabricación',
    },
    {
      id: 'elemento-evento',
      label: 'Elemento visual para evento o presentación',
    },
  ],
  contextTitle: '¿Para qué lo quieres?',
  contextSubtitle: 'Cuéntanos el contexto de uso para ajustar mejor la propuesta.',
  contextOptionsB2C: [
    {
      id: 'Regalo',
      label: 'Regalo',
      helper: 'Una pieza con intención emocional',
    },
    {
      id: 'Colección',
      label: 'Colección',
      helper: 'Para ti, tu hobby o algo que amas',
    },
    {
      id: 'Decoración',
      label: 'Decoración',
      helper: 'Para ambientar un espacio',
    },
    {
      id: 'Recuerdo / homenaje',
      label: 'Recuerdo / homenaje',
      helper: 'Conmemorar algo especial',
    },
  ],
  contextOptionsB2B: [
    {
      id: 'Marca / identidad',
      label: 'Marca / identidad',
      helper: 'Reforzar branding visual',
    },
    {
      id: 'Evento / activación',
      label: 'Evento / activación',
      helper: 'Experiencias en vivo',
    },
    {
      id: 'Producto / merchandising',
      label: 'Producto / merchandising',
      helper: 'Artículos promocionales',
    },
    {
      id: 'Institución',
      label: 'Institución',
      helper: 'Trofeos o reconocimientos',
    },
  ],
  detailsTitle: 'Cuéntanos tu idea',
  detailsSubtitle:
    'Con lo que ya nos contaste, aquí solo afinamos un poco más la idea.',
  contactTitle: '¿Cómo te contactamos?',
  contactSubtitle:
    'Solo unos datos para poder escribirte y continuar la conversación.',
  confirmTitle: 'Todo listo',
  confirmIntro: 'Ya tenemos una buena idea de lo que necesitas.',
  confirmFooter:
    'Al continuar, seguimos la conversación por WhatsApp con el resumen de tu proyecto.',
  whatsappButtonLabel: 'Iniciar conversación en WhatsApp',
  whatsappDisclaimer: 'Sin compromiso. Solo charlamos sobre tu idea.',
};
