'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function RealtimeClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="flex flex-col items-end leading-tight text-right">
      <div className="text-sm font-semibold text-foreground tabular-nums flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-primary" />
        {time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="text-xs text-muted-foreground font-medium capitalize">
        {time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
    </div>
  );
}
