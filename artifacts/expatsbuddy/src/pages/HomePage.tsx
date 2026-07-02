import { useEffect, useState } from "react";
import { Link } from "wouter";
import type { Category } from "@/lib/types";
import { getCategories, getPathsForCategory } from "@/lib/content";
import { CategoryCard } from "@/components/CategoryCard";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SearchBox } from "@/components/SearchBox";
import { routes } from "@/lib/routes";

type CategoryWithCount = { category: Category; pathCount: number };

function PolishFlagHero() {
  return (
    <div className="-mx-4 -mt-8">
      <div className="flex h-3">
        <div className="flex-1 bg-white border-t border-slate-200" />
      </div>
      <div className="flex h-3">
        <div className="flex-1 bg-[#DC143C]" />
      </div>

      <div className="bg-white px-4 pb-8 pt-7 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-sm font-medium tracking-widest text-slate-400 uppercase">
          <span role="img" aria-label="Polish flag">🇵🇱</span>
          <span>Poland</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          Polish bureaucracy,
          <br />
          <span className="text-[#DC143C]">explained</span> for foreigners.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          Understand common situations around residence, work, sick leave,
          hospitalization, insurance, and official documents — with links to
          official Polish sources.
        </p>
        <div className="mx-auto mt-7 max-w-xl">
          <SearchBox large />
        </div>
      </div>

      <div className="flex h-1.5">
        <div className="flex-1 bg-white" />
      </div>
      <div className="flex h-1.5">
        <div className="flex-1 bg-[#DC143C]" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [items, setItems] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(async (cats) => {
      const withCounts = await Promise.all(
        cats.map(async (c) => ({
          category: c,
          pathCount: (await getPathsForCategory(c.id)).length,
        }))
      );
      setItems(withCounts);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <PolishFlagHero />

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-xl font-semibold text-slate-900">
          What do you need help understanding?
        </h2>
        {loading ? (
          <div className="mt-4 text-slate-500">Loading…</div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ category, pathCount }) => (
              <CategoryCard key={category.id} category={category} pathCount={pathCount} />
            ))}
            <Link
              href={routes.start()}
              className="group flex flex-col justify-center rounded-xl border-2 border-dashed border-red-200 bg-red-50/40 p-5 text-center transition hover:border-[#DC143C]/40 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                I don&rsquo;t know where to start
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Answer a few simple questions and we&rsquo;ll point you to the
                relevant explainer pages.
              </p>
            </Link>
          </div>
        )}
      </section>

      <DisclaimerBox />
    </div>
  );
}
