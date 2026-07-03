import type { Metadata } from "next";
import { TriageWizard } from "@/components/TriageWizard";
import { getCategories, getPaths } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { routes, LOCALES, type Locale } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale);
  return {
    title: t.meta.start.title,
    description: t.meta.start.description,
    alternates: {
      canonical: routes.start(locale),
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, routes.start(l)]),
      ),
    },
  };
}

export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDict(locale);

  const pathIndex = Object.fromEntries(
    getPaths(locale as Locale).map((p) => [
      p.slug,
      { slug: p.slug, title: p.title, summary: p.summary },
    ]),
  );
  const categoryIndex = Object.fromEntries(
    getCategories(locale as Locale).map((c) => [c.slug, { slug: c.slug, title: c.title }]),
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {t.start.title}
        </h1>
        <p className="mt-3 leading-relaxed text-slate-600">
          {t.start.intro}
        </p>
      </header>
      <TriageWizard
        locale={locale}
        pathIndex={pathIndex}
        categoryIndex={categoryIndex}
      />
    </div>
  );
}
