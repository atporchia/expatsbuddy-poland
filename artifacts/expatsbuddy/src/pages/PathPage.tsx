import { useEffect, useState } from "react";
import { Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DisclaimerBox, PageScopeBox } from "@/components/DisclaimerBox";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { InstitutionList } from "@/components/InstitutionBadge";
import { RelatedPaths } from "@/components/RelatedPaths";
import { SourceCardList } from "@/components/SourceCard";
import { TermChips } from "@/components/GlossaryTooltip";
import {
  getCategoryById,
  getPathBySlug,
  getSourcesByIds,
} from "@/lib/content";
import { formatDate, needsReviewWarning } from "@/lib/freshness";
import { routes } from "@/lib/routes";
import type { Category, OfficialSource, Path } from "@/lib/types";

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

export default function PathPage({
  locale,
  pathSlug,
}: {
  locale: string;
  pathSlug: string;
}) {
  const [path, setPath] = useState<Path | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [sources, setSources] = useState<OfficialSource[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getPathBySlug(pathSlug).then(async (p) => {
      if (!p) {
        setNotFound(true);
        return;
      }
      setPath(p);
      const [cat, srcs] = await Promise.all([
        getCategoryById(p.categoryId),
        getSourcesByIds(p.officialSourceIds),
      ]);
      setCategory(cat ?? null);
      setSources(srcs);
    });
  }, [pathSlug]);

  if (notFound) {
    return <p className="text-slate-600">Path not found.</p>;
  }

  if (!path) {
    return <p className="text-slate-500">Loading…</p>;
  }

  const stale = needsReviewWarning(path);

  return (
    <article className="space-y-8">
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
          "{path.userSituation}"
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Last reviewed {formatDate(path.lastReviewedAt)}
          {path.status !== "published" && (
            <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 font-medium uppercase tracking-wide text-slate-600">
              {path.status.replace("_", " ")}
            </span>
          )}
        </p>
      </header>

      {stale && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This page may need review. Always check the official sources below.
        </p>
      )}

      <Section id="what-this-means" title="What this situation means">
        <div className="prose-explainer max-w-3xl text-slate-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{path.body}</ReactMarkdown>
        </div>
      </Section>

      <Section id="who-for" title="Who this page is for">
        <ul className="list-disc pl-5 text-slate-700">
          {path.whoThisIsFor.map((item) => (
            <li key={item} className="mt-1 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="institutions" title="Which institution is usually involved">
        <InstitutionList ids={path.institutions} />
      </Section>

      <Section id="terms" title="Terms you may see">
        <TermChips terms={path.commonTerms} locale={locale} />
      </Section>

      <Section id="documents" title="Documents often mentioned">
        <ul className="list-disc pl-5 text-slate-700">
          {path.commonDocuments.map((item) => (
            <li key={item} className="mt-1 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="explains" title="What this page can explain">
        <ul className="list-disc pl-5 text-slate-700">
          {path.whatThisExplains.map((item) => (
            <li key={item} className="mt-1 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <PageScopeBox items={path.whatThisDoesNotDo} />

      <Section id="sources" title="Official sources">
        <SourceCardList sources={sources} />
      </Section>

      {path.relatedPathIds.length > 0 && (
        <Section id="related" title="Related paths">
          <RelatedPaths pathIds={path.relatedPathIds} locale={locale} />
        </Section>
      )}

      <DisclaimerBox />
      <FeedbackWidget pageType="path" pageSlug={path.slug} />
    </article>
  );
}
