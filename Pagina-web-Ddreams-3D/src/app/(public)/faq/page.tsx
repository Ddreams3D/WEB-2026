import React from 'react';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background dark:from-neutral-900 dark:to-neutral-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-neutral-900 dark:text-white">
          Preguntas Frecuentes
        </h1>
        <div className="bg-surface dark:bg-neutral-800 rounded-lg shadow-soft p-8">
          <p className="text-neutral-600 dark:text-neutral-300 text-center">
            Esta página está en construcción. Pronto tendremos contenido disponible.
          </p>
        </div>
      </div>
    </div>
  );
}