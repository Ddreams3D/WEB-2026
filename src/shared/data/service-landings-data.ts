
import { ServiceLandingConfig } from '../types/service-landing';

export const SERVICE_LANDINGS_DATA: ServiceLandingConfig[] = [
  {
    id: 'organic-modeling',
    slug: 'modelado-3d-personalizado',
    name: 'Modelado 3D Orgánico',
    isActive: true,
    themeMode: 'system',
    metaTitle: 'Modelado 3D de Personajes y Figuras Orgánicas | Esculpido Digital en Arequipa',
    metaDescription: 'Servicio profesional de esculpido digital y modelado 3D orgánico en Arequipa. Creamos personajes, criaturas y figuras complejas con alto nivel de detalle para impresión 3D.',
    primaryColor: '#c2410c', // Clay / Terracota Intenso - Organic & Warm
    heroImage: 'https://placehold.co/800x800/e2e8f0/475569.png?text=Escultura+Real', // Placeholder Real
    heroImageComparison: 'https://placehold.co/800x800/475569/e2e8f0.png?text=Modelo+3D', // Placeholder 3D
    featuredTag: 'organico',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Modelado 3D Orgánico y Esculpido Digital',
        subtitle: 'Damos vida a tus ideas más complejas',
        content: 'Transformamos conceptos en figuras tridimensionales detalladas listas para producción.',
      },
      {
        id: 'segmentation',
        type: 'focus',
        title: 'Para quién es (y para quién no es)',
        content:
          '**¿Para quién es este servicio?**\n' +
          'Personas que quieren una figura o personaje único\n' +
          'Proyectos personalizados para impresión 3D\n' +
          'Ideas que aún no están claras y necesitan guía visual\n\n' +
          '**¿Para quién no es este servicio?**\n' +
          'Proyectos enfocados en videojuegos o motores en tiempo real\n' +
          'Renderizado hiperrealista exclusivo para publicidad\n' +
          'Producción en masa o archivos industriales complejos',
      },
      {
        id: 'process-cards',
        type: 'process',
        title: 'Cómo trabajamos tu proyecto (3 pasos)',
        subtitle: 'Hacemos simple un proceso que detrás lleva mucha experiencia.',
        items: [
          {
            title: 'Entendemos tu idea',
            description: 'Nos cuentas qué tienes en mente, incluso si aún no está claro.',
            icon: 'Lightbulb'
          },
          {
            title: 'Bocetamos y definimos el modelo',
            description: 'Usamos IA y herramientas digitales para aterrizar la forma y el estilo.',
            icon: 'PenTool'
          },
          {
            title: 'Refinamos y preparamos para entrega',
            description: 'Ajustamos detalles y dejamos el modelo listo según el objetivo del proyecto.',
            icon: 'Hammer'
          }
        ]
      },
      {
        id: 'organic-gallery',
        type: 'gallery',
        title: 'Ejemplos de proyectos de modelado 3D orgánico',
        items: [
          {
            title: 'Personaje estilizado para impresión 3D',
            description: 'Modelo orgánico listo para impresión, con detalles y pose pensados para vitrina o colección.',
            image: '/images/services/modelado-3d-organico-personajes-esculturas-digitales.png'
          },
          {
            title: 'Escultura digital artística',
            description: 'Exploración de formas orgánicas con enfoque en volúmenes, gestos y silueta.',
            image: '/images/services/diseno-3d-organico-modelado-artistico-profesional.png'
          }
        ]
      },
      {
        id: 'features',
        type: 'features',
        title: '¿Qué incluye este servicio?',
        items: [
          {
            title: 'Personajes y Criaturas',
            description: 'Diseño de personajes para juegos, coleccionables o animación con topología optimizada.',
            icon: 'Ghost'
          },
          {
            title: 'Bustos y Retratos',
            description: 'Captura de semejanza y expresión en bustos digitales de alta fidelidad.',
            icon: 'Smile'
          },
          {
            title: 'Optimización para Impresión',
            description: 'Archivos preparados, cortados y con encastres perfectos para impresión 3D.',
            icon: 'Printer'
          }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'merchandising',
    slug: 'merchandising-corporativo-3d', // Optimizado para B2B y nicho 3D
    name: 'Merchandising Corporativo 3D',
    isActive: true,
    themeMode: 'system',
    metaTitle: 'Merchandising Corporativo y Regalos Empresariales 3D en Arequipa | DDream3D',
    metaDescription: 'Merchandising único y personalizado para tu marca en Arequipa. Llaveros, soportes, logos 3D y regalos corporativos que destacan. Envíos a todo el Perú.',
    primaryColor: '#2563eb', // Blue-600
    heroImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80',
    featuredTag: 'merch',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: '',
        subtitle: '',
        content: '',
      },
      {
        id: 'features',
        type: 'features',
        title: '',
        items: [
          {
            title: '',
            description: '',
            icon: ''
          },
          {
            title: '',
            description: '',
            icon: ''
          },
          {
            title: '',
            description: '',
            icon: ''
          }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'trophies',
    slug: 'trofeos-personalizados-3d', // Más directo a la intención de búsqueda
    name: 'Trofeos y Reconocimientos',
    isActive: true,
    themeMode: 'system',
    metaTitle: 'Trofeos Personalizados y Reconocimientos en Impresión 3D',
    metaDescription: 'Diseño y fabricación de trofeos personalizados. Premios únicos para torneos, eventos corporativos y competiciones gaming.',
    primaryColor: '#CA8A04', // Yellow-600 (Gold) - Trophy & Premium
    heroImage: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&q=80',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Un trofeo no se repite. Se diseña.',
        subtitle: 'Premios que valen la pena ganar',
        content: 'Diseñamos y fabricamos trofeos únicos para eventos, competencias y regalos especiales. Cada modelo se crea desde cero, con un propósito, un estilo y una terminación pensada para una persona o evento específico.',
      },
      {
        id: 'focus',
        type: 'focus',
        title: 'Nuestro Enfoque',
        content: `**Cada trofeo nace de una idea.**
Si puedes imaginarlo, podemos diseñarlo y fabricarlo.
No usamos moldes genéricos ni catálogos repetidos.
Rechazamos los trofeos de latón:
fríos, impersonales, sin carácter.
**Creamos piezas exclusivas, pensadas para existir una sola vez.**`
      },
      {
        id: 'process-cards',
        type: 'process',
        items: [
          {
            title: 'Partimos de una idea',
            description: 'Escuchamos el concepto del cliente y lo traducimos en una propuesta de trofeo pensada para su contexto.',
            icon: 'Lightbulb'
          },
          {
            title: 'Diseño desde cero',
            description: 'Modelamos cada trofeo para la persona o evento, cuidando proporciones, estilo y carácter.',
            icon: 'PenTool'
          },
          {
            title: 'Fabricación personalizada',
            description: 'Fabricamos la pieza final cuidando material, terminación y detalles que le dan identidad.',
            icon: 'Hammer'
          }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'academic-projects',
    slug: 'maquetas-3d', // Keyword "maquetas" es clave aquí
    name: 'Maquetas para Estudiantes',
    isActive: true,
    themeMode: 'system',
    metaTitle: 'Maquetas Volumétricas y Proyectos Estudiantiles 3D',
    metaDescription: 'Apoyo en maquetas y prototipos para estudiantes. Arquitectura, diseño industrial, ingeniería y proyectos de ciencias.',
    primaryColor: '#16a34a', // Green-600
    heroImage: 'https://images.unsplash.com/photo-1544531696-b7809315d0de?auto=format&fit=crop&q=80',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Tu Proyecto Académico al Siguiente Nivel',
        subtitle: 'Maquetas y prototipos para entregas finales',
        content: 'Materializa tus entregas con calidad profesional. Impresión 3D rápida para arquitectura y diseño.',
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'medical-models',
    slug: 'modelos-anatomicos-3d', // Término más profesional y específico
    name: 'Biomodelos Médicos',
    isActive: true,
    themeMode: 'system',
    metaTitle: 'Biomodelos e Impresión 3D Médica en Arequipa',
    metaDescription: 'Impresión 3D de órganos, huesos y estructuras anatómicas en Arequipa para planificación quirúrgica, educación médica y exposiciones.',
    primaryColor: '#0891b2', // Cyan-600
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Biomodelos y Anatomía 3D',
        subtitle: 'Precisión médica en tus manos',
        content: 'Réplicas anatómicas exactas a partir de tomografías para planificación y docencia.',
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'technical-prototyping',
    slug: 'prototipado-tecnico-impresion-3d',
    name: 'Prototipado Técnico en Impresión 3D',
    isActive: true,
    themeMode: 'system',
    metaTitle: 'Prototipado Técnico en Impresión 3D | Validación Rápida de Piezas',
    metaDescription: 'Prototipado técnico con impresión 3D para validar encajes, tolerancias y funcionalidad antes de fabricar en serie. Ideal para ingeniería y diseño de producto.',
    primaryColor: '#0f766e',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Prototipado Técnico en Impresión 3D',
        subtitle: 'Valida tus diseños antes de invertir en producción',
        content: 'Creamos prototipos funcionales y piezas de prueba para revisar formas, encajes y tolerancias sin invertir en moldes ni procesos costosos.',
      },
      {
        id: 'focus',
        type: 'focus',
        title: 'Pensado para equipos técnicos',
        content:
          'Ideal para ingenieros, diseñadores de producto y fabricantes que necesitan validar piezas rápidamente.\n\n' +
          'Trabajamos a partir de archivos CAD, bocetos técnicos o piezas físicas que necesitas replicar o ajustar.',
      },
      {
        id: 'process',
        type: 'process',
        title: 'Cómo trabajamos tu prototipo',
        items: [
          {
            title: 'Revisión del diseño',
            description: 'Analizamos tu archivo o idea para detectar riesgos de impresión y uso.',
          },
          {
            title: 'Impresión del prototipo',
            description: 'Producimos la pieza en el material más adecuado para pruebas.',
          },
          {
            title: 'Ajustes y refinamiento',
            description: 'A partir de tus pruebas, iteramos el diseño hasta dejarlo listo para producción.',
          },
        ],
      },
      {
        id: 'features',
        type: 'features',
        title: 'Casos de uso frecuentes',
        items: [
          {
            title: 'Validación de encastres y uniones',
            description: 'Comprueba cómo se comportan tus piezas ensambladas antes de fabricar en serie.',
          },
          {
            title: 'Prototipos de producto',
            description: 'Muestras físicas para presentaciones, pitches e iteraciones internas.',
          },
          {
            title: 'Soporte a equipos de ingeniería',
            description: 'Iteraciones rápidas sin frenar el avance del proyecto.',
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'custom-spare-parts',
    slug: 'repuestos-personalizados-impresion-3d',
    name: 'Repuestos Personalizados en Impresión 3D',
    isActive: true,
    themeMode: 'system',
    metaTitle: 'Repuestos Personalizados con Impresión 3D | Piezas Difíciles de Conseguir',
    metaDescription: 'Fabricamos repuestos personalizados en impresión 3D cuando la pieza original ya no existe o es difícil de importar. Soluciones rápidas para hogar, oficina y negocio.',
    primaryColor: '#ea580c',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Repuestos Personalizados en Impresión 3D',
        subtitle: 'Cuando el fabricante ya no tiene la pieza, la diseñamos nosotros',
        content: 'Recreamos y mejoramos piezas rotas o descontinuadas mediante diseño 3D e impresión de alta precisión.',
      },
      {
        id: 'focus',
        type: 'focus',
        title: '¿En qué casos funciona mejor?',
        content:
          'Repuestos pequeños o medianos para electrodomésticos, mobiliario, soportes, mecanismos sencillos y partes plásticas.\n\n' +
          'No trabajamos piezas de alta exigencia estructural crítica como frenos, elementos de seguridad o carga extrema.',
      },
      {
        id: 'features',
        type: 'features',
        title: 'Ventajas frente al repuesto original',
        items: [
          {
            title: 'Rápido y local',
            description: 'Evita tiempos de importación y costos altos por piezas pequeñas.',
          },
          {
            title: 'Posibilidad de mejora',
            description: 'Podemos reforzar zonas frágiles o ajustar la pieza a tu uso real.',
          },
          {
            title: 'Producción bajo demanda',
            description: 'Solo fabricamos lo que necesitas, sin mínimos de pedido.',
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'device-mounts',
    slug: 'soportes-personalizados-dispositivos',
    name: 'Soportes Personalizados para Dispositivos',
    isActive: true,
    themeMode: 'system',
    metaTitle: 'Soportes Personalizados para Celulares, Tablets y Dispositivos',
    metaDescription: 'Diseñamos y fabricamos soportes personalizados para celulares, tablets, consolas, cámaras y periféricos. Organización y ergonomía a medida con impresión 3D.',
    primaryColor: '#4f46e5',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Soportes Personalizados para tus Dispositivos',
        subtitle: 'Tu escritorio y tu setup, ordenados a tu manera',
        content: 'Creamos soportes, bases y accesorios específicos para tus equipos, adaptados a tu espacio y forma de trabajar.',
      },
      {
        id: 'features',
        type: 'features',
        title: 'Ideas de soportes que podemos crear',
        items: [
          {
            title: 'Soportes para celular y tablet',
            description: 'Bases para escritorio, videollamadas, lectura o monitoreo constante.',
          },
          {
            title: 'Organizadores de periféricos',
            description: 'Soportes para audífonos, mandos, stylus, hubs y accesorios de escritorio.',
          },
          {
            title: 'Accesorios para setup de contenido',
            description: 'Soportes para cámaras pequeñas, micrófonos o luces ligeras.',
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'custom-web-landings',
    slug: 'landings-web-personalizadas',
    name: 'Landings Web Personalizadas',
    isActive: true,
    themeMode: 'system',
    metaTitle: 'Diseño de Landings Web Personalizadas | Enfoque en Conversión',
    metaDescription: 'Diseñamos landings web enfocadas en conversión para campañas específicas, servicios o productos. Mensajes claros, estructura pensada para que el usuario actúe.',
    primaryColor: '#7c3aed',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Landings Web Personalizadas para tus campañas',
        subtitle: 'Una página, un objetivo claro',
        content: 'Creamos páginas enfocadas en una sola acción: vender, captar leads o agendar reuniones, alineadas a tu marca.',
      },
      {
        id: 'features',
        type: 'features',
        title: 'Qué incluye una landing bien pensada',
        items: [
          {
            title: 'Mensaje claro y segmentado',
            description: 'Texto y estructura enfocados en un tipo de cliente y un solo objetivo.',
          },
          {
            title: 'Diseño alineado a tu marca',
            description: 'Componentes visuales coherentes con tu identidad, sin usar plantillas genéricas.',
          },
          {
            title: 'Preparada para campañas',
            description: 'Estructura lista para conectar con anuncios, formularios y herramientas analíticas.',
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
