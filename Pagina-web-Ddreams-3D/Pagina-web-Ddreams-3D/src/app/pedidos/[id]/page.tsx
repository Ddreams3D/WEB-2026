import OrderDetailClient from './OrderDetailClient';

export async function generateStaticParams() {
  // Para static export, necesitamos retornar al menos un parámetro
  return [
    { id: 'placeholder' }
  ];
}

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}