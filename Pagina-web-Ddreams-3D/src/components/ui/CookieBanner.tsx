'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay to not annoy immediately
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 m-4 md:m-6 md:max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl"
        >
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                🍪 Utilizamos cookies
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Usamos cookies para mejorar tu experiencia de navegación, analizar nuestro tráfico y personalizar el contenido. 
                Al hacer clic en "Aceptar", aceptas nuestro uso de cookies.
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700 ml-1 underline">
                  Leer Política de Privacidad
                </Link>
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={handleDecline}
                className="text-neutral-600"
              >
                Rechazar
              </Button>
              <Button 
                onClick={handleAccept}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                Aceptar
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
