import type { MetadataRoute } from "next";
import { getCategories, getGlossaryTerms, getPaths } from "@/lib/content";
import { LOCALES, routes } from "@/lib/routes";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://expatsbuddy-poland.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    entries.push(
      { url: `${BASE_URL}${routes.home(locale)}`, priority: 1 },
      { url: `${BASE_URL}${routes.glossary(locale)}`, priority: 0.8 },
      { url: `${BASE_URL}${routes.start(locale)}`, priority: 0.8 },
    );
    for (const c of getCategories(locale)) {
      entries.push({
        url: `${BASE_URL}${routes.category(locale, c.slug)}`,
        priority: 0.9,
      });
    }
    for (const p of getPaths(locale)) {
      entries.push({
        url: `${BASE_URL}${routes.path(locale, p.slug)}`,
        lastModified: p.lastReviewedAt,
        priority: 0.9,
      });
    }
    for (const t of getGlossaryTerms(locale)) {
      entries.push({
        url: `${BASE_URL}${routes.glossaryTerm(locale, t.slug)}`,
        priority: 0.6,
      });
    }
  }
  return entries;
}
