import type { Metadata } from "next";
import { TriageWizard } from "@/components/TriageWizard";
import { getCategories, getPaths } from "@/lib/content";

export const metadata: Metadata = {
  title: "I don't know where to start",
  description:
    "Answer a few simple questions about your situation in Poland and get pointed to the relevant plain-language explainer pages with official sources.",
};

export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const pathIndex = Object.fromEntries(
    getPaths().map((p) => [
      p.slug,
      { slug: p.slug, title: p.title, summary: p.summary },
    ]),
  );
  const categoryIndex = Object.fromEntries(
    getCategories().map((c) => [c.slug, { slug: c.slug, title: c.title }]),
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          I don&rsquo;t know where to start
        </h1>
        <p className="mt-3 leading-relaxed text-slate-600">
          Answer a few yes/no questions and we&rsquo;ll suggest explainer pages
          to read. This is routing, not advice: no eligibility checks, no
          deadlines, no recommendations to apply for anything.
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
