import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getGlossaryTerms } from "@/lib/content";
import { routes } from "@/lib/routes";
import type { GlossaryTerm } from "@/lib/types";

export function GlossaryTooltip({
  term,
  locale,
}: {
  term: string;
  locale: string;
}) {
  const [entry, setEntry] = useState<GlossaryTerm | undefined>();

  useEffect(() => {
    getGlossaryTerms()
      .then((terms) =>
        terms.find((t) => t.term.toLowerCase() === term.toLowerCase()),
      )
      .then(setEntry)
      .catch(() => {});
  }, [term]);

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
