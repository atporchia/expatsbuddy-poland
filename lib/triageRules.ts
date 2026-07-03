/**
 * Triage routing per PRD §8.4: route confused users to relevant explainer
 * pages. Never advice, never eligibility, never deadlines — output is only
 * "start with this explainer page" suggestions.
 */

/** Question text lives in the i18n dictionaries (lib/i18n.ts, start.questions). */
export const TRIAGE_QUESTION_IDS = [
  "stay",
  "job",
  "business",
  "sick",
  "hospital",
  "document",
  "insurance",
  "eu",
  "noneu",
  "urgent",
] as const;

export type TriageAnswers = Record<string, boolean>;

export type TriageResult = {
  /** Path slugs to suggest, in priority order. */
  pathSlugs: string[];
  /** Category slugs to suggest when a whole category is relevant. */
  categorySlugs: string[];
  /** Show the "urgent" note pointing at official contacts. */
  urgent: boolean;
};

export function runTriage(answers: TriageAnswers): TriageResult {
  const pathSlugs: string[] = [];
  const categorySlugs: string[] = [];

  const add = (arr: string[], ...items: string[]) => {
    for (const item of items) if (!arr.includes(item)) arr.push(item);
  };

  if (answers.stay) {
    if (answers.eu && !answers.noneu) {
      add(pathSlugs, "eu-citizen-registration");
    } else {
      add(pathSlugs, "work-based-trc", "student-trc", "family-based-trc");
      if (answers.eu) add(pathSlugs, "eu-citizen-registration");
    }
    add(categorySlugs, "residence-trc");
  }

  if (answers.job) {
    add(
      pathSlugs,
      "certificate-of-employment",
      "registering-as-unemployed",
      "unemployment-benefit",
    );
    add(categorySlugs, "work-job-loss");
    if (answers.sick) add(pathSlugs, "sick-leave-after-contract-ends");
  }

  if (answers.sick) {
    add(pathSlugs, "sick-leave-after-contract-ends", "zas-53");
    add(categorySlugs, "sickness-sick-leave");
  }

  if (answers.hospital) {
    add(pathSlugs, "hospital-discharge-document");
    add(categorySlugs, "hospitalization-insurance");
    if (answers.insurance) add(pathSlugs, "private-insurance-claim-basics");
  }

  if (answers.insurance) {
    add(pathSlugs, "private-insurance-claim-basics");
    add(categorySlugs, "hospitalization-insurance");
  }

  if (answers.document) {
    add(categorySlugs, "official-documents");
  }

  if (answers.business) {
    add(pathSlugs, "jdg-basics", "ceidg-registration", "b2b-basics");
    add(categorySlugs, "business-self-employment");
  }

  // Nothing matched: offer the categories overview.
  if (pathSlugs.length === 0 && categorySlugs.length === 0) {
    add(
      categorySlugs,
      "residence-trc",
      "work-job-loss",
      "business-self-employment",
      "sickness-sick-leave",
      "hospitalization-insurance",
      "official-documents",
    );
  }

  return {
    pathSlugs: pathSlugs.slice(0, 4),
    categorySlugs: categorySlugs.slice(0, 6),
    urgent: Boolean(answers.urgent),
  };
}
