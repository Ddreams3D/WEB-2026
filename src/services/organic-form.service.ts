import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  OrganicFormCopy,
  DEFAULT_ORGANIC_FORM_COPY,
} from '@/shared/types/organic-form';

const COLLECTION = 'organic_forms';

const getDocIdForService = (slug: string) => {
  return slug || 'modelado-3d-personalizado';
};

const MERCHANDISING_FORM_COPY: OrganicFormCopy = {
  segmentationTitle: '¿Para qué lo necesitas principalmente?',
  segmentationSubtitle: 'Así entendemos si es para uso personal o para una marca/equipo y ajustamos la propuesta.',
  ideaTitle: '¿Qué tipo de merchandising buscas?',
  ideaOptionsB2C: [
    {
      id: 'llaveros-nombres-tags',
      label: 'Llaveros, nombres o tags personalizados',
      helper: 'Ideales para regalos y uso diario',
    },
    {
      id: 'accesorios-setup-escritorio',
      label: 'Accesorios para escritorio / setup',
      helper: 'Soportes, mini piezas y decoración funcional',
    },
    {
      id: 'figuras-miniaturas',
      label: 'Figuras o miniaturas',
      helper: 'Personajes, mascotas, coleccionables',
    },
    {
      id: 'regalo-personalizado',
      label: 'Regalo personalizado',
      helper: 'Con nombre, frase o temática especial',
    },
  ],
  ideaOptionsB2B: [
    {
      id: 'merch-logo-marca',
      label: 'Merch con logo de marca',
      helper: 'Llaveros, imanes, tokens, mini piezas con identidad',
    },
    {
      id: 'merch-mascota-personaje',
      label: 'Mascota o personaje de marca',
      helper: 'Figuras o piezas para reforzar identidad',
    },
    {
      id: 'souvenirs-evento-activacion',
      label: 'Souvenirs para evento / activación',
      helper: 'Regalos para asistentes, stands, dinámicas',
    },
    {
      id: 'kits-corporativos',
      label: 'Kits corporativos o packs',
      helper: 'Combos para clientes, aliados o colaboradores',
    },
    {
      id: 'merch-equipo-club',
      label: 'Merch para equipo / club',
      helper: 'Escudos, mascotas y accesorios para hinchada',
    },
    {
      id: 'produccion-por-volumen',
      label: 'Producción por volumen',
      helper: 'Series para campañas, ventas o distribución',
    },
    {
      id: 'premium-edicion-limitada',
      label: 'Merch premium / edición limitada',
      helper: 'Más detalle, acabado y presentación',
    },
  ],
  contextTitle: '¿Para qué lo quieres?',
  contextSubtitle: 'El uso define material, tamaño, acabado y presupuesto ideal.',
  contextOptionsB2C: [
    {
      id: 'regalo',
      label: 'Regalo',
      helper: 'Para sorprender con algo hecho a medida',
    },
    {
      id: 'uso-diario',
      label: 'Uso diario',
      helper: 'Accesorios resistentes y funcionales',
    },
    {
      id: 'decoracion-setup',
      label: 'Decoración / setup',
      helper: 'Para ambientar un espacio o temática',
    },
    {
      id: 'coleccion-hobby',
      label: 'Colección / hobby',
      helper: 'Piezas para exhibir o coleccionar',
    },
    {
      id: 'recuerdo-conmemoracion',
      label: 'Recuerdo / conmemoración',
      helper: 'Fechas, logros o momentos especiales',
    },
  ],
  contextOptionsB2B: [
    {
      id: 'branding-identidad',
      label: 'Branding / identidad',
      helper: 'Refuerzo visual: logo, colores, estilo',
    },
    {
      id: 'evento-activacion',
      label: 'Evento / activación',
      helper: 'Experiencias en vivo y regalos para asistentes',
    },
    {
      id: 'venta-merchandising',
      label: 'Venta de merchandising',
      helper: 'Producto para vender en tienda, evento o campaña',
    },
    {
      id: 'regalos-corporativos',
      label: 'Regalos corporativos',
      helper: 'Para clientes, aliados o colaboradores',
    },
    {
      id: 'uniformidad-equipo',
      label: 'Identidad de equipo / cultura interna',
      helper: 'Piezas para staff, equipos o comunidad',
    },
    {
      id: 'reconocimiento-premios',
      label: 'Reconocimiento / premios',
      helper: 'Placas, medallas, trofeos o recordatorios',
    },
  ],
  detailsTitle: 'Cuéntanos qué necesitas',
  detailsSubtitle:
    'Incluye: tipo de pieza, cantidad, tamaño aproximado, colores, si va con logo/texto, y fecha límite. Si tienes referencias o tu logo, adjúntalo o descríbelo.',
  contactTitle: '¿Cómo te contactamos?',
  contactSubtitle: 'Déjanos tus datos y te escribimos para afinar detalles y cotizar.',
  confirmTitle: 'Todo listo',
  confirmIntro: 'Ya tenemos una idea clara de tu merchandising.',
  confirmFooter:
    'Al continuar, seguimos por WhatsApp con el resumen para cotizarte más rápido.',
  whatsappButtonLabel: 'Cotizar por WhatsApp',
  whatsappDisclaimer: 'Sin compromiso. Te orientamos y afinamos tu idea.',
};

