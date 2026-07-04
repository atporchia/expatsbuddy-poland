export type ContentStatus = "draft" | "reviewed" | "published" | "needs_review";

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** 3-5 word homepage-tile descriptor, built from real terms (e.g. "e-ZLA, ZUS sick pay"). */
  shortDescription: string;
  owns: string[];
  doesNotOwn: string[];
  institutionIds: string[];
  pathIds: string[];
  status: "draft" | "published" | "coming_soon";
};

export type Path = {
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  userSituation: string;
  summary: string;
  /**
   * Short (2-3 sentence) direct answer shown above the fold on the path
   * page, always visible. Condensed from `body`, not a topic-preview like
   * `summary` — written to read as the answer itself, not a description of
   * the page.
   */
  briefOverview: string;
  whoThisIsFor: string[];
  institutions: string[];
  commonTerms: string[];
  commonDocuments: string[];
  /**
   * Optional numbered list of the general steps official sources describe
   * for this procedure (e.g. "log in via PUE/eZUS" -> "select the form" ->
   * "submit"). Paraphrased from the cited officialSourceIds, never
   * personalized — omit entirely for pages that don't map to one
   * procedure (e.g. glossary-style document-family overviews).
   */
  officialProcessSteps?: string[];
  whatThisDoesNotDo: string[];
  officialSourceIds: string[];
  relatedPathIds: string[];
  riskLevel: "low" | "medium" | "high";
  lastReviewedAt: string;
  status: ContentStatus;
  /** MDX body: the plain-language "What this situation means" explanation. */
  body: string;
};

export type OfficialSource = {
  id: string;
  title: string;
  institution: string;
  url: string;
  language: "pl" | "en" | "mixed";
  sourceType: "form" | "explainer" | "checklist" | "pdf" | "qna" | "portal";
  relatedPathIds: string[];
  lastCheckedAt: string;
  notes?: string;
};

export type GlossaryTerm = {
  id: string;
  slug: string;
  term: string;
  language: "pl" | "en";
  plainMeaning: string;
  institutionIds: string[];
  relatedPathIds: string[];
  officialSourceIds: string[];
  warning?: string;
  /**
   * Optional numbered "how to do this" steps, for standalone forms/
   * documents with no dedicated Path page (e.g. Z-10, IKP). Terms that
   * DO map to a Path should leave this unset — the term page borrows
   * that Path's officialProcessSteps instead, so the steps have one
   * source of truth. See getProcessStepsForTerm in lib/content.ts.
   */
  officialProcessSteps?: string[];
};

export type FeedbackType =
  | "helpful"
  | "confusing"
  | "missing_information"
  | "broken_link"
  | "wrong_or_outdated"
  | "other";

export type Feedback = {
  id: string;
  pageType: "category" | "path" | "glossary";
  pageSlug: string;
  feedbackType: FeedbackType;
  comment?: string;
  createdAt: string;
};

export type Institution = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  website?: string;
};

export type SearchDoc = {
  id: string;
  type: "path" | "category" | "glossary";
  slug: string;
  title: string;
  categoryTitle?: string;
  text: string;
};
