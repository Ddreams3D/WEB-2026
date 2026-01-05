import React from 'react';
import { Search, Filter, Layout } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RouteFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
}

export function RouteFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter
}: RouteFiltersProps) {
  return (
    <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between bg-muted/30 rounded-t-lg">
       {/* Search */}
       <div className="relative w-full sm:w-72">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
         <Input 
           placeholder="Buscar ruta o página..." 
           className="pl-9 bg-background border-muted-foreground/20"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
       </div>

       {/* Filters */}
       <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
         <Select value={statusFilter} onValueChange={setStatusFilter}>
           <SelectTrigger className="w-[140px] bg-background">
             <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
             <SelectValue placeholder="Estado" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">Todos</SelectItem>
             <SelectItem value="active">Activas</SelectItem>
             <SelectItem value="warning">Revisar</SelectItem>
             <SelectItem value="inactive">Inactivas</SelectItem>
             <SelectItem value="redirect">Redirecciones</SelectItem>
           </SelectContent>
         </Select>

         <Select value={categoryFilter} onValueChange={setCategoryFilter}>
           <SelectTrigger className="w-[140px] bg-background">
             <Layout className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
             <SelectValue placeholder="Categoría" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">Todas</SelectItem>
             <SelectItem value="General">General</SelectItem>
             <SelectItem value="Tienda">Tienda</SelectItem>
             <SelectItem value="Servicios">Servicios</SelectItem>
             <SelectItem value="Admin">Admin</SelectItem>
             <SelectItem value="Usuario">Usuario</SelectItem>
           </SelectContent>
         </Select>
       </div>
    </div>
  );
}
