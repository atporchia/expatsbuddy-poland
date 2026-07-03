"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TRIAGE_QUESTION_IDS,
  runTriage,
  type TriageAnswers,
} from "@/lib/triageRules";
import { routes } from "@/lib/routes";
import { getDict } from "@/lib/i18n";

type PathInfo = { slug: string; title: string; summary: string };
type CategoryInfo = { slug: string; title: string };

export function TriageWizard({
  locale,
  pathIndex,
  categoryIndex,
}: {
  locale: string;
  /** slug → info, provided by the server component */
  pathIndex: Record<string, PathInfo>;
  categoryIndex: Record<string, CategoryInfo>;
}) {
  const t = getDict(locale).start;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<TriageAnswers>({});
  const done = step >= TRIAGE_QUESTION_IDS.length;

  function answer(value: boolean) {
    const id = TRIAGE_QUESTION_IDS[step];
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setStep((s) => s + 1);
  }

  if (!done) {
    const id = TRIAGE_QUESTION_IDS[step];
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {t.questionOf(step + 1, TRIAGE_QUESTION_IDS.length)}
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">
          {t.questions[id]}
        </h2>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => answer(true)}
            className="rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => answer(false)}
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {t.no}
          </button>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="ml-auto rounded-lg px-3 py-2.5 text-sm text-slate-500 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {t.back}
            </button>
          )}
        </div>
      </div>
    );
  }

  const result = runTriage(answers);
  const paths = result.pathSlugs
    .map((slug) => pathIndex[slug])
    .filter(Boolean);
  const categories = result.categorySlugs
    .map((slug) => categoryIndex[slug])
    .filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {t.resultsHeading}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{t.resultsNote}</p>
        {result.urgent && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {t.urgentNote}
          </p>
        )}
        {paths.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-700">
              {t.startWith}
            </h3>
            <ul className="mt-2 grid gap-2">
              {paths.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={routes.path(locale, p.slug)}
                    className="block rounded-lg border border-slate-200 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <span className="font-medium text-blue-800">{p.title}</span>
                    <span className="mt-0.5 block text-sm text-slate-600">
                      {p.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {categories.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-700">
              {t.alsoBrowse}
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={routes.category(locale, c.slug)}
                    className="inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:border-blue-400 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setAnswers({});
          }}
          className="mt-5 text-sm text-slate-500 underline underline-offset-2 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {t.startOver}
        </button>
      </div>
    </div>
  );
}
