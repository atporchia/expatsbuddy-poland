import { getInstitutionById } from "@/lib/content";
import type { Locale } from "@/lib/routes";

export function InstitutionBadge({
  id,
  locale = "en",
}: {
  id: string;
  locale?: string;
}) {
  const institution = getInstitutionById(id, locale as Locale);
  const label = institution?.shortName ?? id;
  return (
    <span
      title={institution?.name}
      className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800"
    >
      {label}
    </span>
  );
}

export function InstitutionList({
  ids,
  locale = "en",
}: {
  ids: string[];
  locale?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <InstitutionBadge key={id} id={id} locale={locale} />
      ))}
    </div>
  );
}
