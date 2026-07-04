/**
 * Build-time content validation, per PRD §18:
 *  - §18.1 publication checklist (structure, ≥3 official sources, review date)
 *  - §18.2 prohibited-content scan (no advice-like phrases)
 *  - §2.2 official sources must come from approved official domains
 * Fails the build on any violation.
 */
import {
  getCategories,
  getGlossaryTerms,
  getInstitutions,
  getPaths,
  getSources,
} from "../lib/content";
import { LOCALES } from "../lib/routes";

const PROHIBITED_PHRASES = [
  "you are eligible",
  "you should apply",
  "you must submit",
  "you will receive",
  "your deadline is",
  "this document means that your claim will be accepted",
  "this diagnosis qualifies",
  "this insurance policy covers",
  "this appeal will work",
  "avoid deportation",
  "guarantee your zus payment",
  "maximize insurance payout",
  "we know if you qualify",
  "appeal successfully",
];

const OFFICIAL_DOMAINS = [
  "mos.cudzoziemcy.gov.pl",
  "cudzoziemcy.gov.pl",
  "gov.pl",
  "zus.pl",
  "lang.zus.pl",
  "pacjent.gov.pl",
  "psz.praca.gov.pl",
  "lang-psz.praca.gov.pl",
  "praca.gov.pl",
  "rf.gov.pl",
  "archiwum.rf.gov.pl",
  "knf.gov.pl",
];

const errors: string[] = [];

function checkProhibited(where: string, text: string) {
  const lower = text.toLowerCase();
  for (const phrase of PROHIBITED_PHRASES) {
    if (lower.includes(phrase)) {
      errors.push(`${where}: contains prohibited phrase "${phrase}"`);
    }
  }
}

const sources = getSources();
const sourceIds = new Set(sources.map((s) => s.id));

for (const s of sources) {
  const host = new URL(s.url).hostname.replace(/^www\./, "");
  const isOfficial = OFFICIAL_DOMAINS.some(
    (d) => host === d || host.endsWith(`.${d}`),
  );
  if (!isOfficial) {
    errors.push(`source ${s.id}: URL host "${host}" is not an approved official domain`);
  }
  if (!s.lastCheckedAt) errors.push(`source ${s.id}: missing lastCheckedAt`);
  if (!s.title || !s.institution) {
    errors.push(`source ${s.id}: missing title or institution`);
  }
}

