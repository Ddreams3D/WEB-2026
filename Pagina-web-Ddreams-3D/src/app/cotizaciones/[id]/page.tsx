import QuoteDetailClient from './QuoteDetailClient';

// Función requerida para build estático
export async function generateStaticParams() {
  // Para static export, necesitamos retornar al menos un parámetro
  // Las rutas dinámicas se manejarán del lado del cliente
  return [
    { id: 'placeholder' }
  ];
}

export default function QuoteDetailPage() {
  return <QuoteDetailClient />;
}