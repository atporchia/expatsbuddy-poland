import type { Category, GlossaryTerm, Institution, OfficialSource, Path } from "./types";

const BASE = import.meta.env.BASE_URL;

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to fetch ${url}: ${r.status}`);
  return r.json() as Promise<T>;
}

let categoriesCache: Category[] | null = null;
let pathsCache: Path[] | null = null;
let glossaryCache: GlossaryTerm[] | null = null;
let sourcesCache: OfficialSource[] | null = null;
let institutionsCache: Institution[] | null = null;

export async function getCategories(): Promise<Category[]> {
  if (categoriesCache) return categoriesCache;
  const index = await fetchJson<string[]>(`${BASE}content/categories/index.json`);
  const all = await Promise.all(index.map((f) => fetchJson<Category>(`${BASE}content/categories/${f}`)));
  categoriesCache = all.sort((a, b) => a.id.localeCompare(b.id));
  return categoriesCache;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.id === id);
}

export async function getPaths(): Promise<Path[]> {
  if (pathsCache) return pathsCache;
  const index = await fetchJson<string[]>(`${BASE}content/paths/index.json`);
  pathsCache = await Promise.all(index.map((f) => fetchJson<Path>(`${BASE}content/paths/${f}`)));
  return pathsCache;
}

export async function getPathBySlug(slug: string): Promise<Path | undefined> {
  return (await getPaths()).find((p) => p.slug === slug);
}

export async function getPathById(id: string): Promise<Path | undefined> {
  return (await getPaths()).find((p) => p.id === id);
}

export async function getPathsForCategory(categoryId: string): Promise<Path[]> {
  return (await getPaths()).filter((p) => p.categoryId === categoryId);
}

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  if (glossaryCache) return glossaryCache;
  const index = await fetchJson<string[]>(`${BASE}content/glossary/index.json`);
  const all = await Promise.all(index.map((f) => fetchJson<GlossaryTerm>(`${BASE}content/glossary/${f}`)));
  glossaryCache = all.sort((a, b) => a.term.localeCompare(b.term, "pl"));
  return glossaryCache;
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | undefined> {
  return (await getGlossaryTerms()).find((t) => t.slug === slug);
}

export async function getSources(): Promise<OfficialSource[]> {
  if (sourcesCache) return sourcesCache;
  sourcesCache = await fetchJson<OfficialSource[]>(`${BASE}content/sources.json`);
  return sourcesCache;
}

export async function getSourcesByIds(ids: string[]): Promise<OfficialSource[]> {
  const all = await getSources();
  return ids.map((id) => all.find((s) => s.id === id)).filter((s): s is OfficialSource => Boolean(s));
}

export async function getInstitutions(): Promise<Institution[]> {
  if (institutionsCache) return institutionsCache;
  institutionsCache = await fetchJson<Institution[]>(`${BASE}content/institutions.json`);
  return institutionsCache;
}

export async function getInstitutionById(id: string): Promise<Institution | undefined> {
  return (await getInstitutions()).find((i) => i.id === id);
}

export async function getTermsForPath(pathId: string): Promise<GlossaryTerm[]> {
  return (await getGlossaryTerms()).filter((t) => t.relatedPathIds.includes(pathId));
}
