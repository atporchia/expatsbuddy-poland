/**
 * One accent color per category, used as a wayfinding aid on the homepage
 * tiles (left rail + page-count link). Purely presentational — literal
 * Tailwind class strings so the compiler can see them statically.
 *
 * `link` is deliberately a darker shade than `rail` for official-documents:
 * the rail is a decorative bar (no contrast requirement), but the link is
 * real text on a white card and yellow-500 text fails contrast at that size.
 */
export const CATEGORY_ACCENT: Record<string, { rail: string; link: string }> = {
  "residence-trc": {
    rail: "border-l-blue-600",
    link: "text-blue-600",
  },
  "work-job-loss": {
    rail: "border-l-emerald-600",
    link: "text-emerald-600",
  },
  "sickness-sick-leave": {
    rail: "border-l-rose-500",
    link: "text-rose-500",
  },
  "hospitalization-insurance": {
    rail: "border-l-violet-500",
    link: "text-violet-500",
  },
  "official-documents": {
    rail: "border-l-yellow-500",
    link: "text-yellow-700",
  },
  "business-self-employment": {
    rail: "border-l-cyan-600",
    link: "text-cyan-600",
  },
};

export const DEFAULT_ACCENT = {
  rail: "border-l-slate-300",
  link: "text-slate-600",
};
