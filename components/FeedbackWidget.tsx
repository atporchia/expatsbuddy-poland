"use client";

import { useState } from "react";
import type { FeedbackType } from "@/lib/types";

const OPTIONS: { value: FeedbackType; label: string }[] = [
  { value: "helpful", label: "Helpful" },
  { value: "confusing", label: "Confusing" },
  { value: "missing_information", label: "Missing info" },
  { value: "wrong_or_outdated", label: "Wrong / outdated" },
  { value: "broken_link", label: "Broken link" },
  { value: "other", label: "Other" },
];

export function FeedbackWidget({
  pageType,
  pageSlug,
}: {
  pageType: "category" | "path" | "glossary";
  pageSlug: string;
}) {
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
        Thanks for your feedback!
      </aside>
    );
  }

  return (
    <aside
      aria-label="Page feedback"
      className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4"
    >
      <p className="text-sm font-medium text-slate-700">Was this page useful?</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Feedback type">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setSelected(o.value)}
            aria-pressed={selected === o.value}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              selected === o.value
                ? "border-blue-400 bg-blue-50 text-blue-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-3">
          <label htmlFor="feedback-comment" className="text-xs text-slate-500">
            Optional comment
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 1000))}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm focus-visible:outline-2 focus-visible:outline-blue-600"
          />
          <p className="mt-1 text-xs text-slate-500">
            Do not include personal, medical, financial, or legal details in
            feedback.
          </p>
          <button
            type="button"
            onClick={submit}
            disabled={state === "sending"}
            className="mt-3 rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-blue-800 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {state === "sending" ? "Sending…" : "Submit"}
          </button>
          {state === "error" && (
            <p className="mt-2 text-sm text-red-700">
              Something went wrong sending feedback. Please try again later.
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
