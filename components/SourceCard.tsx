import type { OfficialSource } from "@/lib/types";
import { formatDate } from "@/lib/freshness";
import { getDict } from "@/lib/i18n";

export function SourceCard({
  source,
  locale = "en",
}: {
  source: OfficialSource;
  locale?: string;
}) {
  const t = getDict(locale).sourceCard;
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-emerald-300 bg-emerald-50/60 p-4 transition hover:border-emerald-400 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          {t.officialSource}
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
        {t.typeLabels[source.sourceType]} · {t.languageLabels[source.language]}{" "}
        · {t.lastChecked} {formatDate(source.lastCheckedAt, locale)}
      </p>
    </a>
  );
}

export function SourceCardList({
  sources,
  locale = "en",
}: {
  sources: OfficialSource[];
  locale?: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {sources.map((s) => (
        <SourceCard key={s.id} source={s} locale={locale} />
      ))}
    </div>
  );
}
