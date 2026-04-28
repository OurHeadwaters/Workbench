export type SpecCategory = "entities" | "actors" | "actions" | "triggers";

export interface MetaphorPrompt {
  id: string;
  question: string;
  helper: string;
  example?: string;
  category: SpecCategory;
  // Sentence template for the plain summary. {answer} is required;
  // {noun} is replaced with the metaphor's noun.
  summaryTemplate: string;
  // Label shown on the structured-spec side for this field.
  specLabel: string;
}

export interface MetaphorGlossaryTerm {
  metaphor: string;
  spec: string;
  category: SpecCategory;
}

export type MetaphorShapeKind =
  | "bucket"
  | "shelf"
  | "jar"
  | "deck"
  | "board"
  | "drawer"
  | "basket"
  | "stack"
  | "folder"
  | "thread"
  | "custom";

export interface MetaphorTemplate {
  id: string;
  noun: string;
  pluralNoun: string;
  article: "a" | "an";
  blurb: string;
  shape: MetaphorShapeKind;
  prompts: MetaphorPrompt[];
  glossary: MetaphorGlossaryTerm[];
}

export interface SharedVisionSession {
  id: string;
  createdAt: number;
  updatedAt: number;
  handedOffAt?: number;
  // Optional rename. When unset, fall back to the metaphor noun.
  name?: string;
  // Either a catalog template id, "custom", or null until the picker.
  metaphorId: string | null;
  customNoun?: string;
  customArticle?: "a" | "an";
  // Map of prompt id → free-text answer.
  answers: Record<string, string>;
  // If the practitioner edits the plain summary directly, keep their
  // wording until they tap Reset. The override wins over the generated
  // summary in the brief.
  plainSummaryOverride?: string;
}

export interface DerivedSpec {
  entities: string[];
  actors: string[];
  actions: string[];
  triggers: string[];
}
