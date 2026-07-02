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

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJsonDir<T>(dir: string): T[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), "utf-8")) as T);
}

let categoriesCache: Category[] | null = null;
let pathsCache: Path[] | null = null;
let glossaryCache: GlossaryTerm[] | null = null;
let sourcesCache: OfficialSource[] | null = null;
let institutionsCache: Institution[] | null = null;

export function getCategories(): Category[] {
  categoriesCache ??= readJsonDir<Category>("categories").sort(
    (a, b) => a.id.localeCompare(b.id),
  );
  return categoriesCache;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return getCategories().find((c) => c.id === id);
}

export function getPaths(): Path[] {
  if (!pathsCache) {
    const dir = path.join(CONTENT_DIR, "paths");
    pathsCache = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => {
        const raw = fs.readFileSync(path.join(dir, f), "utf-8");
        const { data, content } = matter(raw);
        return { ...(data as Omit<Path, "body">), body: content };
      });
  }
  return pathsCache;
}

export function getPathBySlug(slug: string): Path | undefined {
  return getPaths().find((p) => p.slug === slug);
}

export function getPathById(id: string): Path | undefined {
  return getPaths().find((p) => p.id === id);
}

export function getPathsForCategory(categoryId: string): Path[] {
  return getPaths().filter((p) => p.categoryId === categoryId);
}

export function getGlossaryTerms(): GlossaryTerm[] {
  glossaryCache ??= readJsonDir<GlossaryTerm>("glossary").sort((a, b) =>
    a.term.localeCompare(b.term, "pl"),
  );
  return glossaryCache;
}

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return getGlossaryTerms().find((t) => t.slug === slug);
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

export function getInstitutions(): Institution[] {
  if (!institutionsCache) {
    const file = path.join(CONTENT_DIR, "institutions", "institutions.json");
    institutionsCache = JSON.parse(
      fs.readFileSync(file, "utf-8"),
    ) as Institution[];
  }
  return institutionsCache;
}

export function getInstitutionById(id: string): Institution | undefined {
  return getInstitutions().find((i) => i.id === id);
}

/** Glossary terms whose relatedPathIds include the given path. */
export function getTermsForPath(pathId: string): GlossaryTerm[] {
  return getGlossaryTerms().filter((t) => t.relatedPathIds.includes(pathId));
}

/** Documents for the client-side search index. */
export function getSearchDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const c of getCategories()) {
    docs.push({
      id: `category:${c.id}`,
      type: "category",
      slug: c.slug,
      title: c.title,
      text: [c.description, ...c.owns].join(" "),
    });
  }
  for (const p of getPaths()) {
    const category = getCategoryById(p.categoryId);
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
  for (const t of getGlossaryTerms()) {
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
