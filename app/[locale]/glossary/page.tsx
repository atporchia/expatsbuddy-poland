import type { Metadata } from "next";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { getGlossaryTerms } from "@/lib/content";
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
    title: t.meta.glossary.title,
    description: t.meta.glossary.description,
    alternates: {
      canonical: routes.glossary(locale),
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, routes.glossary(l)]),
      ),
    },
  };
}

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDict(locale);
  const terms = getGlossaryTerms(locale as Locale);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {t.glossary.title}
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
          {t.glossary.intro}
        </p>
        <div className="mt-4 max-w-xl">
          <SearchBox locale={locale} large />
        </div>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {terms.map((t) => (
          <li key={t.id}>
            <Link
              href={routes.glossaryTerm(locale, t.slug)}
              className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <span className="font-semibold text-blue-900">{t.term}</span>
              <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                {t.plainMeaning.length > 140
                  ? `${t.plainMeaning.slice(0, 140)}…`
                  : t.plainMeaning}
              </span>
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );
}
