import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { SearchBox } from "@/components/SearchBox";
import { getCategories, getPathsForCategory } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Polish bureaucracy, explained for foreigners",
  description:
    "Understand common situations around residence, work, sick leave, hospitalization, insurance, and official documents in Poland — with links to official Polish sources.",
};

function PolishFlagHero({ locale }: { locale: string }) {
  return (
    <div className="-mx-4 -mt-8">
      <div className="flex h-3">
        <div className="flex-1 border-t border-slate-200 bg-white" />
      </div>
      <div className="flex h-3">
        <div className="flex-1 bg-[#DC143C]" />
      </div>

      <div className="bg-white px-4 pb-8 pt-7 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-widest text-slate-400">
          <span role="img" aria-label="Polish flag">
            🇵🇱
          </span>
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
          <SearchBox locale={locale} large />
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const categories = getCategories();

  return (
    <div className="space-y-8">
      <PolishFlagHero locale={locale} />

      <section aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="text-xl font-semibold text-slate-900"
        >
          What do you need help understanding?
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              locale={locale}
              pathCount={getPathsForCategory(c.id).length}
            />
          ))}
          <Link
            href={routes.start(locale)}
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
      </section>

      <DisclaimerBox />
    </div>
  );
}
