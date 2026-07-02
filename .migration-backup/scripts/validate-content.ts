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
const institutions = new Set(getInstitutions().map((i) => i.id));
const paths = getPaths();
const pathIds = new Set(paths.map((p) => p.id));
const categories = getCategories();
const categoryIds = new Set(categories.map((c) => c.id));

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

for (const p of paths) {
  const where = `path ${p.slug}`;
  if (!p.userSituation) errors.push(`${where}: missing userSituation`);
  if (!p.summary) errors.push(`${where}: missing summary`);
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
    [p.summary, p.userSituation, p.body, ...p.whatThisExplains].join("\n"),
  );
}

for (const c of categories) {
  const where = `category ${c.slug}`;
  if (c.owns.length === 0 || c.doesNotOwn.length === 0) {
    errors.push(`${where}: needs both "owns" and "doesNotOwn" scope lists`);
  }
  for (const id of c.pathIds) {
    if (!pathIds.has(id)) errors.push(`${where}: unknown path id ${id}`);
  }
  for (const id of c.institutionIds) {
    if (!institutions.has(id)) errors.push(`${where}: unknown institution id ${id}`);
  }
  checkProhibited(where, [c.description, ...c.owns].join("\n"));
}

for (const t of getGlossaryTerms()) {
  const where = `glossary ${t.slug}`;
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
  checkProhibited(where, t.plainMeaning);
}

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(
  `Content validation passed: ${paths.length} paths, ${categories.length} categories, ${getGlossaryTerms().length} glossary terms, ${sources.length} sources.`,
);
