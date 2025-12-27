'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { colors } from '../../shared/styles/colors';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'glass' | 'success' | 'overlay';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      default: 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 shadow-md hover:shadow-lg',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg',
      outline: 'border border-neutral-200 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
      secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 dark:bg-secondary-900/50 dark:text-secondary-100 dark:hover:bg-secondary-900/70',
      ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
      link: 'text-primary-600 underline-offset-4 hover:underline dark:text-primary-400',
      gradient: `${colors.gradients.primary} ${colors.gradients.primaryHover} text-white shadow-md hover:shadow-lg border-0 transform hover:scale-105`,
      glass: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 shadow-sm hover:shadow-md',
      success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md',
      overlay: 'bg-white/80 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-700 text-neutral-900 dark:text-white backdrop-blur-sm shadow-md border-0',
    };
    
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10'
    };

    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    );

    if (asChild) {
      return (
        <span className={classes} {...props} ref={ref} />
      );
    }

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
