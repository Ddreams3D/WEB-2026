'use client';

import React from 'react';
import PageHeader from '@/shared/components/PageHeader';
import { heroImages } from '@/config/images';

export default function ContactHero() {
  return (
    <PageHeader
      title="Contáctanos"
      description="Estamos listos para hacer realidad tu proyecto. Escríbenos, llámanos o visítanos."
      image={heroImages.services}
    />
  );
}
