import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { SearchBox } from "@/components/SearchBox";
import { getCategories, getPathsForCategory } from "@/lib/content";
import { routes, LOCALES, type Locale } from "@/lib/routes";
import { getDict } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale);
  return {
    title: t.meta.home.title,
    description: t.meta.home.description,
    alternates: {
      canonical: routes.home(locale),
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, routes.home(l)]),
      ),
    },
  };
}

function PolishFlagHero({ locale }: { locale: string }) {
  const t = getDict(locale);
  return (
    <div className="-mx-4 -mt-8">
      <div className="flex h-3">
        <div className="flex-1 border-t border-slate-200 bg-white" />
      </div>
      <div className="flex h-3">
        <div className="flex-1 bg-[#DC143C]" />
      </div>

      <div className="bg-white px-4 pb-8 pt-7 text-center">
        <div className="mb-4 flex justify-center">
          <svg
            viewBox="0 0 40 25"
            className="h-6 w-10 rounded shadow-sm ring-1 ring-slate-200"
            role="img"
            aria-label="Flag of Poland"
          >
            <rect width="40" height="12.5" fill="#ffffff" />
            <rect y="12.5" width="40" height="12.5" fill="#DC143C" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          {t.home.heroTitleLine1}
          <br />
          <span className="text-[#DC143C]">{t.home.heroHighlight}</span>{" "}
          {t.home.heroTitleRest}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          {t.home.heroSubtitle}
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
  const t = getDict(locale);
  const categories = getCategories(locale as Locale);

  return (
    <div className="space-y-8">
      <PolishFlagHero locale={locale} />

      <section aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="text-xl font-semibold text-slate-900"
        >
          {t.home.categoriesHeading}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href={routes.start(locale)}
            className="group flex flex-col justify-center rounded-xl border-2 border-dashed border-red-200 bg-red-50/40 p-5 text-center transition hover:border-[#DC143C]/40 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {t.nav.startLong}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{t.home.startTileText}</p>
          </Link>
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              locale={locale}
              pathCount={getPathsForCategory(c.id, locale as Locale).length}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
