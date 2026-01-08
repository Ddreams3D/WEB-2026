import React from 'react';

interface IsotypeLogoProps {
  className?: string;
  primaryColor: string;
}

export const IsotypeLogo = ({ className, primaryColor }: IsotypeLogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1000 -4500 11000 13000"
      className={className}
      style={{
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }}
    >
      <g transform="translate(0, -4500)">
        {/* Left D Group - Moved slightly left for spacing */}
        <g transform="translate(-250, 0)">
          {/* Left D - BORDER LAYER (Permanent dark grey stroke) */}
          <path
            d="M2406.59 5529.87c0,929.96 306.87,1676.12 833.48,2187.4 332.43,322.73 757.27,557.5 1252.65,691.41l0 -2878.81 0 -1896.45 0 -982.36 0 -36.52 -2028.22 0c11.42,-11.39 22.93,-22.71 34.5,-33.94 746.02,-724.3 1796.43,-1125.22 3022.52,-1125.22l0 470.77 0 595.06 0 3008.67 0 3008.68 0 595.04 0 470.77c-1226.08,0 -2276.49,-400.91 -3022.52,-1125.21 -731.8,-710.48 -1158.22,-1717.98 -1158.22,-2949.28 0,-711.61 142.43,-1348.48 403.93,-1896.45l1238.71 0c-368.26,488.18 -576.83,1129.86 -576.83,1896.45z"
            fill="none"
            stroke="#000000"
            strokeWidth="500"
            strokeLinejoin="round"
            className="opacity-30"
          />
          
          {/* Left D - MAIN LAYER (Always White) */}
          <path
            fill="#ffffff"
            d="M2406.59 5529.87c0,929.96 306.87,1676.12 833.48,2187.4 332.43,322.73 757.27,557.5 1252.65,691.41l0 -2878.81 0 -1896.45 0 -982.36 0 -36.52 -2028.22 0c11.42,-11.39 22.93,-22.71 34.5,-33.94 746.02,-724.3 1796.43,-1125.22 3022.52,-1125.22l0 470.77 0 595.06 0 3008.67 0 3008.68 0 595.04 0 470.77c-1226.08,0 -2276.49,-400.91 -3022.52,-1125.21 -731.8,-710.48 -1158.22,-1717.98 -1158.22,-2949.28 0,-711.61 142.43,-1348.48 403.93,-1896.45l1238.71 0c-368.26,488.18 -576.83,1129.86 -576.83,1896.45z"
          />
        </g>

        {/* Right D Group - Moved slightly right for spacing */}
        <g transform="translate(600, 0)">
          {/* Right D - Thematic Color */}
          <path
            fill={primaryColor}
            stroke={primaryColor}
            strokeWidth="500"
            strokeLinejoin="round"
            d="M8937.5 5520.13c0,-929.95 -306.87,-1676.12 -833.48,-2187.38 -332.43,-322.74 -757.27,-557.5 -1252.65,-691.42l0 2878.81 0 1896.45 0 982.36 0 36.52 2028.22 0c-11.42,11.39 -22.93,22.71 -34.5,33.95 -746.02,724.3 -1796.43,1125.21 -3022.52,1125.21l0 -470.78 0 -595.04 0 -3008.67 0 -3008.68 0 -595.04 0 -470.77c1226.08,0 2276.49,400.92 3022.52,1125.22 731.8,710.47 1158.22,1717.96 1158.22,2949.27 0,711.62 -142.43,1348.49 -403.93,1896.45l-1238.71 0c368.26,-488.18 576.83,-1129.86 576.83,-1896.45z"
          />
        </g>
      </g>
    </svg>
  );
};
