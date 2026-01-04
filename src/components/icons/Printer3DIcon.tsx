import React from 'react';
import { cn } from '@/lib/utils';

interface Printer3DIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const Printer3DIcon = ({ className, ...props }: Printer3DIconProps) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn("w-6 h-6", className)}
      {...props}
    >
      {/* Base */}
      <rect x="4" y="16" width="16" height="6" rx="1" />
      {/* Frame */}
      <path d="M4 16V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v12" />
      {/* Print Head / Nozzle */}
      <path d="M12 3v8" />
      <path d="M10 11h4" />
      <path d="M12 11v3" />
      {/* Print Bed / Object */}
      <path d="M8 16h8" />
      <path d="M9 13h6" />
    </svg>
  );
};
