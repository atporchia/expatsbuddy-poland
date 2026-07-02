import { useEffect, useState } from "react";
import { Link } from "wouter";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { InstitutionList } from "@/components/InstitutionBadge";
import { RelatedPaths } from "@/components/RelatedPaths";
import { SourceCardList } from "@/components/SourceCard";
import {
  getGlossaryTermBySlug,
  getSourcesByIds,
} from "@/lib/content";
import { routes } from "@/lib/routes";
import type { GlossaryTerm, OfficialSource } from "@/lib/types";

export default function GlossaryTermPage({
  locale,
  termSlug,
}: {
  locale: string;
  termSlug: string;
}) {
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const [sources, setSources] = useState<OfficialSource[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getGlossaryTermBySlug(termSlug).then(async (t) => {
      if (!t) {
        setNotFound(true);
        return;
      }
      setTerm(t);
      const srcs = await getSourcesByIds(t.officialSourceIds);
      setSources(srcs);
    });
  }, [termSlug]);

  if (notFound) {
    return <p className="text-slate-600">Term not found.</p>;
  }

  if (!term) {
    return <p className="text-slate-500">Loading…</p>;
  }

  return (
    <article className="space-y-8">
      <header>
        <Link
          href={routes.glossary(locale)}
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Glossary
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {term.term}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {term.language === "pl" ? "Polish term" : "English term"}
        </p>
      </header>

      <section aria-labelledby="meaning">
        <h2 id="meaning" className="text-lg font-semibold text-slate-900">
          What it generally means
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">
          {term.plainMeaning}
        </p>
        {term.warning && (
          <p className="mt-3 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {term.warning}
          </p>
        )}
      </section>

      {term.institutionIds.length > 0 && (
        <section aria-labelledby="term-institutions">
          <h2
            id="term-institutions"
            className="text-lg font-semibold text-slate-900"
          >
            Usually connected to
          </h2>
          <div className="mt-3">
            <InstitutionList ids={term.institutionIds} />
          </div>
        </section>
      )}

      {term.relatedPathIds.length > 0 && (
        <section aria-labelledby="term-paths">
          <h2 id="term-paths" className="text-lg font-semibold text-slate-900">
            Explainer pages that mention this term
          </h2>
          <div className="mt-3">
            <RelatedPaths pathIds={term.relatedPathIds} locale={locale} />
          </div>
        </section>
      )}

      {sources.length > 0 && (
        <section aria-labelledby="term-sources">
          <h2 id="term-sources" className="text-lg font-semibold text-slate-900">
            Official sources
          </h2>
          <div className="mt-3">
            <SourceCardList sources={sources} />
          </div>
        </section>
      )}

      <DisclaimerBox />
      <FeedbackWidget pageType="glossary" pageSlug={term.slug} />
    </article>
  );
}
