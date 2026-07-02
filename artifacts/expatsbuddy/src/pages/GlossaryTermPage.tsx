import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import type { GlossaryTerm, Path, OfficialSource } from "@/lib/types";
import { getGlossaryTermBySlug, getPaths, getSourcesByIds } from "@/lib/content";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SourceCardList } from "@/components/SourceCard";
import { routes } from "@/lib/routes";

export default function GlossaryTermPage() {
  const { termSlug } = useParams<{ termSlug: string }>();
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const [relatedPaths, setRelatedPaths] = useState<Path[]>([]);
  const [sources, setSources] = useState<OfficialSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!termSlug) return;
    getGlossaryTermBySlug(termSlug).then(async (t) => {
      if (!t) { setLoading(false); return; }
      setTerm(t);
      const [allPaths, srcs] = await Promise.all([
        getPaths(),
        getSourcesByIds(t.officialSourceIds),
      ]);
      setRelatedPaths(allPaths.filter((p) => t.relatedPathIds.includes(p.id)));
      setSources(srcs);
      setLoading(false);
    });
  }, [termSlug]);

  if (loading) return <div className="py-16 text-center text-slate-500">Loading…</div>;
  if (!term) return <div className="py-16 text-center text-slate-500">Term not found.</div>;

  return (
    <div className="space-y-8">
      <header>
        <Link href={routes.glossary()} className="text-sm font-medium text-blue-700 hover:underline">
          ← Glossary
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {term.term}
        </h1>
        <span className="mt-1 inline-block rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
          {term.language === "pl" ? "Polish" : "English"}
        </span>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">What this means</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">{term.plainMeaning}</p>
        {term.warning && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {term.warning}
          </p>
        )}
      </section>

      {relatedPaths.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Appears in these explainers</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {relatedPaths.map((p) => (
              <li key={p.id}>
                <Link
                  href={routes.path(p.slug)}
                  className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-blue-800 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  {p.title} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {sources.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Official sources</h2>
          <div className="mt-3">
            <SourceCardList sources={sources} />
          </div>
        </section>
      )}

      <DisclaimerBox />
    </div>
  );
}
