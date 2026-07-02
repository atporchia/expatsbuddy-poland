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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const categories = getCategories();

  return (
    <div className="space-y-10">
      <section className="pt-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Polish bureaucracy, explained for foreigners.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          Understand common situations around residence, work, sick leave,
          hospitalization, insurance, and official documents — with links to
          official Polish sources.
        </p>
        <div className="mx-auto mt-6 max-w-xl">
          <SearchBox locale={locale} large />
        </div>
      </section>

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
            className="group flex flex-col justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <h3 className="text-lg font-semibold text-blue-900">
              I don&rsquo;t know where to start
            </h3>
            <p className="mt-2 text-sm text-blue-800/80">
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
