"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import MiniSearch from "minisearch";
import type { SearchDoc } from "@/lib/types";
import { routes } from "@/lib/routes";

const TYPE_LABEL: Record<SearchDoc["type"], string> = {
  path: "Explainer",
  category: "Category",
  glossary: "Glossary",
};

function docHref(doc: SearchDoc, locale: string): string {
  switch (doc.type) {
    case "path":
      return routes.path(locale, doc.slug);
    case "category":
      return routes.category(locale, doc.slug);
    case "glossary":
      return routes.glossaryTerm(locale, doc.slug);
  }
}

export function SearchBox({
  locale,
  large = false,
}: {
  locale: string;
  large?: boolean;
}) {
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (docs === null) {
      fetch("/api/search-index")
        .then((r) => r.json())
        .then((d: SearchDoc[]) => {
          if (!cancelled) setDocs(d);
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [docs]);

  const mini = useMemo(() => {
    if (!docs) return null;
    const m = new MiniSearch<SearchDoc>({
      fields: ["title", "text", "categoryTitle"],
      storeFields: ["type", "slug", "title", "categoryTitle"],
      searchOptions: {
        boost: { title: 3 },
        prefix: true,
        fuzzy: 0.2,
      },
    });
    m.addAll(docs);
    return m;
  }, [docs]);

  const results = useMemo(() => {
    if (!mini || query.trim().length < 2) return [];
    return mini.search(query).slice(0, 8) as unknown as (SearchDoc & {
      id: string;
    })[];
  }, [mini, query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative w-full">
      <label htmlFor={large ? "search-large" : "search"} className="sr-only">
        Search subpaths and glossary
      </label>
      <input
        id={large ? "search-large" : "search"}
        type="search"
        placeholder="Search e.g. ZAS-53, karta pobytu, sick leave…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
        className={`w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 ${
          large ? "px-4 py-3 text-base shadow-sm" : "px-3 py-1.5 text-sm"
        }`}
      />
      {open && query.trim().length >= 2 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
        >
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-slate-500">
              No matching pages. Try a Polish or English term, or browse the
              categories.
            </li>
          )}
          {results.map((r) => (
            <li key={r.id}>
              <Link
                href={docHref(r, locale)}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-blue-50 focus-visible:bg-blue-50 focus-visible:outline-none"
              >
                <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                  {TYPE_LABEL[r.type]}
                </span>
                <span className="text-slate-800">{r.title}</span>
                {r.categoryTitle && (
                  <span className="ml-auto shrink-0 text-xs text-slate-400">
                    {r.categoryTitle}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
