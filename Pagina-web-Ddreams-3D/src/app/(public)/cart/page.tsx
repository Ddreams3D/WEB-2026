import { Metadata } from 'next';
import CartPageClient from '@/features/cart/CartPageClient';

export const metadata: Metadata = {
  title: 'Mi Carrito | Ddreams 3D',
  description: 'Revisa tus productos seleccionados y finaliza tu pedido de impresión 3D con Ddreams 3D.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartPageClient />;
}
