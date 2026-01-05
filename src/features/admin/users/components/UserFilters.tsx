import React from 'react';
import { Search as MagnifyingGlassIcon } from '@/lib/icons';
import { UserStatus } from '@/shared/types/domain';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: UserStatus | 'all';
  onFilterChange: (value: UserStatus | 'all') => void;
}

export function UserFilters({ searchTerm, onSearchChange, filterStatus, onFilterChange }: UserFiltersProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            />
          </div>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value as UserStatus | 'all')}
          className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="banned">Baneados</option>
        </select>
      </div>
    </div>
  );
}
