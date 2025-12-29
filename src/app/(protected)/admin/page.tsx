'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users as UsersIcon, 
  ShoppingBag as ShoppingBagIcon,
  Settings as CogIcon,
  Package as PackageIcon
} from '@/lib/icons';

// Datos simulados para el dashboard
const mockStats = {
  totalUsers: 1247,
  totalOrders: 45,
  pendingOrders: 12,
  totalProducts: 156
};

const quickAccess = [
  { name: 'Usuarios', href: '/admin/usuarios', icon: UsersIcon, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { name: 'Productos', href: '/admin/productos', icon: ShoppingBagIcon, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { name: 'Servicios', href: '/admin/servicios', icon: PackageIcon, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { name: 'Pedidos', href: '/admin/pedidos', icon: PackageIcon, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
  { name: 'Configuración', href: '/admin/configuracion', icon: CogIcon, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/30' },
];

function StatCard({ title, value, icon: Icon, color, bg }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Panel de Control
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Bienvenido al panel de administración de Ddreams 3D
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Usuarios Totales"
          value={mockStats.totalUsers}
          icon={UsersIcon}
          color="text-blue-600 dark:text-blue-400"
          bg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          title="Productos Activos"
          value={mockStats.totalProducts}
          icon={ShoppingBagIcon}
          color="text-indigo-600 dark:text-indigo-400"
          bg="bg-indigo-100 dark:bg-indigo-900/30"
        />
        <StatCard
          title="Pedidos Pendientes"
          value={mockStats.pendingOrders}
          icon={PackageIcon}
          color="text-yellow-600 dark:text-yellow-400"
          bg="bg-yellow-100 dark:bg-yellow-900/30"
        />
        <StatCard
          title="Total Pedidos"
          value={mockStats.totalOrders}
          icon={PackageIcon}
          color="text-green-600 dark:text-green-400"
          bg="bg-green-100 dark:bg-green-900/30"
        />
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Accesos Directos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccess.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow group"
            >
              <div className={`p-3 rounded-lg mr-4 ${item.bg}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className="font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
