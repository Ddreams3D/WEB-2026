import { Metadata } from 'next';
import QuotesPageClient from '@/features/quotes/QuotesPageClient';

export const metadata: Metadata = {
  title: 'Cotizaciones y Presupuestos 3D | Ddreams 3D',
  description: 'Solicita cotizaciones para tus proyectos de impresión 3D. Calculadora de costos en línea para prototipos, series cortas y piezas personalizadas.',
  keywords: 'cotización impresión 3d, presupuesto 3d online, calcular precio impresión 3d, costo servicio impresión 3d, cotizar modelo 3d',
  openGraph: {
    title: 'Cotizaciones y Presupuestos 3D | Ddreams 3D',
    description: 'Obtén un presupuesto rápido para tu proyecto de impresión 3D. Sube tu modelo y recibe una estimación.',
    type: 'website',
  },
};

export default function CotizacionesPage() {
  return <QuotesPageClient />;
}
