import Link from "next/link";
import { routes } from "@/lib/routes";
import { getDict } from "@/lib/i18n";
import { SearchBox } from "./SearchBox";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader({ locale }: { locale: string }) {
  const t = getDict(locale);
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link
          href={routes.home(locale)}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <svg
            viewBox="0 0 20 13"
            className="h-[15px] w-[23px] shrink-0 rounded-[3px] ring-1 ring-slate-300"
            role="img"
            aria-label="Flag of Poland"
          >
            <rect width="20" height="6.5" fill="#ffffff" />
            <rect y="6.5" width="20" height="6.5" fill="#DC143C" />
          </svg>
          {t.siteName}{" "}
          <span className="font-normal text-slate-500">{t.siteCountry}</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm">
          <Link
            href={routes.glossary(locale)}
            className="text-slate-600 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {t.nav.glossary}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <div className="w-full max-w-xs sm:w-64">
            <SearchBox locale={locale} />
          </div>
          <LanguageSwitcher locale={locale} />
          <Link
            href={routes.start(locale)}
            className="whitespace-nowrap rounded-full bg-[#DC143C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c01235] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {t.nav.start}
          </Link>
        </div>
      </div>
    </header>
  );
}
