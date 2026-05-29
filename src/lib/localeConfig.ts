// Shared locale configuration (no use server/client directive).
// Must stay in sync with src/i18n/request.ts — both default to 'fr'
// because French is the primary acquisition locale for Moroccan students.
export const locales = ['fr', 'ar', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';
export const COOKIE_NAME = 'NEXT_LOCALE';