const TROFEOS_FORM_COPY: OrganicFormCopy = {
  segmentationTitle: '¿A quién se va a reconocer?',
  segmentationSubtitle: 'Con esto sugerimos el estilo (formal/deportivo) y materiales adecuados.',
  ideaTitle: '¿Qué tipo de pieza buscas?',
  ideaOptionsB2C: [
    {
      id: 'trofeo-personalizado',
      label: 'Trofeo único personalizado',
      helper: 'Para campeonatos, torneos o logros personales',
    },
    {
      id: 'medalla-conmemorativa',
      label: 'Medalla o moneda conmemorativa',
      helper: 'Recuerdos de fechas o eventos especiales',
    },
    {
      id: 'placa-reconocimiento',
      label: 'Placa o reconocimiento',
      helper: 'Homenajes y agradecimientos',
    },
    {
      id: 'regalo-tematico',
      label: 'Regalo temático / Hobby',
      helper: 'Piezas basadas en juegos, series o aficiones',
    },
  ],
  ideaOptionsB2B: [
    {
      id: 'trofeo-corporativo',
      label: 'Trofeo corporativo / Institucional',
      helper: 'Premios de empresa, aniversario o desempeño',
    },
    {
      id: 'medalleria-evento',
      label: 'Medallería para eventos',
      helper: 'Series para maratones, competencias o festivales',
    },
    {
      id: 'galardon-exclusivo',
      label: 'Galardón de diseño exclusivo',
      helper: 'Piezas de alto valor para premiaciones especiales',
    },
    {
      id: 'reconocimiento-trayectoria',
      label: 'Reconocimiento a la trayectoria',
      helper: 'Homenajes a años de servicio o liderazgo',
    },
  ],
  contextTitle: '¿Cuál es la ocasión?',
  contextSubtitle: 'El contexto define el estilo: elegante, deportivo, moderno o divertido.',
  contextOptionsB2C: [
    {
      id: 'deportivo',
      label: 'Competencia deportiva',
      helper: 'Fútbol, e-sports, carreras, etc.',
    },
    {
      id: 'aniversario-fecha',
      label: 'Aniversario / Fecha especial',
      helper: 'Cumpleaños, bodas, fechas memorables',
    },
    {
      id: 'logro-personal',
      label: 'Logro personal / Académico',
      helper: 'Graduaciones, ascensos, metas cumplidas',
    },
    {
      id: 'promocion-escolar',
      label: 'Promoción escolar / Graduación',
      helper: 'Colegios, promociones y universidades',
    },
    {
      id: 'fan-art-gaming',
      label: 'Fan Art / Gaming',
      helper: 'Torneos de amigos, comunidades gamer',
    },
  ],
  contextOptionsB2B: [
    {
      id: 'premiacion-anual',
      label: 'Premiación anual / Gala',
      helper: 'Eventos formales de cierre de año',
    },
    {
      id: 'activacion-marca',
      label: 'Activación de marca',
      helper: 'Eventos de marketing y lanzamiento',
    },
    {
      id: 'torneo-interno',
      label: 'Torneo o competencia interna',
      helper: 'Actividades de integración',
    },
    {
      id: 'reconocimiento-colaboradores',
      label: 'Reconocimiento interno (colaboradores)',
      helper: 'Premios por desempeño, cultura y RR.HH.',
    },
    {
      id: 'agradecimiento-socios',
      label: 'Agradecimiento a socios/clientes',
      helper: 'Regalos ejecutivos premium',
    },
  ],
  detailsTitle: 'Detalles del diseño',
  detailsSubtitle:
    'Cuéntanos la temática, formas/símbolos, si lleva logo, texto (nombres/puestos), colores y cualquier referencia visual.',
  contactTitle: '¿A dónde enviamos la propuesta?',
  contactSubtitle: 'Déjanos tus datos para contactarte y cotizar tu trofeo o medalla.',
  confirmTitle: '¡Genial!',
  confirmIntro: 'Ya tenemos la base para tu trofeo o medalla.',
  confirmFooter:
    'Te contactaremos por WhatsApp para ver referencias, materiales y tiempos de entrega.',
  whatsappButtonLabel: 'Cotizar Trofeo/Medalla',
  whatsappDisclaimer: 'Sin compromiso. Diseñamos piezas únicas.',
};

