'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Edit, Printer, Package, Truck } from '@/lib/icons';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
}

interface InteractiveProcessTreeProps {
  steps: ProcessStep[];
}

export default function InteractiveProcessTree({ steps }: InteractiveProcessTreeProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const stepIcons = [Upload, Edit, Printer, Package, Truck];
  
  return (
    <div className="relative w-full max-w-4xl mx-auto p-6">
      {/* Mensaje instructivo */}
      <div className="text-center mb-8">
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Pasa el cursor sobre cada paso para ver los detalles
        </p>
      </div>

      {/* Línea vertical central */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-20 w-1 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full shadow-sm" 
           style={{ height: `${(steps.length - 1) * 80}px` }} />

      <div className="space-y-6 pt-4">
        {steps.map((step, index) => {
          const isHovered = hoveredStep === index;
          const IconComponent = stepIcons[index] || step.icon;
          
          return (
            <motion.div
              key={step.id}
              className="relative flex items-center justify-center"
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Líneas conectoras */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
              
              {/* Nodo central */}
              <motion.div
                className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <IconComponent className="w-6 h-6 text-white" />
                
                {/* Número del paso */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center text-xs font-bold text-primary-500 border-2 border-primary-500">
                  {index + 1}
                </div>
              </motion.div>

              {/* Panel de detalles expandible */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: index % 2 === 0 ? -20 : 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`absolute z-20 ${index % 2 === 0 ? 'left-20' : 'right-20'} top-1/2 transform -translate-y-1/2 w-80`}
                  >
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 p-4">
                      {/* Flecha indicadora */}
                      <div className={`absolute top-1/2 transform -translate-y-1/2 ${
                        index % 2 === 0 ? '-left-2' : '-right-2'
                      } w-4 h-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rotate-45 ${
                        index % 2 === 0 ? 'border-r-0 border-b-0' : 'border-l-0 border-t-0'
                      }`} />
                      
                      <div className="relative z-10">
                        <h3 className="text-lg font-bold text-primary-500 mb-2">{step.title}</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">{step.description}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                            <span>Duración: {step.duration}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Incluye:</h4>
                          <ul className="space-y-1">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                                <div className="w-1 h-1 bg-secondary-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}