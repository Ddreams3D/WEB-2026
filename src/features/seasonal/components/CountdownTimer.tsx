'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  variant?: 'default' | 'halloween';
}

export const CountdownTimer = ({ targetDate, className, variant = 'default' }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const isHalloween = variant === 'halloween';

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

  const TimeBlock = ({ value, label, delay }: { value: number, label: string, delay: number }) => (
    <div 
        className="flex flex-col items-center mx-2 md:mx-4"
        style={{ animationDelay: `${delay * 0.5}s` }} // Desync jitter per block
    >
      <div className={cn(
        "backdrop-blur-md border rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[90px] text-center relative overflow-hidden group transition-all duration-300",
        isHalloween 
            ? "bg-[#0a0502] border-rusty animate-jitter" 
            : "bg-neutral-900/80 border-rose-500/20 shadow-[0_0_15px_-3px_rgba(225,29,72,0.1)]"
      )}>
        {/* Grime/Dirt Overlay for Halloween */}
        {isHalloween && <div className="absolute inset-0 grime-overlay z-20" />}
        {isHalloween && <div className="absolute inset-0 vignette-dirt z-10" />}

        <div className={cn(
            "absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity z-0",
            isHalloween ? "from-orange-900/20 to-transparent" : "from-rose-500/5 to-transparent"
        )} />
        
        <span 
            className={cn(
                "text-2xl md:text-4xl font-bold tabular-nums block drop-shadow-sm relative z-30",
                isHalloween 
                    ? "text-orange-600/90 font-mono tracking-widest animate-flicker-dying" 
                    : "text-rose-500"
            )}
            style={isHalloween ? { animationDelay: `${delay * 1.2}s` } : {}} // Desync flicker
        >
          {String(value).padStart(2, '0')}
        </span>
        
        {/* Scanline for Halloween */}
        {isHalloween && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent h-[2px] w-full animate-scanline opacity-30 pointer-events-none z-40" />
        )}
      </div>
      <span className={cn(
          "text-xs md:text-sm mt-2 font-medium uppercase tracking-wider",
          isHalloween ? "text-orange-900/60 font-serif italic" : "text-rose-900/70"
      )}>
        {label}
      </span>
    </div>
  );

  return (
    <div className={cn(
        "inline-flex justify-center items-start py-8 px-8 md:px-12 backdrop-blur-sm rounded-3xl border relative",
        isHalloween 
            ? "bg-black/60 border-orange-900/30 shadow-[0_0_50px_-10px_rgba(249,115,22,0.15)]" 
            : "bg-white/5 border-rose-900/5 shadow-[0_0_40px_-10px_rgba(225,29,72,0.1)]",
        className
    )}>
      <div className={cn(
          "absolute inset-0 bg-gradient-to-b rounded-3xl opacity-50 pointer-events-none",
          isHalloween ? "from-orange-900/10 to-transparent" : "from-white/40 to-transparent"
      )} />
      
      {/* Global Vertical Scanline for Halloween */}
      {isHalloween && (
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none z-10">
             <div className="w-full h-[40%] bg-gradient-to-b from-transparent via-orange-500/10 to-transparent animate-scanline-vertical opacity-20" />
        </div>
      )}
      
      <TimeBlock value={timeLeft.days} label="Días" delay={0} />
      <div className={cn(
          "text-2xl md:text-4xl font-bold mt-4",
          isHalloween ? "text-orange-600/50 animate-pulse" : "text-rose-300/50 animate-pulse"
      )}>:</div>
      <TimeBlock value={timeLeft.hours} label="Horas" delay={1} />
      <div className={cn(
          "text-2xl md:text-4xl font-bold mt-4",
          isHalloween ? "text-orange-600/50 animate-pulse" : "text-rose-300/50 animate-pulse"
      )}>:</div>
      <TimeBlock value={timeLeft.minutes} label="Min" delay={2} />
      <div className={cn(
          "text-2xl md:text-4xl font-bold mt-4",
          isHalloween ? "text-orange-600/50 animate-pulse" : "text-rose-300/50 animate-pulse"
      )}>:</div>
      <TimeBlock value={timeLeft.seconds} label="Seg" delay={3} />
    </div>
  );
};
