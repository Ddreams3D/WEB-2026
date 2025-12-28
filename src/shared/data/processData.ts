import {
  MessageSquare,
  Search,
  PenTool,
  Printer,
  Package,
  Award,
  Settings,
  Lightbulb,
  MessageCircle,
  PackageCheck,
  Target,
} from '@/lib/icons';

export const processSteps = [
  {
    id: 1,
    title: 'Solicitud del proyecto',
    description: 'El cliente nos contacta y nos cuenta su idea, referencia o necesidad.',
    details: 'Puede enviar archivos 3D, imágenes, bocetos o una descripción del proyecto.',
    icon: MessageSquare,
  },
  {
    id: 2,
    title: 'Análisis y propuesta',
    description: 'Evaluamos la viabilidad del proyecto y definimos el enfoque más adecuado.',
    details: 'Preparamos una propuesta clara según el tipo de trabajo.',
    icon: Search,
  },
  {
    id: 3,
    title: 'Diseño y preparación',
    description: 'Modelamos o ajustamos el diseño y lo preparamos para impresión 3D.',
    details: 'Se realizan validaciones y correcciones antes de fabricar.',
    icon: PenTool,
  },
  {
    id: 4,
    title: 'Impresión y acabado',
    description: 'Fabricamos la pieza mediante impresión 3D y aplicamos los acabados necesarios según el proyecto.',
    details: 'Utilizamos materiales de alta calidad y técnicas precisas según el proyecto.',
    icon: Printer,
  },
  {
    id: 5,
    title: 'Entrega',
    description: 'El proyecto se entrega terminado o se envía según lo acordado.',
    details: 'Brindamos seguimiento final y soporte básico posterior.',
    icon: Package,
  },
];

export const processAdvantages = [
  {
    title: 'Experiencia comprobada',
    description:
      'Más de 3 años desarrollando proyectos reales en impresión y modelado 3D, desde piezas médicas y prototipos funcionales hasta trofeos y productos personalizados.',
    icon: Award,
  },
  {
    title: 'Enfoque personalizado',
    description:
      'Cada proyecto se diseña y fabrica según su uso real, necesidades técnicas y objetivos del cliente. No trabajamos con soluciones genéricas.',
    icon: Settings,
  },
  {
    title: 'Combinación técnica y creativa',
    description:
      'Unimos modelado 3D, impresión y acabados para lograr piezas funcionales, precisas y visualmente cuidadas.',
    icon: Lightbulb,
  },
  {
    title: 'Comunicación directa',
    description:
      'Tratas directamente con quien diseña y fabrica tu proyecto, lo que permite ajustes rápidos, claridad y mejores resultados.',
    icon: MessageCircle,
  },
  {
    title: 'Producción responsable',
    description:
      'Plazos claros, materiales adecuados y procesos definidos para entregar piezas confiables y bien terminadas.',
    icon: PackageCheck,
  },
  {
    title: 'Calidad enfocada al resultado',
    description:
      'Cada pieza se imprime pensando en su función final: estudio, presentación, validación técnica o uso real.',
    icon: Target,
  },
];
