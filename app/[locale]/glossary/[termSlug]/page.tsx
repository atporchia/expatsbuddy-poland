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
  getProcessStepsForTerm,
  getSourcesByIds,
} from "@/lib/content";
import { LOCALES, routes, type Locale } from "@/lib/routes";
import { getDict } from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getGlossaryTerms(locale).map((t) => ({ locale, termSlug: t.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; termSlug: string }>;
}): Promise<Metadata> {
  const { locale, termSlug } = await params;
  const term = getGlossaryTermBySlug(termSlug, locale as Locale);
  if (!term) return {};
  return {
    title: locale === "uk" ? `Що таке ${term.term}?` : `What is ${term.term}?`,
    description: term.plainMeaning.slice(0, 160),
    alternates: {
      canonical: routes.glossaryTerm(locale, term.slug),
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, routes.glossaryTerm(l, term.slug)]),
      ),
    },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ locale: string; termSlug: string }>;
}) {
  const { locale, termSlug } = await params;
  const t = getDict(locale);
  const term = getGlossaryTermBySlug(termSlug, locale as Locale);
  if (!term) notFound();

  const sources = getSourcesByIds(term.officialSourceIds);
  const process = getProcessStepsForTerm(term, locale as Locale);

  return (
    <article className="space-y-8">
      <header>
        <Link
          href={routes.glossary(locale)}
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          {t.glossary.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {term.term}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {term.language === "pl" ? t.glossary.polishTerm : t.glossary.englishTerm}
        </p>
      </header>

      <section aria-labelledby="meaning">
        <h2 id="meaning" className="text-lg font-semibold text-slate-900">
          {t.glossary.meaning}
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

      {process && (
        <section aria-labelledby="term-process">
          <h2 id="term-process" className="text-lg font-semibold text-slate-900">
            {t.path.officialProcess}
          </h2>
          <p className="mb-3 mt-2 text-sm italic text-slate-500">
            {t.path.officialProcessCaveat}
          </p>
          <ol className="list-decimal space-y-1.5 pl-5 text-slate-700">
            {process.steps.map((step) => (
              <li key={step} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
          {process.borrowedFrom && (
            <Link
              href={routes.path(locale, process.borrowedFrom.slug)}
              className="mt-2 inline-block text-sm font-medium text-blue-700 hover:underline"
            >
              {t.glossary.processFromPath(process.borrowedFrom.title)}
            </Link>
          )}
        </section>
      )}

      {term.institutionIds.length > 0 && (
        <section aria-labelledby="term-institutions">
          <h2
            id="term-institutions"
            className="text-lg font-semibold text-slate-900"
          >
            {t.glossary.connectedTo}
          </h2>
          <div className="mt-3">
            <InstitutionList ids={term.institutionIds} locale={locale} />
          </div>
        </section>
      )}

      {term.relatedPathIds.length > 0 && (
        <section aria-labelledby="term-paths">
          <h2 id="term-paths" className="text-lg font-semibold text-slate-900">
            {t.glossary.mentionedIn}
          </h2>
          <div className="mt-3">
            <RelatedPaths pathIds={term.relatedPathIds} locale={locale} />
          </div>
        </section>
      )}

      {sources.length > 0 && (
        <section aria-labelledby="term-sources">
          <h2 id="term-sources" className="text-lg font-semibold text-slate-900">
            {t.glossary.sources}
          </h2>
          <div className="mt-3">
            <SourceCardList sources={sources} locale={locale} />
          </div>
        </section>
      )}

      <FeedbackWidget pageType="glossary" pageSlug={term.slug} locale={locale} />
    </article>
  );
}
