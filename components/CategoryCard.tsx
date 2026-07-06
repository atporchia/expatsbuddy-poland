import Link from "next/link";
import type { Category } from "@/lib/types";
import { routes } from "@/lib/routes";
import { getDict } from "@/lib/i18n";
import { CATEGORY_ACCENT, DEFAULT_ACCENT } from "@/lib/categoryStyles";

export function CategoryCard({
  category,
  locale,
  pathCount,
}: {
  category: Category;
  locale: string;
  pathCount: number;
}) {
  const accent = CATEGORY_ACCENT[category.slug] ?? DEFAULT_ACCENT;
  return (
    <Link
      href={routes.category(locale, category.slug)}
      className={`flex flex-col gap-1.5 rounded-xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${accent.rail}`}
    >
      <span className="text-[15px] font-semibold leading-snug text-slate-900">
        {category.title}
      </span>
      <span className="text-sm leading-snug text-slate-500">
        {category.shortDescription}
      </span>
      <span className={`mt-3 w-fit text-sm font-semibold ${accent.link}`}>
        {getDict(locale).home.explainerPages(pathCount)} →
      </span>
    </Link>
  );
}
