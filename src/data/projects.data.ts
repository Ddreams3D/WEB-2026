import { PortfolioItem } from '@/shared/types/domain';

export const projects: PortfolioItem[] = [
  {
    id: '1',
    title: 'Modelos Anatómicos de Precisión',
    slug: 'modelos-anatomicos-precision',
    description: 'Desarrollo de réplicas anatómicas exactas a escala real para fines educativos y planificación quirúrgica. Utilizamos tecnología de escaneo e impresión 3D para garantizar la máxima fidelidad.',
    category: 'Medicina',
    coverImage: '/images/catalogo/modelo-pelvis-anatomica-escala-real-3d-perspectiva.jpg',
    tags: ['Medicina', 'Educación', 'Anatomía'],
    isFeatured: true,
    projectDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    client: 'Universidad de Medicina'
  },
  {
    id: '2',
    title: 'Prototipos Automotrices Funcionales',
    slug: 'prototipos-automotrices',
    description: 'Fabricación de componentes funcionales y estéticos para el sector automotriz. Desde piezas de motor a escala hasta accesorios personalizados para vehículos.',
    category: 'Ingeniería',
    coverImage: '/images/catalogo/cooler-motor-v8-impresion-3d-regalo-autos-detalle.png',
    tags: ['Automotriz', 'Prototipado', 'Ingeniería'],
    isFeatured: true,
    projectDate: new Date('2024-02-20'),
    createdAt: new Date('2024-02-20'),
    client: 'Taller Especializado'
  },
  {
    id: '3',
    title: 'Trofeos Corporativos Personalizados',
    slug: 'trofeos-corporativos',
    description: 'Diseño y producción de trofeos únicos y medallas para eventos corporativos y deportivos. Acabados premium que reflejan la identidad de la marca.',
    category: 'Corporativo',
    coverImage: '/images/catalogo/trofeos-medallas-personalizadas-3d-b2b-principal.jpg',
    tags: ['Diseño', 'Premios', 'Corporativo'],
    isFeatured: true,
    projectDate: new Date('2024-03-10'),
    createdAt: new Date('2024-03-10'),
    client: 'Evento Deportivo Nacional'
  }
];
