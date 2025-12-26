'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import CartDrawer from '../ui/CartDrawer';
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  MessageSquare,
  ShoppingCart,
  UserCircle,
  Heart,
  MapPin,
  Package,
  ChevronDown,
  Shield,
} from '@/lib/icons';
import { useCart } from '../../../contexts/CartContext';
import { useAdminPermissions } from '../../../components/admin/AdminProtection';
import {
  getTransitionClasses,
  getIconClasses,
  getGradientClasses,
  responsiveStyles,
} from '../../styles';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { darkMode } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { isAdmin } = useAdminPermissions();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    // const handleScroll = () => {
    //   setIsScrolled(window.scrollY > 20);
    // };

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
        !target.closest('.navbar-svg-menu') &&
        !target.closest('.navbar-toggle') &&
        !target.closest('.user-menu-button')
      ) {
        console.log('prueba');
        setIsOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    // window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      // window.removeEventListener('scroll', handleScroll);
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
      className={`fixed top-0 left-0 right-0 z-50 ${getTransitionClasses()} ${
        isScrolled
          ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg border-b border-neutral-200/50 dark:border-neutral-700/50'
          : `${getGradientClasses('primary')}`
      }`}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className={responsiveStyles.container['6xl']}>
        <div className="flex justify-between items-center gap-2 h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className={` ${getTransitionClasses('transform')} hover:scale-105`}
            aria-label="Ddreams 3D - Inicio"
          >
            <Image
              src={
                darkMode
                  ? '/logo/logo_DD_2026_negro.svg'
                  : '/logo/logo_DD_2026_blanco.svg'
              }
              alt="logo"
              width={250}
              height={40}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${getTransitionClasses(
                  'transform'
                )} hover:scale-105 hover:shadow-lg ${
                  pathname === link.href
                    ? isScrolled
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md'
                      : 'bg-white/30 text-white shadow-lg'
                    : isScrolled
                    ? 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400'
                    : 'text-white/90 hover:bg-white/20 hover:text-white'
                }`}
                aria-label={link.ariaLabel}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Quote Button */}
            <Link
              href="/contact"
              className={`flex w-[200px]  items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${getTransitionClasses(
                'transform'
              )} hover:scale-105 hover:shadow-lg ${
                isScrolled
                  ? 'bg-primary-500 hover:bg-primary-700 text-white shadow-md'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50'
              }`}
              aria-label="Solicitar cotización"
            >
              <MessageSquare className={getIconClasses('md') + ' text-white'} />
              <span className="text-wrap">Solicitar Cotización</span>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleUserMenu();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleUserMenu();
                    }
                  }}
                  className={`user-menu-button flex items-center space-x-2 px-3 py-2 rounded-lg ${getTransitionClasses(
                    'default'
                  )} hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    isScrolled
                      ? 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:ring-offset-white dark:focus:ring-offset-neutral-900'
                      : 'text-white hover:bg-white/20 focus:ring-offset-transparent'
                  }`}
                  aria-label="Menú de usuario"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  id="user-menu-button"
                >
                  {/* Avatar with online indicator */}
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${getTransitionClasses(
                        'default'
                      )} ${
                        isScrolled
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      <User className={getIconClasses('sm')} />
                    </div>
                    {/* Online status indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-neutral-800 rounded-full animate-pulse"></div>
                  </div>

                  <div className="hidden xl:flex xl:flex-col xl:items-start">
                    <span className="text-sm font-medium leading-tight">
                      {user.username || 'Usuario'}
                    </span>
                    <span
                      className={`text-xs leading-tight ${
                        isScrolled
                          ? 'text-neutral-500 dark:text-neutral-400'
                          : 'text-white/70'
                      }`}
                    >
                      En línea
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 ${getTransitionClasses('transform')} ${
                      isUserMenuOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {/* Enhanced User Dropdown */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 py-2 z-50 navbar-menu transition-all duration-200 ease-in-out transform opacity-100 scale-100"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    style={{ display: 'block' }}
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-700 dark:text-primary-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {user.username || 'Usuario'}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {user.email || 'usuario@ejemplo.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className={`flex items-center space-x-3 px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 dark:focus:bg-neutral-700 focus:outline-none ${getTransitionClasses(
                          'colors'
                        )}`}
                        onClick={() => setIsUserMenuOpen(false)}
                        role="menuitem"
                        tabIndex={0}
                      >
                        <UserCircle className={getIconClasses('sm')} />
                        <div>
                          <span className="font-medium">Perfil de usuario</span>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Gestiona tu información personal
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/wishlist"
                        className={`flex items-center space-x-3 px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 dark:focus:bg-neutral-700 focus:outline-none ${getTransitionClasses(
                          'colors'
                        )}`}
                        onClick={() => setIsUserMenuOpen(false)}
                        role="menuitem"
                        tabIndex={0}
                      >
                        <Heart className={getIconClasses('sm')} />
                        <div>
                          <span className="font-medium">Lista de deseos</span>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Productos que te interesan
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/addresses"
                        className={`flex items-center space-x-3 px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 dark:focus:bg-neutral-700 focus:outline-none ${getTransitionClasses(
                          'colors'
                        )}`}
                        onClick={() => setIsUserMenuOpen(false)}
                        role="menuitem"
                        tabIndex={0}
                      >
                        <MapPin className={getIconClasses('sm')} />
                        <div>
                          <span className="font-medium">
                            Direcciones guardadas
                          </span>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Gestiona tus direcciones de envío
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/orders"
                        className={`flex items-center space-x-3 px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 dark:focus:bg-neutral-700 focus:outline-none ${getTransitionClasses(
                          'colors'
                        )}`}
                        onClick={() => setIsUserMenuOpen(false)}
                        role="menuitem"
                        tabIndex={0}
                      >
                        <Package className={getIconClasses('sm')} />
                        <div>
                          <span className="font-medium">Mis pedidos</span>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Historial de compras
                          </p>
                        </div>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className={`flex items-center space-x-3 px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 dark:focus:bg-neutral-700 focus:outline-none ${getTransitionClasses(
                            'colors'
                          )}`}
                          onClick={() => setIsUserMenuOpen(false)}
                          role="menuitem"
                          tabIndex={0}
                        >
                          <Shield className={getIconClasses('sm')} />
                          <div>
                            <span className="font-medium">Administración</span>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Panel de administrador
                            </p>
                          </div>
                        </Link>
                      )}

                      <Link
                        href="/settings"
                        className={`flex items-center space-x-3 px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 dark:focus:bg-neutral-700 focus:outline-none ${getTransitionClasses(
                          'colors'
                        )}`}
                        onClick={() => setIsUserMenuOpen(false)}
                        role="menuitem"
                        tabIndex={0}
                      >
                        <Settings className={getIconClasses('sm')} />
                        <div>
                          <span className="font-medium">Configuración</span>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Preferencias de la cuenta
                          </p>
                        </div>
                      </Link>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-1">
                      <button
                        onClick={handleLogout}
                        className={`flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 focus:outline-none ${getTransitionClasses(
                          'colors'
                        )} w-full text-left`}
                        role="menuitem"
                        tabIndex={0}
                      >
                        <LogOut className={getIconClasses('sm')} />
                        <div>
                          <span className="font-medium">Cerrar sesión</span>
                          <p className="text-xs text-red-500 dark:text-red-400">
                            Salir de tu cuenta
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`hidden px-4 py-2 w-[130px] rounded-lg text-sm font-medium ${getTransitionClasses(
                  'transform'
                )} hover:scale-105 hover:shadow-lg ${
                  isScrolled
                    ? 'bg-neutral-500 hover:bg-neutral-700 text-white shadow-md'
                    : 'bg-white/30 hover:bg-white/40 text-white'
                }`}
              >
                Iniciar Sesión
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-lg ${getTransitionClasses(
                'transform'
              )} hover:scale-105 hover:shadow-lg ${
                isScrolled
                  ? 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                  : 'text-white/90 hover:bg-white/20'
              }`}
              aria-label="Abrir carrito de compras"
            >
              <ShoppingCart
                className={getIconClasses(
                  'md',
                  isScrolled ? 'primary' : 'white'
                )}
              />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle isScrolled={isScrolled} />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className={` relative p-3 rounded-lg ${getTransitionClasses()} navbar-toggle touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center ${
                isScrolled
                  ? 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700'
                  : 'text-white/90 hover:bg-white/20 active:bg-white/30'
              }`}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {isOpen ? (
                <X className={getIconClasses('lg')} />
              ) : (
                <Menu className={`navbar-svg-menu ${getIconClasses('lg')}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/98 dark:bg-neutral-900/98 border-t border-neutral-200/50 dark:border-neutral-700/50 navbar-menu z-50">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${getTransitionClasses()} touch-manipulation min-h-[48px] flex items-center ${
                    pathname === link.href
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md'
                      : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400 active:bg-neutral-200 dark:active:bg-neutral-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                  tabIndex={isOpen ? 0 : -1}
                  aria-label={link.ariaLabel}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Quote Button */}
            <div className="pt-4 space-y-3">
              <Link
                href="/contact"
                className={`flex items-center justify-center space-x-2 px-4 py-4 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-center rounded-lg font-medium ${getTransitionClasses(
                  'colors'
                )} touch-manipulation min-h-[48px]`}
                onClick={() => setIsOpen(false)}
                tabIndex={isOpen ? 0 : -1}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <MessageSquare
                  className={getIconClasses('md') + ' text-white'}
                />
                <span>Solicitar Cotizdación</span>
              </Link>

              {/* Mobile Cart Button */}
              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 active:bg-primary-200 dark:active:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg font-medium ${getTransitionClasses(
                  'colors'
                )} relative touch-manipulation min-h-[48px]`}
                tabIndex={isOpen ? 0 : -1}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ShoppingCart className={getIconClasses('sm', 'primary')} />
                <span>Carrito ({itemCount})</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold animate-pulse">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <User className={getIconClasses('md', 'primary')} />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {user.username || user.email}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={`flex items-center space-x-3 px-4 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg ${getTransitionClasses(
                        'colors'
                      )}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Shield className={getIconClasses('sm')} />
                      <span>Administración</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className={`flex items-center space-x-3 px-4 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg ${getTransitionClasses(
                      'colors'
                    )}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className={getIconClasses('sm')} />
                    <span>Configuración</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg ${getTransitionClasses(
                      'colors'
                    )} w-full text-left`}
                  >
                    <LogOut className={getIconClasses('sm')} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={` hidden block px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-center rounded-lg font-medium ${getTransitionClasses(
                    'colors'
                  )}`}
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
