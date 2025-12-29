import React from 'react';
import { Product } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';
import { Star, Check } from 'lucide-react';

interface ProductTabsProps {
  product: Product | Service;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export function ProductTabs({ product, activeTab, setActiveTab }: ProductTabsProps) {
  if (!product.tabs) return null;

  return (
    <div className="space-y-6">
      {/* Micro-copy encima de las tabs */}
      {product.tabsTitle && (
        <p className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-white mb-3 text-center">
          {product.tabsTitle}
        </p>
      )}

      {/* Selector de Tabs */}
      <div className="flex space-x-3 rounded-xl bg-transparent p-1">
        {product.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-xl py-3 px-4 text-sm font-bold tracking-wide uppercase transition-all duration-300",
              activeTab === tab.id
                ? cn("text-white shadow-lg scale-[1.02]", colors.gradients.primary, colors.gradients.primaryHover)
                : "bg-transparent text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de Tabs */}
      {product.tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "space-y-6 animate-in fade-in slide-in-from-top-2 duration-300",
            activeTab === tab.id ? "block" : "hidden"
          )}
        >
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
            <p className="whitespace-pre-line">{tab.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/20">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" /> Ideal para
              </h3>
              <ul className="space-y-2">
                {tab.idealFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Check className="w-4 h-4" /> Condiciones
              </h3>
              <ul className="space-y-2">
                {tab.conditions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
