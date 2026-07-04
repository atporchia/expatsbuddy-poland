import Link from "next/link";
import type { Category } from "@/lib/types";
import { routes } from "@/lib/routes";
import { getDict } from "@/lib/i18n";
import { CategoryIcon } from "./CategoryIcon";
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
      className={`group flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${accent.hoverBorder}`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent.badge}`}
      >
        <CategoryIcon slug={category.slug} className="h-5 w-5" />
      </span>
      <span className="text-[15px] font-semibold leading-snug text-slate-900">
        {category.title}
      </span>
      <span className="text-xs leading-snug text-slate-500">
        {category.shortDescription}
      </span>
      <span
        className={`mt-auto w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${accent.badge}`}
      >
        {getDict(locale).home.explainerPages(pathCount)}
      </span>
    </Link>
  );
}
