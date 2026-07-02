export type ContentStatus = "draft" | "reviewed" | "published" | "needs_review";

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
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
  whoThisIsFor: string[];
  institutions: string[];
  commonTerms: string[];
  commonDocuments: string[];
  whatThisExplains: string[];
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
