/**
 * One accent color per category, used as a wayfinding aid on the homepage
 * tiles (icon badge + page-count pill + hover border). Purely presentational
 * — literal Tailwind class strings so the compiler can see them statically.
 */
export const CATEGORY_ACCENT: Record<
  string,
  { badge: string; hoverBorder: string }
> = {
  "business-self-employment": {
    badge: "bg-indigo-50 text-indigo-700",
    hoverBorder: "hover:border-indigo-300",
  },
  "hospitalization-insurance": {
    badge: "bg-emerald-50 text-emerald-700",
    hoverBorder: "hover:border-emerald-300",
  },
  "official-documents": {
    badge: "bg-violet-50 text-violet-700",
    hoverBorder: "hover:border-violet-300",
  },
  "residence-trc": {
    badge: "bg-blue-50 text-blue-700",
    hoverBorder: "hover:border-blue-300",
  },
  "sickness-sick-leave": {
    badge: "bg-rose-50 text-rose-700",
    hoverBorder: "hover:border-rose-300",
  },
  "work-job-loss": {
    badge: "bg-amber-50 text-amber-700",
    hoverBorder: "hover:border-amber-300",
  },
};

export const DEFAULT_ACCENT = {
  badge: "bg-slate-100 text-slate-700",
  hoverBorder: "hover:border-slate-300",
};
