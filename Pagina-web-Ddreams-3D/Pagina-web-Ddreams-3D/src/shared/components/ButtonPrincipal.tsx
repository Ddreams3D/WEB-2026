import { Button } from '@/components/ui';
import React, { DetailedHTMLProps, ReactNode } from 'react';

interface PropsButtonPrincipal
  extends DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: ReactNode;
  iconRight?: ReactNode;
  msgLg: string;
  msgSm?: string;
  isLoading?: boolean;
  msgLoading?: string;
  isFull?: boolean;
}

export default function ButtonPrincipal({
  icon,
  iconRight,
  msgSm,
  msgLg,
  isLoading = false,
  msgLoading,
  isFull,
  ...props
}: PropsButtonPrincipal) {
  return (
    <Button
      className={
        'inline-flex items-center px-4 py-4 sm:px-6 sm:py-3 ' +
        'bg-gradient-to-r from-primary-500 to-secondary-500 ' +
        'hover:from-secondary-500 hover:to-primary-500 ' +
        'text-white text-sm sm:text-base ' +
        'rounded-lg font-semibold transition-all duration-300 transform ' +
        'hover:scale-105 shadow-lg hover:shadow-xl ' +
        (isFull ? 'w-full' : '')
      }
      size="lg"
      {...props}
    >
      {isLoading ? (
        <>
          <div
            className="rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 animate-spin"
            aria-hidden="true"
          />
          <span>{msgLoading ? msgLoading : 'Cargando'}</span>
        </>
      ) : (
        <>
          {icon && icon}
          <span className="sm:hidden">{msgSm ? msgSm : msgLg}</span>
          <span className="hidden sm:inline">{msgLg}</span>
          {iconRight && iconRight}
        </>
      )}
    </Button>
  );
}
