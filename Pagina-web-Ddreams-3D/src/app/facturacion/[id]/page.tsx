import BillingDetailClient from './BillingDetailClient';

export async function generateStaticParams() {
  // Para static export, necesitamos retornar al menos un parámetro
  return [
    { id: 'placeholder' }
  ];
}

export default function InvoiceDetailPage() {
  return <BillingDetailClient />;
}