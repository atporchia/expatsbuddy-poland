import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

const FEEDBACK_TYPES = new Set([
  "helpful",
  "confusing",
  "missing_information",
  "broken_link",
  "wrong_or_outdated",
  "other",
]);

const PAGE_TYPES = new Set(["category", "path", "glossary"]);

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

router.post("/feedback", async (req: Request, res: Response) => {
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
    req.socket.remoteAddress ??
    "unknown";

  if (rateLimited(ip)) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  const { pageType, pageSlug, feedbackType, comment } = req.body as {
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
    res.status(400).json({ error: "Invalid payload" });
    return;
  }

  const sanitizedComment =
    typeof comment === "string"
      ? comment
          .replace(/<[^>]*>/g, "")
          .slice(0, 1000)
          .trim() || null
      : null;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    req.log.warn({ pageType, pageSlug, feedbackType }, "Feedback received but Supabase not configured");
    res.json({ ok: true, stored: false });
    return;
  }

  try {
    const supabaseRes = await fetch(`${supabaseUrl}/rest/v1/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        page_type: pageType,
        page_slug: pageSlug,
        feedback_type: feedbackType,
        comment: sanitizedComment,
      }),
    });

    if (!supabaseRes.ok) {
      req.log.error({ status: supabaseRes.status }, "Failed to store feedback");
      res.status(500).json({ error: "Storage failed" });
      return;
    }

    res.json({ ok: true, stored: true });
  } catch (err) {
    req.log.error({ err }, "Feedback storage error");
    res.status(500).json({ error: "Storage failed" });
  }
});

export default router;
