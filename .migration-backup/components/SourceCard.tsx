import type { OfficialSource } from "@/lib/types";
import { formatDate } from "@/lib/freshness";

const LANGUAGE_LABEL: Record<OfficialSource["language"], string> = {
  pl: "Polish",
  en: "English",
  mixed: "Polish / English",
};

const TYPE_LABEL: Record<OfficialSource["sourceType"], string> = {
  form: "Form page",
  explainer: "Explainer",
  checklist: "Checklist",
  pdf: "PDF",
  qna: "Q&A",
  portal: "Portal",
};

export function SourceCard({ source }: { source: OfficialSource }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-emerald-300 bg-emerald-50/60 p-4 transition hover:border-emerald-400 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          Official source
        </span>
        <span className="text-xs text-slate-500">{source.institution}</span>
      </div>
      <p className="mt-2 font-medium text-slate-900 group-hover:underline">
        {source.title}
        <span aria-hidden="true" className="ml-1 text-emerald-700">
          ↗
        </span>
      </p>
      <p className="mt-2 text-xs text-slate-500">
        {TYPE_LABEL[source.sourceType]} · {LANGUAGE_LABEL[source.language]} ·
        Last checked {formatDate(source.lastCheckedAt)}
      </p>
    </a>
  );
}

export function SourceCardList({ sources }: { sources: OfficialSource[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {sources.map((s) => (
        <SourceCard key={s.id} source={s} />
      ))}
    </div>
  );
}
