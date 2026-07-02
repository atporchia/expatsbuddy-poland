import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import type { Category, Path, OfficialSource } from "@/lib/types";
import {
  getCategoryBySlug,
  getCategories,
  getPathsForCategory,
  getSourcesByIds,
} from "@/lib/content";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { InstitutionList } from "@/components/InstitutionBadge";
import { PathCard } from "@/components/PathCard";
import { SourceCardList } from "@/components/SourceCard";
import { TermChips } from "@/components/GlossaryTooltip";
import { routes } from "@/lib/routes";

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const [sources, setSources] = useState<OfficialSource[]>([]);
  const [terms, setTerms] = useState<string[]>([]);
  const [otherCategories, setOtherCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!categorySlug) return;
    setLoading(true);
    getCategoryBySlug(categorySlug).then(async (cat) => {
      if (!cat) { setNotFound(true); setLoading(false); return; }
      setCategory(cat);

      const [catPaths, allCats] = await Promise.all([
        getPathsForCategory(cat.id),
        getCategories(),
      ]);

      setPaths(catPaths);
      setOtherCategories(allCats.filter((c) => c.id !== cat.id));

      const sourceIds = [...new Set(catPaths.flatMap((p) => p.officialSourceIds))];
      const [catSources] = await Promise.all([getSourcesByIds(sourceIds)]);
      setSources(catSources);
      setTerms([...new Set(catPaths.flatMap((p) => p.commonTerms))]);
      setLoading(false);
    });
  }, [categorySlug]);

  if (loading) return <div className="py-16 text-center text-slate-500">Loading…</div>;
  if (notFound || !category) return <div className="py-16 text-center text-slate-500">Category not found.</div>;

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
          <h2 className="text-sm font-semibold text-emerald-800">This category helps with</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
            {category.owns.map((item) => (
              <li key={item} className="mt-1">{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-red-800">This category does not help with</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
            {category.doesNotOwn.map((item) => (
              <li key={item} className="mt-1">{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50 px-5 py-4">
        <p className="text-sm font-medium text-slate-500">Not what you need? Try another category:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {otherCategories.map((c) => (
            <Link
              key={c.id}
              href={routes.category(c.slug)}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {c.title}
            </Link>
          ))}
          <Link
            href={routes.start()}
            className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            I don&rsquo;t know where to start →
          </Link>
        </div>
      </div>

      <section aria-labelledby="paths-heading">
        <h2 id="paths-heading" className="text-lg font-semibold text-slate-900">Explainer pages</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {paths.map((p) => <PathCard key={p.id} path={p} />)}
        </div>
      </section>

      <section aria-labelledby="institutions-heading">
        <h2 id="institutions-heading" className="text-lg font-semibold text-slate-900">Key institutions</h2>
        <div className="mt-3">
          <InstitutionList ids={category.institutionIds} />
        </div>
      </section>

      {terms.length > 0 && (
        <section aria-labelledby="terms-heading">
          <h2 id="terms-heading" className="text-lg font-semibold text-slate-900">Most common Polish terms</h2>
          <div className="mt-3">
            <TermChips terms={terms} />
          </div>
        </section>
      )}

      {sources.length > 0 && (
        <section aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="text-lg font-semibold text-slate-900">Official source pool</h2>
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
