export type TriageQuestion = {
  id: string;
  question: string;
};

export const TRIAGE_QUESTIONS: TriageQuestion[] = [
  {
    id: "stay",
    question: "Are you trying to understand your right to stay in Poland?",
  },
  {
    id: "job",
    question:
      "Did your job end, or are you worried about employment documents?",
  },
  { id: "sick", question: "Are you sick or on medical leave?" },
  { id: "hospital", question: "Were you hospitalized or did you have surgery?" },
  {
    id: "document",
    question: "Are you trying to understand a type of official document?",
  },
  { id: "insurance", question: "Are you dealing with private insurance?" },
  { id: "eu", question: "Are you an EU/EFTA/Swiss citizen?" },
  { id: "noneu", question: "Are you a non-EU citizen?" },
  {
    id: "urgent",
    question: "Is your situation urgent or connected to an official deadline?",
  },
];

export type TriageAnswers = Record<string, boolean>;

export type TriageResult = {
  pathSlugs: string[];
  categorySlugs: string[];
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

  if (pathSlugs.length === 0 && categorySlugs.length === 0) {
    add(
      categorySlugs,
      "residence-trc",
      "work-job-loss",
      "sickness-sick-leave",
      "hospitalization-insurance",
      "official-documents",
    );
  }

  return {
    pathSlugs: pathSlugs.slice(0, 4),
    categorySlugs: categorySlugs.slice(0, 3),
    urgent: Boolean(answers.urgent),
  };
}
