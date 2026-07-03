"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES } from "@/lib/routes";

const LABELS: Record<string, string> = { en: "EN", uk: "УКР" };

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname() ?? `/${locale}`;

  function hrefFor(target: string) {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }

  return (
    <nav aria-label="Language" className="flex items-center gap-1 text-xs">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-slate-300">|</span>}
          {l === locale ? (
            <span aria-current="true" className="font-semibold text-slate-900">
              {LABELS[l] ?? l.toUpperCase()}
            </span>
          ) : (
            <Link
              href={hrefFor(l)}
              className="text-slate-500 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {LABELS[l] ?? l.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
