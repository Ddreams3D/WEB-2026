import { Metadata } from 'next';
import ProcessClient from '../../features/process/ProcessClient';

export const metadata: Metadata = {
  title: 'Nuestro Proceso - Ddreams 3D',
  description: 'Conoce nuestro proceso de trabajo paso a paso. Desde la consulta inicial hasta la entrega final.',
};

export default function ProcessPage() {
  return <ProcessClient />;
}
