'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuoteStatus } from '../types';

interface QuoteFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: QuoteStatus | 'all';
  setStatusFilter: (value: QuoteStatus | 'all') => void;
  setActiveTab: (value: string) => void;
}

export function QuoteFilters({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: QuoteFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Buscar por título o ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="md:w-1/3"
      />
      <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="draft">Borrador</SelectItem>
          <SelectItem value="pending">Pendiente</SelectItem>
          <SelectItem value="approved">Aprobada</SelectItem>
          <SelectItem value="rejected">Rechazada</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
