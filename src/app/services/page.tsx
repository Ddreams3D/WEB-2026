import { Metadata } from 'next';
import ContactPageClient from '../../features/contact/ContactPageClient';
import ServicesPageClient from '@/features/services/ServicesPageClient';

export const metadata: Metadata = {
  title: 'Servicio - Ddreams 3D',
  description: 'Servicios para proyecto de impresión 3D',
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
