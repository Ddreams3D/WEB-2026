import { Metadata } from 'next';
import ContactPageClient from '../../features/contact/ContactPageClient';
import ServicesPageClient from '@/features/services/ServicesPageClient';

export const metadata: Metadata = {
  title: 'Servicios de Impresión 3D y Modelado | Ddreams 3D',
  description: 'Ofrecemos servicios integrales de impresión 3D, modelado CAD, prototipado rápido y consultoría técnica. Soluciones personalizadas para tus proyectos.',
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
