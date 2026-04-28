import { describe, expect, it } from "vitest";
import { generateBrief } from "../markdown";
import {
  activeGlossary,
  deriveSpec,
  resolveTemplate,
} from "../spec";
import type { SharedVisionSession } from "../types";

function makeSession(
  overrides: Partial<SharedVisionSession> = {},
): SharedVisionSession {
  return {
    id: "test-session",
    createdAt: 0,
    updatedAt: 0,
    metaphorId: null,
    answers: {},
    ...overrides,
  };
}

describe("resolveTemplate", () => {
  it("returns null when no metaphor has been chosen", () => {
    expect(resolveTemplate(makeSession())).toBeNull();
  });

  it("looks up built-in metaphors by id", () => {
    const bucket = resolveTemplate(makeSession({ metaphorId: "bucket" }));
    expect(bucket).not.toBeNull();
    expect(bucket?.noun).toBe("bucket");
    expect(bucket?.article).toBe("a");
    expect(bucket?.prompts.map((p) => p.id)).toEqual([
      "bucket_what",
      "bucket_who",
      "bucket_when",
      "bucket_do",
    ]);

    const shelf = resolveTemplate(makeSession({ metaphorId: "shelf" }));
    expect(shelf?.noun).toBe("shelf");
    expect(shelf?.shape).toBe("shelf");
  });

  it("returns null for unknown metaphor ids", () => {
    const result = resolveTemplate(makeSession({ metaphorId: "ghost" }));
    expect(result).toBeNull();
  });

  it("builds a custom template that substitutes the noun into prompts", () => {
    const session = makeSession({
      metaphorId: "custom",
      customNoun: "garden",
      customArticle: "a",
    });
    const template = resolveTemplate(session);
    expect(template).not.toBeNull();
    expect(template?.id).toBe("custom");
    expect(template?.noun).toBe("garden");
    expect(template?.article).toBe("a");

    const what = template?.prompts.find((p) => p.id === "custom_what");
    expect(what?.question).toBe("What goes in the garden?");
    expect(what?.helper).toBe("The kinds of things this garden holds.");

    const when = template?.prompts.find((p) => p.id === "custom_when");
    expect(when?.question).toBe("When does the garden change?");

    expect(template?.glossary).toEqual([
      { metaphor: "the garden", spec: "the thing", category: "entities" },
    ]);
  });

  it("respects a custom article on the custom template", () => {
    const session = makeSession({
      metaphorId: "custom",
      customNoun: "orchard",
      customArticle: "an",
    });
    const template = resolveTemplate(session);
    expect(template?.article).toBe("an");
    expect(template?.noun).toBe("orchard");
  });

  it("falls back to a default noun when the custom noun is blank", () => {
    const session = makeSession({
      metaphorId: "custom",
      customNoun: "   ",
      customArticle: "a",
    });
    const template = resolveTemplate(session);
    expect(template?.noun).toBe("thing");
    const what = template?.prompts.find((p) => p.id === "custom_what");
    expect(what?.question).toBe("What goes in the thing?");
  });
});

describe("deriveSpec", () => {
  it("returns empty sections when there is no metaphor", () => {
    expect(deriveSpec(makeSession())).toEqual({
      entities: [],
      actors: [],
      actions: [],
      triggers: [],
    });
  });

  it("groups answers into the right spec categories for a fully-answered bucket", () => {
    const session = makeSession({
      metaphorId: "bucket",
      answers: {
        bucket_what: "draft notes, photos, links",
        bucket_who: "anyone in the band; the kids",
        bucket_when: "every Sunday\nbefore a meeting",
        bucket_do: "sort the keepers, archive the rest",
      },
    });
    const spec = deriveSpec(session);
    expect(spec.entities).toEqual(["draft notes", "photos", "links"]);
    expect(spec.actors).toEqual(["anyone in the band", "the kids"]);
    expect(spec.triggers).toEqual(["every Sunday", "before a meeting"]);
    expect(spec.actions).toEqual(["sort the keepers", "archive the rest"]);
  });

  it("only fills sections the practitioner has answered", () => {
    const session = makeSession({
      metaphorId: "bucket",
      answers: {
        bucket_what: "draft notes",
        bucket_who: "",
      },
    });
    const spec = deriveSpec(session);
    expect(spec.entities).toEqual(["draft notes"]);
    expect(spec.actors).toEqual([]);
    expect(spec.actions).toEqual([]);
    expect(spec.triggers).toEqual([]);
  });

  it("deduplicates repeated answers within a category", () => {
    const session = makeSession({
      metaphorId: "bucket",
      answers: {
        bucket_what: "notes, photos, notes",
      },
    });
    expect(deriveSpec(session).entities).toEqual(["notes", "photos"]);
  });
});

