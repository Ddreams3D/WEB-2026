'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

export const CountdownTimer = ({ targetDate, className }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeBlock = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="bg-neutral-900/80 backdrop-blur-md border border-rose-500/20 rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[90px] text-center shadow-[0_0_15px_-3px_rgba(225,29,72,0.1)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-2xl md:text-4xl font-bold text-rose-500 tabular-nums block drop-shadow-sm">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm text-rose-900/70 mt-2 font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className={cn("inline-flex justify-center items-start py-8 px-8 md:px-12 bg-white/5 backdrop-blur-sm rounded-3xl border border-rose-900/5 shadow-[0_0_40px_-10px_rgba(225,29,72,0.1)] relative", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-3xl opacity-50 pointer-events-none" />
      <TimeBlock value={timeLeft.days} label="Días" />
      <div className="text-2xl md:text-4xl font-bold text-rose-300/50 mt-4 animate-pulse">:</div>
      <TimeBlock value={timeLeft.hours} label="Horas" />
      <div className="text-2xl md:text-4xl font-bold text-rose-300/50 mt-4 animate-pulse">:</div>
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <div className="text-2xl md:text-4xl font-bold text-rose-300/50 mt-4 animate-pulse">:</div>
      <TimeBlock value={timeLeft.seconds} label="Seg" />
    </div>
  );
};
