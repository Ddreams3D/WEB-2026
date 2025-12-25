'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, Settings, LogOut, Bell } from '@/lib/icons';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ui/ToastManager';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('success', 'Sesión cerrada', '¡Hasta pronto!');
    } catch (error) {
      console.error('Error during logout:', error);
      showToast('error', 'Error', 'Error al cerrar sesión');
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
      >
        {/* TODO: Implementar avatar cuando esté disponible */}
        <User className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
        <div className="px-4 py-2 border-b dark:border-neutral-700">
            <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
              {user.username || user.email}
            </p>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate">
              {user.email}
            </p>
          </div>

          <Link
            href="/profile"
            className="block px-4 py-2 text-sm sm:text-base text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Mi Perfil</span>
            </div>
          </Link>

          <Link
            href="/notifications"
            className="block px-4 py-2 text-sm sm:text-base text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notificaciones</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm sm:text-base text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <div className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}