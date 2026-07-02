import { useEffect, useState } from "react";
import { Link } from "wouter";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SearchBox } from "@/components/SearchBox";
import { getGlossaryTerms } from "@/lib/content";
import { routes } from "@/lib/routes";
import type { GlossaryTerm } from "@/lib/types";

export default function GlossaryPage({ locale }: { locale: string }) {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);

  useEffect(() => {
    getGlossaryTerms().then(setTerms);
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Glossary
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
          Common Polish bureaucracy terms, explained in plain language. Each
          term links to the explainer pages and official sources where it
          appears. Definitions describe what a term generally means — they are
          not advice about your situation.
        </p>
        <div className="mt-4 max-w-xl">
          <SearchBox locale={locale} large />
        </div>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {terms.map((t) => (
          <li key={t.id}>
            <Link
              href={routes.glossaryTerm(locale, t.slug)}
              className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <span className="font-semibold text-blue-900">{t.term}</span>
              <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                {t.plainMeaning.length > 140
                  ? `${t.plainMeaning.slice(0, 140)}…`
                  : t.plainMeaning}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <DisclaimerBox />
    </div>
  );
}
