import { Category } from '@/shared/types/domain';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

// Categories data
export const categories: Category[] = [
  {
    id: 'medicina',
    name: 'Medicina',
    description: 'Prótesis personalizadas y modelos anatómicos de precisión médica',
    slug: 'medicina',
    imageUrl: `/${StoragePathBuilder.categories('medicina')}/cover.png`,
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
    imageUrl: `/${StoragePathBuilder.categories('arquitectura')}/cover.png`,
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
    imageUrl: `/${StoragePathBuilder.categories('educacion')}/cover.jpg`,
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
    imageUrl: `/${StoragePathBuilder.categories('ingenieria')}/cover.png`,
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
    imageUrl: `/${StoragePathBuilder.categories('arte-diseno')}/cover.png`,
    productCount: 25,
    isActive: true,
    sortOrder: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];