describe("activeGlossary", () => {
  it("starts with the template's static glossary and appends practitioner words", () => {
    const session = makeSession({
      metaphorId: "bucket",
      answers: { bucket_what: "draft notes, photos" },
    });
    const glossary = activeGlossary(session);
    // First items are the static glossary rows from catalog.ts.
    expect(glossary.slice(0, 4)).toEqual([
      { metaphor: "the bucket", spec: "the collection", category: "entities" },
      { metaphor: "drops in", spec: "add-item action", category: "actions" },
      { metaphor: "empties", spec: "archive event", category: "triggers" },
      { metaphor: "what's inside", spec: "items", category: "entities" },
    ]);
    expect(glossary).toContainEqual({
      metaphor: "draft notes",
      spec: "entity",
      category: "entities",
    });
    expect(glossary).toContainEqual({
      metaphor: "photos",
      spec: "entity",
      category: "entities",
    });
  });
});

describe("generateBrief", () => {
  const REQUIRED_HEADINGS = [
    "## What & Why",
    "## Done looks like",
    "## Out of scope",
    "## Glossary",
    "## Spec",
  ];

  it("renders all of the headings the handoff UI promises", () => {
    const session = makeSession({
      metaphorId: "bucket",
      answers: {
        bucket_what: "draft notes, photos",
        bucket_who: "anyone in the band",
        bucket_when: "every Sunday",
        bucket_do: "archive the rest",
      },
    });
    const brief = generateBrief(session);
    for (const heading of REQUIRED_HEADINGS) {
      expect(brief).toContain(heading);
    }
    // Title heading: "# A bucket" (article + noun for the default name).
    expect(brief).toMatch(/^# A bucket\n/);
  });

  it("uses the practitioner's chosen name when one is set", () => {
    const session = makeSession({
      metaphorId: "bucket",
      name: "Sunday Cleanup",
      answers: { bucket_what: "notes" },
    });
    const brief = generateBrief(session);
    expect(brief).toMatch(/^# Sunday Cleanup\n/);
  });

  it("reflects answers verbatim in the spec sections and the metaphor line", () => {
    const session = makeSession({
      metaphorId: "bucket",
      answers: {
        bucket_what: "draft notes, photos",
        bucket_who: "anyone in the band",
        bucket_when: "every Sunday",
        bucket_do: "archive the rest",
      },
    });
    const brief = generateBrief(session);
    expect(brief).toContain("Described as a **bucket**.");
    // Each answer should appear as a bullet under its spec subheading.
    expect(brief).toContain("### Entities (what's collected/held)");
    expect(brief).toContain("- draft notes");
    expect(brief).toContain("- photos");
    expect(brief).toContain("### Actors (who interacts)");
    expect(brief).toContain("- anyone in the band");
    expect(brief).toContain("### Triggers (when things happen)");
    expect(brief).toContain("- every Sunday");
    expect(brief).toContain("### Actions (what gets done)");
    expect(brief).toContain("- archive the rest");
    // Plain-language summary should also include the verbatim answers.
    expect(brief).toContain("The bucket holds draft notes, photos");
    expect(brief).toContain("anyone in the band can drop things in");
  });

  it("shows placeholder copy when sections are missing answers", () => {
    const session = makeSession({
      metaphorId: "bucket",
      answers: { bucket_what: "draft notes" },
    });
    const brief = generateBrief(session);
    expect(brief).toContain("the people involved are still to be defined");
    expect(brief).toContain("the things that happen to it are still to be defined");
    expect(brief).toContain("what triggers a change is still to be defined");
    expect(brief).toContain("_none yet_");
  });

  it("honors a plain-summary override verbatim", () => {
    const session = makeSession({
      metaphorId: "bucket",
      answers: { bucket_what: "draft notes" },
      plainSummaryOverride: "We just need a place to dump notes",
    });
    const brief = generateBrief(session);
    expect(brief).toContain("We just need a place to dump notes.");
    // The auto-generated sentence should not appear when overridden.
    expect(brief).not.toContain("The bucket holds draft notes.");
  });

  it("renders a custom-noun session with the chosen article", () => {
    const session = makeSession({
      metaphorId: "custom",
      customNoun: "orchard",
      customArticle: "an",
      answers: { custom_what: "apple trees, pear trees" },
    });
    const brief = generateBrief(session);
    expect(brief).toMatch(/^# An orchard\n/);
    expect(brief).toContain("Described as an **orchard**.");
    expect(brief).toContain("The orchard holds apple trees, pear trees");
    expect(brief).toContain("- apple trees");
    expect(brief).toContain("- pear trees");
  });
});
