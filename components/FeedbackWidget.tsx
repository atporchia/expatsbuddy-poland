"use client";

import { useState } from "react";
import type { FeedbackType } from "@/lib/types";
import { getDict } from "@/lib/i18n";

const OPTION_VALUES: FeedbackType[] = [
  "helpful",
  "confusing",
  "missing_information",
  "wrong_or_outdated",
  "broken_link",
  "other",
];

export function FeedbackWidget({
  pageType,
  pageSlug,
  locale = "en",
}: {
  pageType: "category" | "path" | "glossary";
  pageSlug: string;
  locale?: string;
}) {
  const t = getDict(locale).feedback;
  const [selected, setSelected] = useState<FeedbackType | null>(null);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  async function submit() {
    if (!selected) return;
    setState("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageType,
          pageSlug,
          feedbackType: selected,
          comment: comment.trim() || undefined,
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <aside className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {t.thanks}
      </aside>
    );
  }

  return (
    <aside
      aria-label="Page feedback"
      className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4"
    >
      <p className="text-sm font-medium text-slate-700">{t.question}</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Feedback type">
        {OPTION_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelected(value)}
            aria-pressed={selected === value}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              selected === value
                ? "border-blue-400 bg-blue-50 text-blue-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
            }`}
          >
            {t.options[value]}
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-3">
          <label htmlFor="feedback-comment" className="text-xs text-slate-500">
            {t.optionalComment}
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 1000))}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm focus-visible:outline-2 focus-visible:outline-blue-600"
          />
          <p className="mt-1 text-xs text-slate-500">
{t.privacyWarning}
          </p>
          <button
            type="button"
            onClick={submit}
            disabled={state === "sending"}
            className="mt-3 rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-blue-800 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {state === "sending" ? t.sending : t.submit}
          </button>
          {state === "error" && (
            <p className="mt-2 text-sm text-red-700">
{t.error}
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
