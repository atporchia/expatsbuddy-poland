import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import type { Category, Path, GlossaryTerm } from "@/lib/types";
import { getCategories, getPaths, getGlossaryTerms } from "@/lib/content";
import { routes } from "@/lib/routes";

type Result = { href: string; label: string; sub?: string };

export function SearchBox({ large }: { large?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [, navigate] = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const q = query.toLowerCase();

    Promise.all([getCategories(), getPaths(), getGlossaryTerms()]).then(([cats, paths, terms]) => {
      const hits: Result[] = [];

      for (const c of cats as Category[]) {
        if (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
          hits.push({ href: routes.category(c.slug), label: c.title, sub: "Category" });
        }
      }
      for (const p of paths as Path[]) {
        if (p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.userSituation.toLowerCase().includes(q)) {
          hits.push({ href: routes.path(p.slug), label: p.title, sub: "Explainer" });
        }
      }
      for (const t of terms as GlossaryTerm[]) {
        if (t.term.toLowerCase().includes(q) || t.plainMeaning.toLowerCase().includes(q)) {
          hits.push({ href: routes.glossaryTerm(t.slug), label: t.term, sub: "Glossary" });
        }
      }
      setResults(hits.slice(0, 8));
    });
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setResults([]);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const inputClass = large
    ? "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
    : "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div ref={ref} className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search explainers, terms…"
        className={inputClass}
        aria-label="Search"
      />
      {results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {results.map((r) => (
            <li key={r.href}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-blue-50"
                onClick={() => { navigate(r.href); setQuery(""); setResults([]); }}
              >
                {r.sub && (
                  <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                    {r.sub}
                  </span>
                )}
                <span className="text-slate-800">{r.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
