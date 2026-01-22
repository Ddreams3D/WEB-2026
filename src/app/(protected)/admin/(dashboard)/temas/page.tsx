import React from 'react';
import { Metadata } from 'next';
import ThemeManager from '@/features/admin/components/themes/ThemeManager';

export const metadata: Metadata = {
  title: 'Gestión de Apariencia Global | Admin',
  description: 'Administra los temas visuales y colores de la web.',
};

export default function TemasPage() {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <ThemeManager />
    </div>
  );
}
