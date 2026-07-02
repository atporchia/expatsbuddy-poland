import { NextResponse } from "next/server";
import { getSearchDocs } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(getSearchDocs(), {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
