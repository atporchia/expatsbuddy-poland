import Link from "next/link";
import type { Category } from "@/lib/types";
import { routes } from "@/lib/routes";
import { getDict } from "@/lib/i18n";

export function CategoryCard({
  category,
  locale,
  pathCount,
}: {
  category: Category;
  locale: string;
  pathCount: number;
}) {
  return (
    <Link
      href={routes.category(locale, category.slug)}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-800">
        {category.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {category.description}
      </p>
      <p className="mt-3 text-xs font-medium text-blue-700">
        {getDict(locale).home.explainerPages(pathCount)}
      </p>
    </Link>
  );
}
