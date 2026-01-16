'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface IsotypeLogoProps {
  className?: string;
  primaryColor?: string;
  ignoreTheme?: boolean;
}

export const IsotypeLogo = ({ className, primaryColor, ignoreTheme = false }: IsotypeLogoProps) => {
  const { theme } = useTheme();

  // Colores temáticos
  const isValentines = !ignoreTheme && theme === 'valentines';
  const isHalloween = !ignoreTheme && theme === 'halloween';
  
  // Determinación del color de relleno
  // Prioridad: primaryColor (prop) > Halloween > Valentines > Standard (Gradient)
  const getFill = () => {
    if (primaryColor) return primaryColor;
    if (isHalloween) return '#f97316'; // Orange-500
    if (isValentines) return '#E11D48'; // Rose-600
    return 'url(#isotype-logo-gradient)'; // Default Gradient
  };

  const fill = getFill();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1000 -5500 14500 14500"
      className={className}
      style={{
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }}
    >
      <defs>
        <linearGradient id="isotype-logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%" spreadMethod="repeat">
          <stop offset="0%" stopColor="rgb(var(--primary-600))" />
          <stop offset="50%" stopColor="rgb(var(--secondary-500))" />
          <stop offset="100%" stopColor="rgb(var(--primary-600))" />
          <animateTransform attributeName="gradientTransform" type="translate" from="-1" to="0" dur="5s" repeatCount="indefinite" />
        </linearGradient>
      </defs>

      <g transform="translate(0, -4500)">
        {/* Parte Izquierda - Blanco con borde negro (Igual que MainLogo) */}
        <path
          d="M2406.59 5529.87c0,929.96 306.87,1676.12 833.48,2187.4 332.43,322.73 757.27,557.5 1252.65,691.41l0 -2878.81 0 -1896.45 0 -982.36 0 -36.52 -2028.22 0c11.42,-11.39 22.93,-22.71 34.5,-33.94 746.02,-724.3 1796.43,-1125.22 3022.52,-1125.22l0 470.77 0 595.06 0 3008.67 0 3008.68 0 595.04 0 470.77c-1226.08,0 -2276.49,-400.91 -3022.52,-1125.21 -731.8,-710.48 -1158.22,-1717.98 -1158.22,-2949.28 0,-711.61 142.43,-1348.48 403.93,-1896.45l1238.71 0c-368.26,488.18 -576.83,1129.86 -576.83,1896.45z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="240.12"
          strokeLinejoin="round"
        />
        
        {/* Parte Derecha - Color Temático con borde negro (Igual que MainLogo) */}
        <path
          d="M8937.5 5520.13c0,-929.95 -306.87,-1676.12 -833.48,-2187.38 -332.43,-322.74 -757.27,-557.5 -1252.65,-691.42l0 2878.81 0 1896.45 0 982.36 0 36.52 2028.22 0c-11.42,11.39 -22.93,22.71 -34.5,33.95 -746.02,724.3 -1796.43,1125.21 -3022.52,1125.21l0 -470.78 0 -595.04 0 -3008.67 0 -3008.68 0 -595.04 0 -470.77c1226.08,0 2276.49,400.92 3022.52,1125.22 731.8,710.47 1158.22,1717.96 1158.22,2949.27 0,711.62 -142.43,1348.49 -403.93,1896.45l-1238.71 0c368.26,-488.18 576.83,-1129.86 576.83,-1896.45z"
          fill={fill}
          stroke="#000000"
          strokeWidth="240.12"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
