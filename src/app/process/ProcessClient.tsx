'use client';

import { useState, useEffect } from 'react';
import PageHeader from '../../shared/components/PageHeader';
import { MessageSquare, FileText, Palette, Printer, Package, CheckCircle, Clock, Users, Lightbulb, ChevronDown, ChevronUp, HelpCircle, Star, Shield, Zap, ArrowDown, ArrowRight, Play, Pause } from '@/lib/icons';
import { useStaggeredItemsAnimation, getAnimationClasses } from '../../shared/hooks/useIntersectionAnimation';

const processSteps = [
  {
    step: 1,
    title: "Consulta Inicial",
    description: "Analizamos tus necesidades y objetivos para entender completamente tu visión del proyecto.",
    duration: "1-2 días",
    icon: MessageSquare,
    details: [
      "Reunión de descubrimiento",
      "Análisis de requerimientos",
      "Definición de objetivos",
      "Evaluación de viabilidad",
      "Propuesta inicial"
    ]
  },
  {
    step: 2,
    title: "Planificación y Estrategia",
    description: "Desarrollamos un plan detallado con cronograma, recursos y metodología específica para tu proyecto.",
    duration: "2-3 días",
    icon: FileText,
    details: [
      "Cronograma detallado",
      "Asignación de recursos",
      "Definición de entregables",
      "Plan de comunicación",
      "Identificación de riesgos"
    ]
  },
  {
    step: 3,
    title: "Diseño y Conceptualización",
    description: "Creamos los diseños iniciales y conceptos visuales que darán forma a tu proyecto.",
    duration: "3-5 días",
    icon: Palette,
    details: [
      "Bocetos iniciales",
      "Wireframes y mockups",
      "Paleta de colores",
      "Tipografía y estilos",
      "Revisiones y ajustes"
    ]
  },
  {
    step: 4,
    title: "Desarrollo y Producción",
    description: "Implementamos y desarrollamos tu proyecto utilizando las mejores prácticas y tecnologías.",
    duration: "1-3 semanas",
    icon: Package,
    details: [
      "Desarrollo técnico",
      "Integración de sistemas",
      "Pruebas de calidad",
      "Optimización",
      "Documentación"
    ]
  },
  {
    step: 5,
    title: "Entrega y Soporte",
    description: "Entregamos tu proyecto finalizado con soporte completo y seguimiento post-entrega.",
    duration: "1-2 días",
    icon: CheckCircle,
    details: [
      "Entrega final",
      "Capacitación",
      "Documentación completa",
      "Soporte técnico",
      "Seguimiento post-entrega"
    ]
  }
];

const advantages = [
  {
    title: "Experiencia Comprobada",
    description: "Más de 5 años creando soluciones digitales innovadoras para empresas de todos los tamaños.",
    icon: Users,
    details: [
      "1000+ proyectos completados",
      "500+ clientes satisfechos",
      "Equipo multidisciplinario",
      "Metodologías ágiles"
    ]
  },
  {
    title: "Innovación Constante",
    description: "Utilizamos las últimas tecnologías y tendencias para mantener tu proyecto a la vanguardia.",
    icon: Lightbulb,
    details: [
      "Tecnologías de última generación",
      "Investigación continua",
      "Actualización constante",
      "Soluciones creativas"
    ]
  },
  {
    title: "Soporte Integral",
    description: "Ofrecemos soporte completo desde la conceptualización hasta el mantenimiento a largo plazo.",
    icon: Shield,
    details: [
      "Soporte 24/7",
      "Mantenimiento incluido",
      "Actualizaciones gratuitas",
      "Consultoría continua"
    ]
  },
  {
    title: "Entrega Rápida",
    description: "Procesos optimizados que garantizan entregas puntuales sin comprometer la calidad.",
    icon: Zap,
    details: [
      "Metodología ágil",
      "Entregas incrementales",
      "Comunicación constante",
      "Plazos garantizados"
    ]
  },
  {
    title: "Calidad Premium",
    description: "Estándares de calidad excepcionales en cada aspecto del desarrollo y diseño.",
    icon: Star,
    details: [
      "Control de calidad riguroso",
      "Pruebas exhaustivas",
      "Código limpio y documentado",
      "Diseño pixel-perfect"
    ]
  },
  {
    title: "Transparencia Total",
    description: "Comunicación clara y transparente en cada etapa del proyecto con reportes detallados.",
    icon: HelpCircle,
    details: [
      "Reportes semanales",
      "Acceso a herramientas",
      "Comunicación directa",
      "Feedback constante"
    ]
  }
];

