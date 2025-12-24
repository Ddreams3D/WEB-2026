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
    name: 'Casa Moderna Minimalista',
    description: 'Modelo 3D de una casa moderna con diseño minimalista, perfecta para visualizaciones arquitectónicas y presentaciones de proyectos.',
    shortDescription: 'Casa moderna con diseño minimalista',
    price: 49.99,
    originalPrice: 69.99,
    currency: 'USD',
    categoryId: '1',
    categoryName: 'Arquitectura 3D',
    sellerId: '2',
    sellerName: 'Ana García',
    images: [
      {
        id: '1',
        productId: '1',
        url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=600',
        alt: 'Casa moderna vista frontal',
        isPrimary: true,
        sortOrder: 1,
        order: 1
      },
      {
        id: '2',
        productId: '1',
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600',
        alt: 'Casa moderna vista lateral',
        isPrimary: false,
        sortOrder: 2,
        order: 2
      },
      {
        id: '3',
        productId: '1',
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
        alt: 'Casa moderna interior',
        isPrimary: false,
        sortOrder: 3,
        order: 3
      }
    ],
    specifications: [
      {
        id: '1',
        name: 'Formato',
        value: '.blend, .fbx, .obj'
      },
      {
        id: '2',
        name: 'Polígonos',
        value: '45,000'
      },
      {
        id: '3',
        name: 'Texturas',
        value: '4K PBR'
      },
      {
        id: '4',
        name: 'Dimensiones',
        value: '12m x 8m x 3m'
      }
    ],
    tags: ['casa', 'moderna', 'minimalista', 'arquitectura', 'residencial'],
    sku: 'HOUSE-MOD-001',
    stock: 999,
    minQuantity: 1,
    materials: ['PLA', 'ABS', 'PETG'],
    complexity: 'high',
    rating: 4.5,
    reviewCount: 12,
    downloadCount: 156,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Silla Ergonómica Oficina',
    description: 'Modelo 3D de silla ergonómica para oficina con materiales PBR y múltiples variaciones de color.',
    shortDescription: 'Silla ergonómica para oficina',
    price: 19.99,
    currency: 'USD',
    categoryId: '2',
    categoryName: 'Diseño Industrial',
    sellerId: '1',
    sellerName: 'Carlos Mendoza',
    images: [
      {
        id: '3',
        productId: '2',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600',
        alt: 'Silla de oficina vista frontal',
        isPrimary: true,
        sortOrder: 1,
        order: 1
      },
      {
        id: '4',
        productId: '2',
        url: 'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&q=80&w=600',
        alt: 'Silla de oficina vista lateral',
        isPrimary: false,
        sortOrder: 2,
        order: 2
      }
    ],
    specifications: [
      {
        id: '5',
        name: 'Formato',
        value: '.blend, .max, .fbx'
      },
      {
        id: '6',
        name: 'Polígonos',
        value: '8,500'
      },
      {
        id: '7',
        name: 'Texturas',
        value: '2K PBR'
      }
    ],
    tags: ['silla', 'oficina', 'ergonómica', 'mueble', 'industrial'],
    sku: 'CHAIR-OFF-001',
    stock: 999,
    minQuantity: 1,
    materials: ['PLA', 'PETG'],
    complexity: 'medium',
    rating: 4.2,
    reviewCount: 8,
    downloadCount: 89,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Escultura Abstracta',
    description: 'Escultura digital abstracta con formas orgánicas, ideal para arte conceptual y decoración virtual.',
    shortDescription: 'Escultura digital abstracta',
    price: 29.99,
    currency: 'USD',
    categoryId: '3',
    categoryName: 'Arte Digital',
    sellerId: '3',
    sellerName: 'Miguel Rodríguez',
    images: [
      {
        id: '6',
        productId: '3',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600',
        alt: 'Escultura abstracta vista principal',
        isPrimary: true,
        sortOrder: 1,
        order: 1
      },
      {
        id: '7',
        productId: '3',
        url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=600',
        alt: 'Escultura abstracta detalle',
        isPrimary: false,
        sortOrder: 2,
        order: 2
      }
    ],
    specifications: [
      {
        id: '8',
        name: 'Formato',
        value: '.blend, .obj, .stl'
      },
      {
        id: '9',
        name: 'Polígonos',
        value: '25,000'
      }
    ],
    tags: ['escultura', 'abstracta', 'arte', 'digital', 'decoración'],
    sku: 'SCULP-ABS-001',
    stock: 999,
    minQuantity: 1,
    materials: ['PLA', 'Resin'],
    complexity: 'high',
    rating: 4.8,
    reviewCount: 15,
    downloadCount: 203,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '4',
    name: 'Espada Medieval Fantasy',
    description: 'Espada medieval para videojuegos con texturas detalladas y optimizada para engines de juego.',
    shortDescription: 'Espada medieval para videojuegos',
    price: 15.99,
    currency: 'USD',
    categoryId: '4',
    categoryName: 'Videojuegos',
    sellerId: '1',
    sellerName: 'Carlos Mendoza',
    images: [
      {
        id: '8',
        productId: '4',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600',
        alt: 'Espada medieval completa',
        isPrimary: true,
        sortOrder: 1,
        order: 1
      },
      {
        id: '9',
        productId: '4',
        url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=600',
        alt: 'Detalle de la empuñadura',
        isPrimary: false,
        sortOrder: 2,
        order: 2
      }
    ],
    specifications: [
      {
        id: '10',
        name: 'Formato',
        value: '.fbx, .unity, .unreal'
      },
      {
        id: '11',
        name: 'Polígonos',
        value: '3,200 (Game Ready)'
      },
      {
        id: '12',
        name: 'Texturas',
        value: '1K Diffuse, Normal, Metallic'
      }
    ],
    tags: ['espada', 'medieval', 'fantasy', 'videojuego', 'arma'],
    sku: 'SWORD-MED-001',
    stock: 999,
    minQuantity: 1,
    materials: ['PLA', 'ABS'],
    complexity: 'medium',
    rating: 4.6,
    reviewCount: 22,
    downloadCount: 334,
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '5',
    name: 'Personaje Animado Robot',
    description: 'Personaje robot completamente rigeado y listo para animación con múltiples expresiones faciales.',
    shortDescription: 'Robot rigeado para animación',
    price: 79.99,
    currency: 'USD',
    categoryId: '5',
    categoryName: 'Animación',
    sellerId: '3',
    sellerName: 'Miguel Rodríguez',
    images: [
      {
        id: '10',
        productId: '5',
        url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
        alt: 'Robot character vista frontal',
        isPrimary: true,
        sortOrder: 1,
        order: 1
      },
      {
        id: '11',
        productId: '5',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&q=80&w=600',
        alt: 'Robot character vista trasera',
        isPrimary: false,
        sortOrder: 2,
        order: 2
      }
    ],
    specifications: [
      {
        id: '13',
        name: 'Formato',
        value: '.blend, .ma, .fbx'
      },
      {
        id: '14',
        name: 'Polígonos',
        value: '18,500'
      },
      {
        id: '15',
        name: 'Rig',
        value: 'Completo con IK/FK'
      },
      {
        id: '16',
        name: 'Animaciones',
        value: '12 poses básicas incluidas'
      }
    ],
    tags: ['robot', 'personaje', 'animación', 'rigging', 'sci-fi'],
    sku: 'ROBOT-CHAR-001',
    stock: 999,
    minQuantity: 1,
    materials: ['PLA', 'ABS'],
    complexity: 'high',
    rating: 4.9,
    reviewCount: 31,
    downloadCount: 187,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-16')
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