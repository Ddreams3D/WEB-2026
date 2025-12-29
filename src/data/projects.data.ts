import { PortfolioItem } from '@/shared/types/domain';

export const projects: PortfolioItem[] = [
  {
    id: '1',
    title: 'Modelos Médicos Anatómicos Personalizados',
    slug: 'modelos-medicos-anatomicos-personalizados',
    description: 'Desarrollo de modelos anatómicos impresos en 3D a partir de referencias reales para estudio, enseñanza y planificación médica. Cada detalle se define desde el modelado 3D, asegurando coherencia total entre diseño, fabricación y acabados finales, incluidos pintura y postprocesado.',
    category: 'Medicina',
    coverImage: '/images/modelo-anatomico-craneo-3d-corte-lateral.jpg',
    galleryImages: [
      '/images/modelo-anatomico-craneo-3d-corte-lateral.jpg',
      '/images/modelo-anatomico-craneo-3d-corte-sagital.jpg'
    ],
    galleryAlt: [
      'Modelo anatómico cráneo 3D corte lateral impresión 3D Arequipa',
      'Modelo anatómico cráneo 3D corte sagital impresión 3D Arequipa'
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
    description: 'Diseñamos trofeos y piezas conmemorativas completamente personalizadas, desarrolladas desde el modelado 3D para garantizar coherencia total entre diseño, fabricación y acabados finales.\n\nCada pieza se crea considerando forma, proporción, narrativa visual y uso final, permitiendo integrar logotipos, conceptos temáticos, textos y geometrías únicas que se reflejan fielmente en la impresión y el acabado.',
    category: 'Trofeos y Regalos',
    coverImage: '/images/trofeo-3d-personalizado-evento-deportivo-impresion-3d.png',
    galleryImages: [
      '/images/trofeo-impresion-3d-premiacion.jpg',
      '/images/trofeo-3d-personalizado-evento-deportivo-impresion-3d.png',
      '/images/trofeo-3d-personalizado-cascos-impresion-3d-premio.jpg',
      '/images/trofeos-3d-personalizados-eventos-deportivos.jpg'
    ],
    galleryAlt: [
      'Trofeo impresión 3D premiación corporativa Arequipa',
      'Trofeo 3D personalizado evento deportivo impresión 3D Arequipa',
      'Trofeo 3D personalizado cascos premio impresión 3D',
      'Trofeos 3D personalizados eventos deportivos Arequipa'
    ],
    applications: 'Eventos corporativos · Campeonatos deportivos · Reconocimientos institucionales · Premios conmemorativos · Regalos personalizados',
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
    description: 'Cada solución se desarrolla desde el modelado 3D, considerando función, resistencia, tolerancias y uso final, asegurando que lo diseñado se refleje fielmente en la fabricación y el resultado final.',
    category: 'Prototipado',
    coverImage: '/images/sistema-de-engranajes-impresion-3d-prototipo.png',
    galleryImages: [
      '/images/sistema-de-engranajes-impresion-3d-prototipo.png',
      '/images/prototipo-funcional-impresion-3d-pieza-tecnica-acople.png',
      '/images/prototipo-funcional-impresion-3d-conjunto-mecanico.png',
      '/images/engranajes-impresos-3d-prototipado-funcional.png',
      '/images/engranajes-impresion-3d-prototipo-funcional-personalizado.png'
    ],
    applications: 'Prototipado · Adaptaciones técnicas · Piezas funcionales · Soportes personalizados · Validación de diseño · Soluciones a medida',
    client: undefined,
    ctaText: 'Solicitar solución personalizada',
    tags: ['prototipado', 'funcional', 'ingenieria', 'soluciones'],
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    projectDate: new Date('2024-01-01')
  }
];
