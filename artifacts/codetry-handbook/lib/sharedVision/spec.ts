// Pure helpers that turn a session's metaphor + answers into:
//   - a derived structured spec (for the technical view + handoff brief)
//   - a generated plain-language summary (one-way: structured → plain)
//   - the running glossary (template terms plus practitioner-entered words).
// No network or LLM calls; the translation is rule-based.

import { buildCustomTemplate, getMetaphorById } from "./catalog";
import type {
  DerivedSpec,
  MetaphorGlossaryTerm,
  MetaphorTemplate,
  SharedVisionSession,
  SpecCategory,
} from "./types";

const EMPTY_SPEC: DerivedSpec = Object.freeze({
  entities: [],
  actors: [],
  actions: [],
  triggers: [],
});

export function resolveTemplate(
  session: SharedVisionSession,
): MetaphorTemplate | null {
  if (!session.metaphorId) return null;
  if (session.metaphorId === "custom") {
    return buildCustomTemplate(
      session.customNoun ?? "thing",
      session.customArticle ?? "a",
    );
  }
  return getMetaphorById(session.metaphorId);
}

// Splits a free-text answer into a list, accepting commas, semicolons,
// or newlines as separators.
export function splitList(value: string): string[] {
  if (!value) return [];
  return value
    .split(/[,\n;]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function deriveSpec(session: SharedVisionSession): DerivedSpec {
  const template = resolveTemplate(session);
  if (!template) return EMPTY_SPEC;
  const out: DerivedSpec = {
    entities: [],
    actors: [],
    actions: [],
    triggers: [],
  };
  for (const prompt of template.prompts) {
    const parts = splitList(session.answers[prompt.id] ?? "");
    if (parts.length === 0) continue;
    pushAll(out, prompt.category, parts);
  }
  return out;
}

function pushAll(
  spec: DerivedSpec,
  category: SpecCategory,
  values: string[],
): void {
  for (const v of values) {
    if (!spec[category].includes(v)) spec[category].push(v);
  }
}

// Plain-language summary for the brief. If the practitioner has
// overridden the auto-generated text we honor that verbatim; otherwise
// we generate it from the structured answers.
export function generatePlainSummary(
  session: SharedVisionSession,
): string {
  if (
    typeof session.plainSummaryOverride === "string" &&
    session.plainSummaryOverride.trim().length > 0
  ) {
    return session.plainSummaryOverride;
  }
  const template = resolveTemplate(session);
  if (!template) return "";
  const sentences: string[] = [];
  for (const prompt of template.prompts) {
    const ans = (session.answers[prompt.id] ?? "").trim();
    if (!ans) continue;
    sentences.push(
      prompt.summaryTemplate
        .replaceAll("{noun}", template.noun)
        .replaceAll("{answer}", ans),
    );
  }
  return sentences.join(" ");
}

const SPEC_SINGULAR: Record<SpecCategory, string> = {
  entities: "entity",
  actors: "actor",
  actions: "action",
  triggers: "trigger",
};

// Running glossary: the template's static terms plus a row for each
// item the practitioner has actually typed in, grouped by category.
// Keeps the shared vocabulary in step with the answers as they're typed.
export function activeGlossary(
  session: SharedVisionSession,
): MetaphorGlossaryTerm[] {
  const template = resolveTemplate(session);
  if (!template) return [];
  const out: MetaphorGlossaryTerm[] = [...template.glossary];
  const seen = new Set(out.map((t) => t.metaphor.toLowerCase()));
  for (const prompt of template.prompts) {
    const items = splitList(session.answers[prompt.id] ?? "");
    for (const item of items) {
      const key = item.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        metaphor: item,
        spec: SPEC_SINGULAR[prompt.category],
        category: prompt.category,
      });
    }
  }
  return out;
}

export function answeredCount(session: SharedVisionSession): number {
  const template = resolveTemplate(session);
  if (!template) return 0;
  return template.prompts.reduce(
    (n, p) => n + ((session.answers[p.id] ?? "").trim().length > 0 ? 1 : 0),
    0,
  );
}

export function totalPrompts(session: SharedVisionSession): number {
  const template = resolveTemplate(session);
  return template?.prompts.length ?? 0;
}

export function sessionLabel(session: SharedVisionSession): string {
  if (session.name && session.name.trim().length > 0) return session.name;
  const template = resolveTemplate(session);
  if (template) {
    return `${template.article === "an" ? "An" : "A"} ${template.noun}`;
  }
  return "Untitled vision";
}
