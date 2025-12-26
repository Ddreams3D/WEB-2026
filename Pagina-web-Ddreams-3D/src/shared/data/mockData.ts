import { Product, Category, User, Review } from '../types';

// Mock Categories - Based on "Industrias que servimos"
export const mockCategories: Category[] = [
  {
    id: 'medicina',
    name: 'Medicina',
    description: 'Prótesis personalizadas y modelos anatómicos de precisión médica',
    slug: 'medicina',
    imageUrl: '/images/categories/medical.jpg',
    productCount: 15,
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'arquitectura',
    name: 'Arquitectura',
    description: 'Maquetas arquitectónicas detalladas y visualización de proyectos',
    slug: 'arquitectura',
    imageUrl: '/images/categories/architecture.jpg',
    productCount: 8,
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'educacion',
    name: 'Educación',
    description: 'Material didáctico interactivo y modelos educativos innovadores',
    slug: 'educacion',
    imageUrl: '/images/categories/education.jpg',
    productCount: 12,
    isActive: true,
    sortOrder: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'ingenieria',
    name: 'Ingeniería',
    description: 'Prototipos funcionales y componentes técnicos de alta precisión',
    slug: 'ingenieria',
    imageUrl: '/images/categories/engineering.jpg',
    productCount: 10,
    isActive: true,
    sortOrder: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'arte-diseno',
    name: 'Arte y Diseño',
    description: 'Esculturas únicas, trofeos y objetos decorativos personalizados',
    slug: 'arte-diseno',
    imageUrl: '/images/categories/art.jpg',
    productCount: 25,
    isActive: true,
    sortOrder: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'carlos.designer@email.com',
    name: 'Carlos Mendoza',
    avatar: '/images/avatars/carlos.jpg',
    role: 'user',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'ana.architect@email.com',
    name: 'Ana García',
    avatar: '/images/avatars/ana.jpg',
    role: 'user',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    email: 'miguel.artist@email.com',
    name: 'Miguel Rodríguez',
    avatar: '/images/avatars/miguel.jpg',
    role: 'user',
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: '1',
    userName: 'Carlos Mendoza',
    userAvatar: '/images/avatars/carlos.jpg',
    rating: 5,
    comment: 'Excelente modelo, muy detallado y fácil de usar en mis proyectos.',
    isVerifiedPurchase: true,
    helpfulCount: 3,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    productId: '1',
    userId: '2',
    userName: 'Ana García',
    userAvatar: '/images/avatars/ana.jpg',
    rating: 4,
    comment: 'Buen trabajo, aunque podría tener más variaciones de texturas.',
    isVerifiedPurchase: true,
    helpfulCount: 1,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'modelo-anatomico-pelvis-humana-escala-real',
    name: 'Modelo Anatómico de Pelvis Humana – Escala Real (Impresión 3D)',
    description: 'Modelo anatómico físico de pelvis humana impreso en 3D a escala real, diseñado para uso educativo y médico.\n\nEsta pieza reproduce con precisión las principales estructuras óseas de la pelvis, siendo ideal para estudiantes de medicina, enfermería, obstetricia, fisioterapia y carreras afines.\n\nFabricado mediante impresión 3D de alta precisión en PLA Premium, el modelo incluye base de soporte, lo que facilita su correcta exhibición y manipulación en entornos académicos, educativos o clínicos.\n\nEs una herramienta didáctica ideal para el aprendizaje, la enseñanza y la demostración anatómica.',
    shortDescription: 'Modelo anatómico físico de pelvis humana impreso en 3D a escala real',
    price: 300.00,
    currency: 'PEN',
    categoryId: 'medicina',
    categoryName: 'Medicina',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '1',
        productId: '1',
        url: '/images/marketplace/modelo-pelvis-anatomica-escala-real-3d-vista-frontal.png',
        alt: 'Modelo de Pelvis Anatómica en Escala Real - Impresión 3D - Vista Frontal',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '1-b',
        productId: '1',
        url: '/images/marketplace/modelo-pelvis-anatomica-escala-real-3d-vista-lateral.png',
        alt: 'Modelo de Pelvis Anatómica en Escala Real - Impresión 3D - Vista Lateral',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '1-c',
        productId: '1',
        url: '/images/marketplace/modelo-pelvis-anatomica-escala-real-3d-detalle.jpg',
        alt: 'Modelo de Pelvis Anatómica en Escala Real - Impresión 3D - Detalle Estructural',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '1-d',
        productId: '1',
        url: '/images/marketplace/modelo-pelvis-anatomica-escala-real-3d-perspectiva.jpg',
        alt: 'Modelo de Pelvis Anatómica en Escala Real - Impresión 3D - Perspectiva',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '1-e',
        productId: '1',
        url: '/images/marketplace/modelo-pelvis-anatomica-escala-real-3d-uso-educativo.jpg',
        alt: 'Modelo de Pelvis Anatómica en Escala Real - Impresión 3D - Uso Educativo',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ],
    specifications: [
      { name: 'Categoría', value: 'Anatomía Humana 3D' },
      { name: 'Escala', value: 'Escala 1:1 (Tamaño real)' },
      { name: 'Material', value: 'PLA Premium (impresión 3D de alta precisión)' },
      { name: 'Uso', value: 'Educativo y Médico' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['modeloAnatomico', 'pelvisHumana', 'anatomiaHumana', 'educacionMedica', 'modeloEducativo', 'impresion3D', 'anatomia3D', 'Arequipa'],
    downloadCount: 0,
    rating: 4.8,
    reviewCount: 15,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    name: 'Columna Vertebral Anatómica – Escala Real (Ensamblada)',
    description: 'Modelo anatómico físico impreso en 3D, compuesto por vértebras individuales ensambladas manualmente. Incluye pelvis como base de soporte, ideal para uso educativo y demostrativo.',
    shortDescription: 'Modelo anatómico físico impreso en 3D',
    price: 450.00,
    currency: 'PEN',
    categoryId: 'medicina',
    categoryName: 'Medicina',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '12',
        productId: '6',
        url: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=600',
        alt: 'Columna Vertebral Anatómica - Modelo 3D Ensamblado',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      }
    ],
    specifications: [
      {
        id: '26',
        name: 'Categoría',
        value: 'Modelos Anatómicos'
      },
      {
        id: '27',
        name: 'Escala',
        value: 'Real'
      },
      {
        id: '28',
        name: 'Material',
        value: 'PLA Premium'
      },
      {
        id: '29',
        name: 'Configuración',
        value: 'Vértebras impresas por separado y ensambladas manualmente'
      },
      {
        id: '30',
        name: 'Base',
        value: 'Pelvis incluida'
      },
      {
        id: '31',
        name: 'Uso',
        value: 'Educativo / Didáctico'
      },
      {
        id: '32',
        name: 'Tiempo de fabricación',
        value: '7–10 días hábiles'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['anatomía', 'medicina', 'columna', 'educativo', '3d'],
    sku: 'ANAT-SPINE-001',
    stock: 10,
    minQuantity: 1,
    materials: ['PLA Premium'],
    complexity: 'high',
    rating: 4.8,
    reviewCount: 5,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '7',
    slug: 'proyectos-anatomicos-3d-especializados',
    name: 'Proyectos Anatómicos 3D – Especializados (B2B)',
    description: 'Desarrollo, modelado y fabricación de modelos anatómicos personalizados impresos en 3D, orientados a instituciones educativas, centros de salud, universidades y proyectos académicos o médicos.\n\nCada proyecto se diseña a medida según requerimientos técnicos, escala, nivel de detalle, material y uso final.',
    shortDescription: 'Desarrollo, modelado y fabricación de modelos anatómicos personalizados',
    price: 0,
    customPriceDisplay: 'Cotización personalizada según proyecto',
    currency: 'PEN',
    categoryId: 'medicina',
    categoryName: 'Medicina',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '7-a',
        productId: '7',
        url: '/images/marketplace/proyectos-anatomicos-3d-b2b-vista-general.jpg',
        alt: 'Proyectos Anatómicos 3D Personalizados para Medicina y Educación - Vista General',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      },
      {
        id: '7-b',
        productId: '7',
        url: '/images/marketplace/proyectos-anatomicos-3d-b2b-detalle-columna.jpg',
        alt: 'Proyectos Anatómicos 3D - Detalle de Columna Vertebral y Nervios',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      },
      {
        id: '7-c',
        productId: '7',
        url: '/images/marketplace/proyectos-anatomicos-3d-b2b-detalle-organos.jpg',
        alt: 'Proyectos Anatómicos 3D - Detalle de Órganos Internos',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      },
      {
        id: '7-d',
        productId: '7',
        url: '/images/marketplace/proyectos-anatomicos-3d-b2b-detalle-craneo.jpg',
        alt: 'Proyectos Anatómicos 3D - Detalle de Cráneo Humano',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      },
      {
        id: '7-e',
        productId: '7',
        url: '/images/marketplace/proyectos-anatomicos-3d-b2b-detalle-muscular.jpg',
        alt: 'Proyectos Anatómicos 3D - Detalle Muscular y Tejidos',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      },
      {
        id: '7-f',
        productId: '7',
        url: '/images/marketplace/proyectos-anatomicos-3d-b2b-detalle-oseo.jpg',
        alt: 'Proyectos Anatómicos 3D - Detalle Óseo Estructural',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      },
      {
        id: '7-g',
        productId: '7',
        url: '/images/marketplace/proyectos-anatomicos-3d-b2b-detalle-completo.jpg',
        alt: 'Proyectos Anatómicos 3D - Vista Completa del Modelo',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      }
    ],
    specifications: [
      {
        id: 'spec-7-1',
        name: 'Incluye',
        value: '• Análisis del requerimiento\n• Modelado 3D anatómico personalizado\n• Fabricación en impresión 3D\n• Ensamblaje (cuando aplica)\n• Adaptación para uso educativo o institucional'
      },
      {
        id: 'spec-7-2',
        name: 'Información importante',
        value: '• Fabricación bajo pedido\n• Precio sujeto a cotización según proyecto\n• Servicio B2B / institucional'
      },
      {
        id: 'spec-7-3',
        name: 'Sectores',
        value: 'Universidades, institutos, colegios, centros de salud, proyectos de investigación y empresas del sector educativo o médico.'
      }
    ],
    tags: ['proyectosAnatomicos3D', 'modelosAnatomicos3D', 'anatomiaHumana3D', 'modeladoAnatomico', 'educacionMedica', 'modelosEducativos3D', 'serviciosB2B', 'fabricacionPersonalizada', 'impresion3DProfesional', 'prototipado3D', 'Arequipa', 'Peru'],
    sku: 'ANATOMY-B2B-001',
    stock: 999,
    minQuantity: 1,
    materials: ['PLA', 'Resina', 'Filamento Flexible'],
    complexity: 'high',
    rating: 4.9,
    reviewCount: 12,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: '2',
    slug: 'regalo-personalizado-fanaticos-autos-copa-piston',
    name: 'Regalo Personalizado para Fanáticos de Autos – Copa Pistón 3D (Estándar)',
    description: 'Regalo personalizado ideal para fanáticos de los autos, perfecto para sorprender a hijos, jóvenes o adultos amantes de la velocidad. Esta copa pistón fabricada en impresión 3D es una excelente opción para cumpleaños, logros o fechas especiales, e incluye personalización con nombre o frase.',
    shortDescription: 'Regalo personalizado ideal para fanáticos de los autos',
    price: 79.00,
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '2',
        productId: '2',
        url: '/images/marketplace/copa-piston-20cm-regalo-personalizado-autos-3d-frontal.png',
        alt: 'Copa Pistón 20cm - Regalo Personalizado para Fanáticos de Autos - Impresión 3D - Vista Frontal',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2-b',
        productId: '2',
        url: '/images/marketplace/copa-piston-20cm-regalo-personalizado-autos-3d-detalle.png',
        alt: 'Copa Pistón 20cm - Regalo Personalizado para Fanáticos de Autos - Impresión 3D - Vista Detalle',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ],
    options: [
      {
        id: 'opt-color',
        name: 'Color',
        type: 'radio',
        required: true,
        values: [
          { id: 'color-gold', name: 'Oro', priceModifier: 0 },
          { id: 'color-silver', name: 'Plata', priceModifier: 0 },
          { id: 'color-bronze', name: 'Bronce', priceModifier: 0 },
          { id: 'color-red', name: 'Rojo', priceModifier: 0 },
          { id: 'color-blue', name: 'Azul', priceModifier: 0 },
          { id: 'color-yellow', name: 'Amarillo', priceModifier: 0 },
          { id: 'color-other', name: 'Otro', priceModifier: 0, hasInput: true, maxLength: 30, inputPlaceholder: 'Escribe tu color aquí (máx. 30 caracteres)...' }
        ]
      },
      {
        id: 'opt-customization',
        name: '',
        type: 'radio',
        required: true,
        values: [
          {
            id: 'cust-sticker',
            name: 'Sticker personalizado (nombre o frase Incluida)',
            priceModifier: 0,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el nombre o frase (máx. 50 caracteres)...',
            isDefault: true
          },
          {
            id: 'cust-engraving',
            name: 'Grabado 3D impreso (texto integrado en la pieza)',
            priceModifier: 20,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el texto para el grabado (máx. 50 caracteres)...'
          }
        ]
      }
    ],
    specifications: [
      {
        id: '5',
        name: 'Tamaño',
        value: '20 cm'
      },

      {
        id: '8',
        name: 'Tiempo estimado de fabricación',
        value: 'Fabricación bajo pedido (2–4 días hábiles)'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['regaloPersonalizado', 'regaloParaFanaticosDeAutos', 'regaloParaHijos', 'trofeoPersonalizado', 'impresion3D', 'regalosArequipa', 'Arequipa'],
    sku: 'COPA-20CM-001',
    stock: 50,
    minQuantity: 1,
    materials: ['PLA'],
    complexity: 'medium',
    downloadCount: 0,
    rating: 4.8,
    reviewCount: 12,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '3',
    slug: 'regalo-personalizado-fanaticos-autos-copa-piston-grande',
    name: 'Regalo Personalizado para Fanáticos de Autos – Copa Pistón 3D (Grande)',
    description: 'Regalo personalizado ideal para fanáticos de los autos, perfecto para sorprender a hijos, jóvenes o adultos amantes de la velocidad. Esta versión grande de nuestra copa pistón, fabricada en impresión 3D, destaca por su mayor tamaño y presencia, siendo una excelente opción para cumpleaños, logros o fechas especiales, e incluye personalización con nombre o frase.',
    shortDescription: 'Regalo personalizado ideal para fanáticos de los autos (Versión Grande)',
    price: 129.00,
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '3',
        productId: '3',
        url: '/images/marketplace/copa-piston-grande-30cm-regalo-personalizado-autos-3d-frontal.png',
        alt: 'Copa Pistón Grande 30cm - Regalo Personalizado para Fanáticos de Autos - Impresión 3D - Vista Frontal',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '3-b',
        productId: '3',
        url: '/images/marketplace/copa-piston-grande-30cm-regalo-personalizado-autos-3d-detalle.png',
        alt: 'Copa Pistón Grande 30cm - Regalo Personalizado para Fanáticos de Autos - Impresión 3D - Vista Detalle',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ],
    options: [
      {
        id: 'opt-color',
        name: 'Color',
        type: 'radio',
        required: true,
        values: [
          { id: 'color-gold', name: 'Oro', priceModifier: 0 },
          { id: 'color-silver', name: 'Plata', priceModifier: 0 },
          { id: 'color-bronze', name: 'Bronce', priceModifier: 0 },
          { id: 'color-red', name: 'Rojo', priceModifier: 0 },
          { id: 'color-blue', name: 'Azul', priceModifier: 0 },
          { id: 'color-yellow', name: 'Amarillo', priceModifier: 0 },
          { id: 'color-other', name: 'Otro', priceModifier: 0, hasInput: true, maxLength: 30, inputPlaceholder: 'Escribe tu color aquí (máx. 30 caracteres)...' }
        ]
      },
      {
        id: 'opt-customization',
        name: '',
        type: 'radio',
        required: true,
        values: [
          {
            id: 'cust-sticker',
            name: 'Sticker personalizado (nombre o frase Incluida)',
            priceModifier: 0,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el nombre o frase (máx. 50 caracteres)...',
            isDefault: true
          },
          {
            id: 'cust-engraving',
            name: 'Grabado 3D impreso (texto integrado en la pieza)',
            priceModifier: 20,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el texto para el grabado (máx. 50 caracteres)...'
          }
        ]
      }
    ],
    specifications: [
      {
        id: '9',
        name: 'Tamaño',
        value: '30 cm'
      },
      {
        id: '13',
        name: 'Tiempo estimado de fabricación',
        value: '3–5 días hábiles'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['regaloPersonalizado', 'regaloParaFanaticosDeAutos', 'regaloParaHijos', 'regaloEspecial', 'trofeoPersonalizado', 'impresion3D', 'regalosArequipa', 'Arequipa'],
    sku: 'COPA-30CM-001',
    stock: 50,
    minQuantity: 1,
    materials: ['PLA'],
    complexity: 'medium',
    rating: 4.9,
    reviewCount: 5,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '8',
    slug: 'trofeos-medallas-3d-personalizados-eventos-empresas-b2b',
    name: 'Trofeos y Medallas 3D Personalizados para Eventos y Empresas (B2B)',
    description: 'Fabricación de trofeos y medallas personalizados mediante impresión 3D, diseñados a medida para eventos deportivos, instituciones educativas, empresas, competencias y reconocimientos corporativos.\n\nCada proyecto se desarrolla desde cero según la identidad del evento o marca, permitiendo personalizar forma, tamaño, textos, logotipos y acabados. Ideal para premiaciones institucionales, torneos, aniversarios empresariales y campañas de reconocimiento.',
    shortDescription: 'Fabricación de trofeos y medallas personalizados mediante impresión 3D',
    price: 0,
    customPriceDisplay: 'Precio sujeto a cotización según cantidad y diseño',
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '8-a',
        productId: '8',
        url: '/images/marketplace/trofeos-medallas-personalizadas-3d-b2b-principal.jpg',
        alt: 'Trofeos y Medallas 3D Personalizados para Eventos y Empresas - Vista Principal',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      },
      {
        id: '8-b',
        productId: '8',
        url: '/images/marketplace/trofeos-medallas-personalizadas-3d-b2b-detalle.jpg',
        alt: 'Trofeos y Medallas 3D Personalizados para Eventos y Empresas - Vista Detalle',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      }
    ],
    specifications: [
      {
        id: 'spec-8-1',
        name: 'Incluye',
        value: '• Análisis del requerimiento y objetivo del evento\n• Diseño 3D personalizado (trofeos, medallas o piezas conmemorativas)\n• Fabricación en impresión 3D de alta calidad\n• Opciones de acabado (pintura, colores institucionales, placas)\n• Producción por unidad o en volumen\n• Adaptación a uso institucional o corporativo'
      },
      {
        id: 'spec-8-2',
        name: 'Información importante',
        value: '• Fabricación bajo pedido\n• Precio sujeto a cotización según cantidad, diseño y complejidad\n• Servicio orientado a clientes B2B / institucionales\n• Entregas coordinadas según cronograma del evento'
      },
      {
        id: 'spec-8-3',
        name: 'Sectores atendidos',
        value: 'Empresas y marcas, Instituciones educativas, Clubes deportivos y ligas, Municipalidades y organizaciones, Eventos corporativos y competencias.'
      }
    ],
    tags: ['trofeos', 'medallas', 'b2b', 'eventos', 'corporativo'],
    sku: 'TROPHY-B2B-001',
    stock: 999,
    minQuantity: 1,
    materials: ['PLA', 'Resina', 'Filamento Metálico'],
    complexity: 'medium',
    rating: 4.8,
    reviewCount: 15,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '4',
    name: 'Cooler Motor 3D – V6',
    description: 'Cooler funcional impreso en 3D con diseño inspirado en motores V6. Ideal para mantener bebidas frías en reuniones pequeñas, escritorios, espacios gamer o como regalo original para fanáticos de los autos y la mecánica.\n\nFabricado mediante impresión 3D en PLA Premium, combina diseño llamativo con funcionalidad real. Su formato compacto lo hace perfecto para cervezas, gaseosas o bebidas individuales, aportando un toque automotriz único al espacio.',
    shortDescription: 'Cooler funcional impreso en 3D con diseño inspirado en motores V6',
    price: 210.00,
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '8',
        productId: '4',
        url: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?auto=format&fit=crop&q=80&w=600',
        alt: 'Cooler Motor V6 Impresión 3D - Regalo para Amantes de Autos - Vista Referencial',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      }
    ],
    options: [
      {
        id: 'opt-color',
        name: 'Color',
        type: 'radio',
        required: true,
        values: [
          { id: 'color-gold', name: 'Oro', priceModifier: 0 },
          { id: 'color-silver', name: 'Plata', priceModifier: 0 },
          { id: 'color-bronze', name: 'Bronce', priceModifier: 0 },
          { id: 'color-red', name: 'Rojo', priceModifier: 0 },
          { id: 'color-blue', name: 'Azul', priceModifier: 0 },
          { id: 'color-yellow', name: 'Amarillo', priceModifier: 0 },
          { id: 'color-other', name: 'Otro', priceModifier: 0, hasInput: true, maxLength: 30, inputPlaceholder: 'Escribe tu color aquí (máx. 30 caracteres)...' }
        ]
      },
      {
        id: 'opt-customization',
        name: '',
        type: 'radio',
        required: true,
        values: [
          {
            id: 'cust-none',
            name: 'Sin grabado personalizado',
            priceModifier: 0,
            isDefault: true
          },
          {
            id: 'cust-engraving',
            name: 'Grabado 3D personalizado (nombre o frase) – grabado permanente integrado en la pieza',
            priceModifier: 20,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el texto para el grabado (máx. 50 caracteres)...'
          }
        ]
      }
    ],
    specifications: [
      {
        id: '14',
        name: 'Tamaño',
        value: 'V6 (6 espacios)'
      },
      {
        id: '19',
        name: 'Tiempo estimado de fabricación',
        value: '3–5 días hábiles'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['cooler3D', 'coolerMotor', 'regaloParaFanaticosDeAutos', 'regaloOriginal', 'impresion3D', 'cerveza', 'Arequipa'],
    sku: 'COOLER-V6-001',
    stock: 20,
    minQuantity: 1,
    materials: ['PLA'],
    complexity: 'medium',
    rating: 4.8,
    reviewCount: 15,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '5',
    name: 'Cooler Motor 3D – V8',
    description: 'Cooler funcional impreso en 3D con diseño inspirado en motores V8. Ideal para mantener bebidas frías en reuniones pequeñas, escritorios, espacios gamer o como regalo original para fanáticos de los autos y la mecánica.\n\nFabricado mediante impresión 3D en PLA Premium, combina diseño llamativo con funcionalidad real. Su formato compacto lo hace perfecto para cervezas, gaseosas o bebidas individuales, aportando un toque automotriz único al espacio.',
    shortDescription: 'Cooler funcional impreso en 3D con diseño inspirado en motores V8',
    price: 250.00,
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '9',
        productId: '5',
        url: '/images/marketplace/cooler-motor-v8-impresion-3d-regalo-autos-frontal.png',
        alt: 'Cooler Motor V8 Impresión 3D - Regalo para Amantes de Autos - Vista Frontal',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: '9-b',
        productId: '5',
        url: '/images/marketplace/cooler-motor-v8-impresion-3d-regalo-autos-superior.png',
        alt: 'Cooler Motor V8 Impresión 3D - Vista Superior',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: '9-c',
        productId: '5',
        url: '/images/marketplace/cooler-motor-v8-impresion-3d-regalo-autos-detalle.png',
        alt: 'Cooler Motor V8 Impresión 3D - Detalle',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: '9-d',
        productId: '5',
        url: '/images/marketplace/cooler-motor-v8-impresion-3d-regalo-autos-uso.png',
        alt: 'Cooler Motor V8 Impresión 3D - Uso Real',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      }
    ],
    options: [
      {
        id: 'opt-color',
        name: 'Color',
        type: 'radio',
        required: true,
        values: [
          { id: 'color-gold', name: 'Oro', priceModifier: 0 },
          { id: 'color-silver', name: 'Plata', priceModifier: 0 },
          { id: 'color-bronze', name: 'Bronce', priceModifier: 0 },
          { id: 'color-red', name: 'Rojo', priceModifier: 0 },
          { id: 'color-blue', name: 'Azul', priceModifier: 0 },
          { id: 'color-yellow', name: 'Amarillo', priceModifier: 0 },
          { id: 'color-other', name: 'Otro', priceModifier: 0, hasInput: true, maxLength: 30, inputPlaceholder: 'Escribe tu color aquí (máx. 30 caracteres)...' }
        ]
      },
      {
        id: 'opt-customization',
        name: '',
        type: 'radio',
        required: true,
        values: [
          {
            id: 'cust-none',
            name: 'Sin grabado personalizado',
            priceModifier: 0,
            isDefault: true
          },
          {
            id: 'cust-engraving',
            name: 'Grabado 3D personalizado (nombre o frase) – grabado permanente integrado en la pieza',
            priceModifier: 20,
            hasInput: true,
            maxLength: 50,
            inputPlaceholder: 'Escribe aquí el texto para el grabado (máx. 50 caracteres)...'
          }
        ]
      }
    ],
    specifications: [
      {
        id: '15',
        name: 'Tamaño',
        value: 'V8 (8 espacios)'
      },
      {
        id: '20',
        name: 'Tiempo estimado de fabricación',
        value: '3–5 días hábiles'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['cooler3D', 'coolerMotor', 'regaloParaFanaticosDeAutos', 'regaloOriginal', 'impresion3D', 'cerveza', 'Arequipa'],
    sku: 'COOLER-V8-001',
    stock: 15,
    minQuantity: 1,
    materials: ['PLA'],
    complexity: 'medium',
    rating: 4.9,
    reviewCount: 20,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '13',
    slug: 'maquetas-arquitectonicas-visualizacion-3d',
    name: 'Maquetas Arquitectónicas y Visualización 3D',
    description: 'Servicio de fabricación de maquetas arquitectónicas detalladas y visualización de proyectos mediante impresión 3D. Transformamos planos y modelos digitales en maquetas físicas de alta precisión para presentaciones, ventas inmobiliarias y estudios de volumetría.\n\nTrabajamos con arquitectos, inmobiliarias y estudiantes para materializar sus diseños con acabados profesionales y diferentes escalas.',
    shortDescription: 'Maquetas arquitectónicas detalladas y visualización de proyectos',
    price: 0,
    customPriceDisplay: 'Cotización personalizada según proyecto',
    currency: 'PEN',
    categoryId: 'arquitectura',
    categoryName: 'Arquitectura',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '13-a',
        productId: '13',
        url: '/images/placeholder-architectural.svg',
        alt: 'Maquetas Arquitectónicas 3D - Vista General',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      }
    ],
    specifications: [
      { name: 'Servicio', value: 'Maquetería 3D' },
      { name: 'Escalas', value: '1:50, 1:100, 1:200, personalizadas' },
      { name: 'Acabados', value: 'Monocromático, color, modular' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['arquitectura', 'maquetas', 'urbanismo', 'inmobiliaria', 'b2b'],
    downloadCount: 0,
    rating: 4.8,
    reviewCount: 5,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '14',
    slug: 'prototipado-ingenieria-piezas-tecnicas',
    name: 'Prototipado de Ingeniería y Piezas Técnicas',
    description: 'Servicio de prototipado rápido y fabricación de piezas técnicas funcionales para ingeniería. Utilizamos materiales de ingeniería como ABS, PETG, Nylon y ASA para garantizar resistencia mecánica, térmica y química según los requerimientos del proyecto.\n\nIdeal para validación de diseño, pruebas de ajuste, repuestos descontinuados y series cortas de producción.',
    shortDescription: 'Prototipos funcionales y componentes técnicos de alta precisión',
    price: 0,
    customPriceDisplay: 'Cotización personalizada según proyecto',
    currency: 'PEN',
    categoryId: 'ingenieria',
    categoryName: 'Ingeniería',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '14-a',
        productId: '14',
        url: '/images/placeholder-engineering.svg',
        alt: 'Prototipado de Ingeniería 3D - Vista General',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      }
    ],
    specifications: [
      { name: 'Servicio', value: 'Prototipado Industrial' },
      { name: 'Materiales', value: 'ABS, PETG, Nylon, Fibra de Carbono' },
      { name: 'Precisión', value: 'Hasta +/- 0.1mm' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['ingenieria', 'prototipos', 'repuestos', 'industrial', 'b2b'],
    downloadCount: 0,
    rating: 4.9,
    reviewCount: 8,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '15',
    slug: 'material-didactico-educativo',
    name: 'Material Didáctico y Modelos Educativos',
    description: 'Diseño y fabricación de material didáctico interactivo y modelos educativos innovadores para todos los niveles de enseñanza. Facilitamos el aprendizaje de conceptos complejos a través de objetos tangibles y manipulables.\n\nDesarrollamos kits educativos para ciencias, matemáticas, geografía e historia, adaptados al currículo escolar o universitario.',
    shortDescription: 'Material didáctico interactivo y modelos educativos innovadores',
    price: 0,
    customPriceDisplay: 'Cotización personalizada según proyecto',
    currency: 'PEN',
    categoryId: 'educacion',
    categoryName: 'Educación',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '15-a',
        productId: '15',
        url: '/images/placeholder-educational.svg',
        alt: 'Material Didáctico 3D - Vista General',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      }
    ],
    specifications: [
      { name: 'Servicio', value: 'Recursos Educativos' },
      { name: 'Niveles', value: 'Primaria, Secundaria, Superior' },
      { name: 'Personalización', value: 'Diseño a medida según currículo' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['educacion', 'didactico', 'aprendizaje', 'escolar', 'b2b'],
    downloadCount: 0,
    rating: 4.7,
    reviewCount: 6,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '16',
    slug: 'regalos-personalizados-impresion-3d-diseno-medida',
    name: 'Regalos Personalizados en Impresión 3D – Diseño a Medida',
    description: 'Diseño y fabricación de regalos personalizados impresos en 3D, ideales para fechas especiales, aniversarios y sorpresas únicas. Convertimos tus ideas en objetos físicos, desde llaveros y figuras hasta litofanías y accesorios decorativos.\n\nCada pieza es única y se adapta a tus gustos y presupuesto.',
    shortDescription: 'Diseño y fabricación de regalos personalizados impresos en 3D',
    price: 0,
    customPriceDisplay: 'Precio sujeto a cotización según diseño y complejidad',
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '16-a',
        productId: '16',
        url: '/images/marketplace/regalos-personalizados-impresion-3d-diseno-medida.jpg',
        alt: 'Regalos Personalizados en Impresión 3D - Vista General',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      }
    ],
    specifications: [
      { name: 'Servicio', value: 'Regalos Personalizados' },
      { name: 'Opciones', value: 'Litofanías, Figuras, Llaveros, Decoración' },
      { name: 'Material', value: 'PLA, Resina' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['regalos', 'personalizado', 'sorpresa', 'arte', '3d'],
    downloadCount: 0,
    rating: 4.8,
    reviewCount: 10,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'b2b-1',
    slug: 'proyectos-anatomicos-3d-especializados-b2b',
    name: 'Proyectos Anatómicos 3D – Especializados (B2B)',
    description: 'Desarrollo, modelado y fabricación de modelos anatómicos personalizados para instituciones médicas y educativas. Creamos réplicas exactas a partir de tomografías (DICOM) o modelos 3D para planificación quirúrgica, educación médica y simuladores de entrenamiento.',
    shortDescription: 'Desarrollo, modelado y fabricación de modelos anatómicos personalizados',
    price: 0,
    customPriceDisplay: 'Cotización personalizada según proyecto',
    currency: 'PEN',
    categoryId: 'medicina',
    categoryName: 'Medicina',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: 'b2b-1-a',
        productId: 'b2b-1',
        url: '/images/marketplace/modelo-pelvis-anatomica-escala-real-3d-vista-frontal.png',
        alt: 'Proyectos Anatómicos 3D - Especializados',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-02-20')
      }
    ],
    specifications: [
      { name: 'Servicio', value: 'Anatomía Personalizada' },
      { name: 'Origen', value: 'DICOM / Escaneo 3D / Modelado' },
      { name: 'Aplicación', value: 'Quirúrgica / Educativa' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['medicina', 'anatomia', 'b2b', 'quirurgico', 'educacion'],
    downloadCount: 0,
    rating: 4.9,
    reviewCount: 15,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: 'b2b-2',
    slug: 'trofeos-medallas-3d-personalizados-empresas-b2b',
    name: 'Trofeos y Medallas 3D Personalizados para Eventos y Empresas (B2B)',
    description: 'Fabricación de trofeos y medallas personalizados mediante impresión 3D para eventos corporativos, deportivos y reconocimientos especiales. Diseños únicos que reflejan la identidad de tu marca o evento, con acabados en colores metalizados o personalizados.',
    shortDescription: 'Fabricación de trofeos y medallas personalizados mediante impresión 3D',
    price: 0,
    customPriceDisplay: 'Precio sujeto a cotización según cantidad y diseño',
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: 'b2b-2-a',
        productId: 'b2b-2',
        url: '/images/marketplace/copa-piston-grande-30cm-regalo-personalizado-autos-3d-frontal.png',
        alt: 'Trofeos y Medallas 3D Personalizados',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-02-20')
      }
    ],
    specifications: [
      { name: 'Servicio', value: 'Trofeos Corporativos' },
      { name: 'Personalización', value: 'Logo, Texto, Forma' },
      { name: 'Volumen', value: 'Unitario o Masivo' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['trofeos', 'medallas', 'eventos', 'corporativo', 'b2b'],
    downloadCount: 0,
    rating: 4.8,
    reviewCount: 20,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: '17',
    slug: 'modelado-3d-personalizado',
    name: 'Modelado 3D personalizado',
    description: 'Creación de modelos 3D únicos adaptados a tus necesidades específicas. Transformamos tus bocetos, ideas o planos en modelos tridimensionales digitales listos para impresión 3D, renderizado o animación. Nuestro equipo de diseñadores expertos utiliza software avanzado para garantizar precisión y detalle en cada proyecto.',
    shortDescription: 'Creación de modelos 3D únicos adaptados a tus necesidades específicas',
    price: 0,
    customPriceDisplay: 'Cotización personalizada',
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '17-a',
        productId: '17',
        url: '/images/placeholder-modeling.svg',
        alt: 'Modelado 3D Personalizado - Diseño Digital',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ],
    specifications: [
      { name: 'Servicio', value: 'Diseño y Modelado 3D' },
      { name: 'Entregables', value: 'Archivos STL, OBJ, STEP, Renders' },
      { name: 'Software', value: 'Blender, Fusion 360, ZBrush' }
    ],
    format: 'Digital',
    fileSize: 'Variable',
    license: 'Standard',
    tags: ['modelado3d', 'diseño', 'digital', 'personalizado', 'servicios'],
    downloadCount: 0,
    rating: 5.0,
    reviewCount: 8,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: '18',
    slug: 'impresion-3d-por-encargo',
    name: 'Impresión 3D por encargo',
    description: 'Servicio de impresión 3D de alta calidad en múltiples materiales y acabados. Contamos con tecnología FDM (filamento) y SLA/DLP (resina) para materializar tus proyectos con la mejor resolución y resistencia. Ideal para piezas únicas, series cortas, repuestos y prototipos.',
    shortDescription: 'Impresión de alta calidad en múltiples materiales y acabados',
    price: 0,
    customPriceDisplay: 'Cotización según proyecto',
    currency: 'PEN',
    categoryId: 'ingenieria',
    categoryName: 'Ingeniería',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '18-a',
        productId: '18',
        url: '/images/placeholder-prototype.svg',
        alt: 'Servicio de Impresión 3D por Encargo',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ],
    specifications: [
      { name: 'Tecnologías', value: 'FDM, SLA (Resina)' },
      { name: 'Materiales', value: 'PLA, ABS, PETG, TPU, Resina Standard/Tough' },
      { name: 'Volumen Máx', value: '300 x 300 x 400 mm' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['impresion3d', 'manufactura', 'servicios', 'prototipado'],
    downloadCount: 0,
    rating: 4.9,
    reviewCount: 25,
    isFeatured: true,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-03-02'),
    updatedAt: new Date('2024-03-02')
  },
  {
    id: '19',
    slug: 'acabado-profesional-postprocesado',
    name: 'Acabado Profesional y Postprocesado',
    description: 'Servicio de postprocesado y acabados premium para resultados excepcionales. Llevamos tus impresiones 3D al siguiente nivel mediante técnicas de lijado, masillado, pintura, barnizado y tratamientos superficiales. Eliminamos las líneas de capa para obtener piezas con apariencia de producto final inyectado.',
    shortDescription: 'Postprocesado y acabados premium para resultados excepcionales',
    price: 0,
    customPriceDisplay: 'Cotización personalizada',
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '19-a',
        productId: '19',
        url: '/images/placeholder-artistic.svg',
        alt: 'Acabado Profesional y Pintura de Modelos 3D',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ],
    specifications: [
      { name: 'Servicio', value: 'Postprocesado y Pintura' },
      { name: 'Técnicas', value: 'Lijado, Masillado, Aerografía, Pincel' },
      { name: 'Acabados', value: 'Mate, Brillante, Metálico, Texturizado' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['postprocesado', 'pintura', 'acabado', 'premium', 'servicios'],
    downloadCount: 0,
    rating: 4.8,
    reviewCount: 12,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: '20',
    slug: 'trofeos-3d-tematicos-personalizados',
    name: 'Trofeos 3D Temáticos',
    description: 'Trofeos únicos y personalizados para eventos, torneos y reconocimientos. Diseñamos y fabricamos premios temáticos que capturan la esencia de tu evento. Desde copas clásicas hasta figuras de personajes o logotipos corporativos en 3D.',
    shortDescription: 'Trofeos únicos y personalizados para eventos y reconocimientos',
    price: 0,
    customPriceDisplay: 'Cotización según diseño',
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '20-a',
        productId: '20',
        url: '/images/marketplace/copa-piston-20cm-regalo-personalizado-autos-3d-frontal.png',
        alt: 'Trofeos Temáticos Personalizados 3D',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ],
    specifications: [
      { name: 'Servicio', value: 'Diseño y Fabricación de Trofeos' },
      { name: 'Personalización', value: 'Total (Forma, Tamaño, Color)' },
      { name: 'Uso', value: 'Torneos, Eventos, Reconocimientos' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['trofeos', 'premios', 'eventos', 'tematico', 'personalizado'],
    downloadCount: 0,
    rating: 4.9,
    reviewCount: 18,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];