const MAQUETAS_FORM_COPY: OrganicFormCopy = {
  segmentationTitle: '¿Para quién es este proyecto?',
  segmentationSubtitle: 'Selecciona si es un proyecto personal/escolar o para una institución educativa.',
  ideaTitle: '¿Qué tipo de material necesitas?',
  ideaOptionsB2C: [
    {
      id: 'maqueta-escolar',
      label: 'Maqueta Escolar',
      helper: 'Para tareas, exposiciones y proyectos',
    },
    {
      id: 'apoyo-visual',
      label: 'Apoyo Visual de Estudio',
      helper: 'Para reforzar aprendizaje en casa',
    },
    {
      id: 'proyecto-universitario',
      label: 'Proyecto Universitario',
      helper: 'Modelos conceptuales o técnicos',
    },
  ],
  ideaOptionsB2B: [
    {
      id: 'material-institucional',
      label: 'Material Institucional',
      helper: 'Para uso en aulas y laboratorios',
    },
    {
      id: 'kit-didactico',
      label: 'Kits Didácticos',
      helper: 'Sets de piezas para alumnos',
    },
    {
      id: 'modelo-anatomico',
      label: 'Modelos Anatómicos/Científicos',
      helper: 'Réplicas precisas para enseñanza',
    },
  ],
  contextTitle: '¿Cuál es el objetivo principal?',
  contextSubtitle: 'Cuéntanos más sobre el uso que le darás.',
  contextOptionsB2C: [
    {
      id: 'tarea-exposicion',
      label: 'Tarea o Exposición',
      helper: 'Necesito presentar un tema específico',
    },
    {
      id: 'comprension-tema',
      label: 'Comprensión de un Tema',
      helper: 'Necesito visualizar un concepto',
    },
    {
      id: 'hobby-aprendizaje',
      label: 'Hobby o Aprendizaje Personal',
      helper: 'Interés personal en el tema',
    },
  ],
  contextOptionsB2B: [
    {
      id: 'equipamiento-aula',
      label: 'Equipamiento de Aula',
      helper: 'Material duradero para uso constante',
    },
    {
      id: 'demostracion-clase',
      label: 'Demostración en Clase',
      helper: 'Para explicar conceptos a alumnos',
    },
    {
      id: 'proyecto-educativo',
      label: 'Proyecto Educativo Especial',
      helper: 'Desarrollo a medida para un programa',
    },
  ],
  detailsTitle: 'Detalles del Proyecto',
  detailsSubtitle: 'Describe lo que necesitas: tema, tamaño aproximado, nivel educativo, etc...',
  contactTitle: 'Datos de Contacto',
  contactSubtitle: 'Para enviarte la propuesta.',
  confirmTitle: '¡Todo listo!',
  confirmIntro: 'Aquí tienes el resumen de tu solicitud:',
  confirmFooter: 'Al hacer clic en enviar, se abrirá WhatsApp con los detalles de tu pedido.',
  whatsappButtonLabel: 'Enviar Solicitud',
  whatsappDisclaimer: 'Te responderemos lo antes posible.',
};

