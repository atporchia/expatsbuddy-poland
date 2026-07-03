import { NextResponse } from "next/server";
import { getSearchDocs } from "@/lib/content";
import { LOCALES, isLocale, type Locale } from "@/lib/routes";

export const dynamic = "force-static";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "en";
  return NextResponse.json(getSearchDocs(safeLocale), {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
