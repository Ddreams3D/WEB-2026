import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { fetchThemesFromFirestore, saveThemesToFirestore } from '@/services/seasonal.service';

export async function getSeasonalThemes(): Promise<SeasonalThemeConfig[]> {
  // Now uses Firestore with fallback logic encapsulated in the service
  return await fetchThemesFromFirestore();
}

export async function saveSeasonalThemes(themes: SeasonalThemeConfig[]): Promise<void> {
  // Writes to Firestore
  await saveThemesToFirestore(themes);
}

/**
 * Checks if the current date falls within a specific month/day range.
 * Handles ranges that cross year boundaries (e.g., Dec 20 - Jan 5).
 */
export function isDateInRange(
  date: Date, 
  start: { month: number; day: number }, 
  end: { month: number; day: number }
): boolean {
  const currentMonth = date.getMonth() + 1; // 1-12
  const currentDay = date.getDate(); // 1-31

  const currentValue = currentMonth * 100 + currentDay;
  const startValue = start.month * 100 + start.day;
  const endValue = end.month * 100 + end.day;

  if (startValue <= endValue) {
    // Standard range within same year
    return currentValue >= startValue && currentValue <= endValue;
  } else {
    // Range crossing year boundary
    return currentValue >= startValue || currentValue <= endValue;
  }
}

export async function resolveActiveTheme(overrideDate?: Date): Promise<SeasonalThemeConfig | null> {
  const themes = await getSeasonalThemes();
  const now = overrideDate || new Date();

  // 1. Check for manual overrides (isActive: true)
  // If multiple are active manually, the first one wins (or we could add priority logic)
  const manualOverride = themes.find(t => t.isActive === true);
  if (manualOverride) return manualOverride;

  // 2. Check date ranges
  // We filter all matching themes
  const matchingThemes = themes.filter(theme => {
    // Validate theme has ranges and critical landing data
    if (!theme.dateRanges || theme.dateRanges.length === 0) return false;
    if (!theme.landing || !theme.landing.featuredTag) {
      console.warn(`Theme ${theme.id} is active but missing landing configuration.`);
      return false;
    }
    
    return theme.dateRanges.some(range => 
      isDateInRange(now, range.start, range.end)
    );
  });

  // 3. Resolve conflicts
  // If multiple themes match the date, we could use a 'priority' field if added,
  // or just return the first one found in the list.
  // For now, we return the first match.
  return matchingThemes.length > 0 ? matchingThemes[0] : null;
}
