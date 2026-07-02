export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const routes = {
  home: (locale: string) => `/${locale}`,
  category: (locale: string, slug: string) => `/${locale}/categories/${slug}`,
  path: (locale: string, slug: string) => `/${locale}/paths/${slug}`,
  glossary: (locale: string) => `/${locale}/glossary`,
  glossaryTerm: (locale: string, slug: string) => `/${locale}/glossary/${slug}`,
  start: (locale: string) => `/${locale}/start`,
  search: (locale: string) => `/${locale}/search`,
};
