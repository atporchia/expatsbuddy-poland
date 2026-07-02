import { useEffect, useState } from "react";
import { TriageWizard } from "@/components/TriageWizard";
import { getCategories, getPaths } from "@/lib/content";

export default function StartPage({ locale }: { locale: string }) {
  const [pathIndex, setPathIndex] = useState<
    Record<string, { slug: string; title: string; summary: string }>
  >({});
  const [categoryIndex, setCategoryIndex] = useState<
    Record<string, { slug: string; title: string }>
  >({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getPaths(), getCategories()]).then(([paths, categories]) => {
      setPathIndex(
        Object.fromEntries(
          paths.map((p) => [
            p.slug,
            { slug: p.slug, title: p.title, summary: p.summary },
          ]),
        ),
      );
      setCategoryIndex(
        Object.fromEntries(
          categories.map((c) => [c.slug, { slug: c.slug, title: c.title }]),
        ),
      );
      setLoaded(true);
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
      {loaded ? (
        <TriageWizard
          locale={locale}
          pathIndex={pathIndex}
          categoryIndex={categoryIndex}
        />
      ) : (
        <p className="text-slate-500">Loading…</p>
      )}
    </div>
  );
}
