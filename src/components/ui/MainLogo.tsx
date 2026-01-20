'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface MainLogoProps {
  className?: string;
  variant?: 'white' | 'black';
  ignoreTheme?: boolean;
  customColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
}

export const MainLogo = ({ 
  className, 
  variant = 'white', 
  ignoreTheme = false, 
  customColor,
  gradientStart,
  gradientEnd
}: MainLogoProps) => {
  const { theme } = useTheme();
  
  // Colores según variante
  const textColor = variant === 'white' ? '#FEFEFE' : '#373435';
  const sloganColor = variant === 'white' ? '#FEFEFE' : '#373435';
  const separatorOpacity = variant === 'white' ? '0.3' : '0.5'; // Separador más visible en negro
  
  const isValentines = !ignoreTheme && theme === 'valentines';
  
  const hasCustomGradient = !customColor && gradientStart && gradientEnd;
  const activeGradientId = hasCustomGradient ? 'custom-logo-gradient' : 'main-logo-gradient';
  
  let finalFill: string = `url(#${activeGradientId})`;
  if (customColor) {
    finalFill = customColor;
  } else if (isValentines && !hasCustomGradient) {
    finalFill = '#E11D48';
  }
  
  const isotopeLeftColor = '#FEFEFE'; // Blanco constante
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1000 -4500 45000 13000"
      className={className}
      style={{
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }}
    >
      <defs>
        <style>{`
          .fnt-montserrat { font-family: var(--font-montserrat), sans-serif; font-weight: 700; }
          .fnt-montserrat-alt-bold { font-family: var(--font-montserrat-alternates), sans-serif; font-weight: 600; }
          .fnt-montserrat-alt-light { font-family: var(--font-montserrat-alternates), sans-serif; font-weight: 300; }
          
          @keyframes pulse-calm {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .pulse-text {
            animation: pulse-calm 5s ease-in-out infinite;
          }
        `}</style>
        
        {/* Gradiente por defecto */}
        <linearGradient id="main-logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%" spreadMethod="repeat">
          <stop offset="0%" stopColor="rgb(var(--primary-600))" />
          <stop offset="50%" stopColor="rgb(var(--secondary-500))" />
          <stop offset="100%" stopColor="rgb(var(--primary-600))" />
          <animateTransform attributeName="gradientTransform" type="translate" from="-1" to="0" dur="5s" repeatCount="indefinite" />
        </linearGradient>

        {/* Gradiente personalizado (si se proporcionan props) */}
        {hasCustomGradient && (
          <linearGradient id="custom-logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%" spreadMethod="repeat">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="50%" stopColor={gradientEnd} />
            <stop offset="100%" stopColor={gradientStart} />
            <animateTransform attributeName="gradientTransform" type="translate" from="-1" to="0" dur="5s" repeatCount="indefinite" />
          </linearGradient>
        )}
      </defs>
      
      {/* Isotipo */}
      <g transform="translate(0, -4500)">
        {/* Parte Izquierda - Blanco con borde negro */}
        <path
          style={{ fill: isotopeLeftColor, stroke: 'black', strokeWidth: '240.12' }}
          d="M2406.59 5529.87c0,929.96 306.87,1676.12 833.48,2187.4 332.43,322.73 757.27,557.5 1252.65,691.41l0 -2878.81 0 -1896.45 0 -982.36 0 -36.52 -2028.22 0c11.42,-11.39 22.93,-22.71 34.5,-33.94 746.02,-724.3 1796.43,-1125.22 3022.52,-1125.22l0 470.77 0 595.06 0 3008.67 0 3008.68 0 595.04 0 470.77c-1226.08,0 -2276.49,-400.91 -3022.52,-1125.21 -731.8,-710.48 -1158.22,-1717.98 -1158.22,-2949.28 0,-711.61 142.43,-1348.48 403.93,-1896.45l1238.71 0c-368.26,488.18 -576.83,1129.86 -576.83,1896.45z"
        />
        {/* Parte Derecha - Turquesa / Gradiente */}
        <path
          style={{ fill: finalFill, stroke: 'black', strokeWidth: '240.12' }}
          d="M8937.5 5520.13c0,-929.95 -306.87,-1676.12 -833.48,-2187.38 -332.43,-322.74 -757.27,-557.5 -1252.65,-691.42l0 2878.81 0 1896.45 0 982.36 0 36.52 2028.22 0c-11.42,11.39 -22.93,22.71 -34.5,33.95 -746.02,724.3 -1796.43,1125.21 -3022.52,1125.21l0 -470.78 0 -595.04 0 -3008.67 0 -3008.68 0 -595.04 0 -470.77c1226.08,0 2276.49,400.92 3022.52,1125.22 731.8,710.47 1158.22,1717.96 1158.22,2949.27 0,711.62 -142.43,1348.49 -403.93,1896.45l-1238.71 0c368.26,-488.18 576.83,-1129.86 576.83,-1896.45z"
        />
      </g>
      
      {/* Textos */}
      <g>
        {/* D´DREAMS */}
        <text x="11500" y="2500" style={{ fill: textColor }} className="fnt-montserrat" fontSize="4000">
          D´DREAMS
        </text>
        
        {/* 3D */}
        <text x="35500" y="2500" style={{ fill: finalFill }} className="fnt-montserrat-alt-bold" fontSize="4000">
          3D
        </text>
        
        {/* Slogan Animado */}
        <text x="11500" y="5500" style={{ fill: sloganColor }} className="fnt-montserrat-alt-light" fontSize="2200">
          <tspan className="pulse-text" style={{ animationDelay: '0s' }}>Soñar</tspan>
          <tspan style={{ opacity: separatorOpacity }}> | </tspan>
          <tspan className="pulse-text" style={{ animationDelay: '1.5s' }}>Diseñar</tspan>
          <tspan style={{ opacity: separatorOpacity }}> | </tspan>
          <tspan className="pulse-text" style={{ animationDelay: '3s' }}>Crear</tspan>
        </text>
      </g>
    </svg>
  );
};
