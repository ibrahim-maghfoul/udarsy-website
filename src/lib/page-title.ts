import { getLocale } from 'next-intl/server';

type Locale = 'ar' | 'fr' | 'en';

export async function pageTitle(titles: Record<Locale, string>): Promise<string> {
  const locale = (await getLocale()) as Locale;
  return titles[locale] ?? titles.ar;
}
