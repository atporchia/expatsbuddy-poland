import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import type { Path, Category, OfficialSource } from "@/lib/types";
import {
  getPathBySlug,
  getCategoryById,
  getSourcesByIds,
} from "@/lib/content";
import { formatDate, needsReviewWarning } from "@/lib/freshness";
import { markdownToHtml } from "@/lib/markdown";
import { DisclaimerBox, PageScopeBox } from "@/components/DisclaimerBox";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { InstitutionList } from "@/components/InstitutionBadge";
import { RelatedPaths } from "@/components/RelatedPaths";
import { SourceCardList } from "@/components/SourceCard";
import { TermChips } from "@/components/GlossaryTooltip";
import { routes } from "@/lib/routes";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function PathPage() {
  const { pathSlug } = useParams<{ pathSlug: string }>();
  const [path, setPath] = useState<Path | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [sources, setSources] = useState<OfficialSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!pathSlug) return;
    setLoading(true);
    getPathBySlug(pathSlug).then(async (p) => {
      if (!p) { setNotFound(true); setLoading(false); return; }
      setPath(p);
      const [cat, srcs] = await Promise.all([
        getCategoryById(p.categoryId),
        getSourcesByIds(p.officialSourceIds),
      ]);
      setCategory(cat ?? null);
      setSources(srcs);
      setLoading(false);
    });
  }, [pathSlug]);

  if (loading) return <div className="py-16 text-center text-slate-500">Loading…</div>;
  if (notFound || !path) return <div className="py-16 text-center text-slate-500">Page not found.</div>;

  const stale = needsReviewWarning(path);

  return (
    <article className="space-y-8">
      <header>
        {category && (
          <Link
            href={routes.category(category.slug)}
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            ← {category.title}
          </Link>
        )}
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {path.title}
        </h1>
        <p className="mt-3 max-w-3xl italic text-slate-500">
          &ldquo;{path.userSituation}&rdquo;
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
        <div
          className="prose-explainer max-w-3xl text-slate-700 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_h2]:mt-5 [&_h2]:text-base [&_h2]:font-semibold"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(path.body) }}
        />
      </Section>

      <Section id="who-for" title="Who this page is for">
        <ul className="list-disc pl-5 text-slate-700">
          {path.whoThisIsFor.map((item) => (
            <li key={item} className="mt-1 leading-relaxed">{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="institutions" title="Which institution is usually involved">
        <InstitutionList ids={path.institutions} />
      </Section>

      <Section id="terms" title="Terms you may see">
        <TermChips terms={path.commonTerms} />
      </Section>

      <Section id="documents" title="Documents often mentioned">
        <ul className="list-disc pl-5 text-slate-700">
          {path.commonDocuments.map((item) => (
            <li key={item} className="mt-1 leading-relaxed">{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="explains" title="What this page can explain">
        <ul className="list-disc pl-5 text-slate-700">
          {path.whatThisExplains.map((item) => (
            <li key={item} className="mt-1 leading-relaxed">{item}</li>
          ))}
        </ul>
      </Section>

      <PageScopeBox items={path.whatThisDoesNotDo} />

      <Section id="sources" title="Official sources">
        <SourceCardList sources={sources} />
      </Section>

      {path.relatedPathIds.length > 0 && (
        <Section id="related" title="Related paths">
          <RelatedPaths pathIds={path.relatedPathIds} />
        </Section>
      )}

      <DisclaimerBox />
      <FeedbackWidget pageType="path" pageSlug={path.slug} />
    </article>
  );
}
