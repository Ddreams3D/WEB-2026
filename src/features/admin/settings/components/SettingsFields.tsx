import React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface InputFieldProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function InputField({ label, type = 'text', value, onChange, placeholder, description, icon: Icon }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full px-3 py-2.5 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none placeholder:text-muted-foreground/50",
            Icon && "pl-10"
          )}
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  description?: string;
}

export function SelectField({ label, value, onChange, options, description }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}

export function ToggleField({ label, value, onChange, description }: ToggleFieldProps) {
  return (
    <div className={cn(
      "flex items-start justify-between p-4 rounded-xl border transition-all duration-200",
      value 
        ? "bg-primary/5 border-primary/20" 
        : "bg-background border-border hover:border-muted-foreground/20"
    )}>
      <div className="flex-1 mr-4">
        <label className="block text-sm font-semibold text-foreground cursor-pointer" onClick={() => onChange(!value)}>
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
      />
    </div>
  );
}
