import Link from "next/link";
import { routes } from "@/lib/routes";
import { getDict } from "@/lib/i18n";
import { CookieSettingsLink } from "./CookieConsent";

export function SiteFooter({ locale }: { locale: string }) {
  const t = getDict(locale);
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 text-sm text-slate-500">
        <p>{t.footer.disclaimer}</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-4">
          <Link href={routes.home(locale)} className="hover:text-blue-800">
            {t.nav.home}
          </Link>
          <Link href={routes.glossary(locale)} className="hover:text-blue-800">
            {t.nav.glossary}
          </Link>
          <Link href={routes.start(locale)} className="hover:text-blue-800">
            {t.nav.startLong}
          </Link>
          <CookieSettingsLink locale={locale} />
        </nav>
        <p>© {new Date().getFullYear()} ExpatsBuddy Poland</p>
      </div>
    </footer>
  );
}
