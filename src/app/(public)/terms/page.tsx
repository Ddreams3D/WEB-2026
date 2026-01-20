'use client';

import React from 'react';
import PageHeader from '@/shared/components/PageHeader';
import { EMAIL_BUSINESS, PHONE_DISPLAY, ADDRESS_BUSINESS } from '../../../shared/constants/contactInfo';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

/* ----------------------------- */
/* Section Header */
/* ----------------------------- */
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
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
export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader
        title="Términos de Servicio"
        description="Condiciones de uso de nuestros servicios"
        image={`/${StoragePathBuilder.ui.banners()}/servicios-diseno-modelado-impresion-3d-ddreams-3d.png`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-10">
          {/* 1. Introducción */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader title="1. Introducción" />
            <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
              Al acceder y utilizar los servicios de{' '}
              <strong>Designs and Dreamings (Ddreams 3D) E.I.R.L.</strong>,
              aceptas estos términos y condiciones en su totalidad. Si no estás
              de acuerdo con alguna parte, te pedimos que no utilices nuestros
              servicios.
            </p>
          </section>

          {/* 2. Servicios */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader title="2. Nuestros Servicios" />

            <h3 className="text-lg font-semibold mb-3">
              2.1 Servicios Principales
            </h3>
            <ul className="space-y-2 mb-6">
              <Bullet>Impresión 3D profesional</Bullet>
              <Bullet>Modelado 3D y diseño personalizado</Bullet>
              <Bullet>Prototipado rápido</Bullet>
              <Bullet>Producción en serie</Bullet>
            </ul>

            <h3 className="text-lg font-semibold mb-3">
              2.2 Calidad del Servicio
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Utilizamos tecnología de vanguardia y materiales premium. Cada
              proyecto pasa por un riguroso control de calidad antes de su
              entrega.
            </p>
          </section>

          {/* 3. Proceso de Pedido */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader title="3. Proceso de Pedido" />

            <h3 className="text-lg font-semibold mb-3">3.1 Cotización</h3>
            <ul className="space-y-2 mb-6">
              <Bullet>Complejidad del modelo</Bullet>
              <Bullet>Material seleccionado</Bullet>
              <Bullet>Tiempo de impresión</Bullet>
              <Bullet>Cantidad de unidades</Bullet>
              <Bullet>Acabados requeridos</Bullet>
            </ul>

            <h3 className="text-lg font-semibold mb-3">
              3.2 Plazos de Entrega
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Los plazos se confirman al momento de la cotización y dependen de
              la complejidad del proyecto.
            </p>
          </section>

          {/* 4. Pagos */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader title="4. Pagos y Facturación" />

            <h3 className="text-lg font-semibold mb-3">4.1 Métodos de Pago</h3>
            <ul className="space-y-2 mb-6">
              <Bullet>Transferencia bancaria</Bullet>
              <Bullet>Depósito en cuenta</Bullet>
              <Bullet>Pago en efectivo</Bullet>
              <Bullet>Yape / Plin</Bullet>
            </ul>

            <h3 className="text-lg font-semibold mb-3">
              4.2 Condiciones de Pago
            </h3>
            <ul className="space-y-2">
              <Bullet>50% de adelanto para iniciar el proyecto</Bullet>
              <Bullet>50% restante antes de la entrega</Bullet>
              <Bullet>Condiciones especiales según el proyecto</Bullet>
            </ul>
          </section>

          {/* 5. Propiedad Intelectual */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader title="5. Propiedad Intelectual" />

            <h3 className="text-lg font-semibold mb-3">
              5.1 Derechos del Cliente
            </h3>
            <ul className="space-y-2 mb-6">
              <Bullet>El cliente conserva los derechos de sus diseños</Bullet>
              <Bullet>Confidencialidad de los archivos</Bullet>
              <Bullet>No reutilización sin autorización</Bullet>
            </ul>

            <h3 className="text-lg font-semibold mb-3">
              5.2 Responsabilidad Legal
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              El cliente garantiza la titularidad de los diseños. No asumimos
              responsabilidad por infracciones de terceros.
            </p>
          </section>

          {/* 6. Garantías */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader title="6. Garantías y Devoluciones" />

            <h3 className="text-lg font-semibold mb-3">
              6.1 Garantía de Calidad
            </h3>
            <ul className="space-y-2 mb-6">
              <Bullet>7 días de garantía por defectos</Bullet>
              <Bullet>Reimpresión gratuita</Bullet>
              <Bullet>Reembolso en casos específicos</Bullet>
            </ul>

            <h3 className="text-lg font-semibold mb-3">6.2 Exclusiones</h3>
            <ul className="space-y-2">
              <Bullet>Mal uso del producto</Bullet>
              <Bullet>Modificaciones del cliente</Bullet>
              <Bullet>Desgaste normal</Bullet>
            </ul>
          </section>

          {/* 7. Limitación */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader title="7. Limitación de Responsabilidad" />
            <ul className="space-y-2">
              <Bullet>Uso indebido</Bullet>
              <Bullet>Daños indirectos</Bullet>
              <Bullet>Pérdidas comerciales</Bullet>
              <Bullet>Fuerza mayor</Bullet>
            </ul>
          </section>

          {/* 8. Modificaciones */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-sm">
            <SectionHeader title="8. Modificaciones de los Términos" />
            <p className="text-neutral-700 dark:text-neutral-300">
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Los cambios entran en vigencia al ser publicados.
            </p>
          </section>

          {/* 9. Contacto */}
          <section className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <SectionHeader title="9. Contacto" />
            <ul className="space-y-2 text-muted-foreground">
              <li>Email: {EMAIL_BUSINESS}</li>
              <li>Teléfono: {PHONE_DISPLAY}</li>
              <li>Ubicación: {ADDRESS_BUSINESS}</li>
            </ul>
          </section>

          {/* Footer */}
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            Última actualización: <strong>Enero 2026</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
