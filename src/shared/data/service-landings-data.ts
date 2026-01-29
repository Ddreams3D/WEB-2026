
import { ServiceLandingConfig } from '../types/service-landing';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

export const SERVICE_LANDINGS_DATA: ServiceLandingConfig[] = [
  {
    id: 'organic-modeling',
    slug: 'modelado-3d-personalizado',
    name: 'Modelado 3D Orgánico',
    isActive: true,
    themeMode: 'system',
    category: 'vertical',
    metaTitle: 'Modelado 3D de Personajes y Figuras Orgánicas | Esculpido Digital en Arequipa',
    metaDescription: 'Servicio profesional de esculpido digital y modelado 3D orgánico en Arequipa. Creamos personajes, criaturas y figuras complejas con alto nivel de detalle para impresión 3D.',
    primaryColor: '#c2410c', // Clay / Terracota Intenso - Organic & Warm
    heroImage: `/${StoragePathBuilder.services('modelado-3d-personalizado')}/modelado-3d-organico-personajes-esculturas-digitales.png`,
    heroImageComparison: `/${StoragePathBuilder.services('modelado-3d-personalizado')}/diseno-3d-organico-modelado-artistico-profesional.png`,
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
            image: `/${StoragePathBuilder.services('modelado-3d-personalizado')}/modelado-3d-organico-personajes-esculturas-digitales.png`
          },
          {
            title: 'Escultura digital artística',
            description: 'Exploración de formas orgánicas con enfoque en volúmenes, gestos y silueta.',
            image: `/${StoragePathBuilder.services('modelado-3d-personalizado')}/diseno-3d-organico-modelado-artistico-profesional.png`
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
    category: 'vertical',
    metaTitle: 'Merchandising Corporativo y Regalos Empresariales 3D en Arequipa | DDream3D',
    metaDescription: 'Merchandising único y personalizado para tu marca en Arequipa. Llaveros, soportes, logos 3D y regalos corporativos que destacan. Envíos a todo el Perú.',
    primaryColor: '#2563eb', // Blue-600
    heroImage: `/${StoragePathBuilder.services('merchandising-corporativo-3d')}/hero-cover.jpg`,
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
        title: 'Nuestra Propuesta de Valor',
        items: [
          {
            title: 'Merchandising que representa tu marca',
            description: 'Diseñamos y fabricamos piezas corporativas personalizadas que refuerzan la identidad de tu empresa. No es un regalo genérico, es una extensión de tu marca.',
            icon: 'Target'
          },
          {
            title: 'Producción por volumen y a medida',
            description: 'Trabajamos pedidos por lote, optimizando costos y tiempos sin sacrificar calidad. Ideal para campañas, ferias, eventos y reconocimientos empresariales.',
            icon: 'Factory'
          },
          {
            title: 'Acompañamiento de principio a fin',
            description: 'Te asesoramos desde la idea hasta la entrega final. Prototipado, ajustes y fabricación bajo pedido para asegurar un resultado profesional y alineado a tus objetivos.',
            icon: 'Handshake'
          }
        ]
      },
      {
        id: 'success-stories',
        type: 'gallery',
        title: 'Casos de Éxito',
        subtitle: 'Proyectos a gran escala que marcan la diferencia.',
        items: [
          {
            title: 'Proyecto corporativo: Modelo anatómico personalizado para la empresa Drag Pharma-Lima',
            location: 'Cliente corporativo en Lima',
            description: 'Merchandising corporativo técnico con branding integrado.',
            content: `Desarrollo de un modelo anatómico corporativo personalizado para Drag Pharma, producido en un lote de 100 piezas con acabado y pintura a mano, diseñado como pieza demostrativa para uso educativo y promocional.

El modelado 3D se realizó en colaboración con un veterinario, asegurando fidelidad anatómica del modelo. Las piezas fueron usadas como merchandising corporativo estratégico, entregadas como regalo promocional junto a la venta de productos para el tratamiento de la otitis canina, integrando impresión 3D, branding institucional y control de calidad por unidad bajo estándares corporativos.`,
            image: '',
            images: []
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
    category: 'vertical',
    metaTitle: 'Trofeos Personalizados y Reconocimientos en Impresión 3D',
    metaDescription: 'Diseño y fabricación de trofeos personalizados. Premios únicos para torneos, eventos corporativos y competiciones gaming.',
    primaryColor: '#CA8A04', // Yellow-600 (Gold) - Trophy & Premium
    heroImage: `/${StoragePathBuilder.services('trofeos-personalizados-3d')}/hero-cover.jpg`,
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
    category: 'vertical',
    metaTitle: 'Maquetas Volumétricas y Proyectos Estudiantiles 3D',
    metaDescription: 'Apoyo en maquetas y prototipos para estudiantes. Arquitectura, diseño industrial, ingeniería y proyectos de ciencias.',
    primaryColor: '#16a34a', // Green-600
    heroImage: `/${StoragePathBuilder.services('maquetas-3d')}/maquetas-didacticas-v2.png`,
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
    name: 'Modelos Médicos',
    isActive: true,
    themeMode: 'system',
    category: 'vertical',
    metaTitle: 'Modelos Médicos e Impresión 3D en Arequipa',
    metaDescription: 'Impresión 3D de órganos, huesos y estructuras anatómicas en Arequipa para planificación quirúrgica, educación médica y exposiciones.',
    primaryColor: '#0891b2', // Cyan-600
    heroImage: `/${StoragePathBuilder.services('modelos-anatomicos-3d')}/hero-cover.jpg`,
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Modelos Médicos y Anatomía 3D',
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
    id: 'custom-landings-service',
    slug: 'landings-personalizadas',
    name: 'Diseño de Landings Personalizadas',
    isActive: true,
    themeMode: 'dark',
    category: 'special',
    robots: 'index, follow', // This is a service we want to sell, so index it
    metaTitle: 'Diseño de Landing Pages Personalizadas | Ddreams Digital',
    metaDescription: 'Servicio de diseño y desarrollo de Landing Pages optimizadas para conversión. Rapidez, estética y funcionalidad para tu negocio.',
    primaryColor: '#6366f1', // Indigo-500
    heroImage: `/${StoragePathBuilder.services('landings-personalizadas')}/hero-placeholder.svg`,
    sections: [
      {
        id: 'hero',
            type: 'hero',
            title: 'Landings que Convierten',
            subtitle: 'Diseño web estratégico para potenciar tus ventas',
            content: 'Creamos páginas de aterrizaje rápidas, modernas y efectivas.'
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'soportes-personalizados-landing',
    slug: 'soportes-personalizados',
    name: 'Soportes Personalizados',
    isActive: true,
    themeMode: 'system',
    category: 'special',
    robots: 'noindex, nofollow', // EXPLICIT REQUEST: No Index due to IP concerns
    metaTitle: 'Soportes Personalizados | Ddreams 3D',
    metaDescription: 'Colección exclusiva de soportes personalizados para tus dispositivos. Alexa, Nintendo Switch, Celulares y más.',
    primaryColor: '#0ea5e9', // Sky-500
    heroImage: `/${StoragePathBuilder.services('soportes-personalizados')}/hero-placeholder.svg`,
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Soportes personalizados para tus dispositivos',
        subtitle: 'Ordena tu escritorio y tu zona de juego con soportes diseñados específicamente para tus equipos.',
        content: 'Diseños únicos para Alexa, Nintendo Switch y más.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
