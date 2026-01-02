import { Category } from '@/shared/types/domain';

// Categories data
export const categories: Category[] = [
  {
    id: 'medicina',
    name: 'Medicina',
    description: 'Prótesis personalizadas y modelos anatómicos de precisión médica',
    slug: 'medicina',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fmodelo-pelvis-anatomica-escala-real-3d-vista-frontal.png?alt=media&token=d16a5cd3-4552-4995-910a-e3cadc295252',
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
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fservices%2Fmaquetas-didacticas-v2.png?alt=media&token=facc350a-3825-42cc-9e5c-1e635ebd79c3',
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
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fmodelo-pelvis-anatomica-escala-real-3d-uso-educativo.jpg?alt=media&token=533a34cd-0cc8-40ba-8e4d-d1addf825c74',
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
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fcooler-motor-v8-impresion-3d-regalo-autos-frontal.png?alt=media&token=1e24c02c-eab9-4ed8-81f4-7454cdda126c',
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
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ddreams3d.firebasestorage.app/o/images%2Fcatalogo%2Fcopa-piston-20cm-regalo-personalizado-autos-3d-frontal.png?alt=media&token=de1cdac1-67be-461a-abd2-2fccd8729a56',
    productCount: 25,
    isActive: true,
    sortOrder: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];
