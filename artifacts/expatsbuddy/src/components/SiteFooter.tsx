import { Link } from "wouter";
import { routes } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 text-sm text-slate-500">
        <p>
          ExpatsBuddy provides general educational information and links to
          official sources. It does not provide legal, medical, tax,
          immigration, benefits, or insurance advice. It does not interpret
          personal documents, calculate deadlines or entitlements, or submit
          forms. Always check the linked official sources or contact the
          relevant institution or a qualified professional for your specific
          situation.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-4">
          <Link href={routes.home()} className="hover:text-blue-800">Home</Link>
          <Link href={routes.glossary()} className="hover:text-blue-800">Glossary</Link>
          <Link href={routes.start()} className="hover:text-blue-800">I don&rsquo;t know where to start</Link>
        </nav>
        <p>© {new Date().getFullYear()} ExpatsBuddy Poland</p>
      </div>
    </footer>
  );
}
