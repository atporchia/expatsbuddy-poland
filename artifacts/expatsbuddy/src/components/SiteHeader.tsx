import { Link } from "wouter";
import { routes } from "@/lib/routes";
import { SearchBox } from "./SearchBox";

export function SiteHeader({ locale }: { locale: string }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link
          href={routes.home(locale)}
          className="text-lg font-bold tracking-tight text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          ExpatsBuddy{" "}
          <span className="font-normal text-slate-500">Poland</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm">
          <Link
            href={routes.glossary(locale)}
            className="text-slate-600 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Glossary
          </Link>
          <Link
            href={routes.start(locale)}
            className="text-slate-600 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Where do I start?
          </Link>
        </nav>
        <div className="ml-auto w-full max-w-xs sm:w-64">
          <SearchBox locale={locale} />
        </div>
      </div>
    </header>
  );
}
