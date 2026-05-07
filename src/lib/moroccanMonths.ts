/**
 * Moroccan Arabic (Darija) month names.
 * Standard Arabic uses Middle-Eastern names (سبتمبر، نوفمبر، ديسمبر…)
 * but Moroccan Darija uses its own names (شتنبر، نونبر، دجنبر…).
 */
export const MOROCCAN_MONTHS_AR: readonly string[] = [
  'يناير',   // January
  'فبراير',  // February
  'مارس',    // March
  'أبريل',   // April
  'ماي',     // May
  'يونيو',   // June
  'يوليوز',  // July
  'غشت',     // August
  'شتنبر',   // September
  'أكتوبر',  // October
  'نونبر',   // November
  'دجنبر',   // December
] as const;

export const MOROCCAN_MONTHS_SHORT_AR: readonly string[] = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو',
  'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر',
] as const;

/** Format a Date to "Day MonthName Year" in Moroccan Arabic */
export function formatDateMoroccan(date: Date): string {
  const month = MOROCCAN_MONTHS_AR[date.getMonth()];
  return `${date.getDate()} ${month} ${date.getFullYear()}`;
}

/** Format a Date to "MonthName Year" in Moroccan Arabic */
export function formatMonthYearMoroccan(date: Date): string {
  return `${MOROCCAN_MONTHS_AR[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Returns "MonthName Day" for a given ISO date string (YYYY-MM-DD),
 * using either Moroccan Arabic (locale='ar') or JS locale formatting.
 */
export function formatShortDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (locale === 'ar') {
    return `${d.getDate()} ${MOROCCAN_MONTHS_SHORT_AR[d.getMonth()]}`;
  }
  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}