const ANATOMICOS_FORM_COPY: OrganicFormCopy = {
  segmentationTitle: '¿Para qué tipo de proyecto anatómico lo necesitas?',
  segmentationSubtitle: 'Cuéntanos si es para estudio personal, docencia o un proyecto institucional.',
  ideaTitle: '¿Qué tipo de modelo anatómico buscas?',
  ideaOptionsB2C: [
    {
      id: 'modelo-estudio-general',
      label: 'Modelo para estudio general',
      helper: 'Para repasar anatomía en casa o apoyo en clases',
    },
    {
      id: 'modelo-estructura-especifica',
      label: 'Estructura específica (ej. columna, cráneo, órgano)',
      helper: 'Para enfocarse en una zona anatómica concreta',
    },
    {
      id: 'proyecto-academico-salud',
      label: 'Proyecto académico en salud',
      helper: 'Trabajo, tesis o presentación en ciencias de la salud',
    },
  ],
  ideaOptionsB2B: [
    {
      id: 'kit-docencia',
      label: 'Kit para docencia',
      helper: 'Varios modelos para uso repetido en aula o laboratorio',
    },
    {
      id: 'modelo-entrenamiento',
      label: 'Modelo para entrenamiento o demostración',
      helper: 'Para explicar procedimientos o patologías específicas',
    },
    {
      id: 'serie-modelos-institucional',
      label: 'Serie de modelos para institución',
      helper: 'Producción para varias sedes, aulas o servicios',
    },
  ],
  contextTitle: '¿Cómo se utilizarán estos modelos?',
  contextSubtitle: 'Así ajustamos el nivel de detalle, tamaño y materiales.',
  contextOptionsB2C: [
    {
      id: 'estudio-personal',
      label: 'Estudio personal',
      helper: 'Uso individual para reforzar temas de anatomía',
    },
    {
      id: 'apoyo-clases',
      label: 'Apoyo para clases o exposiciones',
      helper: 'Presentaciones ante docentes o compañeros',
    },
    {
      id: 'material-complementario',
      label: 'Material complementario a libros o videos',
      helper: 'Modelo físico que acompaña recursos teóricos',
    },
  ],
  contextOptionsB2B: [
    {
      id: 'docencia-formal',
      label: 'Docencia formal en aulas o laboratorios',
      helper: 'Uso intensivo por grupos de alumnos',
    },
    {
      id: 'demostracion-pacientes',
      label: 'Demostración a pacientes o familiares',
      helper: 'Explicar procedimientos o diagnósticos',
    },
    {
      id: 'entrenamiento-profesional',
      label: 'Entrenamiento profesional interno',
      helper: 'Simulación y práctica para equipos de salud',
    },
  ],
  detailsTitle: 'Detalles del modelo o proyecto',
  detailsSubtitle:
    'Indica qué estructuras necesitas, el nivel de detalle (básico/avanzado), tamaño aproximado y si tienes referencias (imágenes, modelos previos, etc.).',
  contactTitle: 'Datos de contacto',
  contactSubtitle: 'Para enviarte la propuesta y coordinar detalles técnicos.',
  confirmTitle: 'Resumen del proyecto anatómico',
  confirmIntro: 'Con esta información podemos estimar tiempos, materiales y alcance.',
  confirmFooter:
    'Al continuar, seguimos por WhatsApp para revisar referencias y cerrar la propuesta.',
  whatsappButtonLabel: 'Continuar por WhatsApp',
  whatsappDisclaimer: 'Sin compromiso. Podemos ajustar el alcance según tu presupuesto.',
};

const getDefaultCopyForService = (slug: string): OrganicFormCopy => {
  if (slug === 'merchandising-3d-personalizado') {
    return MERCHANDISING_FORM_COPY;
  }
  if (slug === 'trofeos-medallas-3d-personalizados') {
    return TROFEOS_FORM_COPY;
  }
  if (slug === 'maquetas-didacticas-material-educativo-3d') {
    return MAQUETAS_FORM_COPY;
  }
  if (slug === 'proyectos-anatomicos-3d-personalizados') {
    return ANATOMICOS_FORM_COPY;
  }
  return DEFAULT_ORGANIC_FORM_COPY;
};

export async function fetchOrganicFormCopy(serviceSlug: string = 'modelado-3d-personalizado'): Promise<OrganicFormCopy> {
  if (!db) return getDefaultCopyForService(serviceSlug || 'modelado-3d-personalizado');

  try {
    const normalizedSlug = serviceSlug || 'modelado-3d-personalizado';
    const ref = doc(db, COLLECTION, getDocIdForService(normalizedSlug));
    const snap = await getDoc(ref);
    if (!snap.exists()) return getDefaultCopyForService(normalizedSlug);

    const data = snap.data() as Partial<OrganicFormCopy>;
    return {
      ...getDefaultCopyForService(normalizedSlug),
      ...data,
    };
  } catch (error) {
    console.warn(
      '[organic-form.service] Error fetching organic form copy, using defaults',
      error
    );
    return DEFAULT_ORGANIC_FORM_COPY;
  }
}

export async function saveOrganicFormCopy(
  copy: OrganicFormCopy,
  serviceSlug: string = 'modelado-3d-personalizado'
): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');

  const ref = doc(db, COLLECTION, getDocIdForService(serviceSlug));
  const sanitized = JSON.parse(JSON.stringify(copy));
  await setDoc(ref, sanitized, { merge: true });
}
