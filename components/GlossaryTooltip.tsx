import Link from "next/link";
import { getGlossaryTerms } from "@/lib/content";
import { routes, type Locale } from "@/lib/routes";

/**
 * Renders a term as a link to its glossary page when a matching glossary
 * entry exists, with the plain-language meaning as a hover tooltip.
 * Falls back to plain text when the term is not in the glossary.
 */
export function GlossaryTooltip({
  term,
  locale,
}: {
  term: string;
  locale: string;
}) {
  const needle = term.toLowerCase();
  const terms = getGlossaryTerms(locale as Locale);
  // Exact match first; fall back to matching the parenthetical original
  // (e.g. commonTerms "rozwiązanie umowy" against a glossary term field of
  // "Розірвання договору (rozwiązanie umowy)") so bilingual display titles
  // don't break links from path/category pages still using the bare term.
  const entry =
    terms.find((t) => t.term.toLowerCase() === needle) ??
    terms.find((t) => t.term.toLowerCase().includes(`(${needle})`));
  if (!entry) {
    return <span className="text-slate-700">{term}</span>;
  }
  return (
    <Link
      href={routes.glossaryTerm(locale, entry.slug)}
      title={entry.plainMeaning}
      className="rounded text-blue-800 underline decoration-dotted underline-offset-4 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      {term}
    </Link>
  );
}

export function TermChips({ terms, locale }: { terms: string[]; locale: string }) {
  return (
    <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
      {terms.map((term) => (
        <li
          key={term}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm"
        >
          <GlossaryTooltip term={term} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
