import { useEffect, useState } from "react";
import { getCategories, getPaths } from "@/lib/content";
import { TriageWizard } from "@/components/TriageWizard";

type PathInfo = { slug: string; title: string; summary: string };
type CategoryInfo = { slug: string; title: string };

export default function StartPage() {
  const [pathIndex, setPathIndex] = useState<Record<string, PathInfo>>({});
  const [categoryIndex, setCategoryIndex] = useState<Record<string, CategoryInfo>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPaths(), getCategories()]).then(([paths, cats]) => {
      setPathIndex(Object.fromEntries(paths.map((p) => [p.slug, { slug: p.slug, title: p.title, summary: p.summary }])));
      setCategoryIndex(Object.fromEntries(cats.map((c) => [c.slug, { slug: c.slug, title: c.title }])));
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          I don&rsquo;t know where to start
        </h1>
        <p className="mt-3 leading-relaxed text-slate-600">
          Answer a few yes/no questions and we&rsquo;ll suggest explainer pages
          to read. This is routing, not advice: no eligibility checks, no
          deadlines, no recommendations to apply for anything.
        </p>
      </header>
      {loading ? (
        <div className="text-slate-500">Loading…</div>
      ) : (
        <TriageWizard pathIndex={pathIndex} categoryIndex={categoryIndex} />
      )}
    </div>
  );
}
