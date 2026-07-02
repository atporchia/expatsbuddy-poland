import { useState } from "react";

const TYPES = [
  { value: "helpful", label: "Helpful" },
  { value: "confusing", label: "Confusing" },
  { value: "missing_information", label: "Missing info" },
  { value: "wrong_or_outdated", label: "Wrong / outdated" },
  { value: "broken_link", label: "Broken link" },
];

export function FeedbackWidget({ pageType, pageSlug }: { pageType: string; pageSlug: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <aside className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Thanks for your feedback!
      </aside>
    );
  }

  return (
    <aside aria-label="Page feedback" className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-sm font-medium text-slate-700">Was this page useful?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setSelected(t.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              selected === t.value
                ? "border-blue-400 bg-blue-50 text-blue-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {selected && (
        <button
          type="button"
          onClick={() => setDone(true)}
          className="mt-3 rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
        >
          Submit
        </button>
      )}
    </aside>
  );
}
