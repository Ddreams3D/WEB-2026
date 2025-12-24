'use client';

import React from 'react';
import { Users as UsersIcon, FileText as DocumentTextIcon, Eye as EyeIcon, BarChart3 as ChartBarIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@/lib/icons';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import AdminProtection from '@/components/admin/AdminProtection';

// Datos simulados para el dashboard
const mockStats = {
  totalUsers: 1247,
  totalMaps: 3456,
  totalViews: 89234,
  activeUsers: 234,
  growthUsers: 12.5,
  growthMaps: 8.3,
  growthViews: -2.1,
  growthActive: 15.7
};

const recentActivity = [
  {
    id: 1,
    user: 'María García',
    action: 'Creó un nuevo mapa conceptual',
    target: 'Biología Celular',
    time: 'Hace 5 minutos',
    type: 'create'
  },
  {
    id: 2,
    user: 'Carlos López',
    action: 'Editó el mapa',
    target: 'Historia de España',
    time: 'Hace 12 minutos',
    type: 'edit'
  },
  {
    id: 3,
    user: 'Ana Martínez',
    action: 'Compartió el mapa',
    target: 'Matemáticas Avanzadas',
    time: 'Hace 25 minutos',
    type: 'share'
  },
  {
    id: 4,
    user: 'Pedro Ruiz',
    action: 'Se registró en la plataforma',
    target: '',
    time: 'Hace 1 hora',
    type: 'register'
  },
  {
    id: 5,
    user: 'Laura Sánchez',
    action: 'Eliminó el mapa',
    target: 'Química Orgánica',
    time: 'Hace 2 horas',
    type: 'delete'
  }
];

const topMaps = [
  { name: 'Introducción a React', views: 1234, author: 'Juan Pérez' },
  { name: 'Biología Molecular', views: 987, author: 'María García' },
  { name: 'Historia del Arte', views: 856, author: 'Carlos López' },
  { name: 'Física Cuántica', views: 743, author: 'Ana Martínez' },
  { name: 'Programación Web', views: 692, author: 'Pedro Ruiz' }
];

function StatCard({ title, value, change, icon: Icon, trend }: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<any>;
  trend: 'up' | 'down';
}) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      <div className="flex items-center mt-4">
        {trend === 'up' ? (
          <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-1">
          vs mes anterior
        </span>
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: typeof recentActivity[0] }) {
  const getActionColor = (type: string) => {
    switch (type) {
      case 'create': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'edit': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'share': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'register': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30';
      case 'delete': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-neutral-600 bg-neutral-100 dark:bg-neutral-700';
    }
  };

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className={`w-2 h-2 rounded-full mt-2 ${getActionColor(activity.type)}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-900 dark:text-white">
          <span className="font-medium">{activity.user}</span>
          {' '}{activity.action}
          {activity.target && (
            <span className="font-medium text-primary-600 dark:text-primary-400">
              {' "'}{activity.target}{'"'}
            </span>
          )}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {activity.time}
        </p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminProtection>
      <AdminLayout>
        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Resumen general de la plataforma de mapas conceptuales
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Usuarios"
            value={mockStats.totalUsers}
            change={mockStats.growthUsers}
            icon={UsersIcon}
            trend="up"
          />
          <StatCard
            title="Mapas Creados"
            value={mockStats.totalMaps}
            change={mockStats.growthMaps}
            icon={DocumentTextIcon}
            trend="up"
          />
          <StatCard
            title="Visualizaciones"
            value={mockStats.totalViews}
            change={mockStats.growthViews}
            icon={EyeIcon}
            trend="down"
          />
          <StatCard
            title="Usuarios Activos"
            value={mockStats.activeUsers}
            change={mockStats.growthActive}
            icon={ChartBarIcon}
            trend="up"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Actividad Reciente
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Últimas acciones de los usuarios
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-1">
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>

          {/* Top Maps */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Mapas Más Populares
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Los mapas con más visualizaciones
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topMaps.map((map, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {map.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        por {map.author}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                        {map.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminProtection>
  );
}