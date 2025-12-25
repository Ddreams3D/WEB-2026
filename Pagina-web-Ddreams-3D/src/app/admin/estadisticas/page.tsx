'use client';

import React, { useState } from 'react';
import { BarChart3 as ChartBarIcon, Users as UsersIcon, FileText as DocumentTextIcon, Eye as EyeIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, Calendar as CalendarIcon } from '@/lib/icons';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import AdminProtection from '@/components/admin/AdminProtection';

// Datos simulados para estadísticas
const mockStats = {
  overview: {
    totalUsers: 1247,
    totalMaps: 3456,
    totalViews: 89234,
    activeUsers: 234,
    growthUsers: 12.5,
    growthMaps: 8.3,
    growthViews: -2.1,
    growthActive: 15.7
  },
  userGrowth: [
    { month: 'Ene', users: 850, newUsers: 45 },
    { month: 'Feb', users: 920, newUsers: 70 },
    { month: 'Mar', users: 1050, newUsers: 130 },
    { month: 'Abr', users: 1180, newUsers: 130 },
    { month: 'May', users: 1247, newUsers: 67 }
  ],
  mapsByCategory: [
    { category: 'Programación', count: 856, percentage: 24.8 },
    { category: 'Ciencias', count: 743, percentage: 21.5 },
    { category: 'Arte', count: 692, percentage: 20.0 },
    { category: 'Historia', count: 534, percentage: 15.4 },
    { category: 'Matemáticas', count: 431, percentage: 12.5 },
    { category: 'Idiomas', count: 200, percentage: 5.8 }
  ],
  topAuthors: [
    { name: 'María García', maps: 45, views: 12340 },
    { name: 'Carlos López', maps: 38, views: 9876 },
    { name: 'Ana Martínez', maps: 32, views: 8765 },
    { name: 'Pedro Ruiz', maps: 28, views: 7654 },
    { name: 'Laura Sánchez', maps: 25, views: 6543 }
  ],
  dailyActivity: [
    { day: 'Lun', views: 1234, maps: 23 },
    { day: 'Mar', views: 1456, maps: 31 },
    { day: 'Mié', views: 1678, maps: 28 },
    { day: 'Jue', views: 1543, maps: 35 },
    { day: 'Vie', views: 1789, maps: 42 },
    { day: 'Sáb', views: 987, maps: 18 },
    { day: 'Dom', views: 765, maps: 12 }
  ]
};

function StatCard({ title, value, change, icon: Icon, trend, subtitle }: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<any>;
  trend: 'up' | 'down';
  subtitle?: string;
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
          {subtitle && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {subtitle}
            </p>
          )}
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

function SimpleBarChart({ data, title, dataKey, color = 'primary' }: {
  data: any[];
  title: string;
  dataKey: string;
  color?: string;
}) {
  const maxValue = Math.max(...data.map(item => item[dataKey]));
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item[dataKey] / maxValue) * 100;
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-12 text-sm text-neutral-600 dark:text-neutral-400">
                {item.month || item.day || item.category || item.name}
              </div>
              <div className="flex-1">
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      color === 'primary' ? 'bg-primary-500' :
                      color === 'green' ? 'bg-green-500' :
                      color === 'blue' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-sm font-medium text-neutral-900 dark:text-white text-right">
                {item[dataKey].toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryChart({ data }: { data: typeof mockStats.mapsByCategory }) {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500'
  ];
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
        Mapas por Categoría
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`} />
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {item.category}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {item.count.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Statistics() {
  const [timeRange, setTimeRange] = useState('30d');
  
  return (
    <AdminProtection>
      <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Estadísticas
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Análisis detallado del rendimiento de la plataforma
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-neutral-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Usuarios"
            value={mockStats.overview.totalUsers}
            change={mockStats.overview.growthUsers}
            icon={UsersIcon}
            trend="up"
            subtitle="Usuarios registrados"
          />
          <StatCard
            title="Mapas Creados"
            value={mockStats.overview.totalMaps}
            change={mockStats.overview.growthMaps}
            icon={DocumentTextIcon}
            trend="up"
            subtitle="Mapas conceptuales"
          />
          <StatCard
            title="Visualizaciones"
            value={mockStats.overview.totalViews}
            change={mockStats.overview.growthViews}
            icon={EyeIcon}
            trend="down"
            subtitle="Vistas totales"
          />
          <StatCard
            title="Usuarios Activos"
            value={mockStats.overview.activeUsers}
            change={mockStats.overview.growthActive}
            icon={ChartBarIcon}
            trend="up"
            subtitle="Últimos 30 días"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <SimpleBarChart
            data={mockStats.userGrowth}
            title="Crecimiento de Usuarios"
            dataKey="users"
            color="primary"
          />
          
          {/* Category Distribution */}
          <CategoryChart data={mockStats.mapsByCategory} />
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Activity */}
          <SimpleBarChart
            data={mockStats.dailyActivity}
            title="Actividad Diaria (Esta Semana)"
            dataKey="views"
            color="green"
          />
          
          {/* Top Authors */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Autores Más Activos
            </h3>
            <div className="space-y-4">
              {mockStats.topAuthors.map((author, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 dark:text-primary-300 font-medium text-sm">
                        {author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {author.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {author.maps} mapas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {author.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      visualizaciones
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Métricas Detalladas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                4.8
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Calificación Promedio
              </p>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-lg ${
                    star <= 4.8 ? 'text-yellow-400' : 'text-neutral-300'
                  }`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                2.3 min
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Tiempo Promedio de Sesión
              </p>
              <div className="mt-2">
                <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                68%
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Tasa de Retención
              </p>
              <div className="mt-2">
                <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </AdminLayout>
    </AdminProtection>
  );
}