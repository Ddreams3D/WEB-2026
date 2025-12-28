import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const icons = {
  default: "w-5 h-5",
  small: "w-4 h-4",
  large: "w-6 h-6",
  xl: "w-8 h-8",
  md: "w-5 h-5",
};

export const getIconClasses = (size: keyof typeof icons = 'default', className?: string) => {
  return cn(icons[size], className);
};

export const getIconContainerClasses = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary') => {
  const base = "p-2 rounded-full flex items-center justify-center transition-colors";
  const variants = {
    primary: "bg-primary/10 text-primary hover:bg-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  return cn(base, variants[variant]);
};

export const getContextualIconClasses = (context: 'success' | 'warning' | 'error' | 'info') => {
  const variants = {
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
    info: "text-blue-500",
  };
  return variants[context];
};

export const getSocialIconClasses = () => {
  return "text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent";
};

export const commonIconClasses = {
  base: "w-5 h-5 shrink-0",
};
