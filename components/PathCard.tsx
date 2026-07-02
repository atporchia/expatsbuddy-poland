import Link from "next/link";
import type { Path } from "@/lib/types";
import { routes } from "@/lib/routes";

export function PathCard({ path, locale }: { path: Path; locale: string }) {
  return (
    <Link
      href={routes.path(locale, path.slug)}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <h3 className="font-semibold text-slate-900 group-hover:text-blue-800">
        {path.title}
      </h3>
      <p className="mt-2 flex-1 text-sm italic leading-relaxed text-slate-500">
        “{path.userSituation}”
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {path.summary}
      </p>
    </Link>
  );
}
