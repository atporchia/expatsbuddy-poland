import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  Category,
  GlossaryTerm,
  Institution,
  OfficialSource,
  Path,
  SearchDoc,
} from "./types";
import { DEFAULT_LOCALE, type Locale } from "./routes";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJsonDir<T>(locale: string, dir: string): T[] {
  const full = path.join(CONTENT_DIR, locale, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), "utf-8")) as T);
}

const categoriesCache = new Map<string, Category[]>();
const pathsCache = new Map<string, Path[]>();
const glossaryCache = new Map<string, GlossaryTerm[]>();
const institutionsCache = new Map<string, Institution[]>();
let sourcesCache: OfficialSource[] | null = null;

export function getCategories(locale: Locale = DEFAULT_LOCALE): Category[] {
  if (!categoriesCache.has(locale)) {
    categoriesCache.set(
      locale,
      readJsonDir<Category>(locale, "categories").sort((a, b) =>
        a.id.localeCompare(b.id),
      ),
    );
  }
  return categoriesCache.get(locale)!;
}

export function getCategoryBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Category | undefined {
  return getCategories(locale).find((c) => c.slug === slug);
}

export function getCategoryById(
  id: string,
  locale: Locale = DEFAULT_LOCALE,
): Category | undefined {
  return getCategories(locale).find((c) => c.id === id);
}

export function getPaths(locale: Locale = DEFAULT_LOCALE): Path[] {
  if (!pathsCache.has(locale)) {
    const dir = path.join(CONTENT_DIR, locale, "paths");
    const paths = !fs.existsSync(dir)
      ? []
      : fs
          .readdirSync(dir)
          .filter((f) => f.endsWith(".mdx"))
          .map((f) => {
            const raw = fs.readFileSync(path.join(dir, f), "utf-8");
            const { data, content } = matter(raw);
            return { ...(data as Omit<Path, "body">), body: content };
          });
    pathsCache.set(locale, paths);
  }
  return pathsCache.get(locale)!;
}

export function getPathBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Path | undefined {
  return getPaths(locale).find((p) => p.slug === slug);
}

export function getPathById(
  id: string,
  locale: Locale = DEFAULT_LOCALE,
): Path | undefined {
  return getPaths(locale).find((p) => p.id === id);
}

export function getPathsForCategory(
  categoryId: string,
  locale: Locale = DEFAULT_LOCALE,
): Path[] {
  const order = getCategoryById(categoryId, locale)?.pathIds ?? [];
  return getPaths(locale)
    .filter((p) => p.categoryId === categoryId)
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

export function getGlossaryTerms(
  locale: Locale = DEFAULT_LOCALE,
): GlossaryTerm[] {
  if (!glossaryCache.has(locale)) {
    glossaryCache.set(
      locale,
      readJsonDir<GlossaryTerm>(locale, "glossary").sort((a, b) =>
        a.term.localeCompare(b.term, "pl"),
      ),
    );
  }
  return glossaryCache.get(locale)!;
}

export function getGlossaryTermBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): GlossaryTerm | undefined {
  return getGlossaryTerms(locale).find((t) => t.slug === slug);
}

export function getSources(): OfficialSource[] {
  if (!sourcesCache) {
    const file = path.join(CONTENT_DIR, "sources", "sources.json");
    sourcesCache = JSON.parse(fs.readFileSync(file, "utf-8")) as OfficialSource[];
  }
  return sourcesCache;
}

export function getSourceById(id: string): OfficialSource | undefined {
  return getSources().find((s) => s.id === id);
}

export function getSourcesByIds(ids: string[]): OfficialSource[] {
  return ids
    .map((id) => getSourceById(id))
    .filter((s): s is OfficialSource => Boolean(s));
}

export function getInstitutions(
  locale: Locale = DEFAULT_LOCALE,
): Institution[] {
  if (!institutionsCache.has(locale)) {
    const file = path.join(CONTENT_DIR, locale, "institutions.json");
    institutionsCache.set(
      locale,
      fs.existsSync(file)
        ? (JSON.parse(fs.readFileSync(file, "utf-8")) as Institution[])
        : [],
    );
  }
  return institutionsCache.get(locale)!;
}

export function getInstitutionById(
  id: string,
  locale: Locale = DEFAULT_LOCALE,
): Institution | undefined {
  return getInstitutions(locale).find((i) => i.id === id);
}

/** Glossary terms whose relatedPathIds include the given path. */
export function getTermsForPath(
  pathId: string,
  locale: Locale = DEFAULT_LOCALE,
): GlossaryTerm[] {
  return getGlossaryTerms(locale).filter((t) =>
    t.relatedPathIds.includes(pathId),
  );
}

/**
 * "How to do this" steps for a glossary term page. Prefers the term's own
 * officialProcessSteps (standalone forms/documents with no dedicated Path,
 * e.g. Z-10); otherwise borrows steps from the first related Path that has
 * them, so a single Path's steps stay the one source of truth instead of
 * being copied into every glossary term that mentions it.
 */
export function getProcessStepsForTerm(
  term: GlossaryTerm,
  locale: Locale = DEFAULT_LOCALE,
): { steps: string[]; borrowedFrom: Path | null } | null {
  if (term.officialProcessSteps && term.officialProcessSteps.length > 0) {
    return { steps: term.officialProcessSteps, borrowedFrom: null };
  }
  for (const pathId of term.relatedPathIds) {
    const path = getPathById(pathId, locale);
    if (path?.officialProcessSteps && path.officialProcessSteps.length > 0) {
      return { steps: path.officialProcessSteps, borrowedFrom: path };
    }
  }
  return null;
}

/** Documents for the client-side search index. */
export function getSearchDocs(locale: Locale = DEFAULT_LOCALE): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const c of getCategories(locale)) {
    docs.push({
      id: `category:${c.id}`,
      type: "category",
      slug: c.slug,
      title: c.title,
      text: [c.description, ...c.owns].join(" "),
    });
  }
  for (const p of getPaths(locale)) {
    const category = getCategoryById(p.categoryId, locale);
    docs.push({
      id: `path:${p.id}`,
      type: "path",
      slug: p.slug,
      title: p.title,
      categoryTitle: category?.title,
      text: [
        p.userSituation,
        p.summary,
        ...p.commonTerms,
        ...p.commonDocuments,
      ].join(" "),
    });
  }
  for (const t of getGlossaryTerms(locale)) {
    docs.push({
      id: `glossary:${t.id}`,
      type: "glossary",
      slug: t.slug,
      title: t.term,
      text: t.plainMeaning,
    });
  }
  return docs;
}
