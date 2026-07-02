import type {
  Category,
  GlossaryTerm,
  Institution,
  OfficialSource,
  Path,
  SearchDoc,
} from "./types";

const BASE = import.meta.env.BASE_URL;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json() as Promise<T>;
}

const CATEGORY_FILES = [
  "hospitalization-insurance",
  "official-documents",
  "residence-trc",
  "sickness-sick-leave",
  "work-job-loss",
];

const PATH_FILES = [
  "certificate-of-employment",
  "common-official-documents",
  "eu-citizen-registration",
  "family-based-trc",
  "hospital-discharge-document",
  "private-insurance-claim-basics",
  "registering-as-unemployed",
  "rehabilitation-benefit",
  "sick-leave-after-contract-ends",
  "student-trc",
  "unemployment-benefit",
  "work-based-trc",
  "zas-53",
];

const GLOSSARY_FILES = [
  "braki-formalne",
  "decyzja-administracyjna",
  "edm",
  "ekwiwalent-za-urlop",
  "e-skierowanie",
  "e-zla",
  "ikp",
  "karta-informacyjna-leczenia-szpitalnego",
  "karta-pobytu",
  "legalny-pobyt",
  "ol-9",
  "osoba-bezrobotna",
  "osoba-poszukujaca-pracy",
  "pobyt-czasowy-i-praca",
  "polisa",
  "pue-ezus",
  "reklamacja",
  "roszczenie",
  "rozwiazanie-umowy",
  "rzecznik-finansowy",
  "skierowanie",
  "sor",
  "stempel-w-paszporcie",
  "swiadczenie-rehabilitacyjne",
  "swiadectwo-pracy",
  "urzad-pracy",
  "urzad-wojewodzki",
  "wojewoda",
  "wypis-ze-szpitala",
  "wypowiedzenie",
  "z-10",
  "z-3",
  "zas-53",
  "zasilek-chorobowy",
  "zasilek-dla-bezrobotnych",
  "zezwolenie-na-pobyt-czasowy",
  "znp-7",
  "zus",
];

let _categories: Category[] | null = null;
export async function getCategories(): Promise<Category[]> {
  if (_categories) return _categories;
  const results = await Promise.all(
    CATEGORY_FILES.map((f) =>
      fetchJson<Category>(`${BASE}content/categories/${f}.json`),
    ),
  );
  _categories = results.sort((a, b) => a.id.localeCompare(b.id));
  return _categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const cats = await getCategories();
  return cats.find((c) => c.id === id);
}

let _paths: Path[] | null = null;
export async function getPaths(): Promise<Path[]> {
  if (_paths) return _paths;
  const results = await Promise.all(
    PATH_FILES.map((f) =>
      fetchJson<Path>(`${BASE}content/paths/${f}.json`),
    ),
  );
  _paths = results;
  return _paths;
}

export async function getPathBySlug(slug: string): Promise<Path | undefined> {
  const paths = await getPaths();
  return paths.find((p) => p.slug === slug);
}

export async function getPathById(id: string): Promise<Path | undefined> {
  const paths = await getPaths();
  return paths.find((p) => p.id === id);
}

export async function getPathsForCategory(categoryId: string): Promise<Path[]> {
  const paths = await getPaths();
  return paths.filter((p) => p.categoryId === categoryId);
}

let _glossary: GlossaryTerm[] | null = null;
export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  if (_glossary) return _glossary;
  const results = await Promise.all(
    GLOSSARY_FILES.map((f) =>
      fetchJson<GlossaryTerm>(`${BASE}content/glossary/${f}.json`),
    ),
  );
  _glossary = results.sort((a, b) => a.term.localeCompare(b.term, "pl"));
  return _glossary;
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | undefined> {
  const terms = await getGlossaryTerms();
  return terms.find((t) => t.slug === slug);
}

let _sources: OfficialSource[] | null = null;
export async function getSources(): Promise<OfficialSource[]> {
  if (_sources) return _sources;
  _sources = await fetchJson<OfficialSource[]>(`${BASE}content/sources/sources.json`);
  return _sources;
}

export async function getSourceById(id: string): Promise<OfficialSource | undefined> {
  const sources = await getSources();
  return sources.find((s) => s.id === id);
}

export async function getSourcesByIds(ids: string[]): Promise<OfficialSource[]> {
  const sources = await getSources();
  return ids
    .map((id) => sources.find((s) => s.id === id))
    .filter(Boolean) as OfficialSource[];
}

let _institutions: Institution[] | null = null;
export async function getInstitutions(): Promise<Institution[]> {
  if (_institutions) return _institutions;
  _institutions = await fetchJson<Institution[]>(`${BASE}content/institutions/institutions.json`);
  return _institutions;
}

export async function getInstitutionById(id: string): Promise<Institution | undefined> {
  const institutions = await getInstitutions();
  return institutions.find((i) => i.id === id);
}

export async function getTermsForPath(pathId: string): Promise<GlossaryTerm[]> {
  const terms = await getGlossaryTerms();
  return terms.filter((t) => t.relatedPathIds.includes(pathId));
}

export async function getSearchDocs(): Promise<SearchDoc[]> {
  const [categories, paths, terms] = await Promise.all([
    getCategories(),
    getPaths(),
    getGlossaryTerms(),
  ]);
  const docs: SearchDoc[] = [];
  for (const c of categories) {
    docs.push({
      id: `category:${c.id}`,
      type: "category",
      slug: c.slug,
      title: c.title,
      text: [c.description, ...c.owns].join(" "),
    });
  }
  for (const p of paths) {
    const category = categories.find((c) => c.id === p.categoryId);
    docs.push({
      id: `path:${p.id}`,
      type: "path",
      slug: p.slug,
      title: p.title,
      categoryTitle: category?.title,
      text: [
        p.userSituation,
        p.summary,
        ...(p.commonTerms ?? []),
        ...(p.commonDocuments ?? []),
      ].join(" "),
    });
  }
  for (const t of terms) {
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
