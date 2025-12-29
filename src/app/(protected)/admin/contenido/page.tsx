'use client';

import React, { useState, useEffect } from 'react';
import { Search as MagnifyingGlassIcon, Eye as EyeIcon, Trash2 as TrashIcon, FileText as DocumentTextIcon, Calendar as CalendarIcon, User as UserIcon, Share as ShareIcon } from '@/lib/icons';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import AdminProtection from '@/components/admin/AdminProtection';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


interface ConceptMap {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  visibility: 'public' | 'private' | 'shared';
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  shares: number;
  tags: string[];
}

// Datos simulados iniciales
const initialMaps: ConceptMap[] = [
  {
    id: '1',
    title: 'Introducción a React',
    description: 'Conceptos básicos de React y componentes funcionales',
    author: 'Juan Pérez',
    authorId: '2',
    category: 'Programación',
    status: 'published',
    visibility: 'public',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-18',
    views: 1234,
    likes: 89,
    shares: 23,
    tags: ['react', 'javascript', 'frontend']
  },
  {
    id: '2',
    title: 'Biología Molecular',
    description: 'Estructura y función de las moléculas biológicas',
    author: 'María García',
    authorId: '3',
    category: 'Ciencias',
    status: 'published',
    visibility: 'public',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19',
    views: 987,
    likes: 156,
    shares: 45,
    tags: ['biología', 'moléculas', 'adn']
  },
  {
    id: '3',
    title: 'Historia del Arte',
    description: 'Evolución del arte a través de los siglos',
    author: 'Carlos López',
    authorId: '4',
    category: 'Arte',
    status: 'draft',
    visibility: 'private',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-16',
    views: 856,
    likes: 67,
    shares: 12,
    tags: ['arte', 'historia', 'cultura']
  },
  {
    id: '4',
    title: 'Física Cuántica',
    description: 'Principios fundamentales de la mecánica cuántica',
    author: 'Ana Martínez',
    authorId: '5',
    category: 'Ciencias',
    status: 'published',
    visibility: 'shared',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-17',
    views: 743,
    likes: 234,
    shares: 78,
    tags: ['física', 'cuántica', 'ciencia']
  },
  {
    id: '5',
    title: 'Programación Web',
    description: 'Desarrollo de aplicaciones web modernas',
    author: 'Pedro Ruiz',
    authorId: '6',
    category: 'Programación',
    status: 'archived',
    visibility: 'public',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-14',
    views: 692,
    likes: 45,
    shares: 8,
    tags: ['web', 'html', 'css', 'javascript']
  }
];

const categories = ['Todos', 'Programación', 'Ciencias', 'Arte', 'Historia', 'Matemáticas', 'Idiomas'];

