'use client';

import React from 'react';
import PageHeader from '../../shared/components/PageHeader';
import { Shield, Lock, UserCheck, Bell, Database, Phone } from '@/lib/icons';

/* ----------------------------- */
/* Section Header Component */
/* ----------------------------- */
function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600">
        {icon}
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-primary-600 m-0">
        {title}
      </h2>
    </div>
  );
}

/* ----------------------------- */
/* Bullet Item */
/* ----------------------------- */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2 h-2 w-2 rounded-full bg-primary-500 shrink-0" />
      <span className="text-neutral-700 dark:text-neutral-300">{children}</span>
    </li>
  );
}

/* ----------------------------- */
/* Page */
/* ----------------------------- */
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader
        title="Política de Privacidad"
        description="Conoce cómo protegemos y manejamos tu información"
        image="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1920"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-10">
          {/* 1. Introducción */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader
              title="1. Introducción"
              icon={<Shield className="h-6 w-6" />}
            />
            <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
              En <strong>Designs and Dreamings (Ddreams 3D) E.I.R.L.</strong>,
              nos comprometemos a proteger tu privacidad y garantizar la
              seguridad de tu información personal. Esta política describe cómo
              recopilamos, utilizamos y protegemos tus datos.
            </p>
          </section>

          {/* 2. Información Recopilada */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader
              title="2. Información que Recopilamos"
              icon={<Database className="h-6 w-6" />}
            />

            <h3 className="text-lg font-semibold mb-3">
              2.1 Información Personal
            </h3>
            <ul className="space-y-2 mb-6">
              <Bullet>Nombre completo</Bullet>
              <Bullet>Dirección de correo electrónico</Bullet>
              <Bullet>Número de teléfono</Bullet>
              <Bullet>Dirección de envío (si aplica)</Bullet>
            </ul>

            <h3 className="text-lg font-semibold mb-3">
              2.2 Información Técnica
            </h3>
            <ul className="space-y-2 mb-6">
              <Bullet>Archivos 3D subidos para impresión</Bullet>
              <Bullet>Historial de pedidos</Bullet>
              <Bullet>Preferencias de productos</Bullet>
              <Bullet>Información del dispositivo y navegador</Bullet>
            </ul>

            <h3 className="text-lg font-semibold mb-3">
              2.3 Información de Uso
            </h3>
            <ul className="space-y-2">
              <Bullet>Interacciones con el sitio web</Bullet>
              <Bullet>Páginas visitadas</Bullet>
              <Bullet>Tiempo de permanencia</Bullet>
              <Bullet>Patrones de navegación</Bullet>
            </ul>
          </section>

          {/* 3. Uso de la Información */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader
              title="3. Uso de la Información"
              icon={<UserCheck className="h-6 w-6" />}
            />

            <h3 className="text-lg font-semibold mb-3">
              3.1 Propósitos Principales
            </h3>
            <ul className="space-y-2 mb-6">
              <Bullet>Procesar y entregar tus pedidos</Bullet>
              <Bullet>Proporcionar soporte técnico</Bullet>
              <Bullet>Mejorar nuestros servicios</Bullet>
              <Bullet>Personalizar tu experiencia</Bullet>
            </ul>

            <h3 className="text-lg font-semibold mb-3">3.2 Comunicaciones</h3>
            <ul className="space-y-2">
              <Bullet>Actualizaciones sobre tu pedido</Bullet>
              <Bullet>Respuestas a tus consultas</Bullet>
              <Bullet>
                Información sobre nuevos servicios (con consentimiento)
              </Bullet>
              <Bullet>Encuestas de satisfacción</Bullet>
            </ul>
          </section>

          {/* 4. Protección de Datos */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader
              title="4. Protección de Datos"
              icon={<Lock className="h-6 w-6" />}
            />

            <h3 className="text-lg font-semibold mb-3">
              4.1 Medidas de Seguridad
            </h3>
            <ul className="space-y-2 mb-6">
              <Bullet>Encriptación SSL/TLS</Bullet>
              <Bullet>Servidores protegidos</Bullet>
              <Bullet>Acceso restringido</Bullet>
              <Bullet>Monitoreo continuo</Bullet>
            </ul>

            <h3 className="text-lg font-semibold mb-3">
              4.2 Retención de Datos
            </h3>
            <ul className="space-y-2">
              <Bullet>Cumplimiento legal</Bullet>
              <Bullet>Resolución de disputas</Bullet>
              <Bullet>Ejecución de acuerdos</Bullet>
              <Bullet>Mejora de servicios</Bullet>
            </ul>
          </section>

          {/* 5. Tus Derechos */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader
              title="5. Tus Derechos"
              icon={<UserCheck className="h-6 w-6" />}
            />
            <ul className="space-y-2">
              <Bullet>Acceder a tu información personal</Bullet>
              <Bullet>Corregir datos inexactos</Bullet>
              <Bullet>Eliminar tus datos</Bullet>
              <Bullet>Oponerte al procesamiento</Bullet>
              <Bullet>Retirar tu consentimiento</Bullet>
              <Bullet>Solicitar portabilidad</Bullet>
            </ul>
          </section>

          {/* 6. Cookies */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader
              title="6. Cookies y Tecnologías de Seguimiento"
              icon={<Bell className="h-6 w-6" />}
            />

            <h3 className="text-lg font-semibold mb-3">Tipos de Cookies</h3>
            <ul className="space-y-2 mb-6">
              <Bullet>Cookies esenciales</Bullet>
              <Bullet>Cookies analíticas</Bullet>
              <Bullet>Cookies de preferencias</Bullet>
              <Bullet>Cookies de marketing</Bullet>
            </ul>

            <p className="text-neutral-700 dark:text-neutral-300">
              Puedes administrar o eliminar cookies desde la configuración de tu
              navegador.
            </p>
          </section>

          {/* 7. Contacto */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader
              title="7. Contacto"
              icon={<Phone className="h-6 w-6" />}
            />
            <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>Email: dreamings.desings.3d@gmail.com</li>
              <li>Teléfono: +51 901 843 288</li>
              <li>Ubicación: Arequipa, Perú</li>
            </ul>
          </section>

          {/* Footer */}
          <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4 text-sm text-neutral-600 dark:text-neutral-400">
            Última actualización: <strong>Febrero 2024</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
