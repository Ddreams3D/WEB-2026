import React from 'react';
import PageHeader from '@/shared/components/PageHeader';
import { heroImages } from '@/config/images';

export default function ProcessHero() {
  return (
    <PageHeader
      title="Nuestro Proceso de Trabajo"
      description="Desde la idea inicial hasta el producto final, seguimos un proceso riguroso para garantizar la mejor calidad en cada impresión 3D."
      image={heroImages.innovation}
    />
  );
}
