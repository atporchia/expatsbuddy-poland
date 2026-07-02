import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { notifyFeedback } from "@/lib/notifyFeedback";

const FEEDBACK_TYPES = new Set([
  "helpful",
  "confusing",
  "missing_information",
  "broken_link",
  "wrong_or_outdated",
  "other",
]);

const PAGE_TYPES = new Set(["category", "path", "glossary"]);

// Basic in-memory rate limit per IP. Resets on cold start, which is
// acceptable for anonymous, low-stakes feedback.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { pageType, pageSlug, feedbackType, comment } = (body ?? {}) as {
    pageType?: string;
    pageSlug?: string;
    feedbackType?: string;
    comment?: string;
  };

  if (
    !pageType ||
    !PAGE_TYPES.has(pageType) ||
    !pageSlug ||
    typeof pageSlug !== "string" ||
    pageSlug.length > 200 ||
    !feedbackType ||
    !FEEDBACK_TYPES.has(feedbackType)
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const sanitizedComment =
    typeof comment === "string"
      ? comment.replace(/<[^>]*>/g, "").slice(0, 1000).trim() || null
      : null;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Supabase not configured yet: acknowledge without storing so the
    // widget degrades gracefully in preview/local environments.
    console.warn("Feedback received but Supabase is not configured", {
      pageType,
      pageSlug,
      feedbackType,
    });
    await notifyFeedback({
      pageType,
      pageSlug,
      feedbackType,
      comment: sanitizedComment,
      stored: false,
    });
    return NextResponse.json({ ok: true, stored: false });
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from("feedback").insert({
    page_type: pageType,
    page_slug: pageSlug,
    feedback_type: feedbackType,
    comment: sanitizedComment,
  });

  if (error) {
    console.error("Failed to store feedback", error.message);
    return NextResponse.json({ error: "Storage failed" }, { status: 500 });
  }

  await notifyFeedback({
    pageType,
    pageSlug,
    feedbackType,
    comment: sanitizedComment,
    stored: true,
  });

  return NextResponse.json({ ok: true, stored: true });
}
