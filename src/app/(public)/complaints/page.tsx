'use client';

import React from 'react';
import DefaultImage from '@/shared/components/ui/DefaultImage';
import PageHeader from '@/shared/components/PageHeader';
import { EMAIL_BUSINESS, PHONE_DISPLAY, ADDRESS_BUSINESS, SCHEDULE_BUSINESS } from '@/shared/constants/contactInfo';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

export default function Complaints() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Libro de Reclamaciones"
        description="Registra aquí tus quejas o reclamos"
        image={`/${StoragePathBuilder.ui.banners()}/servicios-diseno-modelado-impresion-3d-ddreams-3d.png`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card rounded-lg shadow-soft p-8">
          <div className="text-center mb-8">
            <DefaultImage 
              src={`/${StoragePathBuilder.ui.brand()}/logo-libro-reclamaciones.svg`}
              alt="Libro de Reclamaciones"
              width={96}
              height={96}
              className="h-24 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-4">Libro de Reclamaciones Virtual</h2>
            <p className="text-muted-foreground">
              Conforme a lo establecido en el Código de Protección y Defensa del Consumidor 
              y en cumplimiento con el Decreto Supremo N° 011-2011-PCM, ponemos a tu disposición 
              nuestro Libro de Reclamaciones Virtual a través del portal de INDECOPI.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="font-semibold mb-2">Información Importante</h3>
              <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>El plazo máximo de atención es de 30 días calendario</li>
                <li>Recibirás una copia de tu reclamo al correo electrónico registrado</li>
                <li>Conserva el número de reclamo para futuras referencias</li>
                <li>El Libro de Reclamaciones está integrado con el sistema de INDECOPI</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Datos de la Empresa</h3>
                <dl className="space-y-2 text-neutral-600 dark:text-neutral-300">
                  <dt className="font-medium">Razón Social:</dt>
                  <dd>Designs and Dreamings (Ddreams 3D) E.I.R.L.</dd>
                  <dt className="font-medium">RUC:</dt>
                  <dd>En trámite</dd>
                  <dt className="font-medium">Dirección:</dt>
                  <dd>{ADDRESS_BUSINESS}</dd>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Canales de Atención</h3>
                <dl className="space-y-2 text-neutral-600 dark:text-neutral-300">
                  <dt className="font-medium">Email:</dt>
                  <dd>{EMAIL_BUSINESS}</dd>
                  <dt className="font-medium">Teléfono:</dt>
                  <dd>{PHONE_DISPLAY}</dd>
                  <dt className="font-medium">Horario:</dt>
                  <dd>{SCHEDULE_BUSINESS}</dd>
                </dl>
              </div>
            </div>

            <div className="flex flex-col items-center pt-6 space-y-4">
              <a
                href="https://enlinea.indecopi.gob.pe/reclamavirtual/#/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-secondary-500 text-white px-8 py-3 rounded-lg transition-colors"
              >
                Registrar Reclamo en INDECOPI
              </a>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Al hacer clic serás redirigido al portal oficial de INDECOPI para registrar tu reclamo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}