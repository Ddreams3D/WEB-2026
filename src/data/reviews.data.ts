import { Review } from '@/shared/types';

export const reviews: Review[] = [
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
