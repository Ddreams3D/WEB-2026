import { Metadata } from 'next';
import ContactPageClient from '../../features/contact/ContactPageClient';

export const metadata: Metadata = {
  title: 'Contacto - Ddreams 3D',
  description: 'Ponte en contacto con nosotros para cualquier consulta o proyecto de impresión 3D',
};

export default function ContactPage() {
  return <ContactPageClient />;
}