function MapDetailsModal({ map, isOpen, onClose }: {
  map: ConceptMap | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !map) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-background/80" onClick={onClose} />
        
        <div className={cn(
          "inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl bg-card"
        )}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">
              Detalles del Mapa
            </h3>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted h-auto w-auto"
            >
              ×
            </Button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-foreground mb-2">
                {map.title}
              </h4>
              <p className="text-muted-foreground">
                {map.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Autor
                </label>
                <p className="text-sm text-foreground">{map.author}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Categoría
                </label>
                <p className="text-sm text-foreground">{map.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Estado
                </label>
                <span className={cn("inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                  map.status === 'published'
                    ? 'bg-success/20 text-success'
                    : map.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {map.status === 'published' ? 'Publicado' : map.status === 'draft' ? 'Borrador' : 'Archivado'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Visibilidad
                </label>
                <span className={cn("inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                  map.visibility === 'public'
                    ? 'bg-primary/20 text-primary'
                    : map.visibility === 'shared'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {map.visibility === 'public' ? 'Público' : map.visibility === 'shared' ? 'Compartido' : 'Privado'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className={cn("text-center p-4 rounded-lg bg-muted")}>
                <EyeIcon className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {map.views.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Visualizaciones</p>
              </div>
              <div className={cn("text-center p-4 rounded-lg bg-muted")}>
                <span className="text-red-500 text-xl">♥</span>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {map.likes.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Me gusta</p>
              </div>
              <div className={cn("text-center p-4 rounded-lg bg-muted")}>
                <ShareIcon className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {map.shares.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Compartidos</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2">
                {map.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={cn(
                      "px-2 py-1 text-xs rounded-full text-primary-700 dark:text-primary-300 bg-primary/10"
                    )}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-neutral-500 dark:text-neutral-400">
              <div>
                <span className="font-medium">Creado:</span> {new Date(map.createdAt).toLocaleDateString('es-ES')}
              </div>
              <div>
                <span className="font-medium">Actualizado:</span> {new Date(map.updatedAt).toLocaleDateString('es-ES')}
              </div>
            </div>
          </div>
        </div>
      </div>
          </div>
  );
}

export default function ContentManagement() {
  const [maps, setMaps] = useState<ConceptMap[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMap, setSelectedMap] = useState<ConceptMap | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private' | 'shared'>('all');

  // Cargar mapas del localStorage al montar el componente
  useEffect(() => {
    const savedMaps = localStorage.getItem('admin_maps');
    if (savedMaps) {
      setMaps(JSON.parse(savedMaps));
    } else {
      setMaps(initialMaps);
      localStorage.setItem('admin_maps', JSON.stringify(initialMaps));
    }
  }, []);

  // Guardar mapas en localStorage cuando cambien
  useEffect(() => {
    if (maps.length > 0) {
      localStorage.setItem('admin_maps', JSON.stringify(maps));
    }
  }, [maps]);

  const filteredMaps = maps.filter(map => {
    const matchesSearch = map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         map.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         map.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todos' || map.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || map.status === filterStatus;
    const matchesVisibility = filterVisibility === 'all' || map.visibility === filterVisibility;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesVisibility;
  });

  const handleDeleteMap = (mapId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este mapa conceptual?')) {
      setMaps(maps.filter(map => map.id !== mapId));
    }
  };

  const handleStatusChange = (mapId: string, newStatus: ConceptMap['status']) => {
    setMaps(maps.map(map => 
      map.id === mapId 
        ? { ...map, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : map
    ));
  };

  const openModal = (map: ConceptMap) => {
    setSelectedMap(map);
    setIsModalOpen(true);
  };

  return (
    <AdminProtection>
      <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Gestión de Contenido
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Administra los mapas conceptuales de la plataforma
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={cn("rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4 bg-card")}>
            <div className="flex items-center">
              <DocumentTextIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">{maps.length}</p>
              </div>
            </div>
          </div>
          <div className={cn("rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4 bg-card")}>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3" />
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Publicados</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">
                  {maps.filter(m => m.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          <div className={cn("rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4 bg-card")}>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3" />
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Borradores</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">
                  {maps.filter(m => m.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
          <div className={cn("rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4 bg-card")}>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-neutral-500 rounded-full mr-3" />
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Archivados</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">
                  {maps.filter(m => m.status === 'archived').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={cn("rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 bg-card")}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar mapas conceptuales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white bg-background"
                  )}
                />
              </div>
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={cn(
                "px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white bg-background"
              )}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft' | 'archived')}
              className={cn(
                "px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white bg-background"
              )}
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
              <option value="archived">Archivados</option>
            </select>
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value as 'all' | 'public' | 'private' | 'shared')}
              className={cn(
                "px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white bg-background"
              )}
            >
              <option value="all">Todas las visibilidades</option>
              <option value="public">Públicos</option>
              <option value="private">Privados</option>
              <option value="shared">Compartidos</option>
            </select>
          </div>
        </div>

        {/* Maps Table */}
        <div className={cn("rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-card")}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Mapa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Visibilidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Estadísticas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredMaps.map((map) => (
                  <tr key={map.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                          {map.title}
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-xs">
                          {map.description}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {map.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className={cn(
                                "px-1.5 py-0.5 text-xs rounded text-neutral-600 dark:text-neutral-400 bg-muted"
                              )}
                            >
                              #{tag}
                            </span>
                          ))}
                          {map.tags.length > 2 && (
                            <span className="text-xs text-neutral-400">+{map.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 text-neutral-400 mr-2" />
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {map.author}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={map.status}
                        onChange={(e) => handleStatusChange(map.id, e.target.value as ConceptMap['status'])}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                          map.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : map.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <option value="published">Publicado</option>
                        <option value="draft">Borrador</option>
                        <option value="archived">Archivado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        map.visibility === 'public'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : map.visibility === 'shared'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300'
                      }`}>
                        {map.visibility === 'public' ? 'Público' : map.visibility === 'shared' ? 'Compartido' : 'Privado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <EyeIcon className="w-3 h-3 mr-1 text-muted-foreground" />
                            {map.views}
                          </span>
                          <span className="flex items-center">
                            <span className="text-destructive mr-1">♥</span>
                            {map.likes}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {new Date(map.updatedAt).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          onClick={() => openModal(map)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-muted"
                          title="Ver detalles"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteMap(map.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredMaps.length} de {maps.length} mapas conceptuales
        </div>
      </div>

      {/* Modal */}
      <MapDetailsModal
        map={selectedMap}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </AdminLayout>
  </AdminProtection>
  );
}
