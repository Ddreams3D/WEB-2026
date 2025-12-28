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
        imagePosition: 'object-center',
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
        imagePosition: 'object-top',
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
    displayOrder: 50,
    slug: 'trofeos-medallas-3d-personalizados',
    name: 'Trofeos y Medallas 3D Personalizadas',
    description: 'Diseño y fabricación de trofeos y premios totalmente personalizados.\nPerfectos para eventos, competencias y reconocimientos especiales.',
    shortDescription: 'Trofeos y Medallas 3D Personalizados para eventos y empresas',
    price: 0,
    customPriceDisplay: 'Cotización según diseño y tamaño',
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
        alt: 'Trofeos y Medallas 3D Personalizados - Vista Principal',
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
        alt: 'Trofeos y Medallas 3D Personalizados - Vista Detalle',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      }
    ],
    tabsTitle: 'ESTE SERVICIO SE ADAPTA SEGÚN EL TIPO DE CLIENTE',
    tabs: [
      {
        id: 'b2c',
        label: 'General / Personas (B2C)',
        description: 'Servicio de diseño y fabricación de trofeos 3D personalizados, ideales para reconocimientos, eventos especiales, competencias y celebraciones personales.\nCreamos trofeos temáticos y piezas únicas, adaptadas al concepto del evento, con acabados personalizados y fabricación mediante impresión 3D.\n\nEl enfoque es visual y decorativo, priorizando diseño, estética y personalización según el evento o reconocimiento.',
        idealFor: ['Eventos deportivos o culturales', 'Reconocimientos personales', 'Trofeos temáticos personalizados', 'Premios únicos y conmemorativos'],
        conditions: ['Cotización según diseño y tamaño', 'Fabricación bajo pedido', 'Personalización de textos, logos y formas'],
        ctaText: 'Cotizar servicio',
        ctaAction: 'quote'
      },
      {
        id: 'b2b',
        label: 'Empresas / B2B',
        description: 'Servicio profesional de fabricación de trofeos y medallas 3D personalizados para empresas, instituciones y eventos corporativos.\nDesarrollamos trofeos y medallas en series pequeñas y medianas, manteniendo coherencia visual, calidad de acabado y personalización según identidad de marca o evento.\n\nProducción seriada disponible según cantidad y diseño.',
        idealFor: ['Eventos empresariales y corporativos', 'Premiaciones institucionales', 'Competencias deportivas', 'Reconocimientos internos de empresa'],
        conditions: ['Cotización según cantidad, diseño y acabados', 'Producción por lotes', 'Fabricación bajo pedido'],
        ctaText: 'Cotizar proyecto B2B',
        ctaAction: 'quote'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['merchandising', 'productospersonalizados', 'branding', 'impresion3d', 'empresas', 'general-service'],
    downloadCount: 0,
    rating: 4.8,
    reviewCount: 5,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2025-12-28')
  },
  {
    id: '20',
    displayOrder: 45,
    slug: 'merchandising-3d-personalizado',
    name: 'Merchandising 3D Personalizado',
    description: 'Creación de productos 3D personalizados para marcas, eventos y promociones.\nMerchandising creativo y regalos corporativos.',
    shortDescription: 'Creación de productos 3D personalizados para marcas, eventos y promociones.',
    price: 0,
    customPriceDisplay: 'Cotización según diseño y cantidad',
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '20-a',
        productId: '20',
        url: '/images/services/merchandising-3d-personalizado-regalos-corporativos.png',
        alt: 'Merchandising 3D Personalizado - Regalos Corporativos',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: '20-b',
        productId: '20',
        url: '/images/services/merchandising-3d-detalle-producto-creativo.jpg',
        alt: 'Detalle de Producto Creativo - Merchandising 3D',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ],
    tabsTitle: 'Este servicio se adapta según el tipo de cliente',
    tabs: [
      {
        id: 'b2c',
        label: 'General / Personas (B2C)',
        description: 'Servicio de merchandising personalizado para eventos sociales, fiestas y regalos grupales.\nCreamos recuerdos únicos y temáticos que destacan por su originalidad, fabricados mediante impresión 3D.',
        idealFor: ['Recuerdos para eventos', 'Regalos grupales personalizados', 'Detalles temáticos'],
        conditions: ['Cotización según cantidad', 'Fabricación bajo pedido'],
        ctaText: 'Solicitar cotización',
        ctaAction: 'quote'
      },
      {
        id: 'b2b',
        label: 'Empresas / B2B',
        description: 'Servicio profesional de merchandising corporativo y promocional.\nDesarrollamos productos únicos con el logo o identidad de su marca, ideales para fidelización de clientes, eventos corporativos y campañas de marketing.',
        idealFor: ['Regalos corporativos', 'Merchandising de marca', 'Activaciones BTL'],
        conditions: ['Descuentos por volumen', 'Diseño exclusivo', 'Facturación disponible'],
        ctaText: 'Cotizar proyecto B2B',
        ctaAction: 'quote'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['merchandising', 'regaloscorporativos', 'marketing', 'impresion3d', 'b2b', 'general-service'],
    downloadCount: 0,
    rating: 4.8,
    reviewCount: 10,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2025-12-28')
  },
  {
    id: '14',
    displayOrder: 60,
    slug: 'prototipado-rapido-funcional',
    name: 'Prototipado Rápido y Funcional',
    description: 'Desarrollo de prototipos funcionales para pruebas y validación temprana.\nIdeal para iteración, mejora de diseño y desarrollo de producto.',
    shortDescription: 'Desarrollo ágil de prototipos para validar forma, ajuste y función',
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
        url: '/images/services/prototipado-ingenieria-vista-general-piezas.jpg',
        alt: 'Prototipado de Ingeniería 3D - Vista General de Piezas',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      },
      {
        id: '14-b',
        productId: '14',
        url: '/images/services/prototipado-ingenieria-detalle-mecanico-funcional.jpg',
        alt: 'Detalle de Mecanismo Funcional y Precisión Técnica',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      },
      {
        id: '14-c',
        productId: '14',
        url: '/images/services/prototipado-ingenieria-conjunto-piezas-tecnicas.jpg',
        alt: 'Conjunto de Piezas Técnicas para Validación de Diseño',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      }
    ],
    tabsTitle: 'ESTE SERVICIO SE ADAPTA SEGÚN EL TIPO DE CLIENTE',
    tabs: [
      {
        id: 'b2c',
        label: 'General / Personas (B2C)',
        description: 'Servicio de prototipado técnico orientado a estudiantes, proyectos universitarios y necesidades funcionales personales. Diseñamos y fabricamos piezas técnicas personalizadas para validar ideas, reemplazar componentes o desarrollar soluciones prácticas mediante impresión 3D.\n\nEste servicio está enfocado en iteración, ajuste y mejora de piezas, priorizando funcionalidad, resistencia y compatibilidad con el uso real. Ideal para proyectos académicos, maquetas técnicas, prototipos simples y soluciones a medida sin procesos industriales complejos.',
        idealFor: ['Proyectos universitarios y académicos', 'Prototipos funcionales a pequeña escala', 'Iteración y mejora de piezas personalizadas', 'Repuestos técnicos y adaptadores a medida'],
        conditions: ['Cotización según complejidad y tamaño', 'Fabricación bajo pedido', 'Asesoría básica en funcionalidad y material'],
        ctaText: 'Cotizar servicio',
        ctaAction: 'quote'
      },
      {
        id: 'b2b',
        label: 'Empresas / B2B',
        description: 'Servicio profesional de prototipado de ingeniería y fabricación de piezas técnicas para empresas, emprendimientos y proyectos industriales. Desarrollamos prototipos funcionales y componentes técnicos destinados a validación de diseño, pruebas funcionales y producción seriada mediante impresión 3D.\n\nEste servicio permite iterar diseños, optimizar geometrías y fabricar piezas técnicas en series pequeñas o medianas, reduciendo tiempos y costos frente a procesos industriales tradicionales. Está orientado a producción funcional, no a piezas altamente complejas ni procesos industriales de alta tolerancia.\n\nProducción seriada disponible tras validación del diseño.',
        idealFor: ['Producción seriada de piezas técnicas', 'Validación funcional de componentes', 'Iteración y mejora continua de productos', 'Reemplazo de piezas personalizadas', 'Maquetas técnicas e industriales'],
        conditions: ['Cotización según volumen y alcance del proyecto', 'Producción por lotes disponible', 'Entregables CAD funcionales (STL / STEP)', 'Evaluación técnica previa al inicio de producción'],
        ctaText: 'Cotizar proyecto B2B',
        ctaAction: 'quote'
      }
    ],
    specifications: [
      { name: 'Enfoque', value: 'Prototipado técnico, Producción seriada mediante impresión 3D, Ingeniería funcional' },
      { name: 'Entregables', value: 'Archivos STL / STEP, Piezas técnicas impresas en 3D' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['prototipado', 'ingenieria', 'piezastecnicas', 'impresion3d', 'produccionseriada', 'b2b', 'general-service'],
    downloadCount: 0,
    rating: 4.9,
    reviewCount: 8,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2025-12-28')
  },
  {
    id: '15',
    displayOrder: 70,
    slug: 'maquetas-didacticas-material-educativo-3d',
    name: 'Maquetas Didácticas y Material Educativo 3D',
    description: 'Modelos educativos en 3D para enseñanza visual e interactiva.\nUsados en colegios, universidades y formación especializada.',
    shortDescription: 'Diseño y fabricación de material didáctico interactivo y modelos educativos impresos en 3D',
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
        url: '/images/services/maquetas-didacticas-v2.png',
        alt: 'Maquetas Didácticas y Material Educativo 3D',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2025-12-28')
      }
    ],
    tabsTitle: 'ESTE SERVICIO SE ADAPTA SEGÚN EL TIPO DE CLIENTE',
    tabs: [
      {
        id: 'b2c',
        label: 'General / Personas (B2C)',
        description: 'Servicio de diseño y fabricación de material didáctico y modelos educativos orientado a estudiantes, padres de familia y docentes. Creamos maquetas educativas físicas para apoyar tareas escolares, exposiciones y proyectos académicos, facilitando la comprensión de conceptos mediante objetos visuales y manipulables.\n\nDesarrollamos modelos educativos como células, sistemas solares, estructuras científicas, mapas, figuras geométricas y otros elementos solicitados en colegios y centros educativos. Los diseños se adaptan al nivel del estudiante y al contenido requerido, priorizando claridad, escala adecuada y resistencia para uso escolar.\n\nIdeal para complementar el aprendizaje tradicional con recursos prácticos y visuales.',
        idealFor: ['Tareas y proyectos escolares', 'Exposiciones educativas', 'Maquetas didácticas para colegio', 'Apoyo visual para estudio en casa'],
        conditions: ['Cotización según tamaño y complejidad', 'Fabricación bajo pedido', 'Personalización según nivel educativo'],
        ctaText: 'Cotizar servicio',
        ctaAction: 'quote'
      },
      {
        id: 'b2b',
        label: 'Empresas / B2B',
        description: 'Servicio profesional de diseño y fabricación de material didáctico y modelos educativos para instituciones educativas, colegios, academias y universidades. Desarrollamos maquetas educativas y kits didácticos personalizados alineados al currículo educativo y objetivos pedagógicos.\n\nLos modelos se fabrican mediante impresión 3D, permitiendo producción en series pequeñas o medianas, estandarización de piezas y adaptación a programas educativos específicos. Este servicio está orientado a mejorar la experiencia de aprendizaje en aulas, laboratorios y espacios educativos.\n\nIdeal para instituciones que buscan recursos educativos físicos, durables y reutilizables.',
        idealFor: ['Colegios e instituciones educativas', 'Academias y centros de formación', 'Material didáctico institucional', 'Kits educativos para aula'],
        conditions: ['Cotización según volumen y diseño', 'Producción por lotes disponible', 'Diseño a medida según currículo'],
        ctaText: 'Cotizar proyecto B2B',
        ctaAction: 'quote'
      }
    ],
    specifications: [
      { name: 'Servicio', value: 'Recursos Educativos' },
      { name: 'Niveles', value: 'Primaria, Secundaria, Superior' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['materialdidactico', 'educacion', 'maquetas', 'colegio', 'aprendizaje', 'impresion3d', 'b2b', 'general-service'],
    downloadCount: 0,
    rating: 4.7,
    reviewCount: 6,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2025-12-28')
  },
  {
    id: '16',
    displayOrder: 90,
    slug: 'proyectos-anatomicos-3d-personalizados',
    name: 'Proyectos Anatómicos 3D Personalizados',
    description: 'Desarrollo de modelos anatómicos en 3D con enfoque educativo y médico.\nPara estudio, demostración y formación profesional.',
    shortDescription: 'Desarrollo, modelado y fabricación de modelos anatómicos personalizados en impresión 3D',
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
        alt: 'Proyectos Anatómicos 3D Personalizados',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-02-20')
      }
    ],
    tabsTitle: 'ESTE SERVICIO SE ADAPTA SEGÚN EL TIPO DE CLIENTE',
    tabs: [
      {
        id: 'b2c',
        label: 'General / Personas (B2C)',
        description: 'Servicio de desarrollo y fabricación de modelos anatómicos 3D orientado a estudiantes, docentes y profesionales de la salud. Creamos modelos anatómicos personalizados para estudio, aprendizaje y apoyo visual, ideales para comprender estructuras complejas de forma clara y tangible.\n\nTrabajamos a partir de referencias anatómicas, modelos digitales existentes o requerimientos educativos específicos. Los modelos se diseñan priorizando claridad visual, escala adecuada y utilidad didáctica, y se fabrican mediante impresión 3D según el nivel académico o necesidad de estudio.\n\nIdeal para reforzar el aprendizaje práctico y complementar el material teórico en anatomía.',
        idealFor: ['Estudiantes de medicina y ciencias de la salud', 'Material de estudio anatómico personalizado', 'Apoyo visual para clases y exposiciones', 'Modelos anatómicos a escala para aprendizaje'],
        conditions: ['Cotización según complejidad y tamaño del modelo', 'Fabricación bajo pedido', 'Personalización según requerimiento educativo'],
        ctaText: 'Cotizar servicio',
        ctaAction: 'quote'
      },
      {
        id: 'b2b',
        label: 'Empresas / B2B',
        description: 'Servicio profesional de desarrollo, modelado y fabricación de modelos anatómicos 3D personalizados para instituciones educativas, centros de formación, clínicas y proyectos académicos. Creamos modelos anatómicos físicos destinados a docencia, demostración, entrenamiento y apoyo visual especializado.\n\nLos modelos se desarrollan a partir de referencias anatómicas, modelos digitales base o requerimientos técnicos definidos por la institución. Se optimizan para impresión 3D, asegurando coherencia anatómica, resistencia física y calidad visual.\n\nLa producción puede realizarse en series pequeñas o medianas, según el alcance del proyecto.\n\nEste servicio está orientado a proyectos institucionales y educativos que requieran material anatómico físico como soporte técnico o formativo, sin intervención clínica directa.',
        idealFor: ['Universidades y centros de formación', 'Instituciones educativas y academias', 'Clínicas para entrenamiento y demostración', 'Material anatómico institucional'],
        conditions: ['Cotización según alcance, nivel de detalle y volumen', 'Producción por lotes disponible', 'Posibilidad de acuerdos de confidencialidad (NDA)'],
        ctaText: 'Cotizar proyecto B2B',
        ctaAction: 'quote'
      }
    ],
    specifications: [
      { name: 'Servicio', value: 'Anatomía 3D Personalizada' },
      { name: 'Origen', value: 'Modelado 3D / Referencias anatómicas / Modelos educativos / Modelos base' },
      { name: 'Aplicación', value: 'Educativa / Aprendizaje / Entrenamiento / Demostración' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['anatomia3d', 'modelosanatomicos', 'educacionmedica', 'salud', 'impresion3d', 'b2b', 'materialeducativo', 'medicina', 'business-service', 'general-service'],
    downloadCount: 0,
    rating: 4.9,
    reviewCount: 15,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  },

  {
    id: '17',
    displayOrder: 10,
    slug: 'modelado-3d-personalizado',
    name: 'Modelado 3D Personalizado (Orgánico)',
    description: 'Creación de modelos 3D orgánicos para personajes, figuras y piezas visuales únicas.\nIdeal para proyectos artísticos y creativos personalizados.',
    shortDescription: 'Modelado 3D orgánico y artístico para personajes, objetos personalizados y piezas visuales',
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
        url: '/images/services/modelado-3d-organico-personajes-esculturas-digitales.png',
        alt: 'Modelado 3D Orgánico - Personajes y Esculturas Digitales',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: '17-b',
        productId: '17',
        url: '/images/services/diseno-3d-organico-modelado-artistico-profesional.png',
        alt: 'Diseño 3D Orgánico - Modelado Artístico Profesional',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ],
    specifications: [
      { name: 'Enfoque', value: 'Modelado Orgánico, Escultura Digital, Ajuste Visual' },
      { name: 'Entregables', value: 'Archivos STL / OBJ, Versiones optimizadas' },
      { name: 'Software', value: 'Blender, Flujos asistidos con IA' }
    ],
    tabsTitle: 'ESTE SERVICIO SE ADAPTA SEGÚN EL TIPO DE CLIENTE',
    tabs: [
      {
        id: 'b2c',
        label: 'General / Personas (B2C)',
        description: 'Servicio de modelado 3D orgánico orientado a proyectos creativos y personales. Creamos modelos únicos a partir de ideas, bocetos, imágenes de referencia o conceptos generados con IA, enfocándonos en formas orgánicas, estética y personalidad del diseño.\nIdeal para figuras, personajes, regalos personalizados y piezas visuales listas para impresión 3D o exhibición, sin necesidad de conocimientos técnicos previos.',
        idealFor: ['Figuras y personajes personalizados', 'Regalos únicos y piezas decorativas', 'Modelos para impresión 3D artística', 'Modificación de archivos STL existentes'],
        conditions: ['Cotización según complejidad del modelo', 'Entregables digitales (STL / OBJ)', 'Revisiones incluidas según acuerdo'],
        ctaText: 'Solicitar cotización',
        ctaAction: 'quote'
      },
      {
        id: 'b2b',
        label: 'Empresas / B2B',
        description: 'Servicio profesional de modelado 3D orgánico y visual enfocado en marcas, estudios creativos y proyectos comerciales que requieren modelos con alto impacto visual.\nDesarrollamos personajes, objetos y piezas orgánicas para marketing, exhibición, branding, impresión 3D artística o contenido visual, apoyándonos en flujos híbridos que incluyen IA + escultura digital.',
        idealFor: ['Personajes de marca y mascots', 'Piezas visuales para campañas o eventos', 'Modelos orgánicos para impresión 3D artística', 'Contenido visual y presentaciones de producto'],
        conditions: ['Cotización según alcance creativo', 'Archivos optimizados para impresión o visualización', 'Acuerdos de confidencialidad (NDA) disponibles'],
        ctaText: 'Cotizar proyecto B2B',
        ctaAction: 'quote'
      }
    ],
    format: 'Digital',
    fileSize: 'Variable',
    license: 'Standard',
    tags: ['modelado3d', 'modeladoorganico', 'esculturadigital', 'impresion3d', 'arte3d', 'personajes3d', 'general-service'],
    downloadCount: 0,
    rating: 5.0,
    reviewCount: 8,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: '21',
    displayOrder: 20,
    slug: 'prototipado-tecnico-diseno-cad-funcional',
    name: 'Ingeniería y Diseño Técnico (CAD)',
    description: 'Diseño CAD y desarrollo de piezas técnicas para validación y fabricación.\nEnfocado en ingeniería, precisión y funcionalidad.',
    shortDescription: 'Diseño CAD, prototipado funcional y producción seriada para proyectos técnicos y empresariales',
    price: 0,
    customPriceDisplay: 'Cotización técnica',
    currency: 'PEN',
    categoryId: 'ingenieria',
    categoryName: 'Ingeniería',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '21-a',
        productId: '21',
        url: '/images/services/prototipado-tecnico-diseno-cad-industrial.png',
        alt: 'Prototipado Técnico y Diseño CAD Industrial',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05')
      },
      {
        id: '21-b',
        productId: '21',
        url: '/images/services/ingenieria-inversa-diseno-mecanico-3d.png',
        alt: 'Ingeniería Inversa y Diseño Mecánico 3D',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05')
      }
    ],
    specifications: [
      { name: 'Enfoque', value: 'Diseño CAD funcional, Iteración y mejora de piezas, Prototipado técnico, Producción seriada mediante impresión 3D, Ingeniería inversa básica' },
      { name: 'Entregables', value: 'Archivos STL / STEP, Planos técnicos básicos (cuando aplique)' },
      { name: 'Software', value: 'Fusion 360, FreeCAD' }
    ],
    tabsTitle: 'ESTE SERVICIO SE ADAPTA SEGÚN EL TIPO DE CLIENTE',
    tabs: [
      {
        id: 'b2c',
        label: 'General / Personas (B2C)',
        description: 'Servicio de diseño CAD funcional orientado a estudiantes, proyectos universitarios y necesidades técnicas personales.\nDesarrollamos piezas y soluciones prácticas para prototipos académicos, iteración de piezas personalizadas, maquetas técnicas y validación básica de ideas, asegurando que el diseño funcione correctamente y pueda fabricarse mediante impresión 3D.\n\nEl enfoque es práctico y funcional, ideal para probar, ajustar y mejorar una pieza sin recurrir a procesos industriales complejos.',
        idealFor: ['Proyectos universitarios y académicos', 'Iteración y mejora de piezas personalizadas', 'Maquetas técnicas o industriales a pequeña escala', 'Repuestos y adaptadores personalizados', 'Optimización de archivos STL existentes'],
        conditions: ['Cotización según complejidad del diseño', 'Archivos listos para impresión 3D', 'Asesoría en selección de material y ajustes funcionales'],
        ctaText: 'Solicitar cotización',
        ctaAction: 'quote'
      },
      {
        id: 'b2b',
        label: 'Empresas / B2B',
        description: 'Servicio de diseño CAD y prototipado funcional orientado a empresas y emprendimientos que requieren iterar, validar y producir piezas técnicas en serie.\nTrabajamos desde el desarrollo del diseño hasta la producción seriada mediante impresión 3D, ideal para lotes pequeños y medianos, validación de mercado o reemplazo de componentes.\n\nLa producción se enfoca en repetibilidad, funcionalidad y control de calidad, utilizando impresión 3D como solución flexible y escalable.\n\nProducción seriada disponible tras validación del diseño.\n\nPara proyectos que requieran tolerancias industriales estrictas, normativas específicas o procesos de manufactura complejos, el alcance se evalúa y puede escalarse mediante colaboración técnica especializada.',
        idealFor: ['Producción seriada de piezas técnicas', 'Iteración y mejora continua de componentes', 'Maquetas industriales y prototipos funcionales', 'Reemplazo de piezas personalizadas', 'Validación de productos antes de escalar a manufactura tradicional'],
        conditions: ['Cotización según volumen y alcance del proyecto', 'Producción por lotes (series pequeñas y medianas)', 'Entregables CAD funcionales (STL / STEP)', 'Evaluación técnica previa al inicio de producción'],
        ctaText: 'Cotizar proyecto B2B',
        ctaAction: 'quote'
      }
    ],
    format: 'Digital',
    fileSize: 'Variable',
    license: 'Standard',
    tags: ['prototipado', 'diseñocad', 'produccion3d', 'produccionseriada', 'ingenieria', 'general-service'],
    downloadCount: 0,
    rating: 5.0,
    reviewCount: 4,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05')
  },
  {
    id: '18',
    displayOrder: 30,
    slug: 'impresion-3d-por-encargo',
    name: 'Impresión 3D por Encargo',
    description: 'Fabricación de piezas en impresión 3D bajo pedido y según especificaciones.\nRepuestos, componentes funcionales y soluciones personalizadas.',
    shortDescription: 'Fabricación de piezas en impresión 3D bajo pedido y según especificaciones',
    price: 0,
    customPriceDisplay: 'Solicitar cotización',
    currency: 'PEN',
    categoryId: 'ingenieria',
    categoryName: 'Ingeniería',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '18-a',
        productId: '18',
        url: '/images/services/impresion-3d-encargo-servicio-profesional.jpg',
        alt: 'Servicio de Impresión 3D por Encargo - Calidad Profesional',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: '18-b',
        productId: '18',
        url: '/images/services/impresion-3d-detalle-alta-calidad.jpg',
        alt: 'Detalle de Impresión 3D de Alta Calidad y Precisión',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: '18-c',
        productId: '18',
        url: '/images/services/impresion-3d-gran-formato-piezas-industriales.jpg',
        alt: 'Impresión 3D de Gran Formato para Piezas Industriales',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: '18-d',
        productId: '18',
        url: '/images/services/impresion-3d-produccion-lotes-piezas-tecnicas.jpg',
        alt: 'Producción de Lotes de Piezas Técnicas en Impresión 3D',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ],
    specifications: [
      { name: 'Tecnologías', value: 'FDM (Filamento), SLA/DLP (Resina)' },
      { name: 'Materiales', value: 'PLA, PETG, ABS, TPU, Resina Standard' },
      { name: 'Volumen Máx', value: '300 × 300 × 400 mm' }
    ],
    tabsTitle: 'Este servicio se adapta según el tipo de cliente',
    tabs: [
      {
        id: 'b2c',
        label: 'General / Personas (B2C)',
        description: 'Servicio de impresión 3D orientado a clientes particulares y proyectos personales, ideal para fabricar piezas personalizadas con buen acabado y resistencia.\nTe acompañamos durante todo el proceso, desde la elección del material hasta la impresión final, para que obtengas un resultado funcional y bien terminado, incluso si no tienes experiencia previa en impresión 3D.',
        idealFor: ['Repuestos personalizados', 'Proyectos personales o creativos', 'Trabajos universitarios y académicos', 'Piezas únicas con acabado profesional'],
        conditions: ['Cotización según tamaño y material', 'Fabricación bajo pedido', 'Asesoría incluida durante el proceso'],
        ctaText: 'Solicitar cotización',
        ctaAction: 'quote'
      },
      {
        id: 'b2b',
        label: 'Empresas / B2B',
        description: 'Servicio profesional de impresión 3D enfocado en empresas, ingenieros y proyectos técnicos, ideal para la fabricación de piezas funcionales, prototipos y series cortas.\nAnalizamos cada proyecto según su uso final, tolerancias, material y volumen de producción, asegurando resultados consistentes y listos para validación o implementación.',
        idealFor: ['Prototipos funcionales', 'Validación de diseño', 'Producción piloto y series cortas', 'Piezas técnicas y repuestos'],
        conditions: ['Cotización técnica según requerimientos', 'Posibilidad de fabricación por volumen', 'Coordinación y seguimiento del proyecto'],
        ctaText: 'Cotizar proyecto B2B',
        ctaAction: 'quote'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['impresion3d', 'ingenieria', 'prototipado', 'manufactura', 'fdm', 'resina', 'general-service'],
    downloadCount: 0,
    rating: 4.9,
    reviewCount: 25,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-03-02'),
    updatedAt: new Date('2025-12-28')
  },

  {
    id: '19',
    displayOrder: 80,
    slug: 'fabricacion-cascos-mascaras-props-cosplay',
    name: 'Fabricación de Cascos, Máscaras, Props y Cosplay',
    description: 'Creación de cascos, máscaras y props 3D personalizados de alto impacto visual.\nPara cosplay, eventos y proyectos creativos.',
    shortDescription: 'Diseño, modelado y fabricación de piezas personalizadas mediante impresión 3D',
    price: 0,
    customPriceDisplay: 'Cotización según diseño y tamaño',
    currency: 'PEN',
    categoryId: 'arte-diseno',
    categoryName: 'Arte y Diseño',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '19-a',
        productId: '19',
        url: '/images/services/fabricacion-cascos-mascaras-cosplay-props-frontal.jpg',
        alt: 'Fabricación de Cascos y Máscaras Cosplay - Vista Frontal',
        isPrimary: true,
        imagePosition: 'object-[50%_25%]',
        width: 800,
        height: 600,
        createdAt: new Date('2025-12-28'),
        updatedAt: new Date('2025-12-28')
      },
      {
        id: '19-b',
        productId: '19',
        url: '/images/services/fabricacion-cascos-mascaras-cosplay-props-detalle.jpg',
        alt: 'Detalle de Props y Accesorios Cosplay Personalizados',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2025-12-28'),
        updatedAt: new Date('2025-12-28')
      },
      {
        id: '19-c',
        productId: '19',
        url: '/images/services/fabricacion-cascos-mascaras-cosplay-props-ejemplo-creativo.png',
        alt: 'Ejemplo Creativo de Máscaras y Cascos 3D',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2025-12-28'),
        updatedAt: new Date('2025-12-28')
      },
      {
        id: '19-d',
        productId: '19',
        url: '/images/services/fabricacion-cascos-mascaras-cosplay-props-acabado-final.png',
        alt: 'Acabado Final en Props de Cosplay',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2025-12-28'),
        updatedAt: new Date('2025-12-28')
      },
      {
        id: '19-e',
        productId: '19',
        url: '/images/services/fabricacion-cascos-mascaras-cosplay-props-modelo-exclusivo.png',
        alt: 'Modelo Exclusivo de Casco/Máscara 3D Personalizado',
        isPrimary: false,
        width: 800,
        height: 600,
        createdAt: new Date('2025-12-28'),
        updatedAt: new Date('2025-12-28')
      }
    ],
    specifications: [
      { name: 'Enfoque', value: 'Diseño personalizado, modelado 3D y fabricación mediante impresión 3D' },
      { name: 'Materiales', value: 'PLA, Resina (según diseño y requerimientos de la pieza)' }
    ],
    tabsTitle: 'Este servicio se adapta según el tipo de cliente',
    tabs: [
      {
        id: 'b2c',
        label: 'General / Personas (B2C)',
        description: 'Servicio de diseño y fabricación de cascos, máscaras, props y piezas de cosplay personalizadas, orientado a personas, cosplayers, coleccionistas, artistas y creadores de contenido.\nDesarrollamos piezas desde cero o a partir de referencias visuales, adaptadas al tamaño del usuario, estilo deseado y nivel de detalle requerido. Las piezas se fabrican mediante impresión 3D y pueden entregarse listas para uso o como base para pintado y acabado final.\nTambién hemos desarrollado máscaras personalizadas para DJs y artistas, diseñadas para presentaciones en vivo y contenido visual, adaptadas a identidad estética y comodidad de uso.\n\nIdeal para quienes buscan piezas únicas, resistentes y personalizadas, sin recurrir a productos genéricos o de producción en masa.',
        idealFor: ['Cascos y máscaras personalizadas', 'Props para cosplay y exhibición', 'Accesorios temáticos y réplicas', 'Piezas únicas para coleccionistas', 'Cosplay para eventos, sesiones o contenido digital'],
        conditions: ['Cotización según diseño, tamaño y nivel de detalle', 'Fabricación bajo pedido', 'Ajuste de escala según medidas del usuario', 'No incluye licencias oficiales de marcas registradas'],
        ctaText: 'Solicitar cotización',
        ctaAction: 'quote'
      },
      {
        id: 'b2b',
        label: 'Empresas / B2B',
        description: 'Servicio profesional de diseño y fabricación de cascos, máscaras y props personalizados para empresas, productoras, agencias creativas y eventos.\nDesarrollamos piezas exclusivas para campañas publicitarias, activaciones de marca, exhibiciones, escenografía y contenido audiovisual. Incluye experiencia en la fabricación de máscaras personalizadas para DJs y artistas, utilizadas en eventos, presentaciones en vivo y producciones visuales.\nEl servicio permite producir piezas únicas o series pequeñas y medianas, manteniendo coherencia visual, calidad estructural y personalización según identidad de marca o evento.\n\nLa impresión 3D permite optimizar tiempos de desarrollo, costos y adaptar cada diseño a necesidades específicas.',
        idealFor: ['Producciones audiovisuales y escenografía', 'Activaciones de marca y eventos temáticos', 'Exhibiciones, stands y vitrinas', 'Props personalizados para campañas', 'Producción por series pequeñas'],
        conditions: ['Cotización según alcance, diseño y volumen', 'Producción por lotes disponible', 'Diseño exclusivo por proyecto', 'Uso comercial bajo solicitud del cliente'],
        ctaText: 'Cotizar proyecto B2B',
        ctaAction: 'quote'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['cosplay', 'props', 'mascaras3d', 'cascos3d', 'impresion3d', 'personalizado', 'arteydiseño', 'b2b', 'general-service', 'business-service'],
    downloadCount: 0,
    rating: 4.8,
    reviewCount: 15,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2025-12-28')
  }
];
