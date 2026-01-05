import React from 'react';
import { CheckCircle2, AlertCircle, Shuffle } from 'lucide-react';
import { RouteStatus } from '../types';

export function StatusBadge({ status }: { status: RouteStatus }) {
  switch (status) {
    case 'active':
      return <div className="flex items-center text-green-600 text-xs font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full w-fit"><CheckCircle2 className="w-3 h-3 mr-1" />Activa</div>;
    case 'warning':
      return <div className="flex items-center text-amber-600 text-xs font-medium bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full w-fit"><AlertCircle className="w-3 h-3 mr-1" />Revisar</div>;
    case 'inactive':
      return <div className="flex items-center text-neutral-500 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full w-fit"><AlertCircle className="w-3 h-3 mr-1" />Inactiva</div>;
    case 'redirect':
      return <div className="flex items-center text-blue-600 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full w-fit"><Shuffle className="w-3 h-3 mr-1" />Redirect</div>;
  }
}
