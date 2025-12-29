import { User } from '@/shared/types';

export const users: User[] = [
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
