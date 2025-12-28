'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Perfil</CardTitle>
        <CardDescription>Actualiza tu información personal y de contacto.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" placeholder="Tu nombre" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" />
        </div>
        <Button>Guardar Cambios</Button>
      </CardContent>
    </Card>
  );
}
