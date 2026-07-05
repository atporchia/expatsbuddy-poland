import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdUnit } from "@/components/AdUnit";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { InstitutionList } from "@/components/InstitutionBadge";
import { PathCard } from "@/components/PathCard";
import { SourceCardList } from "@/components/SourceCard";
import { TermChips } from "@/components/GlossaryTooltip";
import {
  getCategories,
  getCategoryBySlug,
  getPathsForCategory,
  getSourcesByIds,
} from "@/lib/content";
import { LOCALES, routes, type Locale } from "@/lib/routes";
import { getDict } from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getCategories(locale).map((c) => ({ locale, categorySlug: c.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug, locale as Locale);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
    alternates: {
      canonical: routes.category(locale, category.slug),
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, routes.category(l, category.slug)]),
      ),
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}) {
  const { locale, categorySlug } = await params;
  const t = getDict(locale);
  const category = getCategoryBySlug(categorySlug, locale as Locale);
  if (!category) notFound();

  const paths = getPathsForCategory(category.id, locale as Locale);
  const sourceIds = [...new Set(paths.flatMap((p) => p.officialSourceIds))];
  const sources = getSourcesByIds(sourceIds);
  const terms = [...new Set(paths.flatMap((p) => p.commonTerms))];
  const otherCategories = getCategories(locale as Locale).filter(
    (c) => c.id !== category.id,
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {category.title}
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
          {category.description}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-emerald-800">
            {t.category.helpsWith}
          </h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
            {category.owns.map((item) => (
              <li key={item} className="mt-1">
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-red-800">
            {t.category.doesNotHelpWith}
          </h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
            {category.doesNotOwn.map((item) => (
              <li key={item} className="mt-1">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="paths-heading">
        <h2 id="paths-heading" className="text-lg font-semibold text-slate-900">
          {t.category.explainerPages}
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {paths.map((p) => (
            <PathCard key={p.id} path={p} locale={locale} />
          ))}
        </div>
      </section>

      <section aria-labelledby="institutions-heading">
        <h2
          id="institutions-heading"
          className="text-lg font-semibold text-slate-900"
        >
          {t.category.keyInstitutions}
        </h2>
        <div className="mt-3">
          <InstitutionList ids={category.institutionIds} locale={locale} />
        </div>
      </section>

      {terms.length > 0 && (
        <section aria-labelledby="terms-heading">
          <h2 id="terms-heading" className="text-lg font-semibold text-slate-900">
            {t.category.commonTerms}
          </h2>
          <div className="mt-3">
            <TermChips terms={terms} locale={locale} />
          </div>
        </section>
      )}

      {sources.length > 0 && (
        <section aria-labelledby="sources-heading">
          <h2
            id="sources-heading"
            className="text-lg font-semibold text-slate-900"
          >
            {t.category.sourcePool}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {t.category.sourcePoolNote}
          </p>
          <div className="mt-3">
            <SourceCardList sources={sources} locale={locale} />
          </div>
        </section>
      )}

      <div>
        <p className="text-sm font-medium text-slate-500">
          {t.category.tryAnother}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {otherCategories.map((c) => (
            <Link
              key={c.id}
              href={routes.category(locale, c.slug)}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {c.title}
            </Link>
          ))}
          <Link
            href={routes.start(locale)}
            className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {t.nav.startLong} →
          </Link>
        </div>
      </div>

      <AdUnit locale={locale} />

      <FeedbackWidget pageType="category" pageSlug={category.slug} locale={locale} />
    </div>
  );
}
