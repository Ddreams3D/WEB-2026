import { Product, Category, User, Review } from '../types';

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Arquitectura 3D',
    description: 'Modelos arquitectónicos y diseños de edificios',
    slug: 'arquitectura-3d',
    imageUrl: '/images/categories/architecture.jpg',
    productCount: 25,
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Diseño Industrial',
    description: 'Productos y prototipos industriales',
    slug: 'diseno-industrial',
    imageUrl: '/images/categories/industrial.jpg',
    productCount: 18,
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Arte Digital',
    description: 'Esculturas y arte conceptual en 3D',
    slug: 'arte-digital',
    imageUrl: '/images/categories/digital-art.jpg',
    productCount: 32,
    isActive: true,
    sortOrder: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Videojuegos',
    description: 'Assets y modelos para videojuegos',
    slug: 'videojuegos',
    imageUrl: '/images/categories/gaming.jpg',
    productCount: 45,
    isActive: true,
    sortOrder: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: 'Animación',
    description: 'Modelos para animación y motion graphics',
    slug: 'animacion',
    imageUrl: '/images/categories/animation.jpg',
    productCount: 28,
    isActive: true,
    sortOrder: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    name: 'Medicina / Educación',
    description: 'Modelos anatómicos y médicos para educación',
    slug: 'medicina',
    imageUrl: '/images/categories/medical.jpg',
    productCount: 15,
    isActive: true,
    sortOrder: 6,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '7',
    name: 'Trofeos, Merchandising & Regalos',
    description: 'Trofeos, copas, regalos personalizados y merchandising',
    slug: 'trofeos-regalos',
    imageUrl: '/images/categories/trophies.jpg',
    productCount: 20,
    isActive: true,
    sortOrder: 7,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '10',
    name: 'Servicios 3D',
    description: 'Servicios de impresión y diseño 3D bajo demanda',
    slug: 'servicios-3d',
    imageUrl: '/images/categories/services.jpg',
    productCount: 10,
    isActive: true,
    sortOrder: 8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '11',
    name: 'Arte 3D & Coleccionables',
    description: 'Figuras, arte y coleccionables impresos en 3D',
    slug: 'arte-coleccionables',
    imageUrl: '/images/categories/art.jpg',
    productCount: 12,
    isActive: true,
    sortOrder: 9,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '12',
    name: 'Diseño 3D',
    description: 'Servicios de modelado y diseño digital',
    slug: 'diseno-3d',
    imageUrl: '/images/categories/design.jpg',
    productCount: 8,
    isActive: true,
    sortOrder: 10,
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
    name: 'Pelvis Anatómica – Escala Real',
    description: 'Modelo anatómico físico impreso en 3D con base incluida lista para uso educativo',
    shortDescription: 'Modelo anatómico físico impreso en 3D con base incluida lista para uso educativo',
    price: 300.00,
    currency: 'PEN',
    categoryId: '6',
    categoryName: 'Medicina / Educación',
    sellerId: '3',
    sellerName: 'Miguel Rodríguez',
    images: [
      {
        id: '1',
        productId: '1',
        url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
        alt: 'Pelvis Anatómica Escala Real',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ],
    specifications: [
      { name: 'Categoría', value: 'ANATOMÍA 3D' },
      { name: 'Escala', value: 'Real' },
      { name: 'Material', value: 'PLA Premium' },
      { name: 'Uso', value: 'Educativo / Médico' }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['anatomía', 'medicina', 'pelvis', 'educación', 'modelo 3d'],
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
    categoryId: '6',
    categoryName: 'Medicina / Educación',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '12',
        productId: '6',
        url: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=600',
        alt: 'Columna Vertebral Anatómica',
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
    name: 'Proyectos Anatómicos 3D – Especializados (B2B)',
    description: 'Desarrollo, modelado y fabricación de modelos anatómicos personalizados impresos en 3D, orientados a instituciones educativas, centros de salud, universidades y proyectos académicos o médicos.\n\nCada proyecto se diseña a medida según requerimientos técnicos, escala, nivel de detalle, material y uso final.',
    shortDescription: 'Desarrollo, modelado y fabricación de modelos anatómicos personalizados',
    price: 0,
    customPriceDisplay: 'Cotización personalizada según proyecto',
    currency: 'PEN',
    categoryId: '6',
    categoryName: 'Medicina / Educación',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '13',
        productId: '7',
        url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
        alt: 'Proyectos Anatómicos 3D',
        isPrimary: true,
        sortOrder: 1,
        order: 1
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
    tags: ['anatomía', 'medicina', 'educación', 'b2b', 'modelos3D', 'impresión3D'],
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
    name: 'Copa Pistón 3D – 20 cm',
    description: 'Detalle impreso en 3D inspirado en pistones de motor, ideal como regalo para fanáticos de los autos y las carreras.',
    shortDescription: 'Detalle impreso en 3D inspirado en pistones de motor',
    price: 79.00,
    currency: 'PEN',
    categoryId: '7',
    categoryName: 'Trofeos, Merchandising & Regalos',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '2',
        productId: '2',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600',
        alt: 'Copa Pistón 3D',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ],
    specifications: [
      {
        id: '5',
        name: 'Tamaño',
        value: '20 cm'
      },
      {
        id: '6',
        name: 'Colores',
        value: 'A elección (según disponibilidad)'
      },
      {
        id: '7',
        name: 'Adicionales',
        value: 'Sticker personalizado (nombre o frase): + S/ 20\nGrabado 3D impreso (texto integrado en la pieza): + S/ 40'
      },
      {
        id: '8',
        name: 'Tiempo estimado de fabricación',
        value: '2–4 días hábiles'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['trofeo', 'copa pistón', 'regalo', 'autos', 'carreras'],
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
    name: 'Copa Pistón 3D – 30 cm',
    description: 'Versión grande y más llamativa de nuestra copa pistón, pensada para regalos especiales y ocasiones importantes.',
    shortDescription: 'Versión grande y más llamativa de nuestra copa pistón',
    price: 129.00,
    currency: 'PEN',
    categoryId: '7',
    categoryName: 'Trofeos, Merchandising & Regalos',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '3',
        productId: '3',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600',
        alt: 'Copa Pistón 3D Grande',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ],
    specifications: [
      {
        id: '9',
        name: 'Tamaño',
        value: '30 cm'
      },
      {
        id: '10',
        name: 'Color',
        value: 'A elección (según disponibilidad)'
      },
      {
        id: '12',
        name: 'Opcionales',
        value: 'Sticker personalizado (nombre o frase): + S/ 20\nGrabado 3D impreso (texto integrado en la pieza): + S/ 40'
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
    tags: ['trofeo', 'copa pistón', 'grande', 'regalo', 'premium'],
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
    name: 'Trofeos y Medallas 3D – Personalizados (B2B)',
    description: 'Fabricación de trofeos y medallas personalizadas en impresión 3D para eventos deportivos, instituciones, empresas y competencias.',
    shortDescription: 'Fabricación de trofeos y medallas personalizadas',
    price: 0,
    customPriceDisplay: 'Precio sujeto a cotización según cantidad y diseño',
    currency: 'PEN',
    categoryId: '7',
    categoryName: 'Trofeos, Merchandising & Regalos',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '14',
        productId: '8',
        url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600',
        alt: 'Trofeos y Medallas 3D',
        isPrimary: true,
        sortOrder: 1,
        order: 1
      }
    ],
    specifications: [
      {
        id: 'spec-8-1',
        name: 'Información importante',
        value: 'Fabricación bajo pedido\nPrecio sujeto a cotización según cantidad y diseño'
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
    description: 'Cooler funcional impreso en 3D con diseño inspirado en motores. Ideal para cervezas, gaseosas y reuniones pequeñas.',
    shortDescription: 'Cooler funcional impreso en 3D con diseño inspirado en motores',
    price: 210.00,
    currency: 'PEN',
    categoryId: '7',
    categoryName: 'Trofeos, Merchandising & Regalos',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '8',
        productId: '4',
        url: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?auto=format&fit=crop&q=80&w=600',
        alt: 'Cooler Motor 3D V6',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      }
    ],
    specifications: [
      {
        id: '14',
        name: 'Tamaño',
        value: 'V6 (6 espacios)'
      },
      {
        id: '15',
        name: 'Color',
        value: 'A elección (según disponibilidad)'
      },
      {
        id: '17',
        name: 'Opcional',
        value: 'Grabado 3D personalizado (nombre o frase): + S/ 40\n📌 Grabado integrado en la pieza (no sticker).'
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
    tags: ['cooler', 'motor', 'v6', 'regalo', 'cerveza'],
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
    description: 'Versión más amplia y robusta de nuestro cooler estilo motor. Ideal para reuniones, parrillas y regalos especiales.',
    shortDescription: 'Versión más amplia y robusta de nuestro cooler estilo motor',
    price: 260.00,
    currency: 'PEN',
    categoryId: '7',
    categoryName: 'Trofeos, Merchandising & Regalos',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '10',
        productId: '5',
        url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
        alt: 'Cooler Motor 3D V8',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ],
    specifications: [
      {
        id: '20',
        name: 'Tamaño',
        value: 'V8 (8 espacios)'
      },
      {
        id: '21',
        name: 'Color',
        value: 'A elección (según disponibilidad)'
      },
      {
        id: '23',
        name: 'Opcional',
        value: 'Grabado 3D personalizado (nombre o frase): + S/ 40\n📌 Grabado permanente impreso junto con la pieza.'
      },
      {
        id: '25',
        name: 'Tiempo estimado de fabricación',
        value: '4–6 días hábiles'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['cooler', 'motor', 'v8', 'regalo', 'parrilla'],
    sku: 'COOLER-V8-001',
    stock: 15,
    minQuantity: 1,
    materials: ['PLA'],
    complexity: 'high',
    rating: 4.9,
    reviewCount: 20,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '9',
    name: 'Regalos Personalizados en Impresión 3D',
    description: 'Diseño y fabricación de regalos personalizados impresos en 3D con nombres, frases o detalles únicos. Ideales para ocasiones especiales y regalos originales.',
    shortDescription: 'Diseño y fabricación de regalos personalizados impresos en 3D',
    price: 0,
    customPriceDisplay: 'Personalización mediante grabado 3D integrado',
    currency: 'PEN',
    categoryId: '7',
    categoryName: 'Trofeos, Merchandising & Regalos',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '15',
        productId: '9',
        url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=600',
        alt: 'Regalos Personalizados en Impresión 3D',
        isPrimary: true,
        sortOrder: 1,
        order: 1
      }
    ],
    specifications: [
      {
        id: 'spec-9-1',
        name: 'Información importante',
        value: 'Fabricación bajo pedido\nPersonalización mediante grabado 3D integrado'
      }
    ],
    tags: ['regalos', 'personalizado', '3d', 'grabado', 'original'],
    sku: 'GIFT-CUSTOM-001',
    stock: 999,
    minQuantity: 1,
    materials: ['PLA', 'Resina'],
    complexity: 'medium',
    rating: 4.8,
    reviewCount: 12,
    downloadCount: 0,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '10',
    name: 'Impresión 3D Personalizada – Proyectos a Medida',
    description: 'Servicio de impresión 3D para proyectos personalizados según requerimiento del cliente. Ideal para piezas funcionales, decorativas, técnicas o prototipos.',
    shortDescription: 'Desarrollo e impresión de piezas personalizadas según requerimiento del cliente',
    price: 0,
    customPriceDisplay: 'Precio sujeto a cotización según proyecto',
    currency: 'PEN',
    categoryId: '10',
    categoryName: 'Servicios 3D',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '16',
        productId: '10',
        url: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?auto=format&fit=crop&q=80&w=600',
        alt: 'Impresión 3D Personalizada',
        isPrimary: true,
        sortOrder: 1,
        order: 1
      }
    ],
    specifications: [
      {
        id: 'spec-10-1',
        name: 'Incluye',
        value: 'Revisión básica del proyecto\nFabricación bajo pedido\nImpresión en tecnología FDM'
      },
      {
        id: 'spec-10-2',
        name: 'Información importante',
        value: 'El precio se determina según tamaño, material y complejidad\nEl proyecto se cotiza antes de iniciar la fabricación\nNo se inicia producción sin aprobación del cliente'
      }
    ],
    tags: ['impresión 3d', 'personalizado', 'proyectos', 'servicios'],
    sku: 'SERV-PRINT-001',
    stock: 999,
    minQuantity: 1,
    materials: ['PLA', 'PETG', 'Resina'],
    complexity: 'high',
    rating: 4.8,
    reviewCount: 45,
    downloadCount: 0,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: '11',
    name: 'Figuras, Máscaras, Cascos y Dioramas 3D – Personalizados',
    description: 'Diseño e impresión 3D de figuras, máscaras, cascos y dioramas personalizados para colección, exhibición o proyectos especiales.',
    shortDescription: 'Diseño e impresión 3D de piezas personalizadas para colección',
    price: 250.00,
    customPriceDisplay: 'Desde S/ 250.00 – IGV incluido\n(El precio varía según tamaño y complejidad)',
    currency: 'PEN',
    categoryId: '11',
    categoryName: 'Arte 3D & Coleccionables',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '17',
        productId: '11',
        url: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=600',
        alt: 'Figuras y Coleccionables 3D',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ],
    specifications: [
      {
        id: 'spec-11-1',
        name: 'Información importante',
        value: 'Precio desde S/ 250\nEl valor final depende del tamaño, nivel de detalle y complejidad\nProducto fabricado bajo pedido\nNo incluye pintura (salvo coordinación previa)'
      }
    ],
    format: 'Físico',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['arte', 'coleccionables', 'cascos', 'figuras', 'dioramas'],
    sku: 'ART-COLL-001',
    stock: 50,
    minQuantity: 1,
    materials: ['PLA', 'Resina'],
    complexity: 'high',
    rating: 4.8,
    reviewCount: 32,
    downloadCount: 0,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: '12',
    name: 'Modelado 3D – Diseño Digital Personalizado',
    description: 'Servicio de modelado 3D a medida para impresión 3D, visualización o desarrollo de productos personalizados.',
    shortDescription: 'Servicio de modelado 3D a medida',
    price: 0,
    customPriceDisplay: 'Precio sujeto a cotización según proyecto',
    currency: 'PEN',
    categoryId: '12',
    categoryName: 'Diseño 3D',
    sellerId: '1',
    sellerName: 'Ddreams 3D',
    images: [
      {
        id: '18',
        productId: '12',
        url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600',
        alt: 'Modelado 3D Digital',
        isPrimary: true,
        width: 800,
        height: 600,
        createdAt: new Date('2024-03-02'),
        updatedAt: new Date('2024-03-02')
      }
    ],
    specifications: [
      {
        id: 'spec-12-1',
        name: 'Incluye',
        value: 'Modelado digital según requerimiento\nEntrega de archivo digital final'
      },
      {
        id: 'spec-12-2',
        name: 'Información importante',
        value: 'Servicio digital (no incluye impresión)\nPrecio sujeto a cotización según alcance del proyecto\nEl tiempo de entrega depende de la complejidad del modelo'
      }
    ],
    format: 'Digital',
    fileSize: 'N/A',
    license: 'Standard',
    tags: ['diseño', 'modelado 3d', 'digital', 'personalizado'],
    sku: 'SERV-DESIGN-001',
    stock: 999,
    minQuantity: 1,
    materials: ['Digital'],
    complexity: 'high',
    rating: 4.7,
    reviewCount: 28,
    downloadCount: 0,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-03-02'),
    updatedAt: new Date('2024-03-02')
  }
];

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return mockProducts.filter(product => product.categoryId === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.isFeatured);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getProductsByPriceRange = (minPrice: number, maxPrice: number): Product[] => {
  return mockProducts.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  );
};

export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(category => category.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getReviewsByProductId = (productId: string): Review[] => {
  return mockReviews.filter(review => review.productId === productId);
};