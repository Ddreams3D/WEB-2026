'use client';

import React from 'react';
import PageHeader from '@/shared/components/PageHeader';
import { aboutImages, heroImages } from '@/config/images';

export default function AboutHero() {
  return (
    <PageHeader
      title="Nuestra Historia"
      description="Innovación, tecnología y pasión por la impresión 3D en Arequipa."
      image={heroImages.innovation} // Using a real image instead of placeholder if possible, or fallback to aboutImages.facility
    />
  );
}
