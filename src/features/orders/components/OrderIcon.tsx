import React from 'react';
import { FileText, Clock, CheckCircle, Factory, PackageCheck, Truck, XCircle, RefreshCw, Package } from '@/lib/icons';
import { OrderStatus } from '@/shared/types/domain';

export function OrderIcon({ status, className = "h-4 w-4" }: { status: OrderStatus; className?: string }) {
  switch (status) {
    case 'quote_requested':
      return <FileText className={`text-gray-500 ${className}`} />;
    case 'pending_payment':
      return <Clock className={`text-yellow-500 ${className}`} />;
    case 'paid':
      return <CheckCircle className={`text-blue-500 ${className}`} />;
    case 'processing':
      return <Factory className={`text-purple-500 ${className}`} />;
    case 'ready':
      return <PackageCheck className={`text-indigo-500 ${className}`} />;
    case 'shipped':
      return <Truck className={`text-blue-600 ${className}`} />;
    case 'completed':
      return <CheckCircle className={`text-green-500 ${className}`} />;
    case 'cancelled':
      return <XCircle className={`text-red-500 ${className}`} />;
    case 'refunded':
      return <RefreshCw className={`text-gray-500 ${className}`} />;
    default:
      return <Package className={`text-gray-500 ${className}`} />;
  }
}
