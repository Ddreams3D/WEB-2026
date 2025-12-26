import { Metadata } from 'next';
import ProcessClient from '../../features/process/ProcessClient';

export const metadata: Metadata = {
  title: 'Proceso | Cómo trabajamos en Ddreams 3D',
  description: 'Conoce nuestro proceso de trabajo paso a paso: desde tu idea o diseño hasta la entrega final de tu impresión 3D o regalo personalizado.',
};

export default function ProcessPage() {
  return <ProcessClient />;
}
