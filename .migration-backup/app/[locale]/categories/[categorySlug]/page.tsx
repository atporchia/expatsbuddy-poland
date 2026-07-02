import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DisclaimerBox } from "@/components/DisclaimerBox";
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
import { LOCALES } from "@/lib/routes";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getCategories().map((c) => ({ locale, categorySlug: c.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}) {
  const { locale, categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const paths = getPathsForCategory(category.id);
  const sourceIds = [...new Set(paths.flatMap((p) => p.officialSourceIds))];
  const sources = getSourcesByIds(sourceIds);
  const terms = [...new Set(paths.flatMap((p) => p.commonTerms))];

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
            This category helps with
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
            This category does not help with
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
          Explainer pages
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
          Key institutions
        </h2>
        <div className="mt-3">
          <InstitutionList ids={category.institutionIds} />
        </div>
      </section>

      {terms.length > 0 && (
        <section aria-labelledby="terms-heading">
          <h2 id="terms-heading" className="text-lg font-semibold text-slate-900">
            Most common Polish terms
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
            Official source pool
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Official pages used across this category&rsquo;s explainers.
          </p>
          <div className="mt-3">
            <SourceCardList sources={sources} />
          </div>
        </section>
      )}

      <DisclaimerBox />
      <FeedbackWidget pageType="category" pageSlug={category.slug} />
    </div>
  );
}
