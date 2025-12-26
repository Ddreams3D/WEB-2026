"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

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
    const [currentDate, setCurrentDate] = React.useState(defaultMonth || new Date());
    const [selectedDate, setSelectedDate] = React.useState<Date | DateRange | undefined>(selected);

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
          <button
            key={day}
            type="button"
            className={cn(
              "p-2 text-sm rounded hover:bg-gray-100 transition-colors",
              isSelected && "bg-blue-500 text-white hover:bg-blue-600",
              isInRange && !isSelected && "bg-blue-100",
              isDisabled && "opacity-50 cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
            onClick={() => handleDateSelect(date)}
            disabled={isDisabled}
          >
            {day}
          </button>
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
          "p-4 bg-white border rounded-lg shadow-sm",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            type="button"
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            →
          </button>
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