export default function ProcessClient() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<{[key: number]: boolean}>({});
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const { ref: processRef, visibleItems } = useStaggeredItemsAnimation(processSteps.length, 200, {
    threshold: 0.2,
    triggerOnce: true
  });

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(activeStep === stepIndex ? null : stepIndex);
  };

  const toggleDetails = (stepIndex: number) => {
    setExpandedDetails(prev => ({
      ...prev,
      [stepIndex]: !prev[stepIndex]
    }));
  };

  return (
    <main className="min-h-screen bg-background dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <PageHeader
        title="Nuestro Proceso"
        description="Conoce cómo trabajamos paso a paso para hacer realidad tu proyecto"
        image="/images/placeholder-process.svg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Proceso paso a paso */}
        <section className="mb-10" aria-labelledby="process-heading">
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
              <h2 id="process-heading" className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Proceso de Trabajo
              </h2>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Seguimos un proceso estructurado y transparente para garantizar los mejores resultados en cada proyecto
            </p>
          </header>

          {/* Proceso simplificado */}
          <div ref={processRef} className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Pasos del proceso de trabajo">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              const isExpanded = expandedDetails[index];
              
              return (
                <div 
                  key={index} 
                  className={`relative bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 min-h-[280px] flex flex-col ${
                    isActive ? 'ring-2 ring-primary-500 shadow-primary-100 dark:shadow-primary-900/20' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Header con icono y número */}
                  <div className="flex items-center mb-4">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg' 
                          : 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800'
                      } mr-4`}
                      onClick={() => handleStepClick(index)}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {step.title}
                        </h3>
                        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                          Paso {index + 1}
                        </span>
                      </div>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {step.duration}
                      </span>
                    </div>
                  </div>
                  
                  {/* Descripción */}
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed flex-grow">
                    {step.description}
                  </p>
                  
                  {/* Botón para ver detalles */}
                  <div className="mt-auto">
                    <button
                      onClick={() => toggleDetails(index)}
                      className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 text-sm font-medium"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                      {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                    </button>
                  </div>
                  
                  {/* Detalles expandibles */}
                  <div className={`transition-all duration-300 ${isExpanded ? 'mt-4' : ''}`}>
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600">
                        <ul className="space-y-1.5 max-h-24 overflow-y-auto">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                              <div className="w-1 h-1 bg-primary-500 rounded-full flex-shrink-0 mt-1.5"></div>
                              <span className="leading-tight">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Barra de progreso interactiva */}
            <div className="mt-6 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Progreso del proceso</span>
                <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
                  {activeStep !== null ? Math.round(((activeStep + 1) / processSteps.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${activeStep !== null ? ((activeStep + 1) / processSteps.length) * 100 : 0}%` }}
                >
                  <div className="h-full bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              
              {/* Indicadores de pasos */}
              <div className="flex justify-between mt-2">
                {processSteps.map((_, stepIndex) => (
                  <button
                    key={stepIndex}
                    onClick={() => setActiveStep(stepIndex)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                      activeStep !== null && stepIndex <= activeStep 
                        ? 'bg-gradient-to-br from-primary-500 to-secondary-500 shadow-md' 
                        : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-primary-300 dark:hover:bg-primary-700'
                    }`}
                    aria-label={`Ir al paso ${stepIndex + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Control de auto-reproducción mejorado */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => activeStep !== null && setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === null || activeStep === 0}
                className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                <ArrowDown className="h-4 w-4 rotate-90" />
                Anterior
              </button>
              
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-2">
                  {isAutoPlaying ? (
                    <>
                      <Pause className="h-4 w-4 animate-pulse" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Reproducir
                    </>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => activeStep !== null && setActiveStep(Math.min(processSteps.length - 1, activeStep + 1))}
                disabled={activeStep === null || activeStep === processSteps.length - 1}
                className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                Siguiente
                <ArrowDown className="h-4 w-4 -rotate-90" />
              </button>
            </div>
          </div>
          
          {/* Indicadores de progreso compactos */}
          <div className="flex justify-center mt-6 space-x-1.5">
            {processSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 scale-125'
                    : activeStep !== null && activeStep > index
                    ? 'bg-green-500'
                    : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-primary-300'
                }`}
                aria-label={`Ir al paso ${index + 1}`}
              ></button>
            ))}
          </div>
        </section>

        {/* Ventajas */}
        <section className="mb-10" aria-labelledby="advantages-heading">
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
              <h2 id="advantages-heading" className="text-2xl font-bold bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">
                ¿Por qué elegirnos?
              </h2>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Nuestras ventajas competitivas que nos distinguen en el mercado
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Ventajas de nuestro servicio">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <article 
                  key={index} 
                  className={`group ${getAnimationClasses(true, index)} animate-fade-in-up`}
                  role="listitem"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-3 h-full border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" aria-hidden="true">
                          <Icon className="h-4 w-4 text-white group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-primary-500 group-hover:text-primary-600 transition-colors duration-300 mb-1">
                          {advantage.title}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-300">
                          {advantage.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-1" aria-label="Detalles de la ventaja">
                      <ul className="space-y-1">
                        {advantage.details.slice(0, 3).map((detail, detailIndex) => (
                          <li 
                            key={detailIndex} 
                            className="flex items-start space-x-2 animate-slide-in-left hover:translate-x-1 transition-transform duration-300"
                            style={{ animationDelay: `${(index * 150) + (detailIndex * 50)}ms` }}
                          >
                            <div className="w-1 h-1 bg-primary-500 rounded-full flex-shrink-0 mt-2 animate-pulse"></div>
                            <span className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center animate-fade-in-up" aria-labelledby="cta-heading">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 rounded-lg p-6 border border-primary-200 dark:border-primary-800 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <MessageSquare className="h-4 w-4 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h2 id="cta-heading" className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  ¿Listo para comenzar tu proyecto?
                </h2>
              </div>
              
              <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-sm group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-300">
                Contáctanos hoy y descubre cómo podemos hacer realidad tu visión con nuestro proceso probado
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/contact"
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 text-sm inline-flex items-center justify-center animate-bounce-subtle"
                  aria-label="Ir a la página de contacto"
                >
                  <MessageSquare className="h-4 w-4 mr-2 hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                  Contactar Ahora
                </a>
                
                <a
                  href="/portfolio"
                  className="border-2 border-primary-500 text-primary-500 px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-500 hover:text-white transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 text-sm inline-flex items-center justify-center"
                  aria-label="Ver nuestro portafolio de proyectos"
                >
                  <Star className="h-4 w-4 mr-2 hover:scale-110 transition-transform duration-300" />
                  Ver Portafolio
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}