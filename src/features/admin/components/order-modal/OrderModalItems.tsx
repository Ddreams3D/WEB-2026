import React from 'react';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { Package } from '@/lib/icons';
import { Order } from '@/shared/types/domain';

interface OrderModalItemsProps {
  order: Order;
}

export function OrderModalItems({ order }: OrderModalItemsProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">Productos</h3>
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300">Producto</th>
              <th className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300 text-center">Cant.</th>
              <th className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300 text-right">Precio</th>
              <th className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {order.items.map((item, idx) => (
              <tr key={item.id || idx} className="bg-white dark:bg-neutral-800">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <div className="w-10 h-10 rounded bg-neutral-100 dark:bg-neutral-700 overflow-hidden flex-shrink-0 relative">
                        <ProductImage 
                          src={item.image} 
                          alt={item.name} 
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                         <Package className="w-5 h-5 text-neutral-400" />
                      </div>
                    )}
                    <span className="font-medium text-neutral-900 dark:text-white">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-400">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-neutral-600 dark:text-neutral-400">S/ {item.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-medium text-neutral-900 dark:text-white">S/ {item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
            <tr>
              <td colSpan={3} className="px-4 py-2 text-right text-neutral-600 dark:text-neutral-400">Subtotal:</td>
              <td className="px-4 py-2 text-right font-medium text-neutral-900 dark:text-white">S/ {order.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="px-4 py-2 text-right text-neutral-600 dark:text-neutral-400">Impuestos:</td>
              <td className="px-4 py-2 text-right font-medium text-neutral-900 dark:text-white">S/ {order.tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="px-4 py-2 text-right text-neutral-600 dark:text-neutral-400">Envío:</td>
              <td className="px-4 py-2 text-right font-medium text-neutral-900 dark:text-white">S/ {order.shippingCost.toFixed(2)}</td>
            </tr>
            <tr className="text-lg">
              <td colSpan={3} className="px-4 py-3 text-right font-bold text-neutral-900 dark:text-white">Total:</td>
              <td className="px-4 py-3 text-right font-bold text-primary-600 dark:text-primary-400">S/ {order.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
