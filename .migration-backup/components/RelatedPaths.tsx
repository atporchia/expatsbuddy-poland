import Link from "next/link";
import { getPathById } from "@/lib/content";
import { routes } from "@/lib/routes";

export function RelatedPaths({
  pathIds,
  locale,
}: {
  pathIds: string[];
  locale: string;
}) {
  const paths = pathIds
    .map((id) => getPathById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (paths.length === 0) return null;
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {paths.map((p) => (
        <li key={p.id}>
          <Link
            href={routes.path(locale, p.slug)}
            className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-blue-800 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {p.title} →
          </Link>
        </li>
      ))}
    </ul>
  );
}
