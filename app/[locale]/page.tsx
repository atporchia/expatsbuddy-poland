import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { SearchBox } from "@/components/SearchBox";
import { getCategories, getPathsForCategory } from "@/lib/content";
import { routes, LOCALES, type Locale } from "@/lib/routes";
import { getDict } from "@/lib/i18n";
import { TRIAGE_QUESTION_IDS } from "@/lib/triageRules";

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
      <div className="h-1.5 bg-[#DC143C]" />

      <div className="bg-white px-4 pb-8 pt-10 text-center">
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

      <div className="h-1.5 bg-[#DC143C]" />
    </div>
  );
}

function HowItWorks({ locale }: { locale: string }) {
  const t = getDict(locale).home.howItWorks;
  const steps = [
    { title: t.step1Title, desc: t.step1Desc },
    { title: t.step2Title, desc: t.step2Desc },
    { title: t.step3Title, desc: t.step3Desc },
  ];
  return (
    <div className="-mx-4 bg-slate-900 px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:gap-8">
        {steps.map((step, i) => (
          <div key={step.title} className="flex flex-1 gap-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DC143C] text-sm font-bold text-white">
              {i + 1}
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-white">
                {step.title}
              </span>
              <span className="mt-0.5 block text-sm leading-snug text-slate-400">
                {step.desc}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StartCard({ locale }: { locale: string }) {
  const t = getDict(locale);
  return (
    <Link
      href={routes.start(locale)}
      className="mb-3 block w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="block text-[15px] font-bold text-slate-900">
        {t.nav.startLong}
      </span>
      <span className="mt-1 block text-sm text-slate-500">
        {t.home.startTileText(TRIAGE_QUESTION_IDS.length)}
      </span>
    </Link>
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
      <HowItWorks locale={locale} />

      <section aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="text-xl font-semibold text-slate-900"
        >
          {t.home.categoriesHeading}
        </h2>
        <div className="mt-4">
          <StartCard locale={locale} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <CategoryCard
                key={c.id}
                category={c}
                locale={locale}
                pathCount={getPathsForCategory(c.id, locale as Locale).length}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
