'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';

interface PageLoaderProps {
  isLoading?: boolean;
}

export function PageLoader({ isLoading = true }: PageLoaderProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Logo animado */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center shadow-lg",
            colors.gradients.primary
          )}
        >
          <div className="w-6 h-6 bg-white rounded-sm" />
        </motion.div>
        
        {/* Barra de progreso */}
        <div className="w-32 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={cn(
              "h-full w-1/3 rounded-full",
              colors.gradients.primary
            )}
          />
        </div>
        
        {/* Texto */}
        <motion.p
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium"
        >
          Cargando...
        </motion.p>
      </div>
    </motion.div>
  );
}

export default PageLoader;