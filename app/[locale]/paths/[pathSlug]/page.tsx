import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { AdUnit } from "@/components/AdUnit";
import { PageScopeBox } from "@/components/DisclaimerBox";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { InstitutionList } from "@/components/InstitutionBadge";
import { RelatedPaths } from "@/components/RelatedPaths";
import { SourceCardList } from "@/components/SourceCard";
import { TermChips } from "@/components/GlossaryTooltip";
import {
  getCategoryById,
  getPathBySlug,
  getPaths,
  getSourcesByIds,
} from "@/lib/content";
import { formatDate, needsReviewWarning } from "@/lib/freshness";
import { LOCALES, routes, type Locale } from "@/lib/routes";
import { getDict } from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getPaths(locale).map((p) => ({ locale, pathSlug: p.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pathSlug: string }>;
}): Promise<Metadata> {
  const { locale, pathSlug } = await params;
  const path = getPathBySlug(pathSlug, locale as Locale);
  if (!path) return {};
  return {
    title: path.title,
    description: path.summary,
    alternates: {
      canonical: routes.path(locale, path.slug),
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, routes.path(l, path.slug)]),
      ),
    },
  };
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-lg font-semibold text-slate-900">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function PathPage({
  params,
}: {
  params: Promise<{ locale: string; pathSlug: string }>;
}) {
  const { locale, pathSlug } = await params;
  const t = getDict(locale);
  const path = getPathBySlug(pathSlug, locale as Locale);
  if (!path) notFound();

  const category = getCategoryById(path.categoryId, locale as Locale);
  const sources = getSourcesByIds(path.officialSourceIds);
  const stale = needsReviewWarning(path);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: path.title,
        acceptedAnswer: { "@type": "Answer", text: path.summary },
      },
    ],
  };

  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header>
        {category && (
          <Link
            href={routes.category(locale, category.slug)}
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            ← {category.title}
          </Link>
        )}
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {path.title}
        </h1>
        <p className="mt-3 max-w-3xl italic text-slate-500">
          “{path.userSituation}”
        </p>
        <p className="mt-2 text-xs text-slate-400">
          {t.path.lastReviewed} {formatDate(path.lastReviewedAt, locale)}
          {path.status !== "published" && (
            <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 font-medium uppercase tracking-wide text-slate-600">
              {path.status.replace("_", " ")}
            </span>
          )}
        </p>
      </header>

      {stale && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {t.path.staleWarning}
        </p>
      )}

      <Section id="what-this-means" title={t.path.whatThisMeans}>
        <p className="max-w-3xl leading-relaxed text-slate-700">
          {path.briefOverview}
        </p>
        <details className="group mt-4 max-w-3xl">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-blue-700 hover:underline [&::-webkit-details-marker]:hidden">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                clipRule="evenodd"
              />
            </svg>
            {t.path.readMore}
          </summary>
          <div className="prose-explainer mt-3 text-slate-700">
            <MDXRemote source={path.body} />
          </div>
        </details>
      </Section>

      <Section id="who-for" title={t.path.whoFor}>
        <ul className="list-disc pl-5 text-slate-700">
          {path.whoThisIsFor.map((item) => (
            <li key={item} className="mt-1 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="institutions" title={t.path.institutions}>
        <InstitutionList ids={path.institutions} locale={locale} />
      </Section>

      <Section id="terms" title={t.path.terms}>
        <TermChips terms={path.commonTerms} locale={locale} />
      </Section>

      <Section id="documents" title={t.path.documents}>
        <ul className="list-disc pl-5 text-slate-700">
          {path.commonDocuments.map((item) => (
            <li key={item} className="mt-1 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {path.officialProcessSteps && path.officialProcessSteps.length > 0 && (
        <Section id="official-process" title={t.path.officialProcess}>
          <p className="mb-3 text-sm italic text-slate-500">
            {t.path.officialProcessCaveat}
          </p>
          <ol className="list-decimal space-y-1.5 pl-5 text-slate-700">
            {path.officialProcessSteps.map((step) => (
              <li key={step} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </Section>
      )}

      <Section id="sources" title={t.path.sources}>
        <SourceCardList sources={sources} locale={locale} />
      </Section>

      {path.relatedPathIds.length > 0 && (
        <Section id="related" title={t.path.related}>
          <RelatedPaths pathIds={path.relatedPathIds} locale={locale} />
        </Section>
      )}

      <PageScopeBox items={path.whatThisDoesNotDo} title={t.path.cannotDo} />

      <AdUnit locale={locale} />

      <FeedbackWidget pageType="path" pageSlug={path.slug} locale={locale} />
    </article>
  );
}
