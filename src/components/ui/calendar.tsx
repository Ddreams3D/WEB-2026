"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

import { Button } from "./button";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface CalendarProps {
  className?: string;
  selected?: Date | DateRange;
  onSelect?: (date: Date | DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
  mode?: "single" | "multiple" | "range";
  initialFocus?: boolean;
  defaultMonth?: Date;
  numberOfMonths?: number;
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, selected, onSelect, disabled, mode = "single", initialFocus, defaultMonth, numberOfMonths = 1, ...props }, ref) => {
    // Inicializar con defaultMonth si existe, o undefined para evitar mismatch
    const [currentDate, setCurrentDate] = React.useState<Date>(defaultMonth || new Date());
    const [selectedDate, setSelectedDate] = React.useState<Date | DateRange | undefined>(selected);
    const [isMounted, setIsMounted] = React.useState(false);

    // Efecto para manejar la fecha actual en el cliente si no hay defaultMonth
    React.useEffect(() => {
      setIsMounted(true);
      if (!defaultMonth) {
        // Actualizar a la fecha actual del cliente para asegurar consistencia visual
        setCurrentDate(new Date());
      }
    }, [defaultMonth]);

    // Si no está montado y no hay fecha por defecto, renderizar null o un estado de carga
    // para evitar mismatch de hidratación con la fecha del servidor
    if (!defaultMonth && !isMounted) {
      return null; 
    }

    const handleDateSelect = (date: Date) => {
      if (disabled && disabled(date)) return;
      
      if (mode === "range") {
        const currentRange = selectedDate as DateRange || {};
        let newRange: DateRange;
        
        if (!currentRange.from || (currentRange.from && currentRange.to)) {
          newRange = { from: date };
        } else if (date < currentRange.from) {
          newRange = { from: date, to: currentRange.from };
        } else {
          newRange = { from: currentRange.from, to: date };
        }
        
        setSelectedDate(newRange);
        onSelect?.(newRange);
      } else {
        setSelectedDate(date);
        onSelect?.(date);
      }
    };

    const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const renderCalendarDays = () => {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const days = [];

      // Empty cells for days before the first day of the month
      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="p-2"></div>);
      }

      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        let isSelected = false;
        let isInRange = false;
        
        if (mode === "range" && selectedDate) {
          const range = selectedDate as DateRange;
          if (range.from && range.to) {
            isSelected = (date.getTime() === range.from.getTime()) || (date.getTime() === range.to.getTime());
            isInRange = date >= range.from && date <= range.to;
          } else if (range.from) {
            isSelected = date.getTime() === range.from.getTime();
          }
        } else if (mode === "single" && selectedDate) {
          const singleDate = selectedDate as Date;
          isSelected = date.getDate() === singleDate.getDate() &&
            date.getMonth() === singleDate.getMonth() &&
            date.getFullYear() === singleDate.getFullYear();
        }
        const isDisabled = disabled && disabled(date);

        days.push(
          <Button
            key={day}
            variant={isSelected ? "gradient" : "ghost"}
            className={cn(
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              isSelected && "text-white hover:text-white",
              isInRange && !isSelected && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
              isDisabled && "opacity-50 cursor-not-allowed",
              !isSelected && !isInRange && "hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => handleDateSelect(date)}
            disabled={isDisabled}
          >
            {day}
          </Button>
        );
      }

      return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(prev.getMonth() - 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
        return newDate;
      });
    };

    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    return (
      <div
        ref={ref}
        className={cn(
          "p-4 bg-white dark:bg-neutral-900 border rounded-lg shadow-sm",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          >
            <span className="sr-only">Previous month</span>
            ←
          </Button>
          <h2 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          >
            <span className="sr-only">Next month</span>
            →
          </Button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-sm font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>
    );
  }
);

Calendar.displayName = "Calendar";

export { Calendar };