export const LOCALE = "en";

export const routes = {
  home: () => `/`,
  category: (slug: string) => `/categories/${slug}`,
  path: (slug: string) => `/paths/${slug}`,
  glossary: () => `/glossary`,
  glossaryTerm: (slug: string) => `/glossary/${slug}`,
  start: () => `/start`,
};
