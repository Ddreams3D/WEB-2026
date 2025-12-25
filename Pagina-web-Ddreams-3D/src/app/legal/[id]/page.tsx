import LegalDetailClient from './LegalDetailClient';

// Función requerida para build estático
export async function generateStaticParams() {
  // Para static export, necesitamos retornar al menos un parámetro
  return [
    { id: 'placeholder' }
  ];
}

export default function LegalDetailPage() {
  return <LegalDetailClient />;
}