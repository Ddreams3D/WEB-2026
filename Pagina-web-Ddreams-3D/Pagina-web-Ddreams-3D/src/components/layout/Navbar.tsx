'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useB2B } from '@/contexts/B2BContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  MessageSquare,
  Building2,
  FileText,
  Package,
  Receipt,
  FileCheck,
} from '@/lib/icons';

import Image from 'next/image';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isB2BMenuOpen, setIsB2BMenuOpen] = useState(false);

  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { currentCompany, isB2BUser } = useB2B();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsOpen(false);
  };

  const toggleB2BMenu = () => {
    setIsB2BMenuOpen(!isB2BMenuOpen);
  };

  const handleLogout = async () => {
    try {
      logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        !target.closest('.navbar-menu') &&
        !target.closest('.navbar-toggle')
      ) {
        setIsOpen(false);
        setIsUserMenuOpen(false);
        setIsB2BMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Inicio', ariaLabel: 'Página de inicio' },
    { href: '/services', label: 'Servicios', ariaLabel: 'Nuestros servicios' },
    {
      href: '/marketplace',
      label: 'Marketplace',
      ariaLabel: 'Página de productos',
    },
    {
      href: '/process',
      label: 'Proceso',
      ariaLabel: 'Información del proceso',
    },
    { href: '/about', label: 'Nosotros', ariaLabel: 'Acerca de nosotros' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-b from-white/95 via-white/95 to-white/60 dark:from-neutral-900/95 dark:via-neutral-900/95 dark:to-neutral-900/60 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-primary-600 via-secondary-600/90 to-transparent backdrop-blur-sm'
      }`}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4 h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 transition-all duration-300 ease-out transform hover:scale-105 group"
            aria-label="Ddreams 3D - Inicio"
          >
            <Image
              src="/logo/logo_DD_2026_blanco"
              alt="logo"
              width={10}
              height={10}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 px-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${
                  pathname === link.href
                    ? isScrolled
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md'
                      : 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : isScrolled
                    ? 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400'
                    : 'text-white/90 hover:bg-white/10 hover:text-white backdrop-blur-sm'
                }`}
                aria-label={link.ariaLabel}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* B2B Menu */}
            {isB2BUser ? (
              <div className="relative">
                <button
                  onClick={toggleB2BMenu}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${
                    isScrolled
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30'
                  }`}
                  aria-label="Menú B2B"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Portal B2B</span>
                </button>

                {/* B2B Dropdown */}
                {isB2BMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 py-2 z-50 navbar-menu">
                    {currentCompany && (
                      <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Empresa
                        </p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                          {currentCompany.name}
                        </p>
                      </div>
                    )}
                    <Link
                      href="/portal-empresarial"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                      onClick={() => setIsB2BMenuOpen(false)}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/cotizaciones"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                      onClick={() => setIsB2BMenuOpen(false)}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Cotizaciones</span>
                    </Link>
                    <Link
                      href="/pedidos"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                      onClick={() => setIsB2BMenuOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      <span>Pedidos</span>
                    </Link>
                    <Link
                      href="/facturacion"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                      onClick={() => setIsB2BMenuOpen(false)}
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Facturación</span>
                    </Link>
                    <Link
                      href="/legal"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                      onClick={() => setIsB2BMenuOpen(false)}
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Legal</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${
                  isScrolled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30'
                }`}
                aria-label="Acceso Portal B2B"
              >
                <Building2 className="w-4 h-4" />
                <span>Acceso B2B</span>
              </Link>
            )}

            {/* Quote Button */}
            <Link
              href={isB2BUser ? '/cotizaciones' : '/contact'}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${
                isScrolled
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md'
                  : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30'
              }`}
              aria-label={
                isB2BUser ? 'Crear cotización' : 'Solicitar cotización'
              }
            >
              <MessageSquare className="w-4 h-4" />
              <span>
                {isB2BUser ? 'Nueva Cotización' : 'Solicitar Cotización'}
              </span>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${
                    isScrolled
                      ? 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      : 'text-white/90 hover:bg-white/10 backdrop-blur-sm'
                  }`}
                  aria-label="Menú de usuario"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isScrolled
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden xl:block text-sm sm:text-base font-medium">
                    {user.username || user.email}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 py-2 z-50 navbar-menu">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-sm sm:text-base text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configuración</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-2 text-sm sm:text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${
                  isScrolled
                    ? 'bg-neutral-600 hover:bg-neutral-700 text-white shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
                }`}
              >
                Iniciar Sesión
              </Link>
            )}

            {/* Theme Toggle */}
            <ThemeToggle isScrolled={isScrolled} />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg transition-all duration-300 navbar-toggle ${
                isScrolled
                  ? 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  : 'text-white/90 hover:bg-white/10 backdrop-blur-sm'
              }`}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/50 dark:border-neutral-700/50 navbar-menu">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
                    pathname === link.href
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md'
                      : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                  tabIndex={isOpen ? 0 : -1}
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile B2B Section */}
            {isB2BUser ? (
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <div className="mb-3">
                  {currentCompany && (
                    <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3">
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Empresa
                      </p>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">
                        {currentCompany.name}
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Link
                      href="/portal-empresarial"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Portal Empresarial</span>
                    </Link>
                    <Link
                      href="/cotizaciones"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Cotizaciones</span>
                    </Link>
                    <Link
                      href="/pedidos"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      <span>Pedidos</span>
                    </Link>
                    <Link
                      href="/facturacion"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Facturación</span>
                    </Link>
                    <Link
                      href="/legal"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Legal</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mb-4">
                <Link
                  href="/login"
                  className="flex items-center space-x-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Acceso Portal B2B</span>
                </Link>
              </div>
            )}

            {/* Mobile Quote Button */}
            <div className="pt-4">
              <Link
                href={isB2BUser ? '/cotizaciones' : '/contact'}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-center rounded-lg font-medium transition-colors mb-4"
                onClick={() => setIsOpen(false)}
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {isB2BUser ? 'Nueva Cotización' : 'Solicitar Cotización'}
                </span>
              </Link>
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-700 dark:text-primary-300" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-neutral-900 dark:text-white">
                        {user.username || user.email}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-sm sm:text-base text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Configuración</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2 text-sm sm:text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-center rounded-lg text-sm sm:text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
