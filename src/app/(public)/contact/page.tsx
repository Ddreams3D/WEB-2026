import { Metadata } from 'next';
import ContactPageClient from '@/features/contact/ContactPageClient';

export const metadata: Metadata = {
  title: 'Contacto | Ddreams 3D Arequipa',
  description: 'Ponte en contacto con nosotros para cotizar tu regalo personalizado, trofeo o proyecto de impresión 3D en Arequipa.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}