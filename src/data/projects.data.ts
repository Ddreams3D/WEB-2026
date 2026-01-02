import { PortfolioItem } from '@/shared/types/domain';

export const projects: PortfolioItem[] = [
  {
    id: '1',
    title: 'Modelos Médicos Anatómicos Personalizados',
    slug: 'modelos-medicos-anatomicos-personalizados',
    description: 'Desarrollo de modelos anatómicos impresos en 3D a partir de referencias reales para estudio, enseñanza y planificación médica. Cada detalle se define desde el modelado 3D, asegurando coherencia total entre diseño, fabricación y acabados finales, incluidos pintura y postprocesado.',
    category: 'Medicina',
    coverImage: '/images/projects/modelo-anatomico-craneo-3d-corte-lateral.jpg',
    galleryImages: [
      '/images/projects/modelo-anatomico-craneo-3d-corte-lateral.jpg',
      '/images/projects/modelo-anatomico-craneo-3d-corte-sagital.jpg',
      '/images/projects/proyectos-anatomicos-3d-b2b-vista-general.jpg',
      '/images/projects/proyectos-anatomicos-3d-b2b-detalle-completo.jpg',
      '/images/projects/proyectos-anatomicos-3d-b2b-detalle-columna.jpg',
      '/images/projects/proyectos-anatomicos-3d-b2b-detalle-oseo.jpg',
      '/images/projects/proyectos-anatomicos-3d-b2b-detalle-organos.jpg',
      '/images/projects/proyectos-anatomicos-3d-b2b-detalle-craneo.jpg',
      '/images/projects/proyectos-anatomicos-3d-b2b-detalle-muscular.jpg'
    ],
    galleryAlt: [
      'Modelo anatómico cráneo 3D corte lateral',
      'Modelo anatómico cráneo 3D corte sagital',
      'Proyecto anatómico 3D B2B vista general',
      'Proyecto anatómico 3D B2B detalle completo',
      'Proyecto anatómico 3D B2B detalle columna',
      'Proyecto anatómico 3D B2B detalle óseo',
      'Proyecto anatómico 3D B2B detalle órganos',
      'Proyecto anatómico 3D B2B detalle cráneo',
      'Proyecto anatómico 3D B2B detalle muscular'
    ],
    applications: 'Enseñanza médica · Estudio anatómico · Planificación quirúrgica · Visualización de procedimientos',
    client: undefined,
    ctaText: 'Solicitar modelo similar',
    tags: ['medicina', 'anatomia', 'educacion', 'planificacion-quirurgica'],
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    projectDate: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Trofeos y Premios 3D Personalizados',
    slug: 'trofeos-premios-3d-personalizados',
    description: 'Diseñamos trofeos y piezas conmemorativas completamente personalizadas, desarrolladas desde el modelado 3D para garantizar coherencia total entre diseño, fabricación y acabados finales.',
    category: 'Trofeos y Regalos',
    coverImage: '/images/projects/regalos-personalizados-impresion-3d-diseno-medida.jpg',
    galleryImages: [
      '/images/projects/regalos-personalizados-impresion-3d-diseno-medida.jpg'
    ],
    galleryAlt: [
      'Regalos personalizados impresión 3D diseño a medida'
    ],
    applications: 'Eventos corporativos · Campeonatos deportivos · Reconocimientos institucionales · Premios conmemorativos',
    client: undefined,
    ctaText: 'Solicitar trofeo personalizado',
    tags: ['trofeos', 'premios', 'personalizado', 'eventos'],
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    projectDate: new Date('2024-01-01')
  },
  {
    id: '3',
    title: 'Soluciones Funcionales a Medida',
    slug: 'soluciones-funcionales-a-medida',
    description: 'Cada solución se desarrolla desde el modelado 3D, considerando función, resistencia, tolerancias y uso final.',
    category: 'Prototipado',
    coverImage: '/images/projects/engranajes-impresion-3d-prototipo-funcional-personalizado.png',
    galleryImages: [
      '/images/projects/engranajes-impresion-3d-prototipo-funcional-personalizado.png',
      '/images/projects/engranajes-impresos-3d-prototipado-funcional.png'
    ],
    applications: 'Prototipado · Adaptaciones técnicas · Piezas funcionales · Soluciones a medida',
    client: undefined,
    ctaText: 'Solicitar solución personalizada',
    tags: ['prototipado', 'funcional', 'ingenieria', 'soluciones'],
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    projectDate: new Date('2024-01-01')
  }
];
