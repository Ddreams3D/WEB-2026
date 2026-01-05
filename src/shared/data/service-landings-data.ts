
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
    primaryColor: '#e11d48', // Rose-600 like default
    heroImage: 'https://images.unsplash.com/photo-1615840287214-7ff58ee0489b?auto=format&fit=crop&q=80',
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
        title: 'Merchandising Corporativo 3D',
        subtitle: 'Regalos empresariales que dejan huella',
        content: 'Destaca tu marca con productos personalizados impresos en 3D que tus clientes querrán conservar.',
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
    primaryColor: '#d97706', // Amber-600
    heroImage: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&q=80',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Trofeos y Galardones Exclusivos',
        subtitle: 'Premios que valen la pena ganar',
        content: 'Olvídate de las copas genéricas. Creamos trofeos únicos que representan la identidad de tu evento.',
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
  }
];
