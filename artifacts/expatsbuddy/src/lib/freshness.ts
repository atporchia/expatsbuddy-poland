import type { Path } from "./types";

const CADENCE_DAYS: Record<string, number> = {
  "residence-trc": 31,
  "sickness-sick-leave": 31,
  "work-job-loss": 92,
  "hospitalization-insurance": 92,
  "official-documents": 92,
};

const DEFAULT_CADENCE_DAYS = 31;

export function needsReviewWarning(p: Path): boolean {
  const cadence = CADENCE_DAYS[p.categoryId] ?? DEFAULT_CADENCE_DAYS;
  const reviewed = new Date(p.lastReviewedAt).getTime();
  if (Number.isNaN(reviewed)) return true;
  const ageDays = (Date.now() - reviewed) / (1000 * 60 * 60 * 24);
  return ageDays > cadence || p.status === "needs_review";
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
