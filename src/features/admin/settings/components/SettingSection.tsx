import React from 'react';

interface SettingSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  children: React.ReactNode;
}

export function SettingSection({ title, icon: Icon, description, children }: SettingSectionProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-start space-x-4">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary flex-shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
