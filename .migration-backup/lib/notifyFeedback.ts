/**
 * Emails new feedback submissions to the site maintainer via Resend.
 * No-op when RESEND_API_KEY / FEEDBACK_NOTIFY_EMAIL are not configured.
 * Failures are logged but never surfaced to the visitor.
 */
export async function notifyFeedback(input: {
  pageType: string;
  pageSlug: string;
  feedbackType: string;
  comment: string | null;
  stored: boolean;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FEEDBACK_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const from =
    process.env.FEEDBACK_NOTIFY_FROM ?? "ExpatsBuddy <onboarding@resend.dev>";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://expatsbuddy-poland.vercel.app";
  const pagePath =
    input.pageType === "path"
      ? `/en/paths/${input.pageSlug}`
      : input.pageType === "category"
        ? `/en/categories/${input.pageSlug}`
        : `/en/glossary/${input.pageSlug}`;

  const lines = [
    `Type: ${input.feedbackType}`,
    `Page: ${siteUrl}${pagePath}`,
    input.comment ? `Comment: ${input.comment}` : "Comment: (none)",
    input.stored ? "" : "Note: not stored in Supabase (storage unavailable).",
  ].filter(Boolean);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[ExpatsBuddy feedback] ${input.feedbackType} — ${input.pageSlug}`,
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error("Feedback email failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("Feedback email failed", (err as Error).message);
  }
}
