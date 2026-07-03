import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { InstitutionList } from "@/components/InstitutionBadge";
import { RelatedPaths } from "@/components/RelatedPaths";
import { SourceCardList } from "@/components/SourceCard";
import {
  getGlossaryTermBySlug,
  getGlossaryTerms,
  getSourcesByIds,
} from "@/lib/content";
import { LOCALES, routes } from "@/lib/routes";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getGlossaryTerms().map((t) => ({ locale, termSlug: t.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; termSlug: string }>;
}): Promise<Metadata> {
  const { termSlug } = await params;
  const term = getGlossaryTermBySlug(termSlug);
  if (!term) return {};
  return {
    title: `What is ${term.term}?`,
    description: term.plainMeaning.slice(0, 160),
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ locale: string; termSlug: string }>;
}) {
  const { locale, termSlug } = await params;
  const term = getGlossaryTermBySlug(termSlug);
  if (!term) notFound();

  const sources = getSourcesByIds(term.officialSourceIds);

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

      <FeedbackWidget pageType="glossary" pageSlug={term.slug} />
    </article>
  );
}
