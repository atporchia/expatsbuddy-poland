import { useEffect, useState } from "react";
import { Link } from "wouter";
import type { GlossaryTerm } from "@/lib/types";
import { getGlossaryTerms } from "@/lib/content";
import { routes } from "@/lib/routes";

let glossaryCache: GlossaryTerm[] | null = null;

export function useGlossaryTerms() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  useEffect(() => {
    if (glossaryCache) { setTerms(glossaryCache); return; }
    getGlossaryTerms().then((t) => { glossaryCache = t; setTerms(t); });
  }, []);
  return terms;
}

export function GlossaryTooltip({ term, glossaryTerms }: { term: string; glossaryTerms: GlossaryTerm[] }) {
  const entry = glossaryTerms.find((t) => t.term.toLowerCase() === term.toLowerCase());
  if (!entry) {
    return <span className="text-slate-700">{term}</span>;
  }
  return (
    <Link
      href={routes.glossaryTerm(entry.slug)}
      title={entry.plainMeaning}
      className="rounded text-blue-800 underline decoration-dotted underline-offset-4 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      {term}
    </Link>
  );
}

export function TermChips({ terms }: { terms: string[] }) {
  const glossaryTerms = useGlossaryTerms();
  return (
    <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
      {terms.map((term) => (
        <li
          key={term}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm"
        >
          <GlossaryTooltip term={term} glossaryTerms={glossaryTerms} />
        </li>
      ))}
    </ul>
  );
}
