import React from 'react';
import { PublicLayoutContent } from './PublicLayoutContent';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayoutContent>
      {children}
    </PublicLayoutContent>
  );
}
