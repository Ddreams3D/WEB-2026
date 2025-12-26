import React, { useState } from 'react';

import Link from 'next/link';

import { Calculator, Plus, Minus, RefreshCw } from '@/lib/icons';
import { WHATSAPP_REDIRECT } from '@/shared/constants/infoBusiness';

const calculatorOptions = {
  materials: [
    {
      name: 'PLA',
      multiplier: 1,
      description: 'Material estándar, ideal para prototipos',
    },
    { name: 'PETG', multiplier: 1.3, description: 'Resistente y transparente' },
    {
      name: 'ABS',
      multiplier: 1.2,
      description: 'Duradero y resistente al calor',
    },
    { name: 'TPU', multiplier: 1.8, description: 'Flexible y elástico' },
    {
      name: 'Resina',
      multiplier: 2.2,
      description: 'Alta precisión y acabado',
    },
    { name: 'PEEK', multiplier: 4.5, description: 'Grado médico e industrial' },
  ],
  sizes: [
    {
      name: 'Pequeño (hasta 5cm³)',
      basePrice: 25,
      description: 'Ideal para joyería y miniaturas',
    },
    {
      name: 'Mediano (5-25cm³)',
      basePrice: 45,
      description: 'Perfecto para prototipos',
    },
    {
      name: 'Grande (25-100cm³)',
      basePrice: 85,
      description: 'Modelos y piezas funcionales',
    },
    {
      name: 'Extra Grande (100cm³+)',
      basePrice: 150,
      description: 'Proyectos complejos',
    },
  ],
  finishes: [
    { name: 'Estándar', multiplier: 1, description: 'Sin post-procesado' },
    { name: 'Lijado', multiplier: 1.2, description: 'Superficie suave' },
    { name: 'Pintado', multiplier: 1.5, description: 'Color personalizado' },
    { name: 'Pulido', multiplier: 1.8, description: 'Acabado brillante' },
  ],
  urgency: [
    {
      name: 'Estándar (5-7 días)',
      multiplier: 1,
      description: 'Tiempo normal',
    },
    {
      name: 'Rápido (3-4 días)',
      multiplier: 1.3,
      description: 'Entrega acelerada',
    },
    {
      name: 'Express (1-2 días)',
      multiplier: 1.8,
      description: 'Entrega urgente',
    },
    { name: 'Mismo día', multiplier: 2.5, description: 'Entrega inmediata' },
  ],
};

export default function ServicesCalculatorPrice() {
  // Calculator states
  const [quantity, setQuantity] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(0);
  const [selectedUrgency, setSelectedUrgency] = useState(0);

  const calculatePrice = () => {
    const basePrice = calculatorOptions.sizes[selectedSize].basePrice;
    const materialMultiplier =
      calculatorOptions.materials[selectedMaterial].multiplier;
    const finishMultiplier =
      calculatorOptions.finishes[selectedFinish].multiplier;
    const urgencyMultiplier =
      calculatorOptions.urgency[selectedUrgency].multiplier;

    return Math.round(
      basePrice *
        materialMultiplier *
        finishMultiplier *
        urgencyMultiplier *
        quantity
    );
  };

  const resetCalculator = () => {
    setQuantity(1);
    setSelectedMaterial(0);
    setSelectedSize(0);
    setSelectedFinish(0);
    setSelectedUrgency(0);
  };

  return (
    <section className="py-12 bg-background dark:from-neutral-800 dark:to-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            <Calculator className="w-8 h-8 inline-block mr-2 text-primary-500" />
            Calculadora de Precios
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Obtén una cotización instantánea personalizada para tu proyecto
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Calculator Form */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Configura tu Proyecto
            </h3>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Cantidad de Piezas
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 flex items-center justify-center transition-colors duration-150"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 flex items-center justify-center transition-colors duration-150"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Material Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Material
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {calculatorOptions.materials.map((material, index) => (
                  <button
                    key={material.name}
                    onClick={() => setSelectedMaterial(index)}
                    className={`p-3 rounded-lg border-2 text-left transition-all duration-150 ${
                      selectedMaterial === index
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-500'
                    }`}
                  >
                    <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                      {material.name}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                      {material.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Tamaño
              </label>
              <div className="space-y-2">
                {calculatorOptions.sizes.map((size, index) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(index)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-150 ${
                      selectedSize === index
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                          {size.name}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                          {size.description}
                        </div>
                      </div>
                      <div className="text-base font-bold text-primary-600 dark:text-primary-400">
                        S/. {size.basePrice}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Finish Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Acabado
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {calculatorOptions.finishes.map((finish, index) => (
                  <button
                    key={finish.name}
                    onClick={() => setSelectedFinish(index)}
                    className={`p-3 rounded-lg border-2 text-left transition-all duration-150 ${
                      selectedFinish === index
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-500'
                    }`}
                  >
                    <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                      {finish.name}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                      {finish.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Tiempo de Entrega
              </label>
              <div className="space-y-2">
                {calculatorOptions.urgency.map((urgency, index) => (
                  <button
                    key={urgency.name}
                    onClick={() => setSelectedUrgency(index)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-150 ${
                      selectedUrgency === index
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                          {urgency.name}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                          {urgency.description}
                        </div>
                      </div>
                      {urgency.multiplier > 1 && (
                        <div className="text-xs font-medium text-orange-600 dark:text-orange-400">
                          +{Math.round((urgency.multiplier - 1) * 100)}%
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={resetCalculator}
              className="w-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 py-2 px-4 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-150 flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-3 h-3" />
              Reiniciar Calculadora
            </button>
          </div>

          {/* Price Summary */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 sticky top-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Resumen de Cotización
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-1.5 border-b border-neutral-200 dark:border-neutral-600">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Material:
                </span>
                <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                  {calculatorOptions.materials[selectedMaterial].name}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-neutral-200 dark:border-neutral-600">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Tamaño:
                </span>
                <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                  {calculatorOptions.sizes[selectedSize].name.split(' ')[0]}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-neutral-200 dark:border-neutral-600">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Acabado:
                </span>
                <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                  {calculatorOptions.finishes[selectedFinish].name}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-neutral-200 dark:border-neutral-600">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Entrega:
                </span>
                <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                  {
                    calculatorOptions.urgency[selectedUrgency].name.split(
                      ' '
                    )[0]
                  }
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-neutral-200 dark:border-neutral-600">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Cantidad:
                </span>
                <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                  {quantity} {quantity === 1 ? 'pieza' : 'piezas'}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-4 text-white text-center mb-5">
              <div className="text-xs font-medium mb-1">Precio Estimado</div>
              <div className="text-3xl font-bold mb-1">
                S/. {calculatePrice()}
              </div>
              <div className="text-xs opacity-90">
                {quantity > 1 &&
                  `S/. ${Math.round(calculatePrice() / quantity)} por pieza`}
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/contact"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-150 flex items-center justify-center gap-2 shadow-lg text-sm"
              >
                Solicitar Cotización Oficial
              </Link>
              <Link
                href={`${WHATSAPP_REDIRECT}?text=Hola, me interesa una cotización para impresión 3D`}
                target="_blank"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-150 flex items-center justify-center gap-2 text-sm"
              >
                Consultar por WhatsApp
              </Link>
            </div>

            <div className="mt-4 p-3 bg-surface dark:bg-neutral-800 rounded-lg">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
                * Los precios son estimados. La cotización final puede variar
                según la complejidad del proyecto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