for (const locale of LOCALES) {
  const institutions = new Set(getInstitutions(locale).map((i) => i.id));
  const paths = getPaths(locale);
  const pathIds = new Set(paths.map((p) => p.id));
  const categories = getCategories(locale);
  const categoryIds = new Set(categories.map((c) => c.id));

  for (const p of paths) {
    const where = `[${locale}] path ${p.slug}`;
    if (!p.userSituation) errors.push(`${where}: missing userSituation`);
    if (!p.summary) errors.push(`${where}: missing summary`);
    if (!p.briefOverview) errors.push(`${where}: missing briefOverview (page render crashes without it)`);
    if (!p.body?.trim()) errors.push(`${where}: missing plain-language body`);
    if (!p.lastReviewedAt) errors.push(`${where}: missing lastReviewedAt`);
    if (!categoryIds.has(p.categoryId)) {
      errors.push(`${where}: unknown categoryId ${p.categoryId}`);
    }
    if (p.officialSourceIds.length < 3) {
      errors.push(`${where}: has ${p.officialSourceIds.length} official sources, needs at least 3`);
    }
    if (p.whatThisDoesNotDo.length === 0) {
      errors.push(`${where}: missing "what this page does not do" items`);
    }
    if (p.commonTerms.length === 0) errors.push(`${where}: missing glossary terms`);
    if (!p.commonDocuments || p.commonDocuments.length === 0) {
      errors.push(`${where}: missing commonDocuments (page render crashes without it)`);
    }
    if (!p.whoThisIsFor || p.whoThisIsFor.length === 0) {
      errors.push(`${where}: missing whoThisIsFor (page render crashes without it)`);
    }
    if (p.relatedPathIds.length === 0) errors.push(`${where}: missing related paths`);
    if (p.institutions.length === 0) errors.push(`${where}: missing institutions`);
    for (const id of p.officialSourceIds) {
      if (!sourceIds.has(id)) errors.push(`${where}: unknown source id ${id}`);
    }
    for (const id of p.relatedPathIds) {
      if (!pathIds.has(id)) errors.push(`${where}: unknown related path id ${id}`);
    }
    for (const id of p.institutions) {
      if (!institutions.has(id)) errors.push(`${where}: unknown institution id ${id}`);
    }
    checkProhibited(
      where,
      [
        p.summary,
        p.briefOverview,
        p.userSituation,
        p.body,
        ...(p.officialProcessSteps ?? []),
      ].join("\n"),
    );
  }

  for (const c of categories) {
    const where = `[${locale}] category ${c.slug}`;
    if (c.owns.length === 0 || c.doesNotOwn.length === 0) {
      errors.push(`${where}: needs both "owns" and "doesNotOwn" scope lists`);
    }
    if (!c.shortDescription) {
      errors.push(`${where}: missing shortDescription (homepage tile crashes without it)`);
    }
    for (const id of c.pathIds) {
      if (!pathIds.has(id)) errors.push(`${where}: unknown path id ${id}`);
    }
    for (const id of c.institutionIds) {
      if (!institutions.has(id)) errors.push(`${where}: unknown institution id ${id}`);
    }
    checkProhibited(where, [c.description, c.shortDescription, ...c.owns].join("\n"));
  }

  for (const t of getGlossaryTerms(locale)) {
    const where = `[${locale}] glossary ${t.slug}`;
    if (!t.plainMeaning) errors.push(`${where}: missing plainMeaning`);
    for (const id of t.relatedPathIds) {
      if (!pathIds.has(id)) errors.push(`${where}: unknown path id ${id}`);
    }
    for (const id of t.officialSourceIds) {
      if (!sourceIds.has(id)) errors.push(`${where}: unknown source id ${id}`);
    }
    for (const id of t.institutionIds) {
      if (!institutions.has(id)) errors.push(`${where}: unknown institution id ${id}`);
    }
    checkProhibited(
      where,
      [t.plainMeaning, ...(t.officialProcessSteps ?? [])].join("\n"),
    );
  }
}

// Locale parity: every locale must publish the same slugs.
const base = LOCALES[0];
const basePathSlugs = new Set(getPaths(base).map((p) => p.slug));
const baseTermSlugs = new Set(getGlossaryTerms(base).map((t) => t.slug));
const baseCategorySlugs = new Set(getCategories(base).map((c) => c.slug));
for (const locale of LOCALES.slice(1)) {
  const pathSlugs = new Set(getPaths(locale).map((p) => p.slug));
  const termSlugs = new Set(getGlossaryTerms(locale).map((t) => t.slug));
  const categorySlugs = new Set(getCategories(locale).map((c) => c.slug));
  for (const s of basePathSlugs) {
    if (!pathSlugs.has(s)) errors.push(`[${locale}] missing path translation: ${s}`);
  }
  for (const s of pathSlugs) {
    if (!basePathSlugs.has(s)) errors.push(`[${locale}] extra path not in ${base}: ${s}`);
  }
  for (const s of baseTermSlugs) {
    if (!termSlugs.has(s)) errors.push(`[${locale}] missing glossary translation: ${s}`);
  }
  for (const s of baseCategorySlugs) {
    if (!categorySlugs.has(s)) errors.push(`[${locale}] missing category translation: ${s}`);
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  \u2717 ${e}`);
  process.exit(1);
}

console.log(
  `Content validation passed for locales [${LOCALES.join(", ")}]: ` +
    LOCALES.map(
      (l) =>
        `${l}: ${getPaths(l).length} paths / ${getCategories(l).length} categories / ${getGlossaryTerms(l).length} terms`,
    ).join("; ") +
    `; ${sources.length} shared sources.`,
);
