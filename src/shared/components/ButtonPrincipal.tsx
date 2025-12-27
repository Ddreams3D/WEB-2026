import { Button } from '@/components/ui';
import React, { DetailedHTMLProps, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
  href?: string;
  asChild?: boolean;
  target?: string;
  rel?: string;
}

export default function ButtonPrincipal({
  icon,
  iconRight,
  msgSm,
  msgLg,
  isLoading = false,
  msgLoading,
  isFull,
  href,
  asChild,
  target,
  rel,
  className,
  ...props
}: PropsButtonPrincipal) {
  const content = isLoading ? (
    <>
      <div
        className="rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white animate-spin"
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
  );

  const buttonClasses = cn(
    "gap-2 px-4 py-4 sm:px-6 sm:py-3",
    isFull && "w-full",
    className
  );

  if (href) {
    return (
      <Button
        variant="gradient"
        size="lg"
        asChild
        className={buttonClasses}
        {...props}
      >
        <Link href={href} target={target} rel={rel} className="flex flex-row items-center justify-center gap-2 w-full h-full">
          {content}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="gradient"
      size="lg"
      asChild={asChild}
      className={buttonClasses}
      {...props}
    >
      {content}
    </Button>
  );
}
