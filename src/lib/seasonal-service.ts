import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { fetchThemesFromFirestore, saveThemesToFirestore, fetchSeasonalConfig } from '@/services/seasonal.service';

// Re-export fetchSeasonalConfig for use in other components
export { fetchSeasonalConfig };

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

export const STANDARD_THEME: SeasonalThemeConfig = {
  id: 'standard',
  themeId: 'standard',
  name: 'Estándar',
  isActive: true,
  dateRanges: [],
  landing: {
    heroTitle: "Tus ideas. Nuestro arte. En 3D.",
    heroDescription: "Fabricación de prototipos, trofeos y piezas personalizadas con tecnología 3D.",
    ctaText: "Descubre como podemos ayudarte.",
    ctaLink: "/services",
    featuredTag: "destacado",
    themeMode: 'light'
  }
};

export async function resolveActiveTheme(overrideDate?: Date): Promise<SeasonalThemeConfig> {
  const [themes, config] = await Promise.all([
    getSeasonalThemes(),
    fetchSeasonalConfig()
  ]);
  const now = overrideDate || new Date();

  // Find the database version of Standard theme, or fallback to code constant if missing
  const dbStandard = themes.find(t => t.id === 'standard') || STANDARD_THEME;

  // 1. Check for manual overrides (isActive: true)
  // This respects the user's manual activation switch in Admin
  const manualOverride = themes.find(t => t.isActive === true);
  if (manualOverride) {
    console.log('[Seasonal] Tema activado manualmente:', manualOverride.id);
    return manualOverride;
  }

  // 2. Check global automation setting
  if (!config.automationEnabled) {
    // If automation is OFF, and no manual override, return the DB Standard theme
    console.log('[Seasonal] Automatización desactivada, usando standard');
    return dbStandard;
  }

  // 3. Check date ranges (Only if Automation is ON)
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

  // 4. Resolve conflicts
  return matchingThemes.length > 0 ? matchingThemes[0] : dbStandard;
}

/**
 * Returns specifically the Standard theme content (from DB or fallback).
 * Used for Home Page content which should NOT change with seasonal campaigns.
 */
export async function getStandardThemeContent(): Promise<SeasonalThemeConfig> {
  const themes = await getSeasonalThemes();
  return themes.find(t => t.id === 'standard') || STANDARD_THEME;
}
