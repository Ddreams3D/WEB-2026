import React from 'react';
import { Product } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { cn } from '@/lib/utils';
import { Star, Check } from 'lucide-react';

interface ProductTabsProps {
  product: Product | Service;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export function ProductTabs({ product, activeTab, setActiveTab }: ProductTabsProps) {
  if (!product.tabs || product.tabs.length === 0) return null;

  const tabsWithContent = product.tabs.filter(tab => {
    const hasDescription = typeof tab.description === 'string' && tab.description.trim().length > 0;
    const hasFeatures = Array.isArray(tab.features) && tab.features.length > 0;
    return hasDescription || hasFeatures;
  });

  if (tabsWithContent.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Micro-copy encima de las tabs */}
      {product.tabsTitle && (
        <p className="text-sm font-bold uppercase tracking-wide text-foreground mb-3 text-center">
          {product.tabsTitle}
        </p>
      )}

      {/* Selector de Tabs */}
      <div className="flex space-x-3 rounded-xl bg-transparent p-1">
        {tabsWithContent.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-xl py-3 px-4 text-sm font-bold tracking-wide uppercase transition-all duration-300",
              activeTab === tab.id
                ? cn("text-primary-foreground shadow-lg scale-[1.02]", "bg-primary")
                : "bg-transparent text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de Tabs */}
      {tabsWithContent.map((tab) => {
        const hasDescription = typeof tab.description === 'string' && tab.description.trim().length > 0;
        const hasFeatures = Array.isArray(tab.features) && tab.features.length > 0;

        return (
        <div
          key={tab.id}
          className={cn(
            "space-y-6 animate-in fade-in slide-in-from-top-2 duration-300",
            activeTab === tab.id ? "block" : "hidden"
          )}
        >
          {hasDescription && (
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-line">{tab.description}</p>
            </div>
          )}

          {hasFeatures && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/10 md:col-span-2">
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Características
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {tab.features?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-primary/80">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )})}
    </div>
  );
}
