import { SeasonalThemeConfig, DateRange } from '@/shared/types/seasonal';

export const MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export const isDateActive = (ranges: DateRange[]) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const current = currentMonth * 100 + currentDay;

  return ranges.some(range => {
    const start = range.start.month * 100 + range.start.day;
    const end = range.end.month * 100 + range.end.day;

    if (start <= end) {
      return current >= start && current <= end;
    } else {
      // Cruza año (ej: Dic a Ene)
      return current >= start || current <= end;
    }
  });
};

export const getThemeStatus = (theme: SeasonalThemeConfig) => {
  if (theme.isActive) return 'manual'; // Forzado manual
  if (isDateActive(theme.dateRanges)) return 'auto'; // Activo por fecha
  return 'inactive';
};

// Timeline helpers
export const getLeftPercent = (month: number, day: number) => {
  // Aprox: (Month-1)/12 + (Day/31)/12
  return ((month - 1) / 12 * 100) + ((day / 31) / 12 * 100);
};

export const getWidthPercent = (start: {month: number, day: number}, end: {month: number, day: number}) => {
  let startP = getLeftPercent(start.month, start.day);
  let endP = getLeftPercent(end.month, end.day);
  
  if (endP < startP) {
    // Crosses year boundary (e.g. Dec to Jan)
    return 100 - startP; 
  }
  return endP - startP;
};
