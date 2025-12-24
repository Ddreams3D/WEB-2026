import React from 'react';

import {
  MessageSquare,
  FileText,
  Palette,
  Package,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

import InteractiveProcessTree from './InteractiveProcessTree';

import { useStaggeredItemsAnimation } from '../../../shared/hooks/useIntersectionAnimation';

const processSteps = [
  {
    id: 'step-1',
    step: 1,
    title: 'Consulta Inicial',
    description:
      'Analizamos tus necesidades y objetivos para entender completamente tu visión del proyecto.',
    duration: '1-2 días',
    icon: MessageSquare,
    details: [
      'Reunión de descubrimiento',
      'Análisis de requerimientos',
      'Definición de objetivos',
      'Evaluación de viabilidad',
      'Propuesta inicial',
    ],
  },
  {
    id: 'step-2',
    step: 2,
    title: 'Planificación y Estrategia',
    description:
      'Desarrollamos un plan detallado con cronograma, recursos y metodología específica para tu proyecto.',
    duration: '2-3 días',
    icon: FileText,
    details: [
      'Cronograma detallado',
      'Asignación de recursos',
      'Definición de entregables',
      'Plan de comunicación',
      'Identificación de riesgos',
    ],
  },
  {
    id: 'step-3',
    step: 3,
    title: 'Diseño y Conceptualización',
    description:
      'Creamos los diseños iniciales y conceptos visuales que darán forma a tu proyecto.',
    duration: '3-5 días',
    icon: Palette,
    details: [
      'Bocetos iniciales',
      'Wireframes y mockups',
      'Paleta de colores',
      'Tipografía y estilos',
      'Revisiones y ajustes',
    ],
  },
  {
    id: 'step-4',
    step: 4,
    title: 'Desarrollo y Producción',
    description:
      'Implementamos y desarrollamos tu proyecto utilizando las mejores prácticas y tecnologías.',
    duration: '1-3 semanas',
    icon: Package,
    details: [
      'Desarrollo técnico',
      'Integración de sistemas',
      'Pruebas de calidad',
      'Optimización',
      'Documentación',
    ],
  },
  {
    id: 'step-5',
    step: 5,
    title: 'Entrega y Soporte',
    description:
      'Entregamos tu proyecto finalizado con soporte completo y seguimiento post-entrega.',
    duration: '1-2 días',
    icon: CheckCircle,
    details: [
      'Entrega final',
      'Capacitación',
      'Documentación completa',
      'Soporte técnico',
      'Seguimiento post-entrega',
    ],
  },
];

export default function ProcessSteps() {
  const { ref: processRef, visibleItems } = useStaggeredItemsAnimation(
    processSteps.length,
    200,
    {
      threshold: 0.2,
      triggerOnce: true,
    }
  );
  return (
    <section className="mb-10" aria-labelledby="process-heading">
      <header className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <Lightbulb className="h-3.5 w-3.5 text-white" />
          </div>
          <h2
            id="process-heading"
            className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
          >
            Proceso de Trabajo
          </h2>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-3">
          Seguimos un proceso estructurado y transparente para garantizar los
          mejores resultados
        </p>
      </header>

      {/* Proceso con estructura de árbol mejorada */}
      <div
        ref={processRef}
        className="max-w-7xl mx-auto"
        role="list"
        aria-label="Pasos del proceso de trabajo"
      >
        <InteractiveProcessTree steps={processSteps} />
      </div>
    </section>
  );
